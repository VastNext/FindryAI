"use server";

import { currentUser } from "@/lib/auth";
import { checkBadge } from "@/lib/badge-verification";
import { FreePlanStatus, PricePlans } from "@/lib/submission";
import { sanityClient } from "@/sanity/lib/client";

export async function verifyBadge(itemId: string): Promise<{
  status: "verified" | "missing" | "unavailable" | "error";
  message: string;
}> {
  try {
    const user = await currentUser();
    if (!user?.id || !itemId) return { status: "error", message: "请先登录" };
    const item = await sanityClient.fetch<{
      _id: string;
      _rev: string;
      link?: string;
      submitter?: { _ref: string };
      pricePlan?: string;
      freePlanStatus?: string;
      publishDate?: string;
    } | null>(
      `*[_type == "item" && _id == $id][0]{_id, _rev, link, submitter, pricePlan, freePlanStatus, publishDate}`,
      { id: itemId },
      { useCdn: false },
    );
    if (
      !item ||
      item.submitter?._ref !== user.id ||
      item.pricePlan !== PricePlans.FREE ||
      (item.freePlanStatus !== FreePlanStatus.SUBMITTING &&
        item.freePlanStatus !== FreePlanStatus.PENDING) ||
      item.publishDate
    ) {
      return { status: "error", message: "无权验证此免费投稿" };
    }
    const result = await checkBadge(item.link || "");
    if (result.status === "verified") {
      await sanityClient
        .patch(itemId)
        .ifRevisionId(item._rev)
        .set({
          badgeVerifiedAt: new Date().toISOString(),
          badgeReviewPriority: true,
        })
        .commit();
    } else if (
      result.status === "missing" &&
      item.freePlanStatus === FreePlanStatus.PENDING
    ) {
      await sanityClient
        .patch(itemId)
        .ifRevisionId(item._rev)
        .set({ badgeReviewPriority: false })
        .unset(["badgeVerifiedAt"])
        .commit();
    }
    return result;
  } catch {
    return { status: "error", message: "徽章验证未能完成，请稍后重试" };
  }
}
