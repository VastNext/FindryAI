"use server";

import { getItemById } from "@/data/item";
import { currentUser } from "@/lib/auth";
import { checkBadge } from "@/lib/badge-verification";
import { sendNotifySubmissionEmail } from "@/lib/mail";
import {
  FREE_SUBMISSION_LIMIT,
  FreePlanStatus,
  PricePlans,
} from "@/lib/submission";
import { getItemLinkInStudio, getItemStatusLinkInWebsite } from "@/lib/utils";
import { sanityClient } from "@/sanity/lib/client";

export type ServerActionResponse = {
  status: "success" | "error";
  message?: string;
};

export const submitToReview = async (
  itemId: string,
  withBadge = false,
): Promise<ServerActionResponse> => {
  console.log("submitToReview, itemId:", itemId);
  try {
    const user = await currentUser();
    if (!user) {
      return { status: "error", message: "Unauthorized" };
    }
    // console.log("submitToReview, user:", user);

    const item = await getItemById(itemId);
    if (!item) {
      return { status: "error", message: "Item not found!" };
    }
    if (item.submitter._ref !== user.id) {
      return { status: "error", message: "You are not allowed to do this!" };
    }
    if (
      item.pricePlan !== PricePlans.FREE ||
      item.freePlanStatus !== FreePlanStatus.SUBMITTING
    ) {
      return { status: "error", message: "Item is not in right plan status!" };
    }

    // 免费套餐每账号终身 2 条（徽章快速通道不受此限）。
    if (!withBadge) {
      const usedSlots = await sanityClient.fetch(
        `count(*[_type == "item" && submitter._ref == $userId && pricePlan == $plan && freePlanStatus in ["pending", "approved"] && _id != $id])`,
        { userId: user.id, plan: PricePlans.FREE, id: itemId },
        { useCdn: false },
      );
      if (usedSlots >= FREE_SUBMISSION_LIMIT) {
        return {
          status: "error",
          message:
            "Free plan includes up to 2 submissions per account. To submit more, verify our badge on your site (fast-track review included) or upgrade to Pro.",
        };
      }
    }

    // 优先入队时重新核验，避免先验证、撤掉徽章后仍占用优先审核资格。
    const badgeResult = withBadge ? await checkBadge(item.link) : null;
    if (withBadge && badgeResult?.status !== "verified") {
      return {
        status: "error",
        message: "徽章复核未通过，请重试或提交普通队列",
      };
    }
    const priority = badgeResult?.status === "verified";
    const fresh = await sanityClient.fetch<{
      _rev: string;
      submitter?: { _ref: string };
      freePlanStatus?: string;
      pricePlan?: string;
      link?: string;
    } | null>(
      '*[_type == "item" && _id == $id][0]{_rev, submitter, freePlanStatus, pricePlan, link}',
      { id: itemId },
      { useCdn: false },
    );
    if (
      !fresh ||
      fresh.submitter?._ref !== user.id ||
      fresh.freePlanStatus !== FreePlanStatus.SUBMITTING ||
      fresh.pricePlan !== PricePlans.FREE ||
      fresh.link !== item.link
    ) {
      return { status: "error", message: "投稿状态已改变，请刷新后重试" };
    }
    let patch = sanityClient
      .patch(itemId)
      .ifRevisionId(fresh._rev)
      .set({
        pricePlan: PricePlans.FREE,
        freePlanStatus: FreePlanStatus.PENDING,
        badgeReviewPriority: priority,
        ...(priority ? { badgeVerifiedAt: new Date().toISOString() } : {}),
      });
    if (!priority) patch = patch.unset(["badgeVerifiedAt"]);
    const result = await patch.commit();
    // console.log('submitToReview, result:', result);
    if (!result) {
      return { status: "error", message: "Failed to submit item to review!" };
    }

    const statusLink = getItemStatusLinkInWebsite(itemId);
    const reviewLink = getItemLinkInStudio(itemId);
    sendNotifySubmissionEmail(
      user.name,
      user.email,
      result.name,
      statusLink,
      reviewLink,
      priority,
    );

    return { status: "success", message: "Item submitted to review!" };
  } catch (error) {
    console.log("submitToReview, error", error);
    return { status: "error", message: "Failed to submit item to review!" };
  }
};
