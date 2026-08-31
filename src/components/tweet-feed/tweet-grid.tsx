"use client";

import { MasonryInfiniteGrid } from "@egjs/react-infinitegrid";
import { useEffect, useRef, useState } from "react";
import { TweetCardItem } from "./tweet-card-item";

interface TweetGridProps {
  tweetIds: string[];
  hasMore: boolean;
  onRequestAppend: () => void;
}

export function TweetGrid({
  tweetIds,
  hasMore,
  onRequestAppend,
}: TweetGridProps) {
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const itemCount = tweetIds.length;
  const gridRef = useRef<MasonryInfiniteGrid>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const appendPendingRef = useRef(false);

  useEffect(() => {
    setMounted(true);
    const media = window.matchMedia("(max-width: 767px)");
    const updateViewport = () => setIsMobile(media.matches);
    updateViewport();
    media.addEventListener("change", updateViewport);
    return () => media.removeEventListener("change", updateViewport);
  }, []);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!mounted || !sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || appendPendingRef.current) return;
        appendPendingRef.current = true;
        onRequestAppend();
        window.setTimeout(() => {
          appendPendingRef.current = false;
        }, 500);
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, mounted, onRequestAppend]);

  useEffect(() => {
    if (!mounted || itemCount === 0) return;
    const timer = window.setTimeout(
      () => gridRef.current?.updateItems(),
      1_000,
    );
    return () => window.clearTimeout(timer);
  }, [itemCount, mounted]);

  if (tweetIds.length === 0) {
    return (
      <div className="my-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-card/40 px-4 py-20 text-center">
        <p className="text-lg font-medium text-foreground">
          Feed temporarily unavailable
        </p>
        <p className="mt-1 max-w-md text-sm text-muted-foreground">
          We could not load this channel. Refresh the page or check back later.
        </p>
      </div>
    );
  }

  if (!mounted || isMobile) {
    return (
      <div className="w-full">
        <div className="grid w-full grid-cols-1 gap-5">
          {tweetIds.map((id) => (
            <div key={id} className="w-full">
              <TweetCardItem tweetId={id} />
            </div>
          ))}
        </div>
        <div
          ref={sentinelRef}
          data-testid="tweet-feed-sentinel"
          className="h-px w-full"
          aria-hidden="true"
        />
        {hasMore && (
          <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary/40 border-t-primary" />
            <span>Loading more feeds...</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-full">
      <MasonryInfiniteGrid
        ref={gridRef}
        className="w-full"
        gap={20}
        align="center"
        useResizeObserver={true}
        observeChildren={true}
      >
        {tweetIds.map((id, index) => {
          const groupKey = Math.floor(index / 20);
          return (
            <div
              key={id}
              data-grid-groupkey={groupKey}
              className="w-full md:w-[calc(50%-10px)] lg:w-[calc(33.333%-14px)] transition-transform duration-200"
              style={{
                willChange: "transform",
                contain: "layout style paint",
              }}
            >
              <TweetCardItem tweetId={id} />
            </div>
          );
        })}
      </MasonryInfiniteGrid>

      <div
        ref={sentinelRef}
        data-testid="tweet-feed-sentinel"
        className="h-px w-full"
        aria-hidden="true"
      />

      {hasMore && (
        <div className="flex justify-center items-center py-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="h-4 w-4 rounded-full border-2 border-primary/40 border-t-primary animate-spin" />
            <span>Loading more feeds...</span>
          </div>
        </div>
      )}
    </div>
  );
}
