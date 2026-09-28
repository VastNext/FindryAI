"use client";

import { urlForIcon, urlForImage } from "@/lib/image";
import { cn, getItemTargetLinkInWebsite } from "@/lib/utils";
import type { ItemInfo } from "@/types";
import { ArrowUpRightIcon, SparklesIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type SponsorItemCardProps = {
  item: ItemInfo;
};

/**
 * SponsorItemCard shows 16:9 cover image, SPONSORED badge, icon, title, description, and direct CTA link.
 * Aligns perfectly with standard ItemCard in the 3-column grid.
 */
export default function SponsorItemCard({ item }: SponsorItemCardProps) {
  const imageProps = item?.image ? urlForImage(item.image) : null;
  const imageBlurDataURL = item?.image?.blurDataURL || null;
  const iconProps = item?.icon ? urlForIcon(item.icon) : null;
  const itemLink = getItemTargetLinkInWebsite(item);

  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between gap-2 rounded-lg border pb-[18px]",
        "border-amber-400/60 dark:border-amber-500/40 bg-gradient-to-b from-amber-500/[0.04] to-background",
        "shadow-sm hover:shadow-md transition-all duration-300 hover:border-amber-500 dark:hover:border-amber-400",
      )}
    >
      {/* Top section */}
      <div className="flex flex-col gap-4">
        {/* 16:9 Cover Image Container */}
        <Link
          href={itemLink}
          target="_blank"
          rel="sponsored noopener noreferrer"
          prefetch={false}
          className="relative block"
        >
          <div className="relative aspect-[16/9] overflow-hidden rounded-t-md border-b transition-all">
            {imageProps && (
              <Image
                src={imageProps.src}
                alt={item.image?.alt || `image of ${item.name}`}
                title={item.image?.alt || `image of ${item.name}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover image-scale"
                {...(imageBlurDataURL && {
                  placeholder: "blur",
                  blurDataURL: imageBlurDataURL,
                })}
              />
            )}

            {/* Sponsored Floating Badge on Image */}
            <div className="absolute top-2.5 right-2.5 z-10 flex items-center gap-1 bg-amber-500/90 text-white dark:bg-amber-500 dark:text-black font-semibold text-[11px] tracking-wider px-2 py-0.5 rounded-full shadow-md backdrop-blur-xs">
              <SparklesIcon className="size-3" />
              <span>SPONSORED</span>
            </div>
          </div>
        </Link>

        {/* Icon + Title + Description */}
        <Link
          href={itemLink}
          target="_blank"
          rel="sponsored noopener noreferrer"
          prefetch={false}
          className="group flex flex-col gap-4"
        >
          <div className="flex flex-col gap-4 px-4">
            <div className="flex items-center justify-between gap-2">
              {iconProps && (
                <Image
                  src={iconProps.src}
                  alt={item.icon?.alt || `icon of ${item.name}`}
                  width={20}
                  height={20}
                  className="size-5 shrink-0 object-contain rounded"
                />
              )}
              <h3 className="min-w-0 flex-1 truncate text-ellipsis font-semibold text-xl">
                <span className="truncate group-hover:text-primary inline-flex items-center gap-1.5 text-gradient_indigo-purple">
                  <span className="truncate">{item.name}</span>
                  <ArrowUpRightIcon className="size-4 shrink-0 text-amber-500 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </h3>
            </div>

            <p className="line-clamp-2 min-h-[3rem] text-sm leading-relaxed text-muted-foreground">
              {item.description}
            </p>
          </div>
        </Link>
      </div>

      {/* Bottom section: Category tags + Sponsor direct pill */}
      <div className="flex h-6 items-center justify-between gap-[6px] overflow-hidden px-4">
        <div className="flex flex-wrap gap-[6px] overflow-hidden">
          {item.categories?.slice(0, 2).map((category) => (
            <Link
              key={category._id}
              title={category.name}
              href={`/category/${category.slug.current}`}
              className="flex min-w-0 items-center truncate rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 px-1.5 text-xs leading-6 hover:bg-amber-500/20"
            >
              <span className="truncate">{category.name}</span>
            </Link>
          ))}
        </div>

        <Link
          href={itemLink}
          target="_blank"
          rel="sponsored noopener noreferrer"
          className="text-xs font-medium text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-0.5 shrink-0"
        >
          <span>Visit Site</span>
          <ArrowUpRightIcon className="size-3" />
        </Link>
      </div>
    </div>
  );
}
