"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DEFAULT_SORT, type SortFilterItem } from "@/lib/constants";
import { createUrl } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export type SortListProps = {
  sortList: SortFilterItem[];
};

export function SortListDesktop({ sortList }: SortListProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [active, setActive] = useState("");

  // Read sort/q from window.location client-side only: useSearchParams() in
  // the category/tag/blog layouts opts those routes into the CSR bailout and
  // breaks static prerendering. Re-runs after every render so client
  // navigations stay in sync (setState with equal values is a no-op).
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const activeItem = sortList.find(
      (item) => params.get("sort") === item.slug,
    );
    if (activeItem) {
      setActive(activeItem.slug);
    }
  });

  const generateUrl = (slug: string) => {
    const q = new URLSearchParams(window.location.search).get("q");
    return createUrl(
      pathname,
      new URLSearchParams({
        ...(q && { q }),
        ...(slug && { sort: slug }),
      }),
    );
  };

  const onSelectChange = (value: string) => {
    setActive(value);
    const href = generateUrl(value);
    router.push(href);
  };

  return (
    <Select onValueChange={onSelectChange} value={active}>
      <SelectTrigger className="w-[220px] h-8 text-sm">
        <SelectValue placeholder={DEFAULT_SORT.label} />
      </SelectTrigger>
      <SelectContent className="text-sm">
        {sortList.map((item) => (
          <SelectItem
            key={item.slug}
            value={item.slug}
            className="cursor-pointer"
          >
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
