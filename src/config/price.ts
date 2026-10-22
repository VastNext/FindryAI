import { PricePlans } from "@/lib/submission";
import type { PriceConfig } from "@/types";

/**
 * 网站价格方案配置
 * 包含 Free（免费方案，支持徽章优先队列与标准队列）、Pro（付费推广）与 Sponsor（全站赞助）
 */
export const priceConfig: PriceConfig = {
  plans: [
    {
      title: PricePlans.FREE,
      description: "Free Submission for AI Builders",
      benefits: [
        "Up to 2 submissions per account",
        "Permanent product directory listing",
        "Badge-verified submissions: editorial review within 24-72 hours and one followed listing link",
        "No badge required: standard queue without a guaranteed review time (listing link is nofollow)",
        "Full support for product updates and screenshots",
      ],
      limitations: [
        "Standard review queue, no featured placement",
        "More than 2 submissions requires a verified badge or Pro",
        "Community support",
      ],
      price: 0,
      priceSuffix: "Free",
      stripePriceId: null,
    },
    {
      title: PricePlans.PRO,
      description: "Expedited Review, Featured Placement & Ongoing Promotion",
      benefits: [
        "Priority editorial review within 12 hours",
        "Featured placement at top of homepage & category for 30 days",
        "Highlighted award badge across directory cards",
        "Unlimited submissions — no per-account cap",
        "3 dedicated dofollow backlinks",
        "Direct email support",
      ],
      limitations: [],
      // Launch-period early-bird price; set back to 29 (and drop originalPrice) after the launch window.
      price: 19.9,
      originalPrice: 29,
      priceSuffix: "USD",
      stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
    },
    {
      title: PricePlans.SPONSOR,
      description: "Site-wide Banner & Prime Sponsorship (Inquire)",
      benefits: [
        "Everything in Pro (listing links use Google's sponsored annotation)",
        "Sticky sponsor banner across all directory & article pages",
        "Exclusive sponsorship slot per category / time period",
        "Custom UTM analytics with a monthly performance report",
        "VIP onboarding & dedicated partner channel",
        "Monthly billing, cancel anytime",
      ],
      limitations: [],
      // Must reference a Stripe RECURRING (monthly) price; a one-time price fails subscription checkout.
      price: 99,
      priceSuffix: "/ month",
      stripePriceId: process.env.NEXT_PUBLIC_STRIPE_SPONSOR_PRICE_ID,
    },
  ],
};
