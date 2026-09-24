import type { CuratedItemData } from "@/data/item-curated/fakeface";

export const unsummaryCuratedData: CuratedItemData = {
  slug: "unsummary",
  name: "Unsummary",
  officialUrl: "https://unsummary.com",
  tagline:
    "AI media summarizer (Books, Podcasts, Movies). Status: Origin server inactive as of September 2026. Compare working alternatives below.",
  realPricingOverview: {
    freeTrial: "Historical: 25 free credits on sign-up (1 credit/summary)",
    starterPaid: "Service currently offline/discontinued",
    creditsSystem: "Pay-as-you-go credit deductions (historical)",
    watermarkPolicy: "Clean structured markdown/text format",
  },
  serviceStatusNotice: {
    isInactive: true,
    badgeText: "Service Offline / Discontinued",
    headline: "Unsummary is currently offline & inactive",
    description:
      "As of September 2026, the origin servers for unsummary.com are no longer responding (HTTP 522/offline). Direct registration and generation are unavailable. We strongly recommend switching to active alternatives.",
    alternativesCtaText: "Find Active Alternatives",
  },
  keyCapabilities: [
    {
      title: "Extensive Media Catalog (Historical)",
      description:
        "Historically indexed over 40M+ books, 600K+ movies, 230K+ TV shows, and 4M+ podcasts into concise, readable summaries.",
      highlight: "Covered multi-format media beyond standard book-only tools",
    },
    {
      title: "Structured Chapter Breakdowns",
      description:
        "Extracted core narrative beats, author arguments, and thematic summaries rather than crude truncation.",
      highlight:
        "Allowed content researchers to digest multi-hour sources in minutes",
    },
    {
      title: "Audio & Podcast Takeaway Conversion",
      description:
        "Enabled researchers to paste podcast titles or audio links and receive key takeaways without listening to long episodes.",
      highlight: "Ideal for content marketing and rapid research",
    },
    {
      title: "Service Status & Working Alternatives",
      description:
        "As of late 2026, unsummary.com's origin servers do not respond (HTTP 522). Active tools like Blinkist, StoryShots, and NoteGPT are recommended replacements.",
      highlight: "Explore working replacements on the Alternatives tab",
    },
  ],
  competitorNames: {
    competitor1: "Blinkist",
    competitor2: "StoryShots",
  },
  recommendedGuidesTitle: "Explore Active Summarizers & Research Tooling",
  recommendedGuidesDescription:
    "Browse verified alternatives, autonomous workflow skills, and next-gen AI decision models:",
  comparisonWithCompetitors: [
    {
      feature: "Service Availability",
      targetValue: "Inactive (HTTP 522/offline)",
      competitor1Value: "Active (24/7 web & app)",
      competitor2Value: "Active (24/7 web & app)",
    },
    {
      feature: "Core Focus",
      targetValue: "Books, Podcasts, Movies, Figures",
      competitor1Value: "Curated Non-fiction Audio Books",
      competitor2Value: "Free & Premium Book Summaries",
    },
    {
      feature: "Library Scale",
      targetValue: "40M+ titles (Historical catalogue)",
      competitor1Value: "6,500+ Curated titles",
      competitor2Value: "Thousands of titles",
    },
    {
      feature: "Free Starter Tier",
      targetValue: "25 credits (Historical policy)",
      competitor1Value: "Daily free book or 7-day trial",
      competitor2Value: "Free tier with text & audio",
    },
    {
      feature: "Best Alternative For",
      targetValue: "Discontinued / Research reference",
      competitor1Value: "Polished audio & key insights",
      competitor2Value: "Quick visual & infographic briefs",
    },
  ],
  faqs: [
    {
      question: "Is Unsummary still active and available in 2026?",
      answer:
        "No. As of September 2026, the origin servers at unsummary.com are unresponsive (HTTP 522/timeout), indicating the tool has been shut down or discontinued. We recommend using active alternatives such as Blinkist, StoryShots, or NoteGPT.",
    },
    {
      question: "What did Unsummary do when it was operating?",
      answer:
        "Unsummary was a multi-format AI summarizer that generated key takeaways for over 40 million books, 600,000 movies, and 4 million podcasts in seconds. It was designed for content creators and researchers to quickly grasp long-form media.",
    },
    {
      question: "What are the best working alternatives to Unsummary?",
      answer:
        "Top active alternatives include Blinkist (best for audio and curated book briefs), StoryShots (great free tier with infographics), NoteGPT (for YouTube and podcast summaries), and ChatGPT for custom text condensation.",
    },
    {
      question:
        "Did Unsummary ever write or expand outlines into long articles?",
      answer:
        "No. Unsummary was strictly an information condensation and summarization platform. It never functioned as an outline-expanding or long-form copywriting assistant.",
    },
  ],
  recommendedGuides: [
    {
      title: "Unsummary Alternatives Matrix",
      href: "/item/unsummary/alternatives",
      badge: "Alternatives",
      description:
        "Compare top active alternatives including Blinkist, StoryShots, NoteGPT, and QuillBot.",
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
