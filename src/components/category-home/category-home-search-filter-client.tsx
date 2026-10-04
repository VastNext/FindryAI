"use client";

import { Button } from "@/components/ui/button";
import {
  DEFAULT_QUERY,
  DEFAULT_SORT,
  type QueryFilterItem,
  type SortFilterItem,
} from "@/lib/constants";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DEFAULT_FILTER_VALUE, ResponsiveComboBox } from "../shared/combobox";
import { MultiSelect } from "../shared/multi-select";

export interface TagFilterItem {
  slug: string;
  name: string;
}

export interface CategoryFilterItem {
  slug: string;
  name: string;
}

interface CategoryHomeSearchFilterClientProps {
  tagList: TagFilterItem[];
  categoryList: CategoryFilterItem[];
  sortList: SortFilterItem[];
  filterList: QueryFilterItem[];
  urlPrefix: string;
}

export function CategoryHomeSearchFilterClient({
  tagList,
  categoryList,
  sortList,
  filterList,
  urlPrefix,
}: CategoryHomeSearchFilterClientProps) {
  const router = useRouter();
  const [selected, setSelected] = useState({
    category: "",
    tag: "",
    sort: "",
    filter: "",
  });
  const selectedCategory = selected.category;
  const selectedTag = selected.tag;
  const selectedSort = selected.sort;
  const selectedFilter = selected.filter;

  // Read selected filters from the URL client-side only: useSearchParams()
  // opts routes rendering this filter bar into the CSR bailout and breaks
  // static prerendering. Re-runs after every render so client navigations
  // stay in sync (setState with equal values is a no-op).
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSelected({
      category: params.get("category") || "",
      tag: params.get("tag") || "",
      sort: params.get("sort") || "",
      filter: params.get("f") || "",
    });
  });

  const handleFilterChange = (type: string, value: string | null) => {
    const newParams = new URLSearchParams(window.location.search);
    if (value === null || value === DEFAULT_FILTER_VALUE) {
      newParams.delete(type);
    } else {
      newParams.set(type, value);
    }
    newParams.delete("page");
    setSelected((prev) => ({
      ...prev,
      [type]: value === null || value === DEFAULT_FILTER_VALUE ? "" : value,
    }));
    router.push(`${urlPrefix}?${newParams.toString()}`);
  };

  const categoryFilterItemList = [
    { value: DEFAULT_FILTER_VALUE, label: "All Categories" },
    ...categoryList.map((item) => ({
      value: item.slug,
      label: item.name,
    })),
  ];
  const tagFilterItemList = tagList.map((item) => ({
    value: item.slug,
    label: item.name,
  }));
  const sortFilterItemList = sortList.map((item) => ({
    value: item.slug ?? DEFAULT_FILTER_VALUE,
    label: item.label,
  }));
  const queryFilterItemList = filterList.map((item) => ({
    value: item.slug ?? DEFAULT_FILTER_VALUE,
    label: item.label,
  }));

  return (
    <div className="grid items-center gap-4 md:grid-cols-[1fr_1fr_1fr_0.5fr]">
      <div className="flex md:hidden">
        <ResponsiveComboBox
          filterItemList={categoryFilterItemList}
          placeholder="All Categories"
          labelPrefix="Category: "
          selectedValue={selectedCategory || DEFAULT_FILTER_VALUE}
          onValueChange={(value) => handleFilterChange("category", value)}
        />
      </div>

      <MultiSelect
        className="shadow-none"
        options={tagFilterItemList}
        onValueChange={(selected) =>
          handleFilterChange(
            "tag",
            selected.length > 0 ? selected.join(",") : null,
          )
        }
        value={selectedTag ? selectedTag.split(",") : []}
        placeholder="Select tags"
        variant="default"
        maxCount={1}
      />

      <ResponsiveComboBox
        filterItemList={queryFilterItemList}
        placeholder={DEFAULT_QUERY.label}
        selectedValue={selectedFilter || DEFAULT_FILTER_VALUE}
        onValueChange={(value) => handleFilterChange("f", value)}
      />

      <ResponsiveComboBox
        filterItemList={sortFilterItemList}
        placeholder={DEFAULT_SORT.label}
        selectedValue={selectedSort || DEFAULT_FILTER_VALUE}
        onValueChange={(value) => handleFilterChange("sort", value)}
      />

      <Button variant="outline" onClick={() => router.push(urlPrefix)}>
        Reset
      </Button>
    </div>
  );
}
