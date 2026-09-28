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
      <div className="flex flex-col lg:flex-row items-stretch justify-between gap-6 lg:gap-10">
        {/* Left Column: Headline + Value Prop + Search Box + Trending/Categories */}
        <div className="flex-1 flex flex-col justify-between items-start text-left gap-3.5">
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
            <HomeSearchBox urlPrefix="/" hasSponsor={!!sponsorItem} />
          </div>
        </div>

        {/* Right Column: Featured Sponsor Showcase Card / Compact Promo Slot */}
        <div className="flex w-full flex-col justify-between gap-2.5 lg:w-[340px] lg:shrink-0">
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

          {/* Active Sponsor Card or Compact Self-Serve Promo Card */}
          {sponsorItem ? (
            <div className="w-full h-full flex flex-col justify-end">
              <SponsorItemCard item={sponsorItem} />
            </div>
          ) : (
            <Link
              href="/pricing"
              className="group relative flex flex-col justify-between rounded-xl border border-dashed border-primary/30 bg-gradient-to-br from-primary/[0.03] via-card to-primary/[0.05] p-4.5 transition-all duration-300 hover:border-primary hover:bg-primary/[0.07] hover:shadow-sm h-full min-h-[175px]"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                    <RocketIcon className="size-3" />
                    <span>Prime Sponsor Slot</span>
                  </div>
                  <span className="text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-0.5">
                    <span>$99/mo</span>
                    <ArrowUpRightIcon className="size-3" />
                  </span>
                </div>

                <h3 className="font-semibold text-base text-foreground group-hover:text-primary transition-colors leading-snug">
                  Showcase Your Product
                </h3>

                <p className="text-xs text-muted-foreground leading-relaxed">
                  Featured placement across homepage, categories, and site-wide
                  sticky banner.
                </p>
              </div>

              <div className="mt-2 flex items-center justify-between pt-2.5 border-t border-border/50 text-[11px]">
                <span className="text-muted-foreground">
                  Limited monthly slots
                </span>
                <span className="font-semibold text-primary group-hover:underline flex items-center gap-0.5">
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
