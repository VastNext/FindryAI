import {
  QUERY_FILTER_LIST,
  SORT_FILTER_LIST,
  SUPPORT_CATEGORY_GROUP,
} from "@/lib/constants";
import type {
  CategoryListQueryResult,
  GroupListQueryResult,
  TagListQueryResult,
} from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  categoryListQuery,
  groupListQuery,
  tagListQuery,
} from "@/sanity/lib/queries";
import {
  type CategoryFilterItem,
  CategoryHomeSearchFilterClient,
  type TagFilterItem,
} from "./category-home-search-filter-client";

interface CategoryHomeSearchFilterProps {
  urlPrefix: string;
}

export async function CategoryHomeSearchFilter({
  urlPrefix,
}: CategoryHomeSearchFilterProps) {
  let categories: CategoryFilterItem[] = [];
  let tags: TagFilterItem[] = [];

  if (SUPPORT_CATEGORY_GROUP) {
    const [groupList, tagList] = await Promise.all([
      sanityFetch<GroupListQueryResult>({ query: groupListQuery }),
      sanityFetch<TagListQueryResult>({ query: tagListQuery }),
    ]);
    categories = groupList.flatMap(
      (group) =>
        group.categories?.map((category) => ({
          slug: category.slug.current,
          name: `${group.name} / ${category.name}`,
        })) || [],
    );
    tags = tagList.map((tag) => ({
      slug: tag.slug.current,
      name: tag.name,
    }));
  } else {
    const [categoryList, tagList] = await Promise.all([
      sanityFetch<CategoryListQueryResult>({ query: categoryListQuery }),
      sanityFetch<TagListQueryResult>({ query: tagListQuery }),
    ]);
    categories = categoryList.map((category) => ({
      slug: category.slug.current,
      name: category.name,
    }));
    tags = tagList.map((tag) => ({
      slug: tag.slug.current,
      name: tag.name,
    }));
  }

  return (
    <CategoryHomeSearchFilterClient
      tagList={tags}
      categoryList={categories}
      sortList={SORT_FILTER_LIST}
      filterList={QUERY_FILTER_LIST}
      urlPrefix={urlPrefix}
    />
  );
}
