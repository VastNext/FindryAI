"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, Languages } from "lucide-react";
import { useEffect } from "react";
import type { FeedTranslationLanguage } from "./translation-context";

const LANGUAGES = [
  { code: "original", label: "Original (Untranslated)" },
  { code: "en", label: "English" },
];

export const FEED_TRANSLATION_STORAGE_KEY = "ai_feeds_translate_lang";

interface GoogleTranslateControlProps {
  currentLang: FeedTranslationLanguage;
  onLanguageChange: (language: FeedTranslationLanguage) => void;
}

export function GoogleTranslateControl({
  currentLang,
  onLanguageChange,
}: GoogleTranslateControlProps) {
  useEffect(() => {
    try {
      localStorage.setItem(FEED_TRANSLATION_STORAGE_KEY, currentLang);
    } catch {
      // 忽略本地存储写入失败
    }
  }, [currentLang]);

  const currentLabel =
    LANGUAGES.find((l) => l.code === currentLang)?.label || "Original";

  return (
    <div className="notranslate flex items-center gap-2" translate="no">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-2 border-border/80 bg-background/80 backdrop-blur-sm hover:bg-accent hover:text-accent-foreground text-xs font-medium rounded-full px-3.5 shadow-sm transition-all"
            aria-label="Translate feeds"
          >
            <Languages className="h-3.5 w-3.5 text-primary" />
            <span>
              Translate:{" "}
              {currentLang === "original"
                ? "Original"
                : currentLabel.split(" ")[0]}
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-52 notranslate"
          translate="no"
        >
          <DropdownMenuLabel className="text-xs font-semibold text-muted-foreground">
            Feed Translation
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {LANGUAGES.map((lang) => {
            const isSelected = currentLang === lang.code;
            return (
              <DropdownMenuItem
                key={lang.code}
                onClick={() =>
                  onLanguageChange(lang.code as FeedTranslationLanguage)
                }
                className="flex items-center justify-between text-xs py-2 cursor-pointer"
              >
                <span>{lang.label}</span>
                {isSelected && <Check className="h-3.5 w-3.5 text-primary" />}
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
