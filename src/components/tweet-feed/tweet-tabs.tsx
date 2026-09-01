"use client";

import { cn } from "@/lib/utils";
import { Bot, Cpu, Layers } from "lucide-react";
import type { FeedTab } from "./types";

interface TweetTabsProps {
  activeTab: FeedTab;
  onTabChange: (tab: FeedTab) => void;
  counts: {
    all: number;
    openclaw: number;
    hermes: number;
  };
}

const TAB_CONFIGS: {
  key: FeedTab;
  label: string;
  icon: typeof Layers;
}[] = [
  { key: "all", label: "All Feeds", icon: Layers },
  { key: "openclaw", label: "OpenClaw", icon: Cpu },
  { key: "hermes", label: "Hermes Agent", icon: Bot },
];

export function TweetTabs({ activeTab, onTabChange, counts }: TweetTabsProps) {
  return (
    <div
      className="notranslate w-full flex items-center justify-center my-6"
      translate="no"
    >
      <div
        role="tablist"
        aria-label="Feed Channels"
        className="inline-flex items-center gap-1.5 p-1.5 rounded-2xl bg-muted/70 backdrop-blur-md border border-border/60 shadow-inner max-w-full overflow-x-auto"
      >
        {TAB_CONFIGS.map((tab) => {
          const isActive = activeTab === tab.key;
          const Icon = tab.icon;
          const count = counts[tab.key];

          return (
            <button
              type="button"
              key={tab.key}
              role="tab"
              id={`tab-${tab.key}`}
              aria-selected={isActive}
              aria-controls="translate-target"
              onClick={() => onTabChange(tab.key)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary select-none whitespace-nowrap",
                isActive
                  ? "bg-background text-foreground shadow-sm font-semibold border border-border/40"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/40",
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4",
                  isActive ? "text-primary" : "text-muted-foreground",
                )}
              />
              <span>{tab.label}</span>
              {count > 0 && (
                <span
                  className={cn(
                    "ml-0.5 px-1.5 py-0.5 text-[10px] font-mono rounded-full",
                    isActive
                      ? "bg-primary/10 text-primary font-semibold"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
