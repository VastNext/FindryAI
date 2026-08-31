import { TweetFeedView } from "@/components/tweet-feed/tweet-feed-view";
import type { TweetFeedData } from "@/components/tweet-feed/types";
import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/metadata";
import { getTweetFeedData } from "@/lib/tweet-feed";

const baseMetadata = constructMetadata({
  title: "AI Daily Feeds - Curated AI Tweets & Agent Updates",
  description:
    "Explore curated daily tweets, breakthroughs, and discussions across AI agents and the AI ecosystem.",
  canonicalUrl: `${siteConfig.url}/ai-daily-feeds`,
});

export const metadata = {
  ...baseMetadata,
  openGraph: {
    ...baseMetadata.openGraph,
    url: `${siteConfig.url}/ai-daily-feeds`,
  },
};

export const revalidate = 86_400;

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
      <TweetFeedView initialData={feedData} />
    </div>
  );
}
