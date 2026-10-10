"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, createUrl } from "@/lib/utils";
import {
  CompassIcon,
  FlameIcon,
  SearchIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";

interface SearchBoxProps {
  urlPrefix: string;
  hasSponsor?: boolean;
}

interface TrendingGuideItem {
  label: string;
  href: string;
  badge?: "Hot" | "New" | "Featured";
}

interface PopularCategoryItem {
  label: string;
  slug: string;
  icon: string;
}

// 爆款热搜词 / 专题指南
const trendingGuides: TrendingGuideItem[] = [
  {
    label: "Gemini 4 Argon",
    href: "/gemini-4-argon",
    badge: "Hot",
  },
  {
    label: "TypeSafe Jev",
    href: "/typesafe-jev",
    badge: "Hot",
  },
  {
    label: "How to Use Jev",
    href: "/how-to-use-jev",
    badge: "New",
  },
  {
    label: "Agent Skills",
    href: "/agent-skills",
  },
  {
    label: "Face Swap GIF",
    href: "/face-swap-gif",
  },
  {
    label: "GPT-6 Astra",
    href: "/gpt-6-astra",
  },
];

// 高频热门分类快捷直达
const popularCategories: PopularCategoryItem[] = [
  { label: "AI Chat", slug: "ai-chat", icon: "🤖" },
  { label: "Image Gen", slug: "image-generation", icon: "🎨" },
  { label: "Dev Tools", slug: "developer-tools", icon: "💻" },
  { label: "Writing", slug: "writing-tools", icon: "✍️" },
  { label: "Video AI", slug: "video-generation", icon: "🎬" },
  { label: "Office & Productivity", slug: "office-tools", icon: "⚡" },
];

export default function HomeSearchBox({
  urlPrefix,
  hasSponsor = false,
}: SearchBoxProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery] = useDebounce(searchQuery, 300);
  const lastExecutedQuery = useRef("");
  const previousQueryRef = useRef("");
  const isUserTypingRef = useRef(false);

  // Read the q param from window.location client-side only: useSearchParams()
  // in the homepage hero opts the route into the CSR bailout and breaks
  // static prerendering. Re-runs after every render so client navigations
  // stay in sync (guarded by previousQueryRef).
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const currentQuery =
      new URLSearchParams(window.location.search).get("q") || "";
    if (currentQuery !== previousQueryRef.current && !isUserTypingRef.current) {
      setSearchQuery(currentQuery);
      previousQueryRef.current = currentQuery;
    }
  });

  useEffect(() => {
    if (debouncedQuery !== lastExecutedQuery.current) {
      const newParams = new URLSearchParams(window.location.search);
      if (debouncedQuery) {
        newParams.set("q", debouncedQuery);
      } else {
        newParams.delete("q");
      }
      newParams.delete("page");
      const newUrl = createUrl(`${urlPrefix}`, newParams);
      lastExecutedQuery.current = debouncedQuery;
      router.push(newUrl, { scroll: false });
    }
  }, [debouncedQuery, router, urlPrefix]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    isUserTypingRef.current = true;
    setSearchQuery(e.target.value);
    setTimeout(() => {
      isUserTypingRef.current = false;
    }, 500);
  };

  return (
    <div className="flex w-full flex-col gap-4">
      {/* Search Input Bar */}
      <div className="relative flex w-full max-w-2xl items-center">
        <Input
          type="text"
          placeholder="Search 1,000+ AI tools, agent skills, models & workflows..."
          autoComplete="off"
          value={searchQuery}
          onChange={handleSearch}
          className={cn(
            "h-12 w-full rounded-r-none border-r-0 bg-background text-base shadow-xs",
            "focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-primary focus:border-2",
          )}
        />
        <Button
          type="submit"
          className="size-12 rounded-l-none shrink-0 px-4 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <SearchIcon className="size-5" aria-hidden="true" />
          <span className="sr-only">Search</span>
        </Button>
      </div>

      {/* Row 1: Trending & Hot Topics (爆款关键词 / 专题直达) */}
      <div className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        <span className="flex items-center gap-1 font-semibold text-foreground/90 shrink-0">
          <FlameIcon className="size-3.5 text-amber-500 fill-amber-500/20" />
          <span>Trending:</span>
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          {trendingGuides.map((guide) => (
            <Link
              key={guide.href}
              href={guide.href}
              className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-card/60 px-2.5 py-0.5 font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
            >
              <span>{guide.label}</span>
              {guide.badge ? (
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.2 text-[10px] font-bold",
                    guide.badge === "Hot"
                      ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                      : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                  )}
                >
                  {guide.badge}
                </span>
              ) : null}
            </Link>
          ))}
        </div>
      </div>

      {/* Row 2: Popular Category Quick Pills (热门分类快速直达)
          TEMP hidden via display:none to reduce hero density — the navbar
          Category menu covers the same destinations. Restore visibility by
          removing the `hidden` class; data stays in popularCategories. */}
      <div className="hidden flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        <span className="flex items-center gap-1 font-semibold text-foreground/90 shrink-0">
          <CompassIcon className="size-3.5 text-indigo-500" />
          <span>Explore:</span>
        </span>
        <div className="flex flex-wrap items-center gap-1.5">
          {popularCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/40 px-2.5 py-0.5 text-xs font-medium text-foreground/80 transition-all hover:bg-muted hover:text-foreground hover:border-primary/30"
            >
              <span className="text-xs">{cat.icon}</span>
              <span>{cat.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Row 3: Trust & Ecosystem Micro-bar (只有当有 Sponsor 时才显示，无 Sponsor 时隐藏以保证呼吸感) */}
      <div
        className={cn(
          "flex items-center gap-4 pt-1 text-xs text-muted-foreground",
          !hasSponsor && "hidden",
        )}
      >
        <div className="flex items-center gap-1.5">
          <ShieldCheckIcon className="size-3.5 text-emerald-500" />
          <span>1,000+ Curated Tools</span>
        </div>
        <span className="text-border">•</span>
        <div className="flex items-center gap-1.5">
          <SparklesIcon className="size-3.5 text-indigo-500" />
          <span>Editorial Tested</span>
        </div>
        <span className="text-border">•</span>
        <span>Updated Daily</span>
      </div>
    </div>
  );
}
