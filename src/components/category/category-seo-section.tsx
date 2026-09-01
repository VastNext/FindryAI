import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import type { CategorySeoDetail } from "@/config/category-seo";
import { cn } from "@/lib/utils";
import {
  ArrowRightIcon,
  BarChart3Icon,
  CheckCircle2Icon,
  HelpCircleIcon,
  LayersIcon,
  SparklesIcon,
} from "lucide-react";
import Link from "next/link";

interface CategorySeoHeaderProps {
  seo: CategorySeoDetail;
}

export function CategorySeoHeader({ seo }: CategorySeoHeaderProps) {
  return (
    <div className="mx-auto max-w-4xl text-center space-y-4 mb-6">
      {seo.badge && (
        <div className="flex justify-center">
          <Badge
            variant="secondary"
            className="px-3 py-1 text-xs font-medium gap-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary"
          >
            <SparklesIcon className="h-3.5 w-3.5" />
            {seo.badge}
          </Badge>
        </div>
      )}

      <h1 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
        {seo.h1}
      </h1>

      <p className="text-base text-muted-foreground max-w-2xl mx-auto">
        {seo.subtitle}
      </p>

      {seo.intro && seo.intro.length > 0 && (
        <div className="pt-2 text-sm leading-relaxed text-muted-foreground/90 space-y-2 text-left bg-muted/30 border rounded-xl p-4 sm:p-5">
          {seo.intro.map((paragraph) => (
            <p key={paragraph.slice(0, 32)}>{paragraph}</p>
          ))}
        </div>
      )}
    </div>
  );
}

interface CategorySeoFooterProps {
  seo: CategorySeoDetail;
}

export function CategorySeoFooter({ seo }: CategorySeoFooterProps) {
  const hasHighlights = seo.highlights && seo.highlights.length > 0;
  const hasFaqs = seo.faqs && seo.faqs.length > 0;

  if (!hasHighlights && !hasFaqs) {
    return null;
  }

  return (
    <div className="mt-16 space-y-12 border-t pt-12">
      {/* Category Sub-domains / Highlights */}
      {hasHighlights && (
        <div className="space-y-6">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <div className="flex items-center justify-center gap-2 text-primary font-semibold text-sm">
              <LayersIcon className="h-4 w-4" />
              <span>Core Sub-Categories</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              Explore by Specialized Use Case
            </h2>
            <p className="text-sm text-muted-foreground">
              Find the exact tool tailored to your data workflow and technical
              stack.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {seo.highlights?.map((highlight) => (
              <Link
                key={highlight.title}
                href={highlight.href || "#"}
                className={cn(
                  "group p-5 rounded-xl border bg-card/60 backdrop-blur-sm space-y-2 transition-all hover:border-primary/40 hover:shadow-sm",
                  highlight.href && "cursor-pointer",
                )}
              >
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary">
                    <BarChart3Icon className="h-4 w-4" />
                  </div>
                  <h3 className="font-semibold text-base text-foreground flex-1">
                    {highlight.title}
                  </h3>
                  {highlight.href && (
                    <ArrowRightIcon className="h-4 w-4 text-muted-foreground/50 transition-all group-hover:text-primary group-hover:translate-x-0.5" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed pl-10">
                  {highlight.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Category FAQs (Rich Schema-backed accordion) */}
      {hasFaqs && (
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-primary font-semibold text-sm">
              <HelpCircleIcon className="h-4 w-4" />
              <span>Frequently Asked Questions</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight">
              Everything You Need to Know
            </h2>
            <p className="text-sm text-muted-foreground">
              Answers to the most common questions about selecting and using
              these tools.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full space-y-3">
            {seo.faqs?.map((faq) => (
              <AccordionItem
                key={faq.question}
                value={faq.question}
                className="border rounded-xl px-4 py-1 bg-card/40 data-[state=open]:bg-card/90 transition-colors"
              >
                <AccordionTrigger className="text-left font-medium text-sm sm:text-base hover:no-underline py-3">
                  <span className="flex items-center gap-2.5">
                    <CheckCircle2Icon className="h-4 w-4 text-primary shrink-0" />
                    {faq.question}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed pt-1 pb-4 pl-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
    </div>
  );
}
