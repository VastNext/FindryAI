"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { SearchIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

interface SearchBoxProps {
  urlPrefix: string;
}

export default function SearchBox({ urlPrefix }: SearchBoxProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();

    const params = new URLSearchParams(searchParams.toString());
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
