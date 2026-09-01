export type FeedTab = "all" | "openclaw" | "hermes";

export interface TweetFeedData {
  all: string[];
  openclaw: string[];
  hermes: string[];
}

export interface TabConfig {
  key: FeedTab;
  label: string;
  badge?: string;
  description: string;
}
