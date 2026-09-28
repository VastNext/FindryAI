import { Icons } from "@/components/icons/icons";
import { heroConfig } from "@/config/hero";
import type { SponsorItemListQueryResult } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { sponsorItemListQuery } from "@/sanity/lib/queries";
import { SparklesIcon } from "lucide-react";
import SponsorItemCard from "../item/item-card-sponsor";
import HomeQuickTools from "./home-quick-tools";
import HomeSearchBox from "./home-search-box";

export default async function HomeHeroSponsor() {
  const LabelIcon = Icons[heroConfig.label.icon];

  const sponsorItems =
    (await sanityFetch<SponsorItemListQueryResult>({
      query: sponsorItemListQuery,
    })) || [];
  const sponsorItem = sponsorItems?.length
    ? sponsorItems[Math.floor(Math.random() * sponsorItems.length)]
    : null;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="w-full flex flex-col lg:flex-row items-stretch lg:items-start justify-between gap-8 lg:gap-12">
        {/* Left Column: Headline + Value Prop + Search Box + Quick Tags */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left justify-center gap-5">
          {/* Top Pill: Value badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
            <SparklesIcon className="size-3.5" />
            <span>Curated AI Directory & Daily Picks</span>
          </div>

          {/* Headline */}
          <h1 className="font-bold text-balance text-3xl sm:text-4xl md:text-5xl tracking-tight leading-tight">
            {heroConfig.title.first}{" "}
            <span className="text-gradient_indigo-purple font-extrabold">
              {heroConfig.title.second}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl text-balance text-muted-foreground text-base sm:text-lg leading-relaxed">
            {heroConfig.subtitle}
          </p>

          {/* Search Box + Trending Guides */}
          <div className="w-full mt-1">
            <HomeSearchBox urlPrefix="/" />
          </div>
        </div>

        {/* Right Column: Quick Tools Header + Sponsor Card */}
        <div className="flex w-full flex-col gap-3 lg:w-[380px] lg:shrink-0">
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

          {/* Sponsor Card (Full size & clean) */}
          {sponsorItem && (
            <div className="w-full">
              <SponsorItemCard item={sponsorItem} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
