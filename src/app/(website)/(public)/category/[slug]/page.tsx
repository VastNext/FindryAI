import {
  CategorySeoFooter,
  CategorySeoHeader,
  CategorySeoSubnav,
} from "@/components/category/category-seo-section";
import ItemGrid from "@/components/item/item-grid";
import EmptyGrid from "@/components/shared/empty-grid";
import { JsonLd } from "@/components/shared/json-ld";
import CustomPagination from "@/components/shared/pagination";
import { getCategorySeo } from "@/config/category-seo";
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

export const revalidate = 172800; // 48 hours ISR cache

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

  const seo = getCategorySeo(params.slug, category.name);
  const title = seo.seoTitle;
  const description = seo.seoDescription || category.description || "";

  const ogImageUrl = new URL(`${siteConfig.url}/api/og`);
  ogImageUrl.searchParams.append("title", category.name);
  ogImageUrl.searchParams.append("description", description);
  ogImageUrl.searchParams.append("type", "Category");

  return constructMetadata({
    title,
    description,
    canonicalUrl: getPaginatedCanonicalUrl(
      `${siteConfig.url}/category/${params.slug}`,
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

  const seo = getCategorySeo(params.slug, category?.name);

  // Build JSON-LD structured data: CollectionPage, ItemList, BreadcrumbList, and FAQPage
  const categoryJsonLd: Array<Record<string, unknown>> = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: seo.h1 || category?.name,
      description: seo.seoDescription || category?.description,
      url: `${siteConfig.url}/category/${params.slug}`,
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
          name: "Category",
          item: `${siteConfig.url}/category`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: category?.name || params.slug,
          item: `${siteConfig.url}/category/${params.slug}`,
        },
      ],
    },
  ];

  if (items && items.length > 0) {
    categoryJsonLd.push({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `${category?.name || params.slug} Tools Directory`,
      numberOfItems: items.length,
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.name,
        description: item.description,
        url: `${siteConfig.url}/item/${item.slug.current}`,
      })),
    });
  }

  if (seo.faqs && seo.faqs.length > 0) {
    categoryJsonLd.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: seo.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    });
  }

  return (
    <div className="space-y-6">
      <JsonLd data={categoryJsonLd} />

      {/* Zone 1: SEO header (badge + single H1 + short subtitle) */}
      <CategorySeoHeader seo={seo} />

      {/* Zone 2: sub-category navigation above the grid */}
      <CategorySeoSubnav seo={seo} />

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
              routePrefix={`/category/${params.slug}`}
              totalPages={totalPages}
            />
          </div>
        </section>
      )}

      {/* Zone 3: deep content below the grid (About → FAQ → Related categories) */}
      <CategorySeoFooter seo={seo} />
    </div>
  );
}
