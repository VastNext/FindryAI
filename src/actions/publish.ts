"use server";

import { getItemById } from "@/data/item";
import { currentUser } from "@/lib/auth";
import { sanityClient } from "@/sanity/lib/client";
import { revalidatePath, revalidateTag } from "next/cache";

export type ServerActionResponse = {
  status: "success" | "error";
  message?: string;
};

export async function publish(itemId: string): Promise<ServerActionResponse> {
  console.log("publish, itemId:", itemId);
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
        publishDate: new Date().toISOString(),
      })
      .commit();
    // console.log('publish, result:', result);

    if (!result) {
      return { status: "error", message: "Failed to publish item!" };
    }
    // 条目带上 publishDate 后会进入首页/分类/搜索列表，全站页面多为 48h ISR，
    // 这里按根布局整体失效，确保新发布立即可见；Banner 走 sponsor-banner 标签缓存，
    // 在此统一失效一次（事件驱动，平时零轮询）
    revalidatePath("/", "layout");
    revalidateTag("sponsor-banner");
    return { status: "success", message: "Successfully published!" };
  } catch (error) {
    console.log("publish, error", error);
    return { status: "error", message: "Failed to publish item!" };
  }
}
