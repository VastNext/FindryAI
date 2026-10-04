"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { SearchIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface SearchBoxProps {
  urlPrefix: string;
}

export default function SearchBox({ urlPrefix }: SearchBoxProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");

  // Read the q param from window.location client-side only: useSearchParams()
  // opts routes rendering this search box into the CSR bailout and breaks
  // static prerendering. Re-runs after every render so client navigations
  // stay in sync.
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const currentQuery =
      new URLSearchParams(window.location.search).get("q") || "";
    setSearchTerm((prev) => {
      const incoming = currentQuery.trim();
      return incoming && incoming !== prev ? incoming : prev;
    });
  });

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();

    const params = new URLSearchParams(window.location.search);
    const query = searchTerm.trim();

    if (query) {
      params.set("q", query);
    } else {
      params.delete("q");
    }
    params.delete("page");

    const queryString = params.toString();
    router.push(queryString ? `${urlPrefix}?${queryString}` : urlPrefix);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="mx-auto flex w-full max-w-[640px] items-center justify-center"
    >
      <Input
        type="search"
        aria-label="Search"
        placeholder="Search any products you need"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        className={cn(
          "h-12 min-w-0 flex-1 rounded-r-none",
          "focus-visible:border-2 focus-visible:border-r-0 focus-visible:border-primary focus-visible:ring-0 focus-visible:ring-offset-0",
        )}
      />
      <Button type="submit" className="size-12 shrink-0 rounded-l-none">
        <SearchIcon className="size-6" aria-hidden="true" />
        <span className="sr-only">Search</span>
      </Button>
    </form>
  );
}
