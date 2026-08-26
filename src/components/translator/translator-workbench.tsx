"use client";

import {
  ArrowDownUp,
  Check,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  Columns2,
  Copy,
  Languages,
  LoaderCircle,
  PanelTop,
  RefreshCw,
  RotateCcw,
  Send,
  Square,
  X,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { languages } from "@/lib/translation/languages";
import type { ProviderId, ProviderResult } from "@/lib/translation/types";
import { cn } from "@/lib/utils";

const providers: Array<{
  id: ProviderId;
  label: string;
  hint: string;
}> = [
  { id: "google", label: "Google", hint: "Web service" },
  { id: "bing", label: "Bing", hint: "Web service" },
  { id: "agnes-2-0", label: "Agnes 2.0", hint: "AI model" },
  { id: "agnes-2-5", label: "Agnes 2.5", hint: "AI model" },
];

const providerLabels = Object.fromEntries(
  providers.map(({ id, label }) => [id, label]),
) as Record<ProviderId, string>;
const layoutStorageKey = "findry-translator:layout";
const providerStorageKey = "findry-translator:providers";
const layoutChangedEvent = "findry-translator:layout-changed";
const defaultProviders: ProviderId[] = ["google", "bing"];
const defaultProvidersSnapshot = JSON.stringify(defaultProviders);
const narrowViewportQuery = "(max-width: 900px)";

type WorkbenchLayout = "stacked" | "side-by-side";
type RequestSnapshot = {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
};
type SettledSlot = {
  provider: ProviderId;
  status: "settled";
  snapshot: RequestSnapshot;
  result: ProviderResult;
};
type ResultSlot =
  | { provider: ProviderId; status: "idle" }
  | {
      provider: ProviderId;
      status: "pending";
      snapshot: RequestSnapshot;
      previous?: SettledSlot;
    }
  | SettledSlot;
type CopyFeedback = {
  provider: ProviderId;
  status: "success" | "error";
};

function sortSlots(slots: ResultSlot[]) {
  return [...slots].sort(
    (left, right) =>
      providers.findIndex(({ id }) => id === left.provider) -
      providers.findIndex(({ id }) => id === right.provider),
  );
}

function getStoredLayout(): WorkbenchLayout {
  try {
    const storedLayout = window.localStorage.getItem(layoutStorageKey);
    return storedLayout === "stacked" || storedLayout === "side-by-side"
      ? storedLayout
      : "stacked";
  } catch {
    return "stacked";
  }
}

function subscribeToStoredLayout(onStoreChange: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key === layoutStorageKey || event.key === null) {
      onStoreChange();
    }
  };
  window.addEventListener("storage", handleStorage);
  window.addEventListener(layoutChangedEvent, onStoreChange);
  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(layoutChangedEvent, onStoreChange);
  };
}

function parseStoredProviders(value: string | null): ProviderId[] {
  if (value === null) return defaultProviders;
  try {
    const storedProviders: unknown = JSON.parse(value);
    if (!Array.isArray(storedProviders)) return defaultProviders;
    return providers.flatMap(({ id }) =>
      storedProviders.includes(id) ? [id] : [],
    );
  } catch {
    return defaultProviders;
  }
}

function getStoredProvidersSnapshot() {
  try {
    return JSON.stringify(
      parseStoredProviders(window.localStorage.getItem(providerStorageKey)),
    );
  } catch {
    return defaultProvidersSnapshot;
  }
}

function getNarrowViewport() {
  return (
    typeof window.matchMedia === "function" &&
    window.matchMedia(narrowViewportQuery).matches
  );
}

function subscribeToNarrowViewport(onStoreChange: () => void) {
  if (typeof window.matchMedia !== "function") return () => undefined;
  const mediaQuery = window.matchMedia(narrowViewportQuery);
  mediaQuery.addEventListener("change", onStoreChange);
  return () => mediaQuery.removeEventListener("change", onStoreChange);
}

const getServerLayout = (): WorkbenchLayout => "stacked";
const getServerProvidersSnapshot = () => defaultProvidersSnapshot;
const getServerNarrowViewport = () => false;

function getProviderResult(
  data: unknown,
  provider: ProviderId,
): ProviderResult | null {
  if (
    !data ||
    typeof data !== "object" ||
    !("results" in data) ||
    !Array.isArray(data.results)
  ) {
    return null;
  }
  const result = data.results.find(
    (item) =>
      item &&
      typeof item === "object" &&
      "provider" in item &&
      item.provider === provider,
  );
  if (
    !result ||
    !("status" in result) ||
    !("durationMs" in result) ||
    typeof result.durationMs !== "number"
  ) {
    return null;
  }
  if (
    result.status === "success" &&
    "translatedText" in result &&
    typeof result.translatedText === "string"
  ) {
    return {
      provider,
      status: "success",
      translatedText: result.translatedText,
      durationMs: result.durationMs,
    };
  }
  if (
    result.status === "error" &&
    "error" in result &&
    typeof result.error === "string" &&
    "code" in result &&
    typeof result.code === "string"
  ) {
    return {
      provider,
      status: "error",
      error: result.error,
      code: result.code,
      durationMs: result.durationMs,
    };
  }
  return null;
}

function getResponseError(data: unknown) {
  if (
    data &&
    typeof data === "object" &&
    "error" in data &&
    data.error &&
    typeof data.error === "object" &&
    "message" in data.error &&
    typeof data.error.message === "string"
  ) {
    return data.error.message;
  }
  return "The translation request failed.";
}

export function TranslatorWorkbench() {
  const [text, setText] = useState("");
  const [sourceLanguage, setSourceLanguage] = useState("auto");
  const [targetLanguage, setTargetLanguage] = useState("zh-CN");
  const [selectedProviders, setSelectedProviders] =
    useState<ProviderId[]>(defaultProviders);
  const [slots, setSlots] = useState<ResultSlot[]>(
    defaultProviders.map((provider) => ({ provider, status: "idle" })),
  );
  const [copyFeedbacks, setCopyFeedbacks] = useState<CopyFeedback[]>([]);
  const [collapsedProviders, setCollapsedProviders] = useState<ProviderId[]>(
    [],
  );
  const [appliedProvidersSnapshot, setAppliedProvidersSnapshot] = useState(
    defaultProvidersSnapshot,
  );
  const [sessionLayout, setSessionLayout] = useState<WorkbenchLayout | null>(
    null,
  );
  const requestsRef = useRef(
    new Map<ProviderId, { controller: AbortController; token: symbol }>(),
  );
  const copyTimersRef = useRef(new Map<ProviderId, number>());
  const copyTokensRef = useRef(new Map<ProviderId, symbol>());
  const providersSnapshotRef = useRef<string | null>(null);

  const getProvidersSnapshot = useCallback(() => {
    providersSnapshotRef.current ??= getStoredProvidersSnapshot();
    return providersSnapshotRef.current;
  }, []);

  const subscribeToStoredProviders = useCallback(
    (onStoreChange: () => void) => {
      const handleStorage = (event: StorageEvent) => {
        if (event.key !== providerStorageKey && event.key !== null) return;
        const nextSnapshot = getStoredProvidersSnapshot();
        const selected = new Set(JSON.parse(nextSnapshot) as ProviderId[]);
        requestsRef.current.forEach(({ controller }, provider) => {
          if (!selected.has(provider)) {
            controller.abort();
            requestsRef.current.delete(provider);
          }
        });
        copyTimersRef.current.forEach((timer, provider) => {
          if (!selected.has(provider)) {
            window.clearTimeout(timer);
            copyTimersRef.current.delete(provider);
            copyTokensRef.current.delete(provider);
          }
        });
        providersSnapshotRef.current = nextSnapshot;
        onStoreChange();
      };
      window.addEventListener("storage", handleStorage);
      return () => window.removeEventListener("storage", handleStorage);
    },
    [],
  );

  const storedProvidersSnapshot = useSyncExternalStore(
    subscribeToStoredProviders,
    getProvidersSnapshot,
    getServerProvidersSnapshot,
  );
  const storedLayout = useSyncExternalStore(
    subscribeToStoredLayout,
    getStoredLayout,
    getServerLayout,
  );
  const narrowViewport = useSyncExternalStore(
    subscribeToNarrowViewport,
    getNarrowViewport,
    getServerNarrowViewport,
  );
  const preferredLayout = sessionLayout ?? storedLayout;
  const effectiveLayout = narrowViewport ? "stacked" : preferredLayout;
  const loading = slots.some((slot) => slot.status === "pending");
  const settledResults = slots.filter(
    (slot): slot is SettledSlot => slot.status === "settled",
  );
  const successfulResults = settledResults.filter(
    ({ result }) => result.status === "success",
  ).length;

  if (appliedProvidersSnapshot !== storedProvidersSnapshot) {
    const storedProviders = JSON.parse(storedProvidersSnapshot) as ProviderId[];
    const selected = new Set(storedProviders);
    setAppliedProvidersSnapshot(storedProvidersSnapshot);
    setSelectedProviders(storedProviders);
    setSlots((current) =>
      sortSlots(
        storedProviders.map(
          (provider) =>
            current.find((slot) => slot.provider === provider) ?? {
              provider,
              status: "idle",
            },
        ),
      ),
    );
    setCopyFeedbacks((current) =>
      current.filter(({ provider }) => selected.has(provider)),
    );
    setCollapsedProviders((current) =>
      current.filter((provider) => selected.has(provider)),
    );
  }

  useEffect(
    () => () => {
      for (const { controller } of Array.from(requestsRef.current.values())) {
        controller.abort();
      }
      requestsRef.current.clear();
      for (const timer of Array.from(copyTimersRef.current.values())) {
        window.clearTimeout(timer);
      }
      copyTimersRef.current.clear();
      copyTokensRef.current.clear();
    },
    [],
  );

  function clearCopyFeedback(provider: ProviderId) {
    const timer = copyTimersRef.current.get(provider);
    if (timer !== undefined) window.clearTimeout(timer);
    copyTimersRef.current.delete(provider);
    copyTokensRef.current.delete(provider);
    setCopyFeedbacks((current) =>
      current.filter((feedback) => feedback.provider !== provider),
    );
  }

  function showCopyFeedback(
    provider: ProviderId,
    token: symbol,
    status: CopyFeedback["status"],
  ) {
    setCopyFeedbacks((current) => [
      ...current.filter((feedback) => feedback.provider !== provider),
      { provider, status },
    ]);
    const timer = window.setTimeout(() => {
      if (copyTokensRef.current.get(provider) !== token) return;
      copyTokensRef.current.delete(provider);
      copyTimersRef.current.delete(provider);
      setCopyFeedbacks((current) =>
        current.filter((feedback) => feedback.provider !== provider),
      );
    }, 1600);
    copyTimersRef.current.set(provider, timer);
  }

  async function copyResult(provider: ProviderId, translatedText: string) {
    const token = Symbol(provider);
    const previousTimer = copyTimersRef.current.get(provider);
    if (previousTimer !== undefined) window.clearTimeout(previousTimer);
    copyTimersRef.current.delete(provider);
    copyTokensRef.current.set(provider, token);
    try {
      await navigator.clipboard.writeText(translatedText);
      if (copyTokensRef.current.get(provider) === token) {
        showCopyFeedback(provider, token, "success");
      }
    } catch {
      if (copyTokensRef.current.get(provider) === token) {
        showCopyFeedback(provider, token, "error");
      }
    }
  }

  function cancelProvider(provider: ProviderId) {
    requestsRef.current.get(provider)?.controller.abort();
    requestsRef.current.delete(provider);
    setSlots((current) =>
      current.map((slot) => {
        if (slot.provider !== provider || slot.status !== "pending")
          return slot;
        return slot.previous ?? { provider, status: "idle" };
      }),
    );
  }

  function cancelAll() {
    for (const { controller } of Array.from(requestsRef.current.values())) {
      controller.abort();
    }
    requestsRef.current.clear();
    setSlots((current) =>
      current.map((slot) =>
        slot.status === "pending"
          ? (slot.previous ?? { provider: slot.provider, status: "idle" })
          : slot,
      ),
    );
  }

  async function executeProvider(
    provider: ProviderId,
    snapshot: RequestSnapshot = { text, sourceLanguage, targetLanguage },
  ) {
    if (!snapshot.text.trim() || requestsRef.current.has(provider)) return;
    clearCopyFeedback(provider);
    const controller = new AbortController();
    const token = Symbol(provider);
    requestsRef.current.set(provider, { controller, token });
    setSlots((current) =>
      current.map((slot) =>
        slot.provider === provider
          ? {
              provider,
              status: "pending",
              snapshot,
              previous: slot.status === "settled" ? slot : undefined,
            }
          : slot,
      ),
    );

    let result: ProviderResult;
    try {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({ ...snapshot, providers: [provider] }),
      });
      let data: unknown;
      try {
        data = await response.clone().json();
      } catch {
        throw new Error(
          "The translation service returned an invalid response.",
        );
      }
      if (!response.ok) throw new Error(getResponseError(data));
      const providerResult = getProviderResult(data, provider);
      if (!providerResult) {
        throw new Error(
          "The translation service returned an invalid response.",
        );
      }
      result = providerResult;
    } catch (error) {
      if (
        controller.signal.aborted ||
        requestsRef.current.get(provider)?.token !== token
      ) {
        return;
      }
      result = {
        provider,
        status: "error",
        code: "UPSTREAM_ERROR",
        error:
          error instanceof Error
            ? error.message
            : "The translation request failed. Please try again.",
        durationMs: 0,
      };
    }
    if (requestsRef.current.get(provider)?.token !== token) return;
    requestsRef.current.delete(provider);
    setSlots((current) =>
      current.map((slot) =>
        slot.provider === provider
          ? { provider, status: "settled", snapshot, result }
          : slot,
      ),
    );
  }

  async function translate() {
    if (!text.trim() || selectedProviders.length === 0 || loading) return;
    const snapshot = { text, sourceLanguage, targetLanguage };
    await Promise.allSettled(
      selectedProviders.map((provider) => executeProvider(provider, snapshot)),
    );
  }

  function toggleProvider(provider: ProviderId) {
    const isSelected = selectedProviders.includes(provider);
    const nextProviders = providers.flatMap(({ id }) => {
      if (id === provider) return isSelected ? [] : [id];
      return selectedProviders.includes(id) ? [id] : [];
    });
    const nextSnapshot = JSON.stringify(nextProviders);
    providersSnapshotRef.current = nextSnapshot;
    setAppliedProvidersSnapshot(nextSnapshot);
    setSelectedProviders(nextProviders);
    try {
      window.localStorage.setItem(providerStorageKey, nextSnapshot);
    } catch {
      // Keep the selection for this tab when persistence is unavailable.
    }
    if (!isSelected) {
      setSlots((current) =>
        sortSlots([
          ...current.filter((slot) => slot.provider !== provider),
          { provider, status: "idle" },
        ]),
      );
      return;
    }
    requestsRef.current.get(provider)?.controller.abort();
    requestsRef.current.delete(provider);
    clearCopyFeedback(provider);
    setSlots((current) => current.filter((slot) => slot.provider !== provider));
    setCollapsedProviders((current) =>
      current.filter((item) => item !== provider),
    );
  }

  function changeLayout(layout: WorkbenchLayout) {
    try {
      window.localStorage.setItem(layoutStorageKey, layout);
      setSessionLayout(null);
      window.dispatchEvent(new Event(layoutChangedEvent));
    } catch {
      // Keep the layout for this tab when persistence is unavailable.
      setSessionLayout(layout);
    }
  }

  function toggleResult(provider: ProviderId) {
    setCollapsedProviders((current) =>
      current.includes(provider)
        ? current.filter((item) => item !== provider)
        : [...current, provider],
    );
  }

  function swapLanguages() {
    if (sourceLanguage === "auto") return;
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
  }

  const hasSettled = settledResults.length > 0;
  const batchLabel = hasSettled ? "Translate all again" : "Translate all";

  return (
    <section
      className="mx-auto w-full max-w-7xl px-4 pb-16 sm:px-6 lg:px-8"
      aria-labelledby="translator-workbench-title"
    >
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2
            id="translator-workbench-title"
            className="text-lg font-semibold tracking-tight"
          >
            Translation workbench
          </h2>
          <p className="text-sm text-muted-foreground">
            Compare independent translations without losing earlier results.
          </p>
        </div>
        <fieldset className="flex rounded-md border bg-muted/40 p-1 max-[900px]:hidden">
          <legend className="sr-only">Workbench layout</legend>
          <Button
            type="button"
            size="sm"
            variant={preferredLayout === "stacked" ? "secondary" : "ghost"}
            className="h-8 px-2.5"
            aria-label="Use stacked layout"
            aria-pressed={preferredLayout === "stacked"}
            onClick={() => changeLayout("stacked")}
          >
            <PanelTop />
            <span className="hidden sm:inline">Stacked</span>
          </Button>
          <Button
            type="button"
            size="sm"
            variant={preferredLayout === "side-by-side" ? "secondary" : "ghost"}
            className="h-8 px-2.5"
            aria-label="Use side-by-side layout"
            aria-pressed={preferredLayout === "side-by-side"}
            onClick={() => changeLayout("side-by-side")}
          >
            <Columns2 />
            <span className="hidden sm:inline">Side by side</span>
          </Button>
        </fieldset>
      </div>

      <div
        className={cn(
          "grid gap-6 max-[900px]:grid-cols-1",
          effectiveLayout === "side-by-side"
            ? "min-[901px]:grid-cols-2"
            : "grid-cols-1",
        )}
        data-layout={effectiveLayout}
      >
        <section
          className="overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm"
          aria-labelledby="translation-input-title"
        >
          <h3 id="translation-input-title" className="sr-only">
            Translation input
          </h3>
          <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-end gap-2 border-b bg-muted/20 p-4">
            <div className="min-w-0 space-y-1.5">
              <p
                id="source-language-label"
                className="text-xs font-medium text-muted-foreground"
              >
                Source language
              </p>
              <Select value={sourceLanguage} onValueChange={setSourceLanguage}>
                <SelectTrigger aria-labelledby="source-language-label">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((language) => (
                    <SelectItem key={language.code} value={language.code}>
                      {language.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button
              type="button"
              variant="outline"
              size="icon"
              aria-label="Swap source and target languages"
              title={
                sourceLanguage === "auto"
                  ? "Choose a source language before swapping"
                  : "Swap languages"
              }
              disabled={sourceLanguage === "auto"}
              onClick={swapLanguages}
            >
              <ArrowDownUp />
            </Button>
            <div className="min-w-0 space-y-1.5">
              <p
                id="target-language-label"
                className="text-xs font-medium text-muted-foreground"
              >
                Target language
              </p>
              <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                <SelectTrigger aria-labelledby="target-language-label">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages
                    .filter((language) => language.code !== "auto")
                    .map((language) => (
                      <SelectItem key={language.code} value={language.code}>
                        {language.label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="relative p-4 pb-3">
            <label htmlFor="translator-source-text" className="sr-only">
              Text to translate
            </label>
            <Textarea
              id="translator-source-text"
              value={text}
              maxLength={5000}
              className="min-h-52 resize-y border-0 p-0 pr-10 text-base shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
              placeholder="Type or paste text to translate..."
              onChange={(event) => setText(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
                  event.preventDefault();
                  void translate();
                }
              }}
            />
            {text.length > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-3 top-3 h-8 w-8"
                aria-label="Clear source text"
                onClick={() => setText("")}
              >
                <X />
              </Button>
            )}
            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
              <span aria-live="polite">{text.length} / 5000</span>
              <span>Ctrl/Cmd + Enter</span>
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t bg-muted/20 p-4">
            <fieldset>
              <legend className="mb-2 text-sm font-medium">
                Translation providers
              </legend>
              <div className="grid gap-2 sm:grid-cols-2">
                {providers.map((provider) => {
                  const selected = selectedProviders.includes(provider.id);
                  const inputId = `provider-${provider.id}`;
                  return (
                    <label
                      key={provider.id}
                      htmlFor={inputId}
                      className={cn(
                        "flex min-h-12 cursor-pointer items-center gap-3 rounded-md border px-3 py-2 transition-colors focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background",
                        selected
                          ? "border-primary/50 bg-primary/5"
                          : "bg-background hover:bg-accent",
                      )}
                    >
                      <Checkbox
                        id={inputId}
                        checked={selected}
                        onCheckedChange={() => toggleProvider(provider.id)}
                        aria-describedby={`${inputId}-hint`}
                      />
                      <span className="min-w-0">
                        <span className="block text-sm font-medium">
                          {provider.label}
                        </span>
                        <span
                          id={`${inputId}-hint`}
                          className="block text-xs text-muted-foreground"
                        >
                          {provider.hint}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </fieldset>

            <Button
              type="button"
              className="w-full sm:self-end sm:px-8"
              variant={loading ? "outline" : "default"}
              disabled={
                !loading && (!text.trim() || selectedProviders.length === 0)
              }
              onClick={() => (loading ? cancelAll() : void translate())}
            >
              {loading ? <Square className="fill-current" /> : <Send />}
              {loading ? "Cancel all" : batchLabel}
            </Button>
          </div>
        </section>

        <section
          className="min-w-0"
          aria-labelledby="translation-results-title"
        >
          <div className="mb-3 flex min-h-7 items-center justify-between gap-4">
            <h3 id="translation-results-title" className="font-semibold">
              Results
            </h3>
            <p className="text-sm text-muted-foreground" aria-live="polite">
              {loading
                ? "Translation in progress"
                : settledResults.length > 0
                  ? `${successfulResults} of ${settledResults.length} available`
                  : "Results appear here"}
            </p>
          </div>
          <div
            className={cn(
              "grid gap-3",
              effectiveLayout === "stacked"
                ? "min-[901px]:grid-cols-2"
                : "grid-cols-1",
            )}
          >
            {slots.map((slot) => {
              if (slot.status === "idle") {
                return (
                  <IdleResultPanel
                    key={slot.provider}
                    provider={slot.provider}
                    disabled={!text.trim()}
                    onExecute={executeProvider}
                  />
                );
              }
              if (slot.status === "pending") {
                return (
                  <PendingResultPanel
                    key={slot.provider}
                    provider={slot.provider}
                    onCancel={cancelProvider}
                  />
                );
              }
              return (
                <ResultPanel
                  key={slot.provider}
                  result={slot.result}
                  stale={
                    slot.snapshot.text !== text ||
                    slot.snapshot.sourceLanguage !== sourceLanguage ||
                    slot.snapshot.targetLanguage !== targetLanguage
                  }
                  collapsed={collapsedProviders.includes(slot.provider)}
                  copyStatus={
                    copyFeedbacks.find(
                      (feedback) => feedback.provider === slot.provider,
                    )?.status
                  }
                  disabled={!text.trim()}
                  onCopy={copyResult}
                  onToggle={toggleResult}
                  onExecute={executeProvider}
                />
              );
            })}
            {slots.length === 0 && <NoProvidersPanel />}
          </div>
        </section>
      </div>
    </section>
  );
}

function ProviderHeading({ provider }: { provider: ProviderId }) {
  return (
    <div className="flex min-w-0 items-center gap-2">
      <span
        className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary"
        aria-hidden="true"
      >
        <Languages className="size-4" />
      </span>
      <strong className="truncate text-sm">{providerLabels[provider]}</strong>
    </div>
  );
}

function IdleResultPanel({
  provider,
  disabled,
  onExecute,
}: {
  provider: ProviderId;
  disabled: boolean;
  onExecute: (provider: ProviderId) => Promise<void>;
}) {
  const label = providerLabels[provider];
  return (
    <article
      className="rounded-lg border bg-card p-4 text-card-foreground"
      aria-label={`${label} translation result`}
    >
      <header className="flex items-center justify-between gap-3">
        <ProviderHeading provider={provider} />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={disabled}
          aria-label={`Translate with ${label}`}
          onClick={() => void onExecute(provider)}
        >
          <Send />
          Translate
        </Button>
      </header>
      <div className="flex min-h-32 flex-col items-center justify-center text-center">
        <p className="text-sm font-medium">Not translated yet</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Run this provider independently when you are ready.
        </p>
      </div>
    </article>
  );
}

function PendingResultPanel({
  provider,
  onCancel,
}: {
  provider: ProviderId;
  onCancel: (provider: ProviderId) => void;
}) {
  const label = providerLabels[provider];
  return (
    <article
      className="rounded-lg border bg-card p-4 text-card-foreground"
      aria-label={`${label} translation in progress`}
      aria-busy="true"
    >
      <header className="flex items-center justify-between gap-3">
        <ProviderHeading provider={provider} />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-label={`Cancel ${label} translation`}
          onClick={() => onCancel(provider)}
        >
          <Square className="fill-current" />
          Cancel
        </Button>
      </header>
      <output className="block min-h-32 pt-6">
        <span className="sr-only">Translating with {label}</span>
        <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
          <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
          Translating
        </div>
        <Skeleton className="mb-2 h-4 w-full" />
        <Skeleton className="mb-2 h-4 w-4/5" />
        <Skeleton className="h-4 w-2/5" />
      </output>
    </article>
  );
}

function ResultPanel({
  result,
  stale,
  collapsed,
  copyStatus,
  disabled,
  onCopy,
  onToggle,
  onExecute,
}: {
  result: ProviderResult;
  stale: boolean;
  collapsed: boolean;
  copyStatus?: CopyFeedback["status"];
  disabled: boolean;
  onCopy: (provider: ProviderId, translatedText: string) => Promise<void>;
  onToggle: (provider: ProviderId) => void;
  onExecute: (provider: ProviderId) => Promise<void>;
}) {
  const label = providerLabels[result.provider];
  const contentId = `translation-result-${result.provider}`;
  const copyLabel =
    copyStatus === "success"
      ? "Copied"
      : copyStatus === "error"
        ? "Copy failed"
        : "Copy";

  return (
    <article
      className={cn(
        "rounded-lg border bg-card text-card-foreground transition-colors",
        result.status === "error" && "border-destructive/40",
      )}
    >
      <output className="sr-only">
        {result.status === "success"
          ? `${label} translation completed.`
          : `${label} translation failed: ${result.error}`}
      </output>
      <header className="flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <ProviderHeading provider={result.provider} />
          <span className="text-xs text-muted-foreground">
            {result.durationMs} ms
          </span>
          {stale && (
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
              Earlier input
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {result.status === "success" && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 px-2",
                copyStatus === "error" && "text-destructive",
              )}
              aria-label={`Copy ${label} translation`}
              onClick={() =>
                void onCopy(result.provider, result.translatedText)
              }
            >
              {copyStatus === "success" ? <Check /> : <Copy />}
              <span className="hidden sm:inline">{copyLabel}</span>
              {copyStatus && (
                <output className="sr-only">{`${label}: ${copyLabel}`}</output>
              )}
            </Button>
          )}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            disabled={disabled}
            aria-label={
              result.status === "error"
                ? `Retry ${label} translation`
                : `Translate again with ${label}`
            }
            onClick={() => void onExecute(result.provider)}
          >
            {result.status === "error" ? <RotateCcw /> : <RefreshCw />}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            aria-label={`${collapsed ? "Expand" : "Collapse"} ${label} result`}
            aria-expanded={!collapsed}
            aria-controls={contentId}
            onClick={() => onToggle(result.provider)}
          >
            {collapsed ? <ChevronDown /> : <ChevronUp />}
          </Button>
        </div>
      </header>
      <div id={contentId} hidden={collapsed} className="min-h-32 p-4">
        {result.status === "success" ? (
          <p className="whitespace-pre-wrap break-words text-sm leading-7">
            {result.translatedText}
          </p>
        ) : (
          <div className="flex min-h-24 items-start gap-3 rounded-md bg-destructive/5 p-3 text-sm">
            <ChevronRight
              className="mt-0.5 size-4 shrink-0 text-destructive"
              aria-hidden="true"
            />
            <div>
              <p className="font-medium">No result was returned</p>
              <p className="mt-1 text-muted-foreground">{result.error}</p>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}

function NoProvidersPanel() {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center rounded-lg border border-dashed bg-muted/20 p-8 text-center">
      <Languages className="mb-3 size-8 text-muted-foreground" />
      <p className="text-sm font-medium">No providers selected</p>
      <p className="mt-1 max-w-xs text-xs text-muted-foreground">
        Select at least one provider to create a translation result panel.
      </p>
    </div>
  );
}
