import { TweetFeedView } from "@/components/tweet-feed/tweet-feed-view";
import type { TweetFeedData } from "@/components/tweet-feed/types";
import { siteConfig } from "@/config/site";
import { curatedTweetSummaries } from "@/data/tweet-feed-curated";
import { constructMetadata } from "@/lib/metadata";
import { getTweetFeedData } from "@/lib/tweet-feed";

const canonicalUrl = `${siteConfig.url}/ai-daily-feeds`;

const pageTitle =
  "AI Daily Pulse: Top AI Agent Updates, LLM Breakthroughs & Curated Tweets";
const pageDescription =
  "Real-time daily curated AI breakthroughs, autonomous agent frameworks (OpenClaw, Hermes 3), TimesFM, LLM benchmarks, and developer discussions. Updated every 3 hours with key takeaways.";

const baseMetadata = constructMetadata({
  title: pageTitle,
  description: pageDescription,
  canonicalUrl,
});

export const metadata = {
  ...baseMetadata,
  keywords: [
    "ai daily feeds",
    "ai agent updates",
    "curated ai tweets",
    "openclaw agent",
    "hermes 3 agent",
    "timesfm 3.0",
    "autonomous coding agents",
    "llm breakthroughs today",
    "multi-agent orchestration",
    "ai research takeaways",
    "ai daily digest",
  ],
  openGraph: {
    ...baseMetadata.openGraph,
    url: canonicalUrl,
    title: pageTitle,
    description: pageDescription,
  },
  twitter: {
    ...baseMetadata.twitter,
    title: pageTitle,
    description: pageDescription,
  },
};

export const revalidate = 10800; // 3 hours ISR cache (3 * 3600 seconds)

// ItemList structured data for search engine rich indexing with accurate timestamps
const tweetFeedJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "AI Daily Pulse: Curated Agent Highlights & Developer Briefings",
  description: pageDescription,
  url: canonicalUrl,
  numberOfItems: curatedTweetSummaries.length,
  itemListElement: curatedTweetSummaries.map((summary, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "SocialMediaPosting",
      headline: summary.title,
      text: summary.summary,
      author: {
        "@type": "Person",
        name: summary.authorName,
        url: `https://x.com/${summary.authorHandle}`,
      },
      url: summary.url,
      datePublished: summary.datePublished,
    },
  })),
};

export default async function AiDailyFeedsPage() {
  let feedData: TweetFeedData = {
    all: [],
    openclaw: [],
    hermes: [],
  };

  try {
    const data = await getTweetFeedData();
    if (data && typeof data === "object") {
      feedData = {
        all: Array.isArray(data.all) ? data.all : [],
        openclaw: Array.isArray(data.openclaw) ? data.openclaw : [],
        hermes: Array.isArray(data.hermes) ? data.hermes : [],
      };
    }
  } catch (err) {
    console.error("Failed to fetch tweet feed data:", err);
  }

  return (
    <div className="min-h-screen">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Valid JSON-LD schema
        dangerouslySetInnerHTML={{ __html: JSON.stringify(tweetFeedJsonLd) }}
      />
      <TweetFeedView initialData={feedData} />

      {/* Server-rendered internal link module for search engines and direct discovery */}
      <aside
        aria-label="Featured Technical Deep Dives"
        className="w-full border-t border-border/80 bg-muted/30 py-10"
      >
        <div className="container mx-auto max-w-5xl px-4">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-primary" />
              <h2 className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">
                Featured Technical Deep Dives & Engineering Guides
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <a
                href="/typesafe-jev"
                className="group flex flex-col gap-1.5 rounded-xl border border-border/70 bg-card p-4 transition-colors hover:border-primary/50"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-foreground group-hover:text-primary">
                    TypeSafe Jev Architecture
                  </span>
                  <span className="text-[10px] font-mono rounded bg-primary/10 text-primary px-1.5 py-0.5">
                    Hub
                  </span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  System One frontier decision model, RLCD calibration proofs,
                  and speculative fan-out.
                </p>
              </a>

              <a
                href="/how-to-use-jev"
                className="group flex flex-col gap-1.5 rounded-xl border border-border/70 bg-card p-4 transition-colors hover:border-primary/50"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-foreground group-hover:text-primary">
                    How to Use Jev AI
                  </span>
                  <span className="text-[10px] font-mono rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5">
                    Guide
                  </span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  7 access routes compared, 10-minute setup, and 4 production
                  recipes with verified schemas.
                </p>
              </a>

              <a
                href="/agent-skills"
                className="group flex flex-col gap-1.5 rounded-xl border border-border/70 bg-card p-4 transition-colors hover:border-primary/50"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-sm text-foreground group-hover:text-primary">
                    280+ Agent Skills & MCP
                  </span>
                  <span className="text-[10px] font-mono rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 px-1.5 py-0.5">
                    Directory
                  </span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  Curated open-source agent skills, MCP servers, and harnesses
                  with direct GitHub repositories.
                </p>
              </a>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
