import ItemBreadCrumb from "@/components/item/item-bread-crumb";
import SponsorItemCard from "@/components/item/item-card-sponsor";
import ItemCustomMdx from "@/components/item/item-custom-mdx";
import ItemGrid from "@/components/item/item-grid";
import BackButton from "@/components/shared/back-button";
import { JsonLd } from "@/components/shared/json-ld";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { urlForIcon, urlForImage } from "@/lib/image";
import { constructMetadata } from "@/lib/metadata";
import { cn, getItemTargetLinkInWebsite, getLocaleDate } from "@/lib/utils";
import type {
  ItemInfoBySlugQueryResult,
  SponsorItemListQueryResult,
} from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  itemFullInfoBySlugQuery,
  itemInfoBySlugQuery,
  sponsorItemListQuery,
} from "@/sanity/lib/queries";
import type { ItemFullInfo } from "@/types";
import {
  GlobeIcon,
  HashIcon,
  LayoutGridIcon,
  SparklesIcon,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 172800; // 48 hours ISR cache

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata | undefined> {
  const item = await sanityFetch<ItemInfoBySlugQueryResult>({
    query: itemInfoBySlugQuery,
    params: { slug: params.slug },
  });
  if (!item?.name) {
    console.warn(`generateMetadata, item not found for slug: ${params.slug}`);
    return;
  }

  const imageProps = item?.image ? urlForImage(item?.image) : null;
  return constructMetadata({
    title: `${item.name}`,
    description: item.description,
    canonicalUrl: `${siteConfig.url}/item/${params.slug}`,
    image: imageProps?.src,
  });
}

interface ItemPageProps {
  params: { slug: string };
}

export default async function ItemPage({ params }: ItemPageProps) {
  // if you do not support sponsor item, you can use this code
  // const item = await sanityFetch<ItemFullInfo>({
  //   query: itemFullInfoBySlugQuery,
  //   params: { slug: params.slug },
  // });

  // if you support sponsor item, you can use this code
  const [item, sponsorItems] = await Promise.all([
    sanityFetch<ItemFullInfo>({
      query: itemFullInfoBySlugQuery,
      params: { slug: params.slug },
    }),
    sanityFetch<SponsorItemListQueryResult>({
      query: sponsorItemListQuery,
    }),
  ]);

  if (!item) {
    console.error("ItemPage, item not found");
    return notFound();
  }

  const imageProps = item?.image ? urlForImage(item?.image) : null;
  const imageBlurDataURL = item?.image?.blurDataURL || null;
  const iconProps = item?.icon ? urlForIcon(item.icon) : null;
  const iconBlurDataURL = item?.icon?.blurDataURL || null;
  const publishDate = item.publishDate || item._createdAt;
  const date = getLocaleDate(publishDate);
  const itemLink = getItemTargetLinkInWebsite(item);
  const sponsorItem = sponsorItems?.length
    ? sponsorItems[Math.floor(Math.random() * sponsorItems.length)]
    : null;
  const itemUrl = `${siteConfig.url}/item/${params.slug}`;
  const primaryCategory = item.categories?.[0];
  const validatedPrimaryCategory =
    primaryCategory?.name && primaryCategory.slug?.current
      ? { name: primaryCategory.name, slug: primaryCategory.slug.current }
      : null;
  const isSponsor = item.sponsor || item.pricePlan === "sponsor";
  const isFreePlan =
    item.pricePlan === "free" && item.freePlanStatus !== "approved";
  const externalRel = isSponsor
    ? "sponsored noopener noreferrer"
    : isFreePlan
      ? "nofollow noopener noreferrer"
      : "noopener noreferrer";

  const breadcrumbItems = [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: siteConfig.url,
    },
    ...(validatedPrimaryCategory
      ? [
          {
            "@type": "ListItem",
            position: 2,
            name: validatedPrimaryCategory.name,
            item: `${siteConfig.url}/category/${validatedPrimaryCategory.slug}`,
          },
        ]
      : []),
    {
      "@type": "ListItem",
      position: validatedPrimaryCategory ? 3 : 2,
      name: item.name,
      item: itemUrl,
    },
  ];
  const itemJsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: item.name,
      ...(item.description && { description: item.description }),
      url: itemUrl,
      applicationSuite: siteConfig.name,
      applicationCategory: primaryCategory?.name || "AIApplication",
      operatingSystem: "Web",
      datePublished: publishDate,
      ...(item.link && { sameAs: item.link }),
      ...(imageProps?.src && { image: imageProps.src }),
      ...(item.pricePlan && {
        offers: {
          "@type": "Offer",
          price: item.pricePlan === "free" ? "0" : undefined,
          priceCurrency: "USD",
          category: item.pricePlan,
        },
      }),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: breadcrumbItems,
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <JsonLd data={itemJsonLd} />
      {/* Header section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left column */}
        <div className="lg:col-span-3 gap-8 flex flex-col">
          {/* Basic information */}
          <ItemBreadCrumb item={item} />

          {/* icon + name + description */}
          <div className="flex flex-1 items-center">
            <div className="flex flex-col gap-8">
              <div className="flex w-full items-center gap-4">
                {iconProps && (
                  <Image
                    src={iconProps?.src}
                    alt={item.icon.alt || `icon of ${item.name}`}
                    title={item.icon.alt || `icon of ${item.name}`}
                    width={32}
                    height={32}
                    className="object-cover image-scale"
                    {...(iconBlurDataURL && {
                      placeholder: "blur",
                      blurDataURL: iconBlurDataURL,
                    })}
                  />
                )}
                <h1
                  className={cn(
                    "text-4xl tracking-wider font-bold flex items-center gap-2",
                    item.featured &&
                      "text-gradient_indigo-purple font-semibold",
                  )}
                >
                  {item.name}
                </h1>
              </div>
              <p className="text-muted-foreground text-balance leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>

          {/* action buttons */}
          <div className="flex flex-wrap gap-4">
            <Button size="lg" variant="default" asChild className="group">
              <Link
                href={itemLink}
                target="_blank"
                rel={externalRel}
                prefetch={false}
                className="flex items-center justify-center space-x-2"
              >
                <GlobeIcon className="w-4 h-4 icon-scale" />
                <span>Visit Website</span>
              </Link>
            </Button>

            <Button size="lg" variant="outline" asChild>
              <Link
                href={`/item/${params.slug}/alternatives`}
                className="flex items-center justify-center space-x-2"
              >
                <SparklesIcon className="w-4 h-4 text-indigo-500" />
                <span>Alternatives</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-2">
          {/* image */}
          <div className="relative group overflow-hidden rounded-lg aspect-[16/9]">
            <Link
              href={`${itemLink}`}
              target="_blank"
              rel={externalRel}
              prefetch={false}
              className="relative block w-full h-full"
            >
              {imageProps && (
                <Image
                  src={imageProps.src}
                  alt={item.image?.alt || `image for ${item.name}`}
                  title={item.image?.alt || `image for ${item.name}`}
                  loading="eager"
                  fill
                  className="border w-full shadow-lg object-cover image-scale"
                  {...(imageBlurDataURL && {
                    placeholder: "blur",
                    blurDataURL: imageBlurDataURL,
                  })}
                />
              )}
              <div
                className="absolute inset-0 flex items-center justify-center bg-black 
                  bg-opacity-0 group-hover:bg-opacity-50 transition-opacity duration-300"
              >
                <span
                  className="text-white text-lg font-semibold 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  Visit Website
                </span>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Content section */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left column */}
        <div className="lg:col-span-3 flex flex-col">
          {/* Detailed content */}
          <div className="bg-muted/50 rounded-lg p-6 mr-0 lg:mr-8">
            <h2 className="text-lg font-semibold mb-4">Introduction</h2>
            <ItemCustomMdx source={item.introduction} />
          </div>

          <div className="flex items-center justify-start mt-16">
            <BackButton />
          </div>
        </div>

        {/* Right column */}
        <div className="lg:col-span-2">
          <div className="flex flex-col space-y-8">
            <div className="flex flex-col space-y-4">
              {/* information */}
              <div className="bg-muted/50 rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Information</h2>
                <ul className="space-y-4 text-sm">
                  {item.submitter && (
                    <li className="flex justify-between">
                      <span className="text-muted-foreground">Publisher</span>
                      <div className="flex items-center gap-2">
                        <UserAvatar
                          className="w-5 h-5"
                          name={item.submitter.name}
                          image={item.submitter.image}
                        />

                        {(item.submitter.link && (
                          <Link
                            href={item.submitter.link}
                            target="_blank"
                            prefetch={false}
                            rel="nofollow noopener noreferrer"
                            className="font-medium link-underline"
                          >
                            {item.submitter.name}
                          </Link>
                        )) || <span>{item.submitter.name}</span>}
                      </div>
                    </li>
                  )}

                  <li className="flex justify-between space-x-4">
                    <span className="text-muted-foreground">Website</span>
                    <Link
                      href={itemLink}
                      target="_blank"
                      prefetch={false}
                      className="font-medium link-underline line-clamp-1"
                    >
                      {new URL(item.link).hostname}
                    </Link>
                  </li>

                  <li className="flex justify-between">
                    <span className="text-muted-foreground">
                      Published date
                    </span>
                    <span className="font-medium">{date}</span>
                  </li>
                </ul>
              </div>

              {/* categories */}
              <div className="bg-muted/50 rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Categories</h2>
                <ul className="flex flex-wrap gap-4">
                  {item.categories?.map((category) => (
                    <li key={category._id}>
                      <Link
                        href={`/category/${category.slug.current}`}
                        className="text-sm link-underline"
                      >
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* tags */}
              <div className="bg-muted/50 rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Tags</h2>
                <ul className="flex flex-wrap gap-4">
                  {item.tags?.map((tag) => (
                    <li key={tag._id}>
                      <Link
                        href={`/tag/${tag.slug.current}`}
                        className="text-sm link-underline
                          flex items-center justify-center space-x-0.5 group"
                      >
                        <HashIcon className="w-3 h-3 text-muted-foreground icon-scale" />
                        <span className="">{tag.name}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* sponsor */}
              {sponsorItem && <SponsorItemCard item={sponsorItem} />}
            </div>
          </div>
        </div>
      </div>

      {/* Footer section shows related items */}
      {item.related && item.related.length > 0 && (
        <div className="flex flex-col gap-4 mt-8">
          <div className="flex items-center gap-2">
            <LayoutGridIcon className="w-4 h-4 text-indigo-500" />
            <h2 className="text-lg tracking-wider font-semibold text-gradient_indigo-purple">
              More Products
            </h2>
          </div>

          <div className="mt-4">
            <ItemGrid
              items={item.related}
              sponsorItems={sponsorItems}
              showSponsor={false}
            />
          </div>
        </div>
      )}
    </div>
  );
}
