"use client";

import { ItemCardSkeleton } from "@/components/item/item-card";
import ItemGridClient from "@/components/item/item-grid-client";
import type { ItemListQueryResult } from "@/sanity.types";
import { useCallback, useEffect, useRef, useState } from "react";

interface HomeInfiniteScrollProps {
  initialItems: ItemListQueryResult;
  initialPage: number;
  totalPages: number;
  category?: string;
  tag?: string;
  sort?: string;
  query?: string;
  filter?: string;
  /**
   * 加载更多的触发方式：
   * - "scroll"（默认）：滚动接近底部时自动加载（无限滚动）
   * - "button"：点击 View More 按钮手动加载
   */
  trigger?: "scroll" | "button";
}

/**
 * 条目网格分页加载组件
 * scroll 模式监听滚动位置（IntersectionObserver 哨兵元素），
 * 接近底部时自动请求 /api/items 加载下一页并追加显示；
 * button 模式由用户点击 View More 按钮触发。
 */
export default function HomeInfiniteScroll({
  initialItems,
  initialPage,
  totalPages,
  category,
  tag,
  sort,
  query,
  filter,
  trigger = "scroll",
}: HomeInfiniteScrollProps) {
  const [items, setItems] = useState(initialItems);
  const [page, setPage] = useState(initialPage);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  const hasMore = page < totalPages;

  const loadMore = useCallback(async () => {
    if (loadingRef.current || page >= totalPages) return;
    loadingRef.current = true;
    setLoading(true);
    setFailed(false);
    try {
      const params = new URLSearchParams();
      if (category) params.set("category", category);
      if (tag) params.set("tag", tag);
      if (sort) params.set("sort", sort);
      if (query) params.set("q", query);
      if (filter) params.set("f", filter);
      params.set("page", String(page + 1));

      const res = await fetch(`/api/items?${params.toString()}`);
      if (!res.ok) throw new Error(`请求失败: ${res.status}`);

      const data: { items: ItemListQueryResult } = await res.json();
      setItems((prev) => [...prev, ...data.items]);
      setPage((prev) => prev + 1);
    } catch (error) {
      console.error("loadMore error:", error);
      setFailed(true);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [page, totalPages, category, tag, sort, query, filter]);

  useEffect(() => {
    // button 模式不观察滚动，由点击触发
    if (trigger !== "scroll") return;
    // 已加载完或正在加载时无需观察
    if (!hasMore) return;

    const el = sentinelRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          loadMore();
        }
      },
      // 提前 800px 触发，滚到底部前就开始加载
      { rootMargin: "800px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore, hasMore, trigger]);

  return (
    <div>
      <ItemGridClient items={items} />

      {/* View More 按钮：原分页位置，点击加载下一页 */}
      {trigger === "button" && hasMore && (
        <div className="mt-8 flex items-center justify-center">
          <button
            type="button"
            onClick={loadMore}
            disabled={loading}
            className="cursor-pointer rounded-md border px-6 py-2 text-sm font-medium transition-colors hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Loading..." : "View More"}
          </button>
        </div>
      )}

      {/* 底部哨兵：进入视口即触发加载下一页（仅滚动模式） */}
      {trigger === "scroll" && hasMore && (
        <div ref={sentinelRef} className="h-px w-full" aria-hidden />
      )}

      {/* 加载中骨架（仅滚动模式；按钮模式的加载态由按钮自身呈现） */}
      {trigger === "scroll" && loading && (
        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: 骨架占位无稳定 id
            <ItemCardSkeleton key={index} />
          ))}
        </div>
      )}

      {/* 加载失败提示与重试（仅滚动模式；按钮模式失败后可直接再次点击按钮） */}
      {trigger === "scroll" && failed && !loading && (
        <div className="mt-8 flex items-center justify-center">
          <button
            type="button"
            onClick={loadMore}
            className="cursor-pointer rounded-md border px-4 py-2 text-sm text-muted-foreground hover:bg-accent"
          >
            Failed to load. Click to retry.
          </button>
        </div>
      )}

      {/* 全部加载完成 */}
      {!hasMore && (
        <div className="mt-8 flex items-center justify-center text-sm text-muted-foreground">
          You've reached the end — {items.length} items in total
        </div>
      )}
    </div>
  );
}
