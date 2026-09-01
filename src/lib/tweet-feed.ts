import { tweetFeedFallback } from "@/data/tweet-feed-fallback";
import { unstable_cache } from "next/cache";
import { type TweetFeedData, fetchMogeTweetFeed } from "./moge-tweet-feed";

const getCachedMogeTweetFeed = unstable_cache(
  fetchMogeTweetFeed,
  ["moge-ai-daily-feeds-v1"],
  { revalidate: 86_400 },
);

function hasUsableFallback(data: TweetFeedData) {
  return (
    data.all.length >= 20 &&
    data.openclaw.length >= 20 &&
    data.hermes.length >= 20
  );
}

export async function getTweetFeedData(): Promise<TweetFeedData> {
  try {
    return await getCachedMogeTweetFeed();
  } catch (error) {
    console.error(
      "Failed to refresh the MOGE tweet feed; using the bundled snapshot.",
      error,
    );
    if (!hasUsableFallback(tweetFeedFallback)) {
      throw new Error(
        "The live tweet feed and bundled fallback are both unavailable.",
      );
    }
    return tweetFeedFallback;
  }
}
