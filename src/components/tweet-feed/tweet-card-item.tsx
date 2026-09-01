"use client";

import { useEffect, useState } from "react";
import { EmbeddedTweet, TweetSkeleton, useTweet } from "react-tweet";
import type { Tweet } from "react-tweet/api";
import { useFeedTranslationLanguage } from "./translation-context";
import { TweetErrorCard } from "./tweet-error-card";

interface TweetCardItemProps {
  tweetId: string;
}

export function TweetCardItem({ tweetId }: TweetCardItemProps) {
  const { data, error, isLoading } = useTweet(tweetId);
  const translationLanguage = useFeedTranslationLanguage();
  const [translatedTweet, setTranslatedTweet] = useState<Tweet | null>(null);

  useEffect(() => {
    if (!data) return;

    if (translationLanguage !== "en" || data.lang === "en") {
      setTranslatedTweet(null);
      return;
    }

    let cancelled = false;
    const translateText = async (text: string) => {
      const response = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          sourceLanguage: "auto",
          targetLanguage: "en",
          providers: ["agnes-2-0"],
        }),
      });
      if (!response.ok) throw new Error("翻译服务请求失败");
      const result = (await response.json()) as {
        results: Array<
          { status: "success"; translatedText: string } | { status: "error" }
        >;
      };
      const translated = result.results.find(
        (item) => item.status === "success",
      );
      if (!translated || translated.status !== "success") {
        throw new Error("翻译服务请求失败");
      }
      return translated.translatedText;
    };

    Promise.all([
      translateText(data.text),
      data.quoted_tweet ? translateText(data.quoted_tweet.text) : null,
    ])
      .then(([text, quotedText]) => {
        if (cancelled) return;
        setTranslatedTweet({
          ...data,
          lang: "en",
          text,
          quoted_tweet:
            data.quoted_tweet && quotedText
              ? { ...data.quoted_tweet, lang: "en", text: quotedText }
              : data.quoted_tweet,
        });
      })
      .catch(() => {
        if (!cancelled) setTranslatedTweet(null);
      });

    return () => {
      cancelled = true;
    };
  }, [data, translationLanguage]);

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
      <EmbeddedTweet tweet={translatedTweet ?? data} />
    </div>
  );
}
