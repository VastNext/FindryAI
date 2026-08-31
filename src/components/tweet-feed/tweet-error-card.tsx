"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ExternalLink, Twitter } from "lucide-react";

interface TweetErrorCardProps {
  tweetId: string;
  errorMessage?: string;
}

export function TweetErrorCard({ tweetId, errorMessage }: TweetErrorCardProps) {
  const tweetUrl = `https://x.com/i/status/${tweetId}`;

  return (
    <Card className="flex flex-col justify-between p-5 rounded-2xl border border-border/70 bg-card/80 backdrop-blur-sm shadow-sm hover:border-primary/40 transition-colors">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted/60 text-foreground/80">
            <Twitter className="h-4 w-4 fill-current" />
          </div>
          <div>
            <span className="text-xs font-medium text-foreground/80 block">
              X (Twitter) Feed
            </span>
            <span className="text-[11px] text-muted-foreground font-mono">
              ID: {tweetId}
            </span>
          </div>
        </div>
      </div>

      <div className="my-2 space-y-1.5">
        <p className="text-sm text-foreground/90 font-medium">
          {errorMessage || "Tweet preview unavailable"}
        </p>
        <p className="text-xs text-muted-foreground leading-relaxed">
          The post may have restricted embedding, requires authentication, or is
          temporarily unreachable from the feed proxy.
        </p>
      </div>

      <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between">
        <span className="text-[11px] text-muted-foreground">Source: x.com</span>
        <Button
          variant="outline"
          size="sm"
          asChild
          className="h-8 gap-1.5 text-xs font-medium border-primary/30 hover:border-primary hover:bg-primary/5 hover:text-primary transition-all"
        >
          <a
            href={tweetUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`View tweet ${tweetId} on X`}
          >
            <span>View on X</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </Button>
      </div>
    </Card>
  );
}
