"use client";

import type { CategoryListQueryResult } from "@/sanity.types";
import { useRouter, useSearchParams } from "next/navigation";
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
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category") || DEFAULT_FILTER_VALUE;
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
