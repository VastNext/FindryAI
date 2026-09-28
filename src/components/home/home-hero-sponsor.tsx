import { heroConfig } from "@/config/hero";
import type { SponsorItemListQueryResult } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { sponsorItemListQuery } from "@/sanity/lib/queries";
import { SparklesIcon } from "lucide-react";
import SponsorItemCard from "../item/item-card-sponsor";
import HomeQuickTools from "./home-quick-tools";
import HomeSearchBox from "./home-search-box";

export default async function HomeHeroSponsor() {
  const sponsorItems =
    (await sanityFetch<SponsorItemListQueryResult>({
      query: sponsorItemListQuery,
    })) || [];
  const sponsorItem = sponsorItems?.length
    ? sponsorItems[Math.floor(Math.random() * sponsorItems.length)]
    : null;

  return (
    <section className="w-full">
      <div className="flex flex-col lg:flex-row items-stretch justify-between gap-8 lg:gap-10">
        {/* Left Column: Headline + Value Prop + Search Box + Trending/Categories + Trust Metrics */}
        <div className="flex-1 flex flex-col justify-between items-start text-left gap-4">
          {/* Top Pill: Value badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
            <SparklesIcon className="size-3.5" />
            <span>Discover Curated AI Tools & Agent Skills</span>
          </div>

          {/* Headline */}
          <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight leading-tight text-foreground">
            {heroConfig.title.first}{" "}
            <span className="text-gradient_indigo-purple font-extrabold">
              {heroConfig.title.second}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl text-muted-foreground text-sm sm:text-base leading-relaxed">
            {heroConfig.subtitle}. Compare features, discover trending
            workflows, and supercharge your productivity.
          </p>

          {/* Search Box + Trending Guides + Popular Categories + Stats */}
          <div className="w-full pt-1">
            <HomeSearchBox urlPrefix="/" />
          </div>
        </div>

        {/* Right Column: Featured Sponsor Showcase Card */}
        <div className="flex w-full flex-col justify-between gap-3 lg:w-[380px] lg:shrink-0">
          {/* Header Row: Featured Sponsor Label & Quick Access Tools inline */}
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold text-muted-foreground tracking-wider uppercase flex items-center gap-1.5">
              <span className="inline-block size-2 rounded-full bg-amber-500 animate-pulse" />
              Featured Sponsor
            </span>
            <div className="flex items-center gap-2">
              <HomeQuickTools />
            </div>
          </div>

          {/* Sponsor Card (Full 16:9 Cover & Balanced Height) */}
          {sponsorItem ? (
            <div className="w-full h-full flex flex-col justify-end">
              <SponsorItemCard item={sponsorItem} />
            </div>
          ) : (
            <div className="w-full h-full rounded-lg border border-dashed border-border/80 flex items-center justify-center p-8 text-center text-muted-foreground text-sm">
              <span>Sponsor Slot Available</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
