import type { Fetcher, ProviderInput, TranslationProvider } from "../provider";

const TKK = "448487.932609646";

function mix(value: number, pattern: string) {
  let result = value;
  for (let index = 0; index < pattern.length - 2; index += 3) {
    let shift: string | number = pattern.charAt(index + 2);
    shift = shift >= "a" ? shift.charCodeAt(0) - 87 : Number(shift);
    const shifted =
      pattern.charAt(index + 1) === "+" ? result >>> shift : result << shift;
    result =
      pattern.charAt(index) === "+"
        ? result + (shifted & 0xffffffff)
        : result ^ shifted;
  }
  return result;
}

export function calculateGoogleToken(text: string) {
  const [indexText, keyText] = TKK.split(".");
  const tkkIndex = Number(indexText);
  const bytes = new TextEncoder().encode(text);
  let round = tkkIndex;
  for (let index = 0; index < bytes.length; index += 1) {
    round = mix(round + bytes[index], "+-a^+6");
  }
  round = mix(round, "+-3^+b+-f") ^ Number(keyText);
  if (round <= 0) round = (round & 0x7fffffff) + 0x80000000;
  const normalized = round % 1_000_000;
  return `${normalized}.${normalized ^ tkkIndex}`;
}

function stripGoogleHtml(value: string) {
  return value
    .replace(/^<pre[^>]*>/, "")
    .replace(/<\/pre>$/, "")
    .replace(/<i>[\s\S]*$/g, "")
    .replace(/<\/?(?:b|a)[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

export class GoogleWebProvider implements TranslationProvider {
  readonly id = "google" as const;
  readonly label = "Google Translate";
  readonly available = true;

  constructor(private readonly fetcher: Fetcher = fetch) {}

  async translate(input: ProviderInput, signal?: AbortSignal) {
    const query = new URLSearchParams({
      anno: "3",
      client: "te",
      v: "1.0",
      format: "text",
      sl: input.sourceLanguage,
      tl: input.targetLanguage,
      tk: calculateGoogleToken(input.text),
    });
    const response = await this.fetcher(
      `https://translate.googleapis.com/translate_a/t?${query}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ q: input.text }).toString(),
        signal,
      },
    );
    if (!response.ok) {
      throw new Error("Google Translate is temporarily unavailable.");
    }
    const data = (await response.json()) as unknown;
    const first = Array.isArray(data) ? data[0] : undefined;
    if (typeof first === "string") {
      return { translatedText: stripGoogleHtml(first) };
    }
    if (Array.isArray(first) && typeof first[0] === "string") {
      return {
        translatedText: stripGoogleHtml(first[0]),
        detectedLanguage: typeof first[1] === "string" ? first[1] : undefined,
      };
    }
    throw new Error("Google returned an unrecognized response.");
  }
}
