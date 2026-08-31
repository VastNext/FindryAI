import ItemGrid from "@/components/item/item-grid";
import EmptyGrid from "@/components/shared/empty-grid";
import { HeaderSection } from "@/components/shared/header-section";
import { JsonLd } from "@/components/shared/json-ld";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { urlForIcon } from "@/lib/image";
import { constructMetadata } from "@/lib/metadata";
import type {
  ItemWithAlternativesBySlugQueryResult,
  SponsorItemListQueryResult,
} from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  itemWithAlternativesBySlugQuery,
  sponsorItemListQuery,
} from "@/sanity/lib/queries";
import { ArrowLeftIcon } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

interface AlternativesPageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: AlternativesPageProps): Promise<Metadata | undefined> {
  const item = await sanityFetch<ItemWithAlternativesBySlugQueryResult>({
    query: itemWithAlternativesBySlugQuery,
    params: { slug: params.slug },
  });

  if (!item?.name) {
    return;
  }

  const primaryCategory = item.categories?.[0]?.name || "AI";
  const title = `Best ${item.name} Alternatives & Competitors in 2026`;
  const description = `Looking for the best alternatives to ${item.name}? Compare top ${primaryCategory} tools, key features, pricing, and find the perfect alternative.`;
  const canonicalUrl = `${siteConfig.url}/item/${params.slug}/alternatives`;

  const ogImageUrl = new URL(`${siteConfig.url}/api/og`);
  ogImageUrl.searchParams.append("title", `${item.name} Alternatives`);
  ogImageUrl.searchParams.append(
    "description",
    `Top competitors and alternatives to ${item.name}`,
  );
  ogImageUrl.searchParams.append("type", "Alternatives");

  return constructMetadata({
    title,
    description,
    canonicalUrl,
    image: ogImageUrl.toString(),
  });
}

export default async function AlternativesPage({
  params,
}: AlternativesPageProps) {
  const [item, sponsorItems] = await Promise.all([
    sanityFetch<ItemWithAlternativesBySlugQueryResult>({
      query: itemWithAlternativesBySlugQuery,
      params: { slug: params.slug },
    }),
    sanityFetch<SponsorItemListQueryResult>({
      query: sponsorItemListQuery,
    }),
  ]);

  if (!item) {
    return notFound();
  }

  const iconProps = item.icon ? urlForIcon(item.icon) : null;
  const primaryCategory = item.categories?.[0];
  const alternatives = item.alternatives || [];
  const count = alternatives.length;

  const pageUrl = `${siteConfig.url}/item/${params.slug}/alternatives`;
  const itemUrl = `${siteConfig.url}/item/${params.slug}`;

  const alternativesJsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: `Best ${item.name} Alternatives & Competitors`,
      description: `Explore the top alternatives and competitors to ${item.name}.`,
      url: pageUrl,
      mainEntity: {
        "@type": "ItemList",
        itemListElement: alternatives.map((altItem, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: altItem.name,
          url: `${siteConfig.url}/item/${altItem.slug?.current}`,
        })),
      },
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
        ...(primaryCategory?.name && primaryCategory.slug?.current
          ? [
              {
                "@type": "ListItem",
                position: 2,
                name: primaryCategory.name,
                item: `${siteConfig.url}/search/${primaryCategory.slug.current}`,
              },
            ]
          : []),
        {
          "@type": "ListItem",
          position: primaryCategory ? 3 : 2,
          name: item.name,
          item: itemUrl,
        },
        {
          "@type": "ListItem",
          position: primaryCategory ? 4 : 3,
          name: "Alternatives",
          item: pageUrl,
        },
      ],
    },
  ];

  return (
    <div className="flex flex-col gap-10">
      <JsonLd data={alternativesJsonLd} />

      {/* Header */}
      <div className="flex flex-col items-center justify-center text-center gap-6">
        <div className="flex items-center gap-3">
          {iconProps && (
            <Image
              src={iconProps.src}
              alt={item.icon?.alt || `icon of ${item.name}`}
              width={40}
              height={40}
              className="rounded-lg object-cover"
            />
          )}
          <span className="text-xl font-medium text-muted-foreground">
            {item.name}
          </span>
        </div>

        <HeaderSection
          labelAs="h1"
          label="Alternatives"
          titleAs="h2"
          title={`Best ${count > 0 ? `${count}+ ` : ""}${item.name} Alternatives & Competitors`}
          subtitle={`Looking for alternatives to ${item.name}? Discover the best curated options with similar features, pricing, and capabilities.`}
        />

        <div className="flex gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link
              href={`/item/${params.slug}`}
              className="flex items-center gap-2"
            >
              <ArrowLeftIcon className="size-4" />
              <span>Back to {item.name}</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="mt-4">
        {alternatives.length === 0 ? (
          <EmptyGrid />
        ) : (
          <ItemGrid
            items={alternatives}
            sponsorItems={sponsorItems || []}
            showSponsor={true}
          />
        )}
      </div>
    </div>
  );
}
