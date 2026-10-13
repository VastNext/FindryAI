// 仅开放已有同用途候选的条目；新增前先核对条目状态和比较内容。
export const ALTERNATIVES_WHITELIST_SLUGS = [
  "unsummary",
  "novelai",
  "autodraw",
  "chefgpt",
  "photocraft",
  "vectorcraft",
  "filmcraft",
  "seedance-2-5",
  "kling-ai-video",
  "pika",
  "qwen-image-2-1",
  "nano-banana-2-1",
  "leonardo-ai",
  "melty-ai",
  "cursor",
  "notebooklm",
  "perplexity-ai",
  "writesonic",
  "upword",
  "vocal-remover",
  "suno",
] as const;

export type AlternativesWhitelistSlug =
  (typeof ALTERNATIVES_WHITELIST_SLUGS)[number];

const WHITELIST_SET = new Set<string>(ALTERNATIVES_WHITELIST_SLUGS);

export function isAlternativesEnabled(slug: string): boolean {
  return WHITELIST_SET.has(slug);
}
