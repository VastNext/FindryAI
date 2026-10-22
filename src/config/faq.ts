import type { FAQConfig } from "@/types";
import { siteConfig } from "./site";

/**
 * 常见问题 FAQ 配置
 * 包含免费提交、徽章优先审核队列、Pro 推广与赞助说明
 */
export const faqConfig: FAQConfig = {
  items: [
    {
      id: "item-1",
      question: "Is it free to submit my AI tool or agent skill?",
      answer:
        "Yes! Free submission is open to all AI builders and creators. \nYou will get:\n" +
        "- Permanent listing on our curated directory\n" +
        "- Up to 2 submissions per account on the free plan\n" +
        "- Badge-verified submissions reviewed within 24-72 hours with a followed listing link; no-badge submissions enter the standard queue with no guaranteed review time and a nofollow listing link\n" +
        "- More than 2 submissions requires a verified badge or the Pro plan",
    },
    {
      id: "item-2",
      question: "How does the badge fast-track review work?",
      answer:
        "Add our official badge (Dark, Light, or Neutral) to your public product website and verify it during submission. Verified submissions receive editorial review within 24-72 hours and are published if approved, and their listing earns one followed link (the primary Visit Website anchor). A badge is optional: submissions without one enter the standard queue with no guaranteed review time and a nofollow listing link. Removing the badge after publication turns the listing link back to nofollow and may return your listing to the review queue.",
    },
    {
      id: "item-3",
      question: "What is the Pro plan?",
      answer:
        "The Pro plan is designed for products seeking expedited review and exposure. It includes priority review within 12 hours, featured placement at the top of the homepage and category feeds for 30 days, an award badge across directory cards, unlimited submissions, and 3 dedicated dofollow backlinks on your listing. New Pro listings are also included in our weekly digest email, sent automatically to newsletter subscribers. A launch-period early-bird price is available for a limited time.",
    },
    {
      id: "item-4",
      question: "How can I sponsor or promote on Findry AI?",
      answer: `We offer prime site-wide banner slots and category-exclusive sponsorships. Please reach out to <a href='mailto:support@findryai.com?subject=Findry%20AI%20Sponsorship' class='underline text-primary'>support@findryai.com</a> with your product link and expected timeline.`,
    },
    {
      id: "item-5",
      question: "Do I need to provide a reciprocal backlink or badge?",
      answer:
        "No reciprocal link or badge is strictly required — standard free submissions stay listed permanently. However, adding our official badge grants fast-track editorial review and a followed listing link, so verified sites get both priority and full link credit.",
    },
  ],
};
