import type { ItemInfo } from "@/types";

/** Free plan lifetime submission cap per account (badge/Pro bypass it). */
export const FREE_SUBMISSION_LIMIT = 2;

type ExternalRelItem = {
  sponsor?: boolean | null;
  pricePlan?: string | null;
  badgeVerifiedAt?: string | null;
};

/**
 * Rel attribute for an item's outbound website link.
 *
 * The followed link is the badge/Pro incentive: free listings are nofollow
 * unless the submitter has a verified Findry badge on their site (or is on
 * Pro). Sponsors are marked `sponsored`. Single source of truth — every
 * renderer of item.link must go through this.
 */
export const getExternalRel = (item: ExternalRelItem): string => {
  if (item.pricePlan === PricePlans.SPONSOR || item.sponsor) {
    return "sponsored noopener noreferrer";
  }
  if (item.pricePlan === PricePlans.FREE && !item.badgeVerifiedAt) {
    return "nofollow noopener noreferrer";
  }
  return "noopener noreferrer";
};

export enum PricePlans {
  FREE = "free",
  PRO = "pro",
  SPONSOR = "sponsor",
}

export enum FreePlanStatus {
  APPROVED = "approved",
  REJECTED = "rejected",
  PENDING = "pending",
  SUBMITTING = "submitting",
}

export enum ProPlanStatus {
  SUCCESS = "success",
  FAILED = "failed",
  PENDING = "pending",
  SUBMITTING = "submitting",
}

export enum SponsorPlanStatus {
  SUCCESS = "success",
  FAILED = "failed",
  PENDING = "pending",
  SUBMITTING = "submitting",
}

export const getPublishable = (item: ItemInfo): boolean => {
  if (item.pricePlan === PricePlans.FREE) {
    return item.freePlanStatus === FreePlanStatus.APPROVED;
  }
  if (item.pricePlan === PricePlans.PRO) {
    return item.proPlanStatus === ProPlanStatus.SUCCESS;
  }
  if (item.pricePlan === PricePlans.SPONSOR) {
    return item.sponsorPlanStatus === SponsorPlanStatus.SUCCESS;
  }
  return false;
};

export const BadgeStyles = {
  SUCCESS: "success",
  WARNING: "warning",
  DANGER: "danger",
  NORMAL: "normal",
} as const;

export type BadgeStyle = (typeof BadgeStyles)[keyof typeof BadgeStyles];

export const getBadgeStyle = (item: ItemInfo): BadgeStyle => {
  if (item.pricePlan === PricePlans.FREE) {
    switch (item.freePlanStatus) {
      case FreePlanStatus.APPROVED:
        return BadgeStyles.SUCCESS;
      case FreePlanStatus.REJECTED:
        return BadgeStyles.DANGER;
      case FreePlanStatus.PENDING:
        return BadgeStyles.WARNING;
      default:
        return BadgeStyles.NORMAL;
    }
  }
  if (item.pricePlan === PricePlans.PRO) {
    switch (item.proPlanStatus) {
      case ProPlanStatus.SUCCESS:
        return BadgeStyles.SUCCESS;
      case ProPlanStatus.FAILED:
        return BadgeStyles.DANGER;
      case ProPlanStatus.PENDING:
        return BadgeStyles.WARNING;
      default:
        return BadgeStyles.NORMAL;
    }
  }
  if (item.pricePlan === PricePlans.SPONSOR) {
    switch (item.sponsorPlanStatus) {
      case SponsorPlanStatus.SUCCESS:
        return BadgeStyles.SUCCESS;
      case SponsorPlanStatus.FAILED:
        return BadgeStyles.DANGER;
      case SponsorPlanStatus.PENDING:
        return BadgeStyles.WARNING;
      default:
        return BadgeStyles.NORMAL;
    }
  }
  return BadgeStyles.NORMAL;
};
