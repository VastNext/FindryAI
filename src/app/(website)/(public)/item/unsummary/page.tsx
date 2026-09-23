import ItemPage from "@/app/(website)/(public)/item/[slug]/page";
import { siteConfig } from "@/config/site";
import { unsummaryCuratedData } from "@/data/item-curated/unsummary";
import { constructMetadata } from "@/lib/metadata";
import type { Metadata } from "next";

export const revalidate = 172800; // 48 hours ISR cache

export async function generateMetadata(): Promise<Metadata> {
  return constructMetadata({
    title:
      "Unsummary: AI Book, Podcast & Media Summarizer Review, Free Limits & Official Link (2026)",
    description:
      "Official review and features of Unsummary (unsummary.com). Discover how it condenses long books, podcasts, and movies into structured key takeaways and chapter insights.",
    canonicalUrl: `${siteConfig.url}/item/unsummary`,
  });
}

export default function UnsummaryDedicatedPage() {
  return <ItemPage params={{ slug: "unsummary" }} />;
}
