import type { CuratedItemData } from "@/data/item-curated/fakeface";

export interface CuratedAlternativeEntry {
  name: string;
  slug?: string;
  tagline: string;
  pricing: string;
  focus: string;
  url: string;
}

export const UNSUMMARY_CURATED_ALTERNATIVES: CuratedAlternativeEntry[] = [
  {
    name: "Blinkist",
    tagline:
      "Industry leader in 15-minute book summaries with audio & text briefs",
    pricing: "Freemium / Trial",
    focus: "Curated Non-fiction Audio Books",
    url: "https://www.blinkist.com",
  },
  {
    name: "StoryShots",
    tagline: "Free book summaries with animated infographics, audio, and text",
    pricing: "Free / Premium",
    focus: "Visual & Audio Book Takeaways",
    url: "https://www.getstoryshots.com",
  },
  {
    name: "NoteGPT",
    tagline: "AI video, podcast, and article summarizer with visual mind maps",
    pricing: "Free / Pro",
    focus: "YouTube, Podcasts & Articles",
    url: "https://notegpt.io",
  },
  {
    name: "QuillBot",
    tagline: "Long-form AI text summarizer, condenser, and rewriter",
    pricing: "Free / Premium",
    focus: "General Text & Document Condensation",
    url: "https://quillbot.com/summarize",
  },
  {
    name: "ChatPDF",
    tagline:
      "Upload books, PDFs, and research papers to chat, summarize, and extract",
    pricing: "Free / Plus",
    focus: "PDF & Long Document Q&A",
    url: "https://www.chatpdf.com",
  },
  {
    name: "MakeMySummary",
    tagline:
      "Generous free quotas for condensing articles, newsletters, and papers",
    pricing: "Free",
    focus: "Article & Text Summarization",
    url: "https://makemysummary.com",
  },
  {
    name: "Shortform",
    tagline:
      "Deep, comprehensive chapter-by-chapter book summaries and exercises",
    pricing: "Free Trial / Paid",
    focus: "In-depth Book Analysis",
    url: "https://www.shortform.com",
  },
  {
    name: "getAbstract",
    tagline:
      "Enterprise-grade library of 27,000+ business book and article summaries",
    pricing: "Trial / Paid",
    focus: "Business & Leadership Summaries",
    url: "https://www.getabstract.com",
  },
  {
    name: "Upword",
    slug: "upword",
    tagline:
      "AI research tool that reads, summarizes, and generates study notes",
    pricing: "Free / Pro",
    focus: "Research Summarizer & Notes",
    url: "https://www.upword.ai",
  },
  {
    name: "12min",
    tagline: "Micro-books and audio digests designed for busy professionals",
    pricing: "Freemium",
    focus: "12-Minute Book Summaries",
    url: "https://12min.com",
  },
  {
    name: "SMMRY",
    tagline: "Instant, no-sign-up text reducer based on ranking key sentences",
    pricing: "100% Free",
    focus: "Direct Text & Webpage Reducer",
    url: "https://smmry.com",
  },
  {
    name: "TLDR This",
    tagline:
      "Browser extension and web tool that distills any article in seconds",
    pricing: "Free / Basic",
    focus: "Web Article Extraction",
    url: "https://tldrthis.com",
  },
  {
    name: "Resoomer",
    tagline:
      "Semantic text analyzer and summarizer for academic and news articles",
    pricing: "Free / Pro",
    focus: "Document & Article Condensation",
    url: "https://resoomer.com",
  },
  {
    name: "AskYourPDF",
    tagline:
      "AI document assistant for reading and summarizing lengthy books & papers",
    pricing: "Free / Premium",
    focus: "PDF Dialogue & Extraction",
    url: "https://askyourpdf.com",
  },
  {
    name: "SciSpace",
    tagline:
      "Read research papers and academic books with instant paragraph summaries",
    pricing: "Free / Pro",
    focus: "Academic Paper & Book Analysis",
    url: "https://typeset.io",
  },
  {
    name: "Glarity",
    tagline:
      "Open-source browser extension summarizing YouTube, Google, and news",
    pricing: "Free",
    focus: "Cross-platform Summary Extension",
    url: "https://glarity.app",
  },
  {
    name: "SummarizeBot",
    tagline:
      "Multi-platform bot that summarizes audio, links, and documents in chat",
    pricing: "Free Trial",
    focus: "Multi-media Bot Summaries",
    url: "https://www.summarizebot.com",
  },
  {
    name: "Summari",
    tagline:
      "API and consumer tool producing human-quality summaries in under 5 seconds",
    pricing: "Free Trial / Pro",
    focus: "Speed-focused Article Summarizer",
    url: "https://www.summari.com",
  },
];

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
