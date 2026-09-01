"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowUp } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  return (
    <div
      className={cn(
        "notranslate fixed bottom-8 right-6 md:bottom-10 md:right-10 z-40 transition-all duration-300 pointer-events-none",
        visible
          ? "opacity-100 translate-y-0 pointer-events-auto"
          : "opacity-0 translate-y-4",
      )}
      translate="no"
    >
      <Button
        variant="secondary"
        size="icon"
        onClick={scrollToTop}
        aria-label="Back to top"
        className="h-11 w-11 rounded-full shadow-lg border border-border/80 bg-background/90 backdrop-blur-md hover:bg-accent hover:text-accent-foreground hover:scale-105 active:scale-95 transition-all text-foreground"
      >
        <ArrowUp className="h-5 w-5" />
      </Button>
    </div>
  );
}
