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
import { useEffect, useState } from "react";

interface GoogleTranslateConstructor {
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
  InlineLayout: { SIMPLE: number };
}

declare global {
  interface Window {
    google?: {
      translate?: {
        TranslateElement: GoogleTranslateConstructor;
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

const LANGUAGES = [
  { code: "original", label: "Original (Untranslated)" },
  { code: "en", label: "English" },
] as const;

const STORAGE_KEY = "ai_feeds_translate_lang";

function applyTranslateCookie(language: string) {
  const hostname = window.location.hostname;
  const expire = "expires=Thu, 01 Jan 1970 00:00:00 GMT";

  document.cookie = `googtrans=; path=/; ${expire}; domain=${hostname}`;
  document.cookie = `googtrans=; path=/; ${expire}; domain=.${hostname}`;
  document.cookie = `googtrans=; path=/; ${expire}`;

  if (language !== "original") {
    document.cookie = `googtrans=/auto/${language}; path=/`;
  }
}

function markTranslationScope() {
  const target = document.getElementById("translate-target");
  if (!target) return;

  const pageChrome = document.querySelectorAll(
    'header, footer, nav, [role="banner"], [role="contentinfo"]',
  );
  for (const element of Array.from(pageChrome)) {
    element.classList.add("notranslate");
    element.setAttribute("translate", "no");
  }

  for (const element of Array.from(target.querySelectorAll("article *"))) {
    const isTweetText = Boolean(element.closest("article p[lang]"));
    element.classList.toggle("notranslate", !isTweetText);
    element.setAttribute("translate", isTweetText ? "yes" : "no");
  }

  const overlays = document.querySelectorAll(
    '[role="menu"], [role="listbox"], [role="dialog"], [data-radix-popper-content-wrapper]',
  );
  for (const element of Array.from(overlays)) {
    element.classList.add("notranslate");
    element.setAttribute("translate", "no");
  }
}

export function GoogleTranslateControl() {
  const [currentLang, setCurrentLang] = useState("original");

  useEffect(() => {
    const savedLanguage = localStorage.getItem(STORAGE_KEY) || "original";
    setCurrentLang(savedLanguage);
    applyTranslateCookie(savedLanguage);

    const style = document.createElement("style");
    style.id = "google-translate-hide-ui-css";
    style.textContent = `
      .goog-te-banner-frame.skiptranslate,
      .goog-te-banner-frame,
      body > .skiptranslate,
      .goog-te-gadget-simple,
      .goog-te-gadget-icon { display: none !important; }
      #google_translate_hidden_element {
        position: fixed !important;
        left: -9999px !important;
        top: 0 !important;
        width: 1px !important;
        height: 1px !important;
        overflow: hidden !important;
        opacity: 0 !important;
        pointer-events: none !important;
      }
      body { top: 0 !important; }
    `;
    if (!document.getElementById(style.id)) document.head.appendChild(style);

    const originalTitle = document.title;
    const title = document.querySelector("head > title");
    title?.setAttribute("translate", "no");
    const titleObserver = title
      ? new MutationObserver(() => {
          if (document.title !== originalTitle) document.title = originalTitle;
        })
      : null;
    titleObserver?.observe(title as Node, {
      childList: true,
      characterData: true,
      subtree: true,
    });

    window.googleTranslateElementInit = () => {
      const TranslateElement = window.google?.translate?.TranslateElement;
      if (!TranslateElement) return;
      new TranslateElement(
        {
          pageLanguage: "auto",
          includedLanguages: "en",
          layout: TranslateElement.InlineLayout.SIMPLE,
          autoDisplay: false,
          multilanguagePage: true,
        },
        "google_translate_hidden_element",
      );
      markTranslationScope();
    };

    markTranslationScope();
    const target = document.getElementById("translate-target");
    let retranslateTimer: ReturnType<typeof setTimeout> | null = null;
    const observer = new MutationObserver((mutations) => {
      markTranslationScope();
      if (
        savedLanguage === "original" ||
        retranslateTimer ||
        !mutations.some((mutation) => mutation.addedNodes.length > 0)
      ) {
        return;
      }

      retranslateTimer = setTimeout(() => {
        retranslateTimer = null;
        const select =
          document.querySelector<HTMLSelectElement>(".goog-te-combo");
        if (!select) return;
        select.value = "";
        select.dispatchEvent(new Event("change"));
        setTimeout(() => {
          select.value = savedLanguage;
          select.dispatchEvent(new Event("change"));
        }, 1200);
      }, 1000);
    });
    if (target) observer.observe(target, { childList: true, subtree: true });

    if (!document.getElementById("google-translate-script")) {
      const script = document.createElement("script");
      script.id = "google-translate-script";
      script.src =
        "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      script.async = true;
      document.body.appendChild(script);
    } else if (window.google?.translate?.TranslateElement) {
      window.googleTranslateElementInit();
    }

    return () => {
      observer.disconnect();
      titleObserver?.disconnect();
      if (retranslateTimer) clearTimeout(retranslateTimer);
    };
  }, []);

  const currentLabel =
    LANGUAGES.find((language) => language.code === currentLang)?.label ||
    "Original";

  return (
    <div className="notranslate flex items-center gap-2" translate="no">
      <div id="google_translate_hidden_element" aria-hidden="true" />

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
              {currentLang === "original" ? "Original" : currentLabel}
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
          {LANGUAGES.map((language) => (
            <DropdownMenuItem
              key={language.code}
              onClick={() => {
                localStorage.setItem(STORAGE_KEY, language.code);
                applyTranslateCookie(language.code);
                window.location.reload();
              }}
              className="flex items-center justify-between text-xs py-2 cursor-pointer"
            >
              <span>{language.label}</span>
              {currentLang === language.code && (
                <Check className="h-3.5 w-3.5 text-primary" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
