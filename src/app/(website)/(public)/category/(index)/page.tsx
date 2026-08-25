import ItemGrid from "@/components/item/item-grid";
import EmptyGrid from "@/components/shared/empty-grid";
import CustomPagination from "@/components/shared/pagination";
import { siteConfig } from "@/config/site";
import { getItems } from "@/data/item";
import {
  DEFAULT_SORT,
  ITEMS_PER_PAGE,
  SORT_FILTER_LIST,
} from "@/lib/constants";
import { constructMetadata, getPaginatedCanonicalUrl } from "@/lib/metadata";
import type { SponsorItemListQueryResult } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { sponsorItemListQuery } from "@/sanity/lib/queries";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export function generateMetadata({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}): Metadata {
  return constructMetadata({
    title: "Category",
    description: "Explore AI tools by category",
    canonicalUrl: getPaginatedCanonicalUrl(
      `${siteConfig.url}/category`,
      searchParams?.page,
    ),
  });
}

export default async function CategoryIndexPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const sponsorItems =
    (await sanityFetch<SponsorItemListQueryResult>({
      query: sponsorItemListQuery,
    })) || [];
  const showSponsor = true;
  const hasSponsorItem = showSponsor && sponsorItems.length > 0;

  const {
    category,
    tag,
    sort,
    page,
    q: query,
    f: filter,
  } = searchParams as { [key: string]: string };
  const { sortKey, reverse } =
    SORT_FILTER_LIST.find((item) => item.slug === sort) || DEFAULT_SORT;
  const parsedPage = page ? Number(page) : 1;
  const pageIsValid = Number.isInteger(parsedPage) && parsedPage > 0;
  const currentPage = pageIsValid ? parsedPage : 1;

  const getCategoryUrl = (targetPage?: number) => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (tag) params.set("tag", tag);
    if (sort) params.set("sort", sort);
    if (query) params.set("q", query);
    if (filter) params.set("f", filter);
    if (targetPage && targetPage > 1) params.set("page", String(targetPage));
    const queryString = params.toString();
    return queryString ? `/category?${queryString}` : "/category";
  };

  if (!pageIsValid) {
    redirect(getCategoryUrl());
  }

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
  const itemsPerPage = hasSponsorItem ? ITEMS_PER_PAGE - 1 : ITEMS_PER_PAGE;
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const lastValidPage = Math.max(totalPages, 1);

  if (currentPage > lastValidPage) {
    redirect(getCategoryUrl(lastValidPage));
  }

  return (
    <div>
      {items?.length === 0 && <EmptyGrid />}

      {items && items.length > 0 && (
        <section>
          <ItemGrid
            items={items}
            sponsorItems={sponsorItems}
            showSponsor={showSponsor}
          />

          <div className="mt-8 flex items-center justify-center">
            <CustomPagination routePrefix="/category" totalPages={totalPages} />
          </div>
        </section>
      )}
    </div>
  );
}
