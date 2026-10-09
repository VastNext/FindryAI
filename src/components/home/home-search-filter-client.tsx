"use client";

import { Button } from "@/components/ui/button";
import {
  DEFAULT_QUERY,
  DEFAULT_SORT,
  type QueryFilterItem,
  type SortFilterItem,
} from "@/lib/constants";
import { createUrl } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DEFAULT_FILTER_VALUE, ResponsiveComboBox } from "../shared/combobox";
import { MultiSelect } from "../shared/multi-select";

interface SearchFilterProps {
  tagList: TagFilterItem[];
  categoryList: CategoryFilterItem[];
  sortList: SortFilterItem[];
  selectedTag?: string;
  selectedCategory?: string;
  selectedSort?: string;
}

interface TagFilterItem {
  slug: string;
  name: string;
}

interface CategoryFilterItem {
  slug: string;
  name: string;
}

interface SearchFilterProps {
  tagList: TagFilterItem[];
  categoryList: CategoryFilterItem[];
  sortList: SortFilterItem[];
}

interface SearchFilterProps {
  tagList: TagFilterItem[];
  categoryList: CategoryFilterItem[];
  sortList: SortFilterItem[];
  filterList: QueryFilterItem[];
  urlPrefix: string;
}

export function HomeSearchFilterClient({
  tagList,
  categoryList,
  sortList,
  filterList,
  urlPrefix,
}: SearchFilterProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [selected, setSelected] = useState({
    category: "",
    tag: "",
    sort: "",
    filter: "",
  });

  // Read selected filters from the URL client-side only: useSearchParams()
  // here opts the homepage into the CSR bailout and breaks static
  // prerendering. Re-run only when the path actually changes — a dependency-
  // free effect would setState a fresh object after every render and, once a
  // navigation starts, interleave with Radix popper measurements into a
  // "Maximum update depth exceeded" loop that silently kills the navigation.
  // biome-ignore lint/correctness/useExhaustiveDependencies: pathname is the trigger, the URL is read from window
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setSelected({
      category: params.get("category") || "",
      tag: params.get("tag") || "",
      sort: params.get("sort") || "",
      filter: params.get("f") || "",
    });
  }, [pathname]);

  const handleFilterChange = (type: string, value: string) => {
    setSelected((prev) => ({
      ...prev,
      [type]: value === DEFAULT_FILTER_VALUE ? "" : value,
    }));

    if (urlPrefix === "/") {
      // The homepage is statically prerendered and no longer reads query
      // params, so route each filter to its dedicated listing route instead
      // of pushing ?category=/?sort= style params onto /.
      if (type === "category" && value !== DEFAULT_FILTER_VALUE) {
        router.push(`/category/${value}`);
        return;
      }
      if (type === "tag" && value) {
        router.push(`/tag/${value.split(",")[0]}`);
        return;
      }
      // sort / f (and cleared filters) land on /search, which renders the
      // full item list with server-side filtering.
      const newParams = new URLSearchParams(window.location.search);
      if (value === null || value === DEFAULT_FILTER_VALUE) {
        newParams.delete(type);
      } else {
        newParams.set(type, value);
      }
      newParams.delete("page");
      router.push(createUrl("/search", newParams));
      return;
    }

    const newParams = new URLSearchParams(window.location.search);
    if (value === null || value === DEFAULT_FILTER_VALUE) {
      newParams.delete(type);
    } else {
      newParams.set(type, value);
    }
    newParams.delete("page");
    router.push(`${urlPrefix}?${newParams.toString()}`);
  };

  const handleResetFilters = () => {
    router.push(urlPrefix);
  };

  const categoryFilterItemList = [
    { value: DEFAULT_FILTER_VALUE, label: "All Categories" },
    ...categoryList.map((item) => ({
      value: item.slug,
      label: item.name,
    })),
  ];
  // Single Select for tag
  // const tagFilterItemList = [
  //   { value: DEFAULT_FILTER_VALUE, label: "All Tags" },
  //   ...tagList.map((item) => ({
  //     value: item.slug,
  //     label: item.name,
  //   })),
  // ];
  // MultiSelect for tags
  const tagFilterItemList = [
    ...tagList.map((item) => ({
      value: item.slug,
      label: item.name,
    })),
  ];
  // change default sort value to default filter value
  const sortFilterItemList = sortList.map((item) => ({
    value: item.slug ?? DEFAULT_FILTER_VALUE,
    label: item.label,
  }));
  // change default filter value to default filter value
  const queryFilterItemList = filterList.map((item) => ({
    value: item.slug ?? DEFAULT_FILTER_VALUE,
    label: item.label,
  }));

  return (
    <div className="grid md:grid-cols-[1fr_1fr_1fr_1fr_0.5fr] gap-4 z-10 items-center">
      <ResponsiveComboBox
        filterItemList={categoryFilterItemList}
        placeholder="All Categories"
        labelPrefix="Category: "
        selectedValue={selected.category || DEFAULT_FILTER_VALUE}
        onValueChange={(value) => handleFilterChange("category", value)}
      />

      {/* Single Select for tag */}
      {/* <ResponsiveComboBox
        filterItemList={tagFilterItemList}
        placeholder="All Tags"
        labelPrefix="Tag: "
        selectedValue={selectedTag || DEFAULT_FILTER_VALUE}
        onValueChange={(value) => handleFilterChange("tag", value)}
      /> */}

      {/* MultiSelect for tags */}
      <MultiSelect
        className="shadow-none"
        options={tagFilterItemList.map((tag) => ({
          value: tag.value,
          label: tag.label || "",
        }))}
        onValueChange={(selected) =>
          handleFilterChange(
            "tag",
            selected.length > 0 ? selected.join(",") : null,
          )
        }
        value={selected.tag ? selected.tag.split(",") : []}
        placeholder="Select tags"
        variant="default"
        maxCount={1}
      />

      <ResponsiveComboBox
        filterItemList={queryFilterItemList}
        placeholder={DEFAULT_QUERY.label}
        selectedValue={selected.filter || DEFAULT_FILTER_VALUE}
        onValueChange={(value) => handleFilterChange("f", value)}
      />

      <ResponsiveComboBox
        filterItemList={sortFilterItemList}
        placeholder={DEFAULT_SORT.label}
        selectedValue={selected.sort || DEFAULT_FILTER_VALUE}
        onValueChange={(value) => handleFilterChange("sort", value)}
      />

      <Button variant="outline" onClick={handleResetFilters}>
        Reset
      </Button>
    </div>
  );
}
