import HomeInfiniteScroll from "@/components/home/home-infinite-scroll";
import EmptyGrid from "@/components/shared/empty-grid";
import { siteConfig } from "@/config/site";
import { getItems } from "@/data/item";
import {
  DEFAULT_SORT,
  ITEMS_PER_PAGE,
  SORT_FILTER_LIST,
} from "@/lib/constants";
import {
  constructMetadata,
  getPaginatedCanonicalUrl,
  parsePageParam,
} from "@/lib/metadata";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export function generateMetadata({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}): Metadata {
  return constructMetadata({
    title: { absolute: siteConfig.name },
    canonicalUrl: getPaginatedCanonicalUrl(
      `${siteConfig.url}/`,
      searchParams?.page,
    ),
  });
}

export default async function HomePage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  console.log("HomePage, searchParams", searchParams);

  const hasSponsorItem = false;

  const {
    category,
    tag,
    sort,
    q: query,
    f: filter,
  } = searchParams as { [key: string]: string };
  const { sortKey, reverse } =
    SORT_FILTER_LIST.find((item) => item.slug === sort) || DEFAULT_SORT;
  const currentPage = parsePageParam(searchParams?.page);
  const { items, totalCount } = await getItems({
    category,
    tag,
    sortKey,
    reverse,
    query,
    filter,
    currentPage,
    hasSponsorItem,
  });
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const lastValidPage = Math.max(1, totalPages);
  if (currentPage > lastValidPage) {
    redirect(lastValidPage > 1 ? `/?page=${lastValidPage}` : "/");
  }
  console.log("HomePage, totalCount", totalCount, ", totalPages", totalPages);

  return (
    <div>
      {/* when no items are found */}
      {items?.length === 0 && <EmptyGrid />}

      {/* when items are found */}
      {items && items.length > 0 && (
        <section className="">
          {/* key 保证搜索/筛选条件变化时重置无限滚动状态 */}
          <HomeInfiniteScroll
            key={`${category ?? ""}-${tag ?? ""}-${sort ?? ""}-${query ?? ""}-${filter ?? ""}-${currentPage}`}
            initialItems={items}
            initialPage={currentPage}
            totalPages={totalPages}
            category={category}
            tag={tag}
            sort={sort}
            query={query}
            filter={filter}
          />
        </section>
      )}
    </div>
  );
}
