import type { CuratedItemData } from "@/data/item-curated/fakeface";
import { unsummaryCuratedData } from "@/data/item-curated/unsummary";

export function getCuratedItemData(slug: string): CuratedItemData | null {
  const normalized = slug.toLowerCase();
  if (normalized === "unsummary") {
    return unsummaryCuratedData;
  }
  return null;
}
