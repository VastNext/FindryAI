"use server";

import { getItemById } from "@/data/item";
import { currentUser } from "@/lib/auth";
import { checkBadge } from "@/lib/badge-verification";
import {
  FreePlanStatus,
  PricePlans,
  ProPlanStatus,
  SponsorPlanStatus,
} from "@/lib/submission";
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
    if (
      (item.pricePlan === PricePlans.FREE &&
        item.freePlanStatus !== FreePlanStatus.APPROVED) ||
      (item.pricePlan === PricePlans.PRO &&
        item.proPlanStatus !== ProPlanStatus.SUCCESS) ||
      (item.pricePlan === PricePlans.SPONSOR &&
        item.sponsorPlanStatus !== SponsorPlanStatus.SUCCESS)
    ) {
      return { status: "error", message: "条目尚未通过审核，不能发布" };
    }
    const fresh = await sanityClient.fetch<{
      _rev: string;
      link: string;
      submitter?: { _ref: string };
      pricePlan?: string;
      freePlanStatus?: string;
      proPlanStatus?: string;
      sponsorPlanStatus?: string;
      badgeReviewPriority?: boolean;
    } | null>(
      '*[_type == "item" && _id == $id][0]{_rev, link, submitter, pricePlan, freePlanStatus, proPlanStatus, sponsorPlanStatus, badgeReviewPriority}',
      { id: itemId },
      { useCdn: false },
    );
    if (
      !fresh ||
      fresh.submitter?._ref !== user.id ||
      (fresh.pricePlan === PricePlans.FREE &&
        fresh.freePlanStatus !== FreePlanStatus.APPROVED) ||
      (fresh.pricePlan === PricePlans.PRO &&
        fresh.proPlanStatus !== ProPlanStatus.SUCCESS) ||
      (fresh.pricePlan === PricePlans.SPONSOR &&
        fresh.sponsorPlanStatus !== SponsorPlanStatus.SUCCESS) ||
      ![PricePlans.FREE, PricePlans.PRO, PricePlans.SPONSOR].includes(
        fresh.pricePlan as PricePlans,
      )
    ) {
      return { status: "error", message: "条目尚未通过审核，不能发布" };
    }
    if (fresh.pricePlan === PricePlans.FREE) {
      if (
        fresh.badgeReviewPriority &&
        (await checkBadge(fresh.link)).status !== "verified"
      ) {
        return {
          status: "error",
          message: "优先条目的徽章暂未通过复核，请稍后重试",
        };
      }
    }

    const result = await sanityClient
      .patch(itemId)
      .ifRevisionId(fresh._rev)
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
