import type { TranslationProvider } from "./provider";
import { createProviderRegistry } from "./registry";
import type { ProviderId, ProviderResult, TranslateRequest } from "./types";

const DEFAULT_TIMEOUT_MS = 12_000;

class ProviderTimeoutError extends Error {}

export class TranslationRequestAbortedError extends Error {
  readonly code = "REQUEST_ABORTED";

  constructor() {
    super("The client canceled the request.");
    this.name = "TranslationRequestAbortedError";
  }
}

export async function translateWithProviders(
  request: TranslateRequest,
  registry: Map<ProviderId, TranslationProvider>,
  signal?: AbortSignal,
): Promise<ProviderResult[]> {
  if (signal?.aborted) {
    throw new TranslationRequestAbortedError();
  }

  return Promise.all(
    request.providers.map(async (providerId) => {
      const startedAt = Date.now();
      const provider = registry.get(providerId);
      if (!provider || !provider.available) {
        return {
          provider: providerId,
          status: "error" as const,
          code: "PROVIDER_UNAVAILABLE",
          error: `${provider?.label ?? providerId} is not configured or unavailable.`,
          durationMs: Date.now() - startedAt,
        };
      }
      const controller = new AbortController();
      const timeoutMs =
        provider.timeoutMs === undefined
          ? DEFAULT_TIMEOUT_MS
          : provider.timeoutMs;
      let timer: ReturnType<typeof setTimeout> | undefined;
      let timedOut = false;
      let rejectOnAbort:
        | ((reason: TranslationRequestAbortedError) => void)
        | undefined;
      const abortProvider = () => {
        controller.abort();
        rejectOnAbort?.(new TranslationRequestAbortedError());
      };
      const aborted = new Promise<never>((_, reject) => {
        rejectOnAbort = reject;
        signal?.addEventListener("abort", abortProvider, { once: true });
      });
      const timeout =
        timeoutMs === null
          ? new Promise<never>(() => undefined)
          : new Promise<never>((_, reject) => {
              timer = setTimeout(() => {
                timedOut = true;
                controller.abort();
                reject(new ProviderTimeoutError());
              }, timeoutMs);
            });
      try {
        const output = await Promise.race([
          provider.translate(request, controller.signal),
          timeout,
          aborted,
        ]);
        return {
          provider: providerId,
          status: "success" as const,
          ...output,
          durationMs: Date.now() - startedAt,
        };
      } catch (error) {
        if (signal?.aborted) {
          throw new TranslationRequestAbortedError();
        }
        return {
          provider: providerId,
          status: "error" as const,
          code: timedOut ? "TIMEOUT" : "UPSTREAM_ERROR",
          error: timedOut
            ? "The translation request timed out. Try again later."
            : error instanceof Error
              ? error.message
              : "The translation provider is temporarily unavailable.",
          durationMs: Date.now() - startedAt,
        };
      } finally {
        if (timer !== undefined) clearTimeout(timer);
        signal?.removeEventListener("abort", abortProvider);
      }
    }),
  );
}

export function translateRequest(
  request: TranslateRequest,
  signal?: AbortSignal,
) {
  return translateWithProviders(request, createProviderRegistry(), signal);
}
