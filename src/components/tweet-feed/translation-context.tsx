"use client";

import { createContext, useContext } from "react";

export type FeedTranslationLanguage = "original" | "en";

export const FeedTranslationContext =
  createContext<FeedTranslationLanguage>("original");

export function useFeedTranslationLanguage() {
  return useContext(FeedTranslationContext);
}
