/**
 * Curated whitelist for tools that have high-quality, high-demand alternatives pages.
 *
 * Instead of mass-generating 1,100+ low-quality template pages that dilute domain
 * crawl budget and trigger Google's "Crawled - currently not indexed" threshold,
 * we strictly only expose curated alternatives matrices for these proven, high-demand tools.
 * All other tools gracefully return 404 (notFound()) on /item/[slug]/alternatives.
 */
export const ALTERNATIVES_WHITELIST_SLUGS = [
  // 1. Content condensation / Discontinued tool focus
  "unsummary",
  // 2. High-search / Already ranking seed items
  "novelai",
  "autodraw",
  "chefgpt",
  // 3. Brand-new flagship suites (ArtCraft family)
  "photocraft",
  "vectorcraft",
  "filmcraft",
  "lightcraft",
  // 4. Trending Video Generation
  "seedance-2-5",
  "kling-ai-video",
  "pika",
  // 5. Trending Image Generation & Models
  "qwen-image-2-1",
  "nano-banana-2-1",
  "leonardo-ai",
  // 6. Coding & AI Development
  "melty-ai",
  "cursor",
  "jan",
  // 7. Research, Notes & Assistants
  "notebooklm",
  "perplexity-ai",
  "elephas",
  // 8. Copywriting & Summarization
  "writesonic",
  "upword",
  // 9. Presentations, Audio & Music
  "gamma",
  "vocal-remover",
  "suno",
] as const;

export type AlternativesWhitelistSlug =
  (typeof ALTERNATIVES_WHITELIST_SLUGS)[number];

const WHITELIST_SET = new Set<string>(ALTERNATIVES_WHITELIST_SLUGS);

export function isAlternativesEnabled(slug: string): boolean {
  return WHITELIST_SET.has(slug);
}
