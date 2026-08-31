"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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

      {hasMore && (
        <div className="flex items-center justify-center pt-10 pb-4">
          <Button
            variant="outline"
            size="lg"
            onClick={onRequestAppend}
            className="rounded-full px-8 gap-2 font-medium shadow-sm hover:border-primary/50 hover:bg-accent transition-all text-sm h-11"
          >
            <span>Load More Feeds</span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      )}
    </div>
  );
}
