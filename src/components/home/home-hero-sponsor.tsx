import { heroConfig } from "@/config/hero";
import type { SponsorItemListQueryResult } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { sponsorItemListQuery } from "@/sanity/lib/queries";
import { ArrowUpRightIcon, RocketIcon, SparklesIcon } from "lucide-react";
import Link from "next/link";
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
        {/* Left Column: Headline + Value Prop + Search Box + Trending/Categories */}
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

          {/* Search Box + Trending Guides + Popular Categories */}
          <div className="w-full pt-1">
            {/* /search owns the q param: the homepage is statically
                prerendered and no longer reads query params */}
            <HomeSearchBox urlPrefix="/search" hasSponsor={!!sponsorItem} />
          </div>
        </div>

        {/* Right Column: Featured Sponsor Showcase Card / Promo Slot */}
        <div className="flex w-full flex-col justify-between gap-3 lg:w-[380px] lg:shrink-0">
          {/* Header Row: Featured Sponsor Label & Quick Access Tools inline */}
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold text-muted-foreground tracking-wider uppercase flex items-center gap-1.5">
              <span className="inline-block size-2 rounded-full bg-amber-500 animate-pulse" />
              {sponsorItem ? "Featured Sponsor" : "Partner Spotlight"}
            </span>
            <div className="flex items-center gap-2">
              <HomeQuickTools />
            </div>
          </div>

          {/* Active Sponsor Card or Sleek Self-Serve Promo Card */}
          {sponsorItem ? (
            <div className="w-full h-full flex flex-col justify-end">
              <SponsorItemCard item={sponsorItem} />
            </div>
          ) : (
            <Link
              href="/pricing"
              className="group relative flex flex-col justify-between rounded-xl border border-dashed border-primary/30 bg-gradient-to-br from-primary/[0.03] via-card to-primary/[0.06] p-6 transition-all duration-300 hover:border-primary hover:bg-primary/[0.08] hover:shadow-md h-full min-h-[220px]"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                    <RocketIcon className="size-3.5" />
                    <span>Prime Sponsor Slot</span>
                  </div>
                  <span className="text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-0.5">
                    <span>$99/mo</span>
                    <ArrowUpRightIcon className="size-3.5" />
                  </span>
                </div>

                <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors leading-snug">
                  Showcase Your Product on Findry AI
                </h3>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  Get high-visibility placement across our homepage, categories,
                  and site-wide sticky banner.
                </p>
              </div>

              <div className="mt-4 flex items-center justify-between pt-3 border-t border-border/60 text-xs">
                <span className="font-medium text-muted-foreground">
                  Limited monthly slots
                </span>
                <span className="font-semibold text-primary group-hover:underline flex items-center gap-1">
                  Claim Spot ↗
                </span>
              </div>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
