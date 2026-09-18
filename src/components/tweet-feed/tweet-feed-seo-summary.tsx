import { Badge } from "@/components/ui/badge";
import {
  type CuratedTweetSummary,
  curatedTweetSummaries,
} from "@/data/tweet-feed-curated";
import {
  ArrowUpRight,
  CheckCircle2,
  MessageSquareText,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

interface TweetFeedSeoSummaryProps {
  items?: CuratedTweetSummary[];
}

export function TweetFeedSeoSummary({
  items = curatedTweetSummaries,
}: TweetFeedSeoSummaryProps) {
  return (
    <section
      aria-label="Curated AI Tweets and Agent Highlights"
      className="my-8 w-full rounded-2xl border border-border/80 bg-card/60 p-6 md:p-8 backdrop-blur-sm shadow-sm"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between border-b border-border/60 pb-6 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge
              variant="outline"
              className="gap-1.5 border-primary/30 bg-primary/5 text-primary text-xs font-semibold uppercase tracking-wider"
            >
              <Sparkles className="h-3 w-3" />
              <span>Today's Curated Briefing</span>
            </Badge>
            <span className="text-xs text-muted-foreground">
              Refreshed Every 3 Hours • Verified Key Takeaways
            </span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Key AI Agent Highlights & Tweet Takeaways
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Direct takeaways and contextual summaries from today's most
            influential AI tweets, agent frameworks, research breakthroughs, and
            developer discussions.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
            Verified Takeaways
          </span>
          <span className="flex items-center gap-1">
            <MessageSquareText className="h-3.5 w-3.5 text-primary" />
            Direct Post Links
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
        {items.map((item) => (
          <article
            key={item.id}
            className="flex flex-col justify-between rounded-xl border border-border/60 bg-background/80 p-5 transition-all duration-200 hover:border-primary/40 hover:shadow-md"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-foreground">
                    {item.authorName}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    @{item.authorHandle}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="text-[11px] font-normal px-2 py-0.5 bg-muted text-muted-foreground"
                  >
                    {item.categoryLabel}
                  </Badge>
                  <span className="text-[11px] text-muted-foreground">
                    {item.date}
                  </span>
                </div>
              </div>

              <h3 className="text-base font-semibold text-foreground leading-snug hover:text-primary transition-colors">
                <Link
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-start gap-1 group"
                >
                  <span>{item.title}</span>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </h3>

              <p className="mt-2.5 text-sm text-muted-foreground leading-relaxed">
                {item.summary}
              </p>

              {item.keyTakeaways && item.keyTakeaways.length > 0 && (
                <div className="mt-3.5 space-y-1.5 rounded-lg bg-muted/40 p-3 text-xs">
                  <span className="font-semibold text-foreground/80 block mb-1">
                    Key Insights:
                  </span>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {item.keyTakeaways.map((takeaway) => (
                      <li key={takeaway} className="leading-snug">
                        {takeaway}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="mt-4 pt-3 border-t border-border/40 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">
                Post ID:{" "}
                <code className="font-mono text-[11px]">{item.id}</code>
              </span>
              <Link
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline inline-flex items-center gap-0.5"
              >
                <span>View on X</span>
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
