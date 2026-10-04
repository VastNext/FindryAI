"use client";

import type { CategoryListQueryResult } from "@/sanity.types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DEFAULT_FILTER_VALUE } from "../shared/combobox";
import CategoryHomeCategoryListItem from "./category-home-category-list-item";

interface CategoryHomeCategoryListClientProps {
  categoryList: CategoryListQueryResult;
  urlPrefix: string;
}

export function CategoryHomeCategoryListClient({
  categoryList,
  urlPrefix,
}: CategoryHomeCategoryListClientProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] =
    useState(DEFAULT_FILTER_VALUE);

  // Read the selected category from window.location client-side only:
  // useSearchParams() opts routes rendering this list into the CSR bailout
  // and breaks static prerendering. Re-runs after every render so client
  // navigations stay in sync (setState with equal values is a no-op).
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const value =
      new URLSearchParams(window.location.search).get("category") ||
      DEFAULT_FILTER_VALUE;
    setSelectedCategory(value);
  });
  const categoryFilterItemList = [
    { value: DEFAULT_FILTER_VALUE, label: "All Categories" },
    ...categoryList.map((item) => ({
      value: item.slug.current,
      label: item.name,
    })),
  ];

  const handleFilterChange = (value: string) => {
    const newParams = new URLSearchParams(window.location.search);
    if (value === DEFAULT_FILTER_VALUE) {
      newParams.delete("category");
    } else {
      newParams.set("category", value);
    }
    newParams.delete("page");
    router.push(`${urlPrefix}?${newParams.toString()}`);
  };

  return (
    <div className="hidden rounded-lg border p-4 md:flex">
      <ul className="flex w-full flex-col gap-y-2">
        {categoryFilterItemList.map((item) => (
          <CategoryHomeCategoryListItem
            key={item.label}
            title={item.label}
            active={item.value === selectedCategory}
            clickAction={() => handleFilterChange(item.value)}
          />
        ))}
      </ul>
    </div>
  );
}
