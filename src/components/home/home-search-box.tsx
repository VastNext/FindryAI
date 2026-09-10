"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { createUrl } from "@/lib/utils";
import { Flame, SearchIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { useEffect, useRef } from "react";
import { useDebounce } from "use-debounce";

interface SearchBoxProps {
  urlPrefix: string;
}

interface TrendingGuideItem {
  label: string;
  href: string;
  badge?: string;
}

const trendingGuides: TrendingGuideItem[] = [
  {
    label: "Face Swap GIF",
    href: "/face-swap-gif",
    badge: "Hot",
  },
  {
    label: "GPT-6 Astra",
    href: "/gpt-6-astra",
  },
  {
    label: "Agent Skills",
    href: "/agent-skills",
  },
];

export default function HomeSearchBox({ urlPrefix }: SearchBoxProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams?.get("q") || "");
  const [debouncedQuery] = useDebounce(searchQuery, 300); // 300ms debounce
  const lastExecutedQuery = useRef(searchParams?.get("q") || "");
  const previousQueryRef = useRef("");
  const isUserTypingRef = useRef(false);

  useEffect(() => {
    const currentQuery = searchParams?.get("q") || "";
    if (currentQuery !== previousQueryRef.current && !isUserTypingRef.current) {
      setSearchQuery(currentQuery);
      previousQueryRef.current = currentQuery;
    }
  }, [searchParams]);

  useEffect(() => {
    if (debouncedQuery !== lastExecutedQuery.current) {
      const newParams = new URLSearchParams(searchParams?.toString());
      if (debouncedQuery) {
        newParams.set("q", debouncedQuery);
      } else {
        newParams.delete("q");
      }
      newParams.delete("page");
      const newUrl = createUrl(`${urlPrefix}`, newParams);
      console.log(`useEffect, newUrl: ${newUrl}`);
      lastExecutedQuery.current = debouncedQuery;
      router.push(newUrl, { scroll: false });
    }
  }, [debouncedQuery, router, searchParams, urlPrefix]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    isUserTypingRef.current = true;
    setSearchQuery(e.target.value);

    // Reset the flag to allow updates after URL changes (but give enough time to complete the current input)
    setTimeout(() => {
      isUserTypingRef.current = false;
    }, 500);
  };

  return (
    <div className="flex w-full flex-col items-center justify-center lg:items-start">
      <div className="flex items-center justify-center">
        <Input
          type="text"
          placeholder="Search any products you need"
          autoComplete="off"
          value={searchQuery}
          onChange={handleSearch}
          className={cn(
            "w-[320px] sm:w-[480px] md:w-[640px] h-12 rounded-r-none",
            "focus-visible:ring-0 focus-visible:ring-offset-0 focus:border-primary focus:border-2 focus:border-r-0",
          )}
        />
        <Button type="submit" className="rounded-l-none size-12">
          <SearchIcon className="size-6" aria-hidden="true" />
          <span className="sr-only">Search</span>
        </Button>
      </div>

      {/* Trending / Featured Guides Hook */}
      <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 text-xs text-muted-foreground lg:justify-start">
        <span className="flex items-center gap-1 font-semibold text-foreground/80">
          <Flame className="size-3.5 text-amber-500" />
          <span>Trending:</span>
        </span>
        {trendingGuides.map((guide) => (
          <Link
            key={guide.href}
            href={guide.href}
            className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-card/60 px-2.5 py-0.5 font-medium text-foreground transition-colors hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
          >
            <span>{guide.label}</span>
            {guide.badge ? (
              <span className="rounded-full bg-amber-500/10 px-1.5 py-0.2 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                {guide.badge}
              </span>
            ) : null}
          </Link>
        ))}
      </div>
    </div>
  );
}
