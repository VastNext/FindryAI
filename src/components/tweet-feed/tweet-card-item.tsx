"use client";

import { EmbeddedTweet, TweetSkeleton, useTweet } from "react-tweet";
import { TweetErrorCard } from "./tweet-error-card";

interface TweetCardItemProps {
  tweetId: string;
}

export function TweetCardItem({ tweetId }: TweetCardItemProps) {
  // 走本站代理，避免浏览器直接访问 react-tweet.vercel.app 在部分网络不可达。
  const { data, error, isLoading } = useTweet(
    tweetId,
    `/api/tweet/${encodeURIComponent(tweetId)}`,
  );

  if (isLoading) {
    return (
      <div className="w-full rounded-2xl border border-border/50 bg-card p-4 shadow-sm animate-pulse">
        <TweetSkeleton />
      </div>
    );
  }

  if (error || !data) {
    return (
      <TweetErrorCard
        tweetId={tweetId}
        errorMessage={error ? "Unable to load post details" : "Post not found"}
      />
    );
  }

  return (
    <div className="tweet-card-wrapper w-full overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-all duration-300 hover:shadow-md hover:border-border">
      <EmbeddedTweet tweet={data} />
    </div>
  );
}
