import { SUPPORT_CATEGORY_GROUP } from "@/lib/constants";
import type {
  CategoryListQueryResult,
  GroupListQueryResult,
} from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { categoryListQuery, groupListQuery } from "@/sanity/lib/queries";
import { CategoryHomeCategoryListClient } from "./category-home-category-list-client";
import { CategoryHomeGroupListClient } from "./category-home-group-list-client";

export async function CategoryHomeCategoryList({
  urlPrefix,
}: {
  urlPrefix: string;
}) {
  if (SUPPORT_CATEGORY_GROUP) {
    const groupList = await sanityFetch<GroupListQueryResult>({
      query: groupListQuery,
    });

    return (
      <CategoryHomeGroupListClient
        groupList={groupList}
        urlPrefix={urlPrefix}
      />
    );
  }

  const categoryList = await sanityFetch<CategoryListQueryResult>({
    query: categoryListQuery,
  });

  return (
    <CategoryHomeCategoryListClient
      categoryList={categoryList}
      urlPrefix={urlPrefix}
    />
  );
}
