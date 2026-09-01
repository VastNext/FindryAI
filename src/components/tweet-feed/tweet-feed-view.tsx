"use client";

import Container from "@/components/container";
import { useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { BackToTop } from "./back-to-top";
import { TweetGrid } from "./tweet-grid";
import { TweetHero } from "./tweet-hero";
import { TweetRelatedLinks } from "./tweet-related-links";
import { TweetTabs } from "./tweet-tabs";
import type { FeedTab, TweetFeedData } from "./types";

interface TweetFeedViewProps {
  initialData: TweetFeedData;
}

const PAGE_SIZE = 20;

export function TweetFeedView({ initialData }: TweetFeedViewProps) {
  const searchParams = useSearchParams();
  // 从查询参数确定初始标签
  const paramTab = searchParams.get("tab") as FeedTab | null;
  const validTab: FeedTab =
    paramTab === "openclaw" || paramTab === "hermes" ? paramTab : "all";

  const [activeTab, setActiveTab] = useState<FeedTab>(validTab);
  const [page, setPage] = useState<number>(1);
  // 根据当前标签选择列表
  const currentList = useMemo(() => {
    const list = initialData?.[activeTab];
    return Array.isArray(list) ? list : [];
  }, [initialData, activeTab]);

  const counts = useMemo(
    () => ({
      all: initialData?.all?.length || 0,
      openclaw: initialData?.openclaw?.length || 0,
      hermes: initialData?.hermes?.length || 0,
    }),
    [initialData],
  );

  const handleTabChange = useCallback(
    (newTab: FeedTab) => {
      if (newTab === activeTab) return;
      setActiveTab(newTab);
      setPage(1);

      // 更新 URL 查询参数
      const url =
        newTab === "all" ? "/ai-daily-feeds" : `/ai-daily-feeds?tab=${newTab}`;
      if (typeof window !== "undefined") {
        window.history.replaceState(null, "", url);
      }
    },
    [activeTab],
  );

  const visibleCount = page * PAGE_SIZE;
  const visibleIds = useMemo(() => {
    return currentList.slice(0, visibleCount);
  }, [currentList, visibleCount]);

  const hasMore = visibleCount < currentList.length;

  const handleAppend = useCallback(() => {
    setPage((prev) => prev + 1);
  }, []);

  return (
    <Container className="mt-4 md:mt-8 pb-16">
      <div className="flex flex-col w-full">
        {/* Hero 区域 */}
        <TweetHero />

        {/* 频道标签 */}
        <TweetTabs
          activeTab={activeTab}
          onTabChange={handleTabChange}
          counts={counts}
        />

        {/* Google Translate 只处理此容器 */}
        <div
          id="translate-target"
          role="tabpanel"
          data-panel-id={`panel-${activeTab}`}
          aria-labelledby={`tab-${activeTab}`}
          className="w-full min-h-[400px]"
        >
          <TweetGrid
            tweetIds={visibleIds}
            hasMore={hasMore}
            onRequestAppend={handleAppend}
          />
        </div>

        {/* 相关站内资源 */}
        <TweetRelatedLinks />

        {/* 返回顶部 */}
        <BackToTop />
      </div>
    </Container>
  );
}
