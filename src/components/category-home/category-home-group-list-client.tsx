"use client";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import type { GroupListQueryResult } from "@/sanity.types";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { DEFAULT_FILTER_VALUE } from "../shared/combobox";

interface CategoryHomeGroupListClientProps {
  groupList: GroupListQueryResult;
  urlPrefix: string;
}

export function CategoryHomeGroupListClient({
  groupList,
  urlPrefix,
}: CategoryHomeGroupListClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("category") || DEFAULT_FILTER_VALUE;
  const [openCategory, setOpenCategory] = useState<string>();

  useEffect(() => {
    const parentGroup = groupList.find((group) =>
      group.categories.some(
        (category) => category.slug?.current === selectedCategory,
      ),
    );
    setOpenCategory(parentGroup?.slug.current);
  }, [selectedCategory, groupList]);

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
        <li>
          <Button
            variant={
              selectedCategory === DEFAULT_FILTER_VALUE ? "default" : "ghost"
            }
            size="sm"
            className="w-full justify-start px-3 py-3"
            onClick={() => handleFilterChange(DEFAULT_FILTER_VALUE)}
          >
            All Categories
          </Button>
        </li>

        {groupList.map((group) => {
          const groupSlug = group.slug.current;
          const isOpen = openCategory === groupSlug;

          return (
            <li key={group._id}>
              <Collapsible
                open={isOpen}
                onOpenChange={() =>
                  setOpenCategory(isOpen ? undefined : groupSlug)
                }
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-between px-3 py-3"
                  >
                    <span>{group.name}</span>
                    <ChevronDownIcon
                      className={`size-4 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </Button>
                </CollapsibleTrigger>

                <CollapsibleContent className="space-y-2">
                  {group.categories.map((category) => (
                    <Button
                      key={category._id}
                      variant={
                        category.slug.current === selectedCategory
                          ? "default"
                          : "ghost"
                      }
                      size="sm"
                      className="w-full justify-start px-6 py-2"
                      onClick={() => handleFilterChange(category.slug.current)}
                    >
                      {category.name}
                    </Button>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
