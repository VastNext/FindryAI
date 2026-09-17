import { getItems } from "@/data/item";
import { DEFAULT_SORT, SORT_FILTER_LIST } from "@/lib/constants";
import { NextResponse } from "next/server";

/**
 * 分页获取条目列表，供无限滚动组件请求下一页
 * 参数与首页查询参数一致：category/tag/sort/q/f/page
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") ?? undefined;
    const tag = searchParams.get("tag") ?? undefined;
    const query = searchParams.get("q") ?? undefined;
    const filter = searchParams.get("f") ?? undefined;
    const sort = searchParams.get("sort") ?? undefined;
    const page = Number(searchParams.get("page")) || 1;

    const { sortKey, reverse } =
      SORT_FILTER_LIST.find((item) => item.slug === sort) || DEFAULT_SORT;

    const { items, totalCount } = await getItems({
      category,
      tag,
      sortKey,
      reverse,
      query,
      filter,
      currentPage: page,
      hasSponsorItem: false,
    });

    // 检查是否请求强制刷新（如传递 nocache=1 或 fresh=1）
    const isNoCache =
      searchParams.get("nocache") === "1" ||
      searchParams.get("fresh") === "1" ||
      request.headers.get("cache-control") === "no-cache";

    // 默认提供 24 小时 (86400秒) 边缘缓存，并允许 48 小时 (172800秒) 的 stale-while-revalidate 异步平滑更新
    const cacheControl = isNoCache
      ? "no-store, no-cache, must-revalidate"
      : "public, s-maxage=86400, stale-while-revalidate=172800";

    return NextResponse.json(
      { items, totalCount },
      {
        headers: {
          "Cache-Control": cacheControl,
          "CDN-Cache-Control": cacheControl,
          "Vercel-CDN-Cache-Control": cacheControl,
        },
      },
    );
  } catch (error) {
    console.error("api/items error:", error);
    return NextResponse.json({ error: "获取条目列表失败" }, { status: 500 });
  }
}
