import HomeInfiniteScroll from "@/components/home/home-infinite-scroll";
import EmptyGrid from "@/components/shared/empty-grid";
import { siteConfig } from "@/config/site";
import { getItems } from "@/data/item";
import { DEFAULT_SORT, ITEMS_PER_PAGE } from "@/lib/constants";
import { constructMetadata } from "@/lib/metadata";
import type { Metadata } from "next";

export const revalidate = 172800; // 48 hours ISR cache

export function generateMetadata(): Metadata {
  return constructMetadata({
    title: {
      absolute: "Findry AI - Curated AI Tools & Agent Skills Directory",
    },
    canonicalUrl: `${siteConfig.url}/`,
  });
}

// No server-side searchParams here: reading them opts the homepage out of ISR.
// /?page= is 308'd by middleware, category/tag/sort browsing lives on the
// /category and /tag routes, and deeper pages load client-side through
// HomeInfiniteScroll calling /api/items.
export default async function HomePage() {
  const hasSponsorItem = false;

  const { items, totalCount } = await getItems({
    sortKey: DEFAULT_SORT.sortKey,
    reverse: DEFAULT_SORT.reverse,
    currentPage: 1,
    hasSponsorItem,
  });
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  return (
    <div>
      {/* when no items are found */}
      {items?.length === 0 && <EmptyGrid />}

      {/* when items are found */}
      {items && items.length > 0 && (
        <section className="">
          <HomeInfiniteScroll
            initialItems={items}
            initialPage={1}
            totalPages={totalPages}
            trigger="button"
          />
        </section>
      )}
    </div>
  );
}
