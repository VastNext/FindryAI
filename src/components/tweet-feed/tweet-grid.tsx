"use client";

import { cn } from "@/lib/utils";
import { useEffect, useMemo, useRef, useState } from "react";
import { TweetCardItem } from "./tweet-card-item";

interface TweetGridProps {
  tweetIds: string[];
  hasMore: boolean;
  onRequestAppend: () => void;
}

const COLUMN_KEYS = [
  "column-primary",
  "column-secondary",
  "column-tertiary",
] as const;

export function TweetGrid({
  tweetIds,
  hasMore,
  onRequestAppend,
}: TweetGridProps) {
  // 移动优先，默认 1 列，避免移动端加载时出现 3 列闪动或宽度溢出
  const [columnCount, setColumnCount] = useState(1);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const appendPendingRef = useRef(false);

  useEffect(() => {
    const updateColumns = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setColumnCount(1);
      } else if (width < 1024) {
        setColumnCount(2);
      } else {
        setColumnCount(3);
      }
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, []);

  // 接近底部 600px 时自动触发追加加载
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore) return;

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
  }, [hasMore, onRequestAppend]);

  // 将推文按时间顺序从左到右分发至各列，保持自然文档流且高度自动撑开
  const columns = useMemo(() => {
    const cols: string[][] = Array.from({ length: columnCount }, () => []);
    tweetIds.forEach((id, index) => {
      cols[index % columnCount].push(id);
    });
    return cols;
  }, [tweetIds, columnCount]);

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

  return (
    <div className="w-full">
      <div
        className={cn(
          "grid gap-5 w-full items-start",
          columnCount === 1 && "grid-cols-1",
          columnCount === 2 && "grid-cols-2",
          columnCount === 3 && "grid-cols-3",
        )}
      >
        {columns.map((colItems, colIndex) => (
          <div
            key={COLUMN_KEYS[colIndex] || `column-${colIndex}`}
            className="flex flex-col gap-5 w-full"
          >
            {colItems.map((id) => (
              <TweetCardItem key={id} tweetId={id} />
            ))}
          </div>
        ))}
      </div>

      <div
        ref={sentinelRef}
        data-testid="tweet-feed-sentinel"
        className="h-px w-full my-4"
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
