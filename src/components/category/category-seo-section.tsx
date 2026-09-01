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

/**
 * Zone 1（首屏顶部）：badge + 唯一 H1 + 一句话导语（40-80 词以内），
 * 不放长文，避免把工具网格推离首屏。
 */
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
    </div>
  );
}

interface CategorySeoSubnavProps {
  seo: CategorySeoDetail;
}

/**
 * Zone 2（网格前）：细分子分类导航。紧凑的 2x2 链接卡片，
 * 让用户和爬虫在浏览列表前即可进入细分落地页。
 */
export function CategorySeoSubnav({ seo }: CategorySeoSubnavProps) {
  const hasHighlights = seo.highlights && seo.highlights.length > 0;
  if (!hasHighlights) return null;

  return (
    <div className="space-y-4 mb-8">
      <div className="flex items-center gap-2 text-primary font-semibold text-sm">
        <LayersIcon className="h-4 w-4" />
        <span>Browse by use case</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {seo.highlights?.map((highlight) => (
          <Link
            key={highlight.title}
            href={highlight.href || "#"}
            className={cn(
              "group flex items-start gap-3 p-4 rounded-xl border bg-card/60 backdrop-blur-sm transition-all hover:border-primary/40 hover:shadow-sm",
              highlight.href && "cursor-pointer",
            )}
          >
            <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">
              <BarChart3Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <h3 className="font-semibold text-sm text-foreground flex items-center gap-1.5">
                {highlight.title}
                {highlight.href && (
                  <ArrowRightIcon className="h-3.5 w-3.5 text-muted-foreground/50 transition-all group-hover:text-primary group-hover:translate-x-0.5" />
                )}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {highlight.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

interface CategorySeoFooterProps {
  seo: CategorySeoDetail;
}

/**
 * Zone 3（网格下方）：深度内容区。
 * 顺序遵循目录页标准：About 长文 → FAQ → 相关分类出口。
 */
export function CategorySeoFooter({ seo }: CategorySeoFooterProps) {
  const hasIntro = seo.intro && seo.intro.length > 0;
  const hasFaqs = seo.faqs && seo.faqs.length > 0;
  const hasRelated = seo.relatedCategories && seo.relatedCategories.length > 0;

  if (!hasIntro && !hasFaqs && !hasRelated) {
    return null;
  }

  return (
    <div className="mt-16 space-y-12 border-t pt-12">
      {/* About：深度介绍长文 */}
      {hasIntro && (
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-2xl font-bold tracking-tight text-center">
            About {seo.h1}
          </h2>
          <div className="text-sm leading-relaxed text-muted-foreground space-y-3">
            {seo.intro.map((paragraph) => (
              <p key={paragraph.slice(0, 32)}>{paragraph}</p>
            ))}
          </div>
        </div>
      )}

      {/* FAQ：结构化数据对应的手风琴 */}
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

      {/* Related Categories：兄弟分类出口，防止走错类别的死胡同 */}
      {hasRelated && (
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-xl font-bold tracking-tight text-center">
            Explore Related Categories
          </h2>
          <div className="flex flex-wrap justify-center gap-2.5">
            {seo.relatedCategories?.map((rel) => (
              <Link
                key={rel.slug}
                href={`/category/${rel.slug}`}
                className="group inline-flex items-center gap-1.5 px-4 py-2 rounded-full border bg-card/60 text-sm text-muted-foreground transition-all hover:border-primary/40 hover:text-primary hover:shadow-sm"
              >
                {rel.name}
                <ArrowRightIcon className="h-3.5 w-3.5 opacity-50 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
