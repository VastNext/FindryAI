import { PricePlans } from "@/lib/submission";
import type { PriceConfig } from "@/types";

export const priceConfig: PriceConfig = {
  plans: [
    {
      title: PricePlans.FREE,
      description: "Limited-Time Free Submission for Early Builders",
      benefits: [
        "Get 3 high-authority dofollow backlinks to boost SEO",
        "Permanent product directory listing",
        "Editorial review and published within 24-72 hours",
        "Full support for product updates and screenshots",
      ],
      limitations: ["Standard review queue", "Community support"],
      price: 0,
      priceSuffix: "Free",
      stripePriceId: null,
    },
    {
      title: PricePlans.PRO,
      description: "Featured Placement & Expedited Review (Coming Soon)",
      benefits: [
        "Instant editorial review within 12 hours",
        "Guaranteed homepage & category top-tier featured placement",
        "Highlighted award badge across directory cards",
        "Dedicated dofollow backlink boost",
        "Priority promotion in newsletters & daily tweet feeds",
        "Direct email support",
      ],
      limitations: [],
      price: 19.9,
      priceSuffix: "USD",
      stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
    },
    {
      title: PricePlans.SPONSOR,
      description: "Site-wide Banner & Prime Sponsorship (Inquire)",
      benefits: [
        "Everything in Pro featured listing",
        "Sticky sponsor banner across all directory & article pages",
        "Top-level billboard visibility for 100K+ monthly impressions",
        "Exclusivity per category / time slot",
        "Custom UTM analytics and dedicated sponsor branding",
        "VIP onboarding & dedicated partner channel",
      ],
      limitations: [],
      price: 99,
      priceSuffix: "/ month",
      stripePriceId: process.env.NEXT_PUBLIC_STRIPE_SPONSOR_PRICE_ID,
    },
  ],
};
