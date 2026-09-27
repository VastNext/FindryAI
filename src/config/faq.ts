import type { FAQConfig } from "@/types";
import { siteConfig } from "./site";

export const faqConfig: FAQConfig = {
  items: [
    {
      id: "item-1",
      question: "Is it free to submit my AI tool or agent skill?",
      answer:
        "Yes! Free submission is open to all AI builders and creators. \nYou will get:\n" +
        "- Permanent listing on our curated directory\n" +
        "- 1 high-authority dofollow backlink to boost your SEO\n" +
        "- Editorial review and listing within 3-7 days (standard queue)",
    },
    {
      id: "item-2",
      question: "What is the Pro Featured plan?",
      answer:
        "The Pro plan is designed for products seeking instant exposure. It includes priority review within 12 hours, featured placement at the top of homepage and category feeds for 30 days, highlighted badges, 3 dedicated dofollow backlinks, and inclusion in our curated social updates. A launch-period early-bird price is available for a limited time.",
    },
    {
      id: "item-3",
      question: "How can I sponsor or promote on Findry AI?",
      answer: `We offer prime site-wide banner slots and category-exclusive sponsorships. Please reach out to <a href='mailto:support@findryai.com?subject=Findry%20AI%20Sponsorship' class='underline text-primary'>support@findryai.com</a> with your product link and expected timeline.`,
    },
    {
      id: "item-4",
      question: "Do I need to provide a reciprocal backlink?",
      answer:
        "No reciprocal backlink is strictly required, though adding a badge or link back to Findry AI will help prioritize your review in our community queue.",
    },
  ],
};
