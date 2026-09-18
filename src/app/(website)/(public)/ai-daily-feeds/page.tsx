import { TweetFeedView } from "@/components/tweet-feed/tweet-feed-view";
import type { TweetFeedData } from "@/components/tweet-feed/types";
import { siteConfig } from "@/config/site";
import { curatedTweetSummaries } from "@/data/tweet-feed-curated";
import { constructMetadata } from "@/lib/metadata";
import { getTweetFeedData } from "@/lib/tweet-feed";

const canonicalUrl = `${siteConfig.url}/ai-daily-feeds`;

const pageTitle =
  "AI Daily Pulse: Top AI Agent Updates, LLM Breakthroughs & Curated Tweets";
const pageDescription =
  "Real-time daily curated AI breakthroughs, autonomous agent frameworks (OpenClaw, Hermes 3), TimesFM, LLM benchmarks, and developer discussions. Updated every 3 hours with key takeaways.";

const baseMetadata = constructMetadata({
  title: pageTitle,
  description: pageDescription,
  canonicalUrl,
});

export const metadata = {
  ...baseMetadata,
  keywords: [
    "ai daily feeds",
    "ai agent updates",
    "curated ai tweets",
    "openclaw agent",
    "hermes 3 agent",
    "timesfm 3.0",
    "autonomous coding agents",
    "llm breakthroughs today",
    "multi-agent orchestration",
    "ai research takeaways",
    "ai daily digest",
  ],
  openGraph: {
    ...baseMetadata.openGraph,
    url: canonicalUrl,
    title: pageTitle,
    description: pageDescription,
  },
  twitter: {
    ...baseMetadata.twitter,
    title: pageTitle,
    description: pageDescription,
  },
};

export const revalidate = 10800; // 3 hours ISR cache (3 * 3600 seconds)

// ItemList structured data for search engine rich indexing with accurate timestamps
const tweetFeedJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "AI Daily Pulse: Curated Agent Highlights & Developer Briefings",
  description: pageDescription,
  url: canonicalUrl,
  numberOfItems: curatedTweetSummaries.length,
  itemListElement: curatedTweetSummaries.map((summary, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "SocialMediaPosting",
      headline: summary.title,
      text: summary.summary,
      author: {
        "@type": "Person",
        name: summary.authorName,
      },
      url: summary.url,
      datePublished: summary.datePublished,
    },
  })),
};

export default async function AiDailyFeedsPage() {
  let feedData: TweetFeedData = {
    all: [],
    openclaw: [],
    hermes: [],
  };

  try {
    const data = await getTweetFeedData();
    if (data && typeof data === "object") {
      feedData = {
        all: Array.isArray(data.all) ? data.all : [],
        openclaw: Array.isArray(data.openclaw) ? data.openclaw : [],
        hermes: Array.isArray(data.hermes) ? data.hermes : [],
      };
    }
  } catch (err) {
    console.error("Failed to fetch tweet feed data:", err);
  }

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Valid JSON-LD schema
        dangerouslySetInnerHTML={{ __html: JSON.stringify(tweetFeedJsonLd) }}
      />
      <TweetFeedView initialData={feedData} />
    </div>
  );
}
