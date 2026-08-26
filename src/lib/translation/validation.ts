import { languageCodes } from "./languages";
import { type ProviderId, type TranslateRequest, providerIds } from "./types";

export class RequestValidationError extends Error {
  constructor(
    message: string,
    public readonly status = 400,
  ) {
    super(message);
  }
}

export function validateTranslateRequest(input: unknown): TranslateRequest {
  if (!input || typeof input !== "object") {
    throw new RequestValidationError("Invalid request format.");
  }

  const value = input as Record<string, unknown>;
  const text = typeof value.text === "string" ? value.text : "";
  if (!text.trim()) {
    throw new RequestValidationError("Enter text to translate.");
  }
  if (text.length > 5000) {
    throw new RequestValidationError(
      "Text must not exceed 5,000 characters.",
      413,
    );
  }

  const sourceLanguage = value.sourceLanguage;
  const targetLanguage = value.targetLanguage;
  if (
    typeof sourceLanguage !== "string" ||
    !languageCodes.has(sourceLanguage as never) ||
    typeof targetLanguage !== "string" ||
    targetLanguage === "auto" ||
    !languageCodes.has(targetLanguage as never)
  ) {
    throw new RequestValidationError(
      "The request contains an unsupported language.",
    );
  }

  if (!Array.isArray(value.providers) || value.providers.length === 0) {
    throw new RequestValidationError(
      "Select at least one translation provider.",
    );
  }
  const providers = Array.from(new Set(value.providers));
  if (
    providers.some(
      (provider) =>
        typeof provider !== "string" ||
        !providerIds.includes(provider as ProviderId),
    )
  ) {
    throw new RequestValidationError(
      "The request contains an unsupported translation provider.",
    );
  }

  return {
    text,
    sourceLanguage,
    targetLanguage,
    providers: providers as ProviderId[],
  };
}
