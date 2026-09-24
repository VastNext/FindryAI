import type { CuratedItemData } from "@/data/item-curated/fakeface";

export const unsummaryCuratedData: CuratedItemData = {
  slug: "unsummary",
  name: "Unsummary",
  officialUrl: "https://unsummary.com",
  tagline:
    "AI-powered content summarizer for books, podcasts, movies, and long-form articles.",
  realPricingOverview: {
    freeTrial: "Free starter summaries available for books and media",
    starterPaid:
      "Flexible credit packs and subscription tiers for avid readers",
    creditsSystem: "Pay-as-you-go credit deductions per long-form summary",
    watermarkPolicy: "Clean structured markdown and PDF export formats",
  },
  keyCapabilities: [
    {
      title: "Extensive Media Catalog",
      description:
        "Access instant summaries across millions of books and hundreds of thousands of podcasts and films.",
      highlight:
        "Covers fiction, non-fiction, academic literature, and long podcasts",
    },
    {
      title: "Structured Chapter Breakdowns",
      description:
        "Extracts chapter-by-chapter arguments and syntheses rather than blunt truncation.",
      highlight: "Preserves key arguments, chronology, and thematic nuance",
    },
    {
      title: "Actionable Insights & Key Takeaways",
      description:
        "Distills actionable learnings, memorable quotes, and core conceptual frameworks in bullet points.",
      highlight: "Designed for readers, researchers, and busy professionals",
    },
    {
      title: "Audio & Video Digest Conversion",
      description:
        "Converts multi-hour conversational podcasts and videos into concise 5-minute reading summaries.",
      highlight: "High signal-to-noise ratio extraction",
    },
  ],
  competitorNames: {
    competitor1: "Blinkist",
    competitor2: "Shortform",
  },
  recommendedGuidesTitle: "Explore Related Content & Architecture Deep Dives",
  recommendedGuidesDescription:
    "Discover how next-generation AI models handle text synthesis, decision routing, and agent tooling:",
  comparisonWithCompetitors: [
    {
      feature: "Core Focus",
      targetValue: "AI Media Summarization (Books, Podcasts, Movies)",
      competitor1Value: "Curated Human Book Summaries",
      competitor2Value: "Detailed Non-fiction Book Guides",
    },
    {
      feature: "Supported Media",
      targetValue: "Books, Podcasts, Films, Articles",
      competitor1Value: "Non-fiction Books & Audio",
      competitor2Value: "Non-fiction Books",
    },
    {
      feature: "Processing Speed",
      targetValue: "Instant AI Synthesis",
      competitor1Value: "Pre-written Editorial Library",
      competitor2Value: "Pre-written Editorial Guides",
    },
    {
      feature: "Free Starter Access",
      targetValue: "Yes (Free starter credits)",
      competitor1Value: "7-day trial with paywall",
      competitor2Value: "Limited preview",
    },
  ],
  faqs: [
    {
      question: "What is Unsummary?",
      answer:
        "Unsummary is an AI-powered content summarizer designed to help readers, researchers, and learners digest long-form media (books, podcasts, movies, articles) in minutes without losing core nuance.",
    },
    {
      question: "Does Unsummary expand outlines into long text?",
      answer:
        "No. Unsummary is strictly a summarization and knowledge distillation tool. It condenses lengthy media into high-signal key takeaways, chapter highlights, and quotes.",
    },
    {
      question: "What is the official website for Unsummary?",
      answer:
        "The official service is hosted directly at https://unsummary.com.",
    },
    {
      question: "Is Unsummary free to use?",
      answer:
        "Unsummary provides free starter credits to test summaries on books and movies, with flexible subscriptions and credit bundles for high-volume readers.",
    },
  ],
  recommendedGuides: [
    {
      title: "TypeSafe Jev AI Deep Dive",
      href: "/typesafe-jev",
      badge: "Architecture",
      description:
        "Explore how non-autoregressive decision models automate high-throughput content triage.",
    },
    {
      title: "How to Use Jev AI",
      href: "/how-to-use-jev",
      badge: "Recipes",
      description:
        "7 access routes and production recipes for filtering retrieved chunks and document triage.",
    },
    {
      title: "280+ Agent Skills Directory",
      href: "/agent-skills",
      badge: "Tools",
      description:
        "Curated MCP servers and autonomous workflow harnesses with direct GitHub repositories.",
    },
  ],
};
