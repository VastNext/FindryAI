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
        "Yes! We offer free submissions for all AI builders and creators. \nYou will get:\n" +
        "- Permanent listing on our curated directory\n" +
        "- 3 high-authority dofollow backlinks to boost your SEO\n" +
        "- Badge-verified submissions reviewed within 24-72 hours and published if approved; no-badge submissions have no guaranteed review time",
    },
    {
      id: "item-2",
      question: "How does the badge fast-track review work?",
      answer:
        "Add our official badge (Dark, Light, or Neutral) to your public product website and verify it during submission. Verified submissions receive editorial review within 24-72 hours and are published if approved. A badge is optional: submissions without one enter the standard queue with no guaranteed review time. Removing the badge after publication may return your listing to the review queue.",
    },
    {
      id: "item-3",
      question: "What is the Pro Featured plan?",
      answer:
        "The Pro plan is designed for products seeking instant exposure. It includes expedited review within 12 hours, top-tier featured placement across category feeds, highlighted badges, and inclusion in our curated social updates.",
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
        "No reciprocal link or badge is strictly required for standard free submission. However, adding our official badge grants fast-track priority review and helps both communities grow.",
    },
  ],
};
