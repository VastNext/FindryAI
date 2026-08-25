import HomeInfiniteScroll from "@/components/home/home-infinite-scroll";
import EmptyGrid from "@/components/shared/empty-grid";
import { siteConfig } from "@/config/site";
import { getItems } from "@/data/item";
import {
  DEFAULT_SORT,
  ITEMS_PER_PAGE,
  SORT_FILTER_LIST,
} from "@/lib/constants";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "",
  canonicalUrl: `${siteConfig.url}/`,
});

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
  const pageParam = Array.isArray(searchParams?.page)
    ? searchParams.page[0]
    : searchParams?.page;
  const parsedPage = Number(pageParam);
  const currentPage =
    Number.isInteger(parsedPage) && parsedPage >= 1 ? parsedPage : 1;
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
