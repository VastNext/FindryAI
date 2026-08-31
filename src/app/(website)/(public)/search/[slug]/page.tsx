import ItemGrid from "@/components/item/item-grid";
import EmptyGrid from "@/components/shared/empty-grid";
import { JsonLd } from "@/components/shared/json-ld";
import CustomPagination from "@/components/shared/pagination";
import { siteConfig } from "@/config/site";
import { getItems } from "@/data/item";
import {
  DEFAULT_SORT,
  ITEMS_PER_PAGE,
  SORT_FILTER_LIST,
} from "@/lib/constants";
import { constructMetadata, getPaginatedCanonicalUrl } from "@/lib/metadata";
import type {
  CategoryQueryResult,
  SponsorItemListQueryResult,
} from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { categoryQuery, sponsorItemListQuery } from "@/sanity/lib/queries";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}): Promise<Metadata | undefined> {
  const category = await sanityFetch<CategoryQueryResult>({
    query: categoryQuery,
    params: { slug: params.slug },
  });
  if (!category) {
    console.warn(
      `generateMetadata, category not found for slug: ${params.slug}`,
    );
    return;
  }

  const ogImageUrl = new URL(`${siteConfig.url}/api/og`);
  ogImageUrl.searchParams.append("title", category.name);
  ogImageUrl.searchParams.append("description", category.description || "");
  ogImageUrl.searchParams.append("type", "Category");

  return constructMetadata({
    title: `${category.name}`,
    description: category.description,
    canonicalUrl: getPaginatedCanonicalUrl(
      `${siteConfig.url}/search/${params.slug}`,
      searchParams?.page,
    ),
    image: ogImageUrl.toString(),
  });
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const [category, sponsorItems] = await Promise.all([
    sanityFetch<CategoryQueryResult>({
      query: categoryQuery,
      params: { slug: params.slug },
    }),
    sanityFetch<SponsorItemListQueryResult>({
      query: sponsorItemListQuery,
    }),
  ]);
  const showSponsor = true;
  const hasSponsorItem = showSponsor && (sponsorItems?.length ?? 0) > 0;

  const { sort, page } = searchParams as { [key: string]: string };
  const { sortKey, reverse } =
    SORT_FILTER_LIST.find((item) => item.slug === sort) || DEFAULT_SORT;
  const currentPage = page ? Number(page) : 1;
  const { items, totalCount } = await getItems({
    category: params.slug,
    sortKey,
    reverse,
    currentPage,
    hasSponsorItem,
  });
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  console.log(
    "CategoryPage, totalCount",
    totalCount,
    ", totalPages",
    totalPages,
  );

  const categoryJsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: category?.name,
      ...(category?.description && { description: category.description }),
      url: `${siteConfig.url}/search/${params.slug}`,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: siteConfig.url,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Search",
          item: `${siteConfig.url}/search`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: category?.name || params.slug,
          item: `${siteConfig.url}/search/${params.slug}`,
        },
      ],
    },
  ];

  return (
    <div>
      <JsonLd data={categoryJsonLd} />
      {/* when no items are found */}
      {items?.length === 0 && <EmptyGrid />}

      {/* when items are found */}
      {items && items.length > 0 && (
        <section className="">
          <ItemGrid
            items={items}
            sponsorItems={sponsorItems}
            showSponsor={showSponsor}
          />

          <div className="mt-8 flex items-center justify-center">
            <CustomPagination
              routePrefix={`/search/${params.slug}`}
              totalPages={totalPages}
            />
          </div>
        </section>
      )}
    </div>
  );
}
