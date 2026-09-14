import { TweetFeedView } from "@/components/tweet-feed/tweet-feed-view";
import type { TweetFeedData } from "@/components/tweet-feed/types";
import { siteConfig } from "@/config/site";
import { curatedTweetSummaries } from "@/data/tweet-feed-curated";
import { constructMetadata } from "@/lib/metadata";
import { getTweetFeedData } from "@/lib/tweet-feed";

const canonicalUrl = `${siteConfig.url}/ai-daily-feeds`;

const baseMetadata = constructMetadata({
  title:
    "AI Daily Feeds: Top AI Agent Updates, Breakthroughs & Curated Tweets (Today)",
  description:
    "Real-time daily curated AI tweets, autonomous agent breakthroughs, prompt techniques, and developer discussions across OpenClaw, Hermes, and leading AI labs.",
  canonicalUrl,
});

export const metadata = {
  ...baseMetadata,
  keywords: [
    "ai daily feeds",
    "curated ai tweets",
    "ai agent updates",
    "openclaw agent",
    "hermes 3 agent",
    "llm breakthroughs today",
    "autonomous agents tweets",
  ],
  openGraph: {
    ...baseMetadata.openGraph,
    url: canonicalUrl,
    title:
      "AI Daily Feeds: Top AI Agent Updates, Breakthroughs & Curated Tweets (Today)",
    description:
      "Real-time daily curated AI tweets, autonomous agent breakthroughs, prompt techniques, and developer discussions across OpenClaw, Hermes, and leading AI labs.",
  },
};

export const revalidate = 172800; // 48 hours ISR cache

// ItemList structured data for search engine rich indexing
const tweetFeedJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "AI Daily Feeds & Agent Highlights",
  description:
    "Curated daily updates and key takeaways from top AI researchers, agent developers, and builders.",
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
      datePublished: new Date().toISOString(),
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
