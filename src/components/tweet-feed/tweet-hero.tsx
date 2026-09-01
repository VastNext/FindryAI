import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";
import { GoogleTranslateControl } from "./google-translate";

export function TweetHero() {
  return (
    <section
      className="notranslate relative w-full pt-6 pb-4 md:pt-10 md:pb-6"
      translate="no"
    >
      {/* 背景氛围光 */}
      <div className="absolute inset-0 -z-10 flex items-center justify-center overflow-hidden pointer-events-none">
        <div className="h-[280px] w-[550px] -rotate-12 rounded-full bg-gradient-to-tr from-primary/15 via-purple-500/10 to-indigo-500/10 blur-3xl opacity-70" />
      </div>

      <div className="flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto">
        <div className="flex items-center gap-2">
          <Badge
            variant="secondary"
            className="px-3 py-1 gap-1.5 text-xs font-medium bg-primary/10 text-primary border border-primary/20 hover:bg-primary/15 transition-colors rounded-full"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Daily X / Twitter Curation</span>
          </Badge>
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl text-balance">
          AI Daily Feeds
        </h1>

        <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-2xl text-balance leading-relaxed">
          Stay ahead with curated tweets, breakthroughs, and discussions across
          AI agents and the broader intelligence ecosystem.
        </p>

        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <GoogleTranslateControl />
        </div>
      </div>
    </section>
  );
}
