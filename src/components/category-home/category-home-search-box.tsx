"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, createUrl } from "@/lib/utils";
import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useDebounce } from "use-debounce";

interface CategoryHomeSearchBoxProps {
  urlPrefix: string;
}

export default function CategoryHomeSearchBox({
  urlPrefix,
}: CategoryHomeSearchBoxProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery] = useDebounce(searchQuery, 300);
  const lastExecutedQuery = useRef("");
  const previousQueryRef = useRef("");
  const isUserTypingRef = useRef(false);

  // Read the q param from window.location client-side only: useSearchParams()
  // opts routes rendering this search box into the CSR bailout and breaks
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
      lastExecutedQuery.current = debouncedQuery;
      router.push(createUrl(urlPrefix, newParams), { scroll: false });
    }
  }, [debouncedQuery, router, urlPrefix]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    isUserTypingRef.current = true;
    setSearchQuery(event.target.value);

    setTimeout(() => {
      isUserTypingRef.current = false;
    }, 500);
  };

  return (
    <div className="flex items-center justify-start">
      <Input
        type="text"
        placeholder="Search any products you need"
        autoComplete="off"
        value={searchQuery}
        onChange={handleSearch}
        className={cn(
          "h-12 w-[320px] rounded-r-none sm:w-[480px] md:w-[640px]",
          "focus-visible:border-2 focus-visible:border-r-0 focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0",
        )}
      />
      <Button type="submit" className="size-12 rounded-l-none">
        <SearchIcon className="size-6" aria-hidden="true" />
        <span className="sr-only">Search</span>
      </Button>
    </div>
  );
}
