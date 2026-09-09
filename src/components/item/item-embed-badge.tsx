"use client";

import { CopyButton } from "@/components/shared/copy-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { CheckIcon, Code2Icon, CopyIcon, SparklesIcon } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

interface ItemEmbedBadgeProps {
  itemName: string;
  itemSlug: string;
}

export default function ItemEmbedBadge({
  itemName,
  itemSlug,
}: ItemEmbedBadgeProps) {
  const [selectedFormat, setSelectedFormat] = useState<"markdown" | "html">(
    "html",
  );
  const [copied, setCopied] = useState(false);

  const itemUrl = `${siteConfig.url}/item/${itemSlug}`;
  const badgeDarkUrl = `${siteConfig.url}/badge.svg?theme=dark`;
  const badgeLightUrl = `${siteConfig.url}/badge.svg?theme=light`;

  const htmlCode = `<a href="${itemUrl}" target="_blank" rel="noopener noreferrer"><img src="${badgeDarkUrl}" alt="${itemName} on Findry AI" width="220" height="54" /></a>`;
  const markdownCode = `[![${itemName} on Findry AI](${badgeDarkUrl})](${itemUrl})`;

  const currentCode = selectedFormat === "html" ? htmlCode : markdownCode;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-muted/50 border border-border/60 rounded-xl p-5 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SparklesIcon className="size-4 text-indigo-500" />
          <h3 className="font-semibold text-sm">Featured Badge</h3>
        </div>
        <Badge variant="outline" className="text-xs text-muted-foreground">
          Embed Code
        </Badge>
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed">
        Are you the maker or a fan of {itemName}? Embed this badge on your
        website or README to show you&apos;re featured on Findry AI.
      </p>

      {/* Visual Preview */}
      <div className="flex justify-center p-3 bg-background/80 rounded-lg border border-border/40">
        <img
          src={badgeDarkUrl}
          alt={`${itemName} featured on Findry AI`}
          width={220}
          height={54}
          className="h-[46px] w-auto object-contain"
        />
      </div>

      {/* Format Selector & Snippet */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 bg-background p-0.5 rounded-md border border-border/50 text-xs">
            <button
              type="button"
              onClick={() => setSelectedFormat("html")}
              className={`px-2.5 py-1 rounded transition-colors ${
                selectedFormat === "html"
                  ? "bg-muted font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              HTML
            </button>
            <button
              type="button"
              onClick={() => setSelectedFormat("markdown")}
              className={`px-2.5 py-1 rounded transition-colors ${
                selectedFormat === "markdown"
                  ? "bg-muted font-medium text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Markdown
            </button>
          </div>

          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs flex items-center gap-1 px-2.5"
            onClick={handleCopy}
          >
            {copied ? (
              <>
                <CheckIcon className="size-3 text-emerald-500" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <CopyIcon className="size-3" />
                <span>Copy Code</span>
              </>
            )}
          </Button>
        </div>

        <div className="relative">
          <pre className="text-[11px] font-mono bg-zinc-950 text-zinc-300 p-2.5 rounded-md overflow-x-auto whitespace-pre-wrap break-all border border-zinc-800">
            {currentCode}
          </pre>
        </div>
      </div>
    </div>
  );
}
