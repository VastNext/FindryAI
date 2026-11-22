"use server";

import { getItemById } from "@/data/item";
import { currentUser } from "@/lib/auth";
import { sanityClient } from "@/sanity/lib/client";
import { revalidatePath, revalidateTag } from "next/cache";

export type ServerActionResponse = {
  status: "success" | "error";
  message?: string;
};

export async function unpublish(itemId: string): Promise<ServerActionResponse> {
  console.log("unpublish, itemId:", itemId);
  try {
    const user = await currentUser();
    if (!user) {
      return { status: "error", message: "Unauthorized" };
    }
    // console.log("publish, user:", user);

    const item = await getItemById(itemId);
    if (!item) {
      return { status: "error", message: "Item not found!" };
    }
    if (item.submitter._ref !== user.id) {
      return { status: "error", message: "You are not allowed to do this!" };
    }

    const result = await sanityClient
      .patch(itemId)
      .set({
        publishDate: null,
      })
      .commit();
    // console.log('unpublish, result:', result);

    if (!result) {
      return { status: "error", message: "Failed to unpublish item!" };
    }

    // 条目页与列表页是 48h ISR，必须在下架后立刻失效，否则仍会展示已下架条目。
    // 只失效该条目涉及的页面，避免整站回源重渲染。
    const detail = await sanityClient.fetch<{
      slug?: string;
      categorySlugs?: (string | null)[];
      tagSlugs?: (string | null)[];
      collectionSlugs?: (string | null)[];
    } | null>(
      '*[_type == "item" && _id == $id][0]{"slug": slug.current, "categorySlugs": categories[]->slug.current, "tagSlugs": tags[]->slug.current, "collectionSlugs": collections[]->slug.current}',
      { id: itemId },
      { useCdn: false },
    );
    revalidatePath("/");
    if (detail?.slug) {
      revalidatePath(`/item/${detail.slug}`);
      revalidateTag(`item:${detail.slug}`);
    }
    for (const slug of detail?.categorySlugs ?? []) {
      if (slug) revalidatePath(`/category/${slug}`);
    }
    for (const slug of detail?.tagSlugs ?? []) {
      if (slug) revalidatePath(`/tag/${slug}`);
    }
    for (const slug of detail?.collectionSlugs ?? []) {
      if (slug) revalidatePath(`/collection/${slug}`);
    }
    revalidateTag("sponsor-item");

    return { status: "success", message: "Item unpublished!" };
  } catch (error) {
    console.log("unpublish, error", error);
    return { status: "error", message: "Failed to unpublish item!" };
  }
}
