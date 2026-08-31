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
import { AlertCircle, Check, Languages } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface GoogleTranslateInstance {
  new (
    options: {
      pageLanguage: string;
      includedLanguages?: string;
      layout?: number;
      autoDisplay?: boolean;
      multilanguagePage?: boolean;
    },
    elementId: string,
  ): unknown;
}

declare global {
  interface Window {
    google?: {
      translate?: {
        TranslateElement: GoogleTranslateInstance;
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

const LANGUAGES = [
  { code: "original", label: "Original (Untranslated)" },
  { code: "en", label: "English" },
];

const STORAGE_KEY = "ai_feeds_translate_lang";

function setTranslateCookie(lang: string) {
  if (typeof document === "undefined") return;
  if (lang === "original") {
    document.cookie =
      "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;
  } else {
    document.cookie = `googtrans=/auto/${lang}; path=/;`;
    document.cookie = `googtrans=/auto/${lang}; path=/; domain=.${window.location.hostname};`;
  }
}

export function GoogleTranslateControl() {
  const [currentLang, setCurrentLang] = useState<string>("original");
  const [, setIsScriptLoaded] = useState<boolean>(false);
  const [isUnavailable, setIsUnavailable] = useState<boolean>(false);

  useEffect(() => {
    const markOutsideFeedAsNoTranslate = () => {
      const elements = document.querySelectorAll(
        'header, footer, nav, [role="banner"], [role="contentinfo"]',
      );
      for (const element of Array.from(elements)) {
        element.classList.add("notranslate");
        element.setAttribute("translate", "no");
      }
    };
    markOutsideFeedAsNoTranslate();

    // 从本地存储恢复语言
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && LANGUAGES.some((l) => l.code === saved)) {
        setCurrentLang(saved);
      }
    } catch {
      // 忽略本地存储访问失败
    }

    // 注册 Google Translate 初始化回调
    window.googleTranslateElementInit = () => {
      try {
        if (window.google?.translate?.TranslateElement) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: "auto",
              includedLanguages: "en",
              layout: 0,
              autoDisplay: false,
              multilanguagePage: true,
            },
            "google_translate_hidden_element",
          );
          setIsScriptLoaded(true);
          markOutsideFeedAsNoTranslate();
        }
      } catch (err) {
        console.warn("Google Translate init caught warning:", err);
      }
    };

    // 已加载脚本时避免重复插入
    if (document.getElementById("google-translate-script")) {
      setIsScriptLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.id = "google-translate-script";
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    script.onerror = () => {
      setIsUnavailable(true);
      console.info(
        "Google Translate script unavailable (retaining original feed text).",
      );
    };

    document.body.appendChild(script);

    const observer = new MutationObserver(markOutsideFeedAsNoTranslate);
    observer.observe(document.body, { childList: true, subtree: true });

    // 五秒后仍不可用则保留原文
    const timer = setTimeout(() => {
      if (!window.google?.translate) {
        setIsUnavailable(true);
      }
    }, 5000);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  const handleLanguageChange = useCallback((langCode: string) => {
    setCurrentLang(langCode);
    try {
      localStorage.setItem(STORAGE_KEY, langCode);
    } catch {
      // 忽略本地存储写入失败
    }

    setTranslateCookie(langCode);

    // 触发 Google Translate 内部选择框
    const select = document.querySelector<HTMLSelectElement>(".goog-te-combo");
    if (select) {
      select.value = langCode === "original" ? "" : langCode;
      select.dispatchEvent(new Event("change"));
    } else {
      // 内部控件尚未就绪时通过刷新应用 Cookie
      window.location.reload();
    }
  }, []);

  const currentLabel =
    LANGUAGES.find((l) => l.code === currentLang)?.label || "Original";

  return (
    <div className="notranslate flex items-center gap-2" translate="no">
      <div
        id="google_translate_hidden_element"
        className="hidden"
        aria-hidden="true"
      />

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
                onClick={() => handleLanguageChange(lang.code)}
                className="flex items-center justify-between text-xs py-2 cursor-pointer"
              >
                <span>{lang.label}</span>
                {isSelected && <Check className="h-3.5 w-3.5 text-primary" />}
              </DropdownMenuItem>
            );
          })}
          {isUnavailable && (
            <>
              <DropdownMenuSeparator />
              <div className="p-2 text-[11px] text-muted-foreground flex items-center gap-1.5 leading-tight">
                <AlertCircle className="h-3.5 w-3.5 shrink-0 text-amber-500" />
                <span>Google Translate offline. Original text displayed.</span>
              </div>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
