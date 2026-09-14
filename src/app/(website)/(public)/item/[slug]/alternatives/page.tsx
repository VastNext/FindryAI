import ItemGrid from "@/components/item/item-grid";
import EmptyGrid from "@/components/shared/empty-grid";
import { HeaderSection } from "@/components/shared/header-section";
import { JsonLd } from "@/components/shared/json-ld";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { siteConfig } from "@/config/site";
import { urlForIcon } from "@/lib/image";
import { constructMetadata } from "@/lib/metadata";
import type {
  ItemWithAlternativesBySlugQueryResult,
  SponsorItemListQueryResult,
} from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  itemWithAlternativesBySlugQuery,
  sponsorItemListQuery,
} from "@/sanity/lib/queries";
import {
  ArrowLeftIcon,
  CheckCircle2Icon,
  ExternalLinkIcon,
  HelpCircleIcon,
  LayersIcon,
  SparklesIcon,
  ZapIcon,
} from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 172800; // 48 hours ISR cache

interface AlternativesPageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: AlternativesPageProps): Promise<Metadata | undefined> {
  const item = await sanityFetch<ItemWithAlternativesBySlugQueryResult>({
    query: itemWithAlternativesBySlugQuery,
    params: { slug: params.slug },
  });

  if (!item?.name) {
    return;
  }

  const primaryCategory = item.categories?.[0]?.name || "AI";
  const title = `Top ${item.name} Alternatives & Competitors (2026 Guide)`;
  const description = `Discover the best alternatives to ${item.name}. Compare features, pricing, free tiers, and top ${primaryCategory} competitors to find the perfect tool.`;
  const canonicalUrl = `${siteConfig.url}/item/${params.slug}/alternatives`;

  const ogImageUrl = new URL(`${siteConfig.url}/api/og`);
  ogImageUrl.searchParams.append("title", `${item.name} Alternatives`);
  ogImageUrl.searchParams.append(
    "description",
    `Top competitors and alternatives to ${item.name}`,
  );
  ogImageUrl.searchParams.append("type", "Alternatives");

  return constructMetadata({
    title,
    description,
    canonicalUrl,
    image: ogImageUrl.toString(),
  });
}

export default async function AlternativesPage({
  params,
}: AlternativesPageProps) {
  const [item, sponsorItems] = await Promise.all([
    sanityFetch<ItemWithAlternativesBySlugQueryResult>({
      query: itemWithAlternativesBySlugQuery,
      params: { slug: params.slug },
    }),
    sanityFetch<SponsorItemListQueryResult>({
      query: sponsorItemListQuery,
    }),
  ]);

  if (!item) {
    return notFound();
  }

  const iconProps = item.icon ? urlForIcon(item.icon) : null;
  const primaryCategory = item.categories?.[0];
  const alternatives = item.alternatives || [];
  const count = alternatives.length;

  const pageUrl = `${siteConfig.url}/item/${params.slug}/alternatives`;
  const itemUrl = `${siteConfig.url}/item/${params.slug}`;

  // Structured FAQs for SEO
  const faqs = [
    {
      question: `What is the best free alternative to ${item.name}?`,
      answer:
        alternatives.length > 0
          ? `Among the curated options, tools like ${alternatives
              .slice(0, 3)
              .map((a) => a.name)
              .join(
                ", ",
              )} offer competitive features, free tiers, or trial access depending on your workflow needs.`
          : `Explore our directory to find similar tools with generous free tiers matching ${item.name}'s capabilities.`,
    },
    {
      question: `Why should I consider alternatives to ${item.name}?`,
      answer: `Users commonly look for alternatives to ${item.name} to find better pricing plans, specialized niche features, higher privacy/self-hosting standards, or faster integrations with their existing toolstack.`,
    },
    {
      question: `How do I choose the right alternative to ${item.name}?`,
      answer:
        "Identify your core requirement—such as team collaboration, API access, cost efficiency, or specific workflow automation—and compare the options in our curated matrix above.",
    },
  ];

  const alternativesJsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: `Best ${item.name} Alternatives & Competitors`,
      description: `Explore top alternatives and competitors to ${item.name}.`,
      url: pageUrl,
      mainEntity: {
        "@type": "ItemList",
        itemListElement: alternatives.map((altItem, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: altItem.name,
          url: `${siteConfig.url}/item/${altItem.slug?.current}`,
        })),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: siteConfig.url,
        },
        ...(primaryCategory?.name && primaryCategory.slug?.current
          ? [
              {
                "@type": "ListItem",
                position: 2,
                name: primaryCategory.name,
                item: `${siteConfig.url}/category/${primaryCategory.slug.current}`,
              },
            ]
          : []),
        {
          "@type": "ListItem",
          position: primaryCategory ? 3 : 2,
          name: item.name,
          item: itemUrl,
        },
        {
          "@type": "ListItem",
          position: primaryCategory ? 4 : 3,
          name: "Alternatives",
          item: pageUrl,
        },
      ],
    },
  ];

  return (
    <div className="flex flex-col gap-12 max-w-6xl mx-auto">
      <JsonLd data={alternativesJsonLd} />

      {/* Header */}
      <div className="flex flex-col items-center justify-center text-center gap-6 pt-4">
        <div className="flex items-center gap-3 bg-muted/60 px-4 py-2 rounded-full border border-border/60">
          {iconProps && (
            <Image
              src={iconProps.src}
              alt={item.icon?.alt || `icon of ${item.name}`}
              width={24}
              height={24}
              className="rounded-md object-cover"
            />
          )}
          <span className="text-sm font-semibold tracking-wide text-foreground">
            {item.name}
          </span>
          {primaryCategory && (
            <Badge variant="secondary" className="text-xs font-normal">
              {primaryCategory.name}
            </Badge>
          )}
        </div>

        <HeaderSection
          labelAs="h1"
          label="Tool Comparison"
          titleAs="h2"
          title={`Top ${count > 0 ? `${count}+ ` : ""}${item.name} Alternatives & Competitors`}
          subtitle={`Looking for alternatives to ${item.name}? Compare curated competitors, feature sets, pricing models, and capabilities to find the right fit for your workflow.`}
        />

        <div className="flex flex-wrap justify-center gap-3">
          <Button variant="outline" size="sm" asChild>
            <Link
              href={`/item/${params.slug}`}
              className="flex items-center gap-2"
            >
              <ArrowLeftIcon className="size-4" />
              <span>Back to {item.name} Overview</span>
            </Link>
          </Button>

          {item.link && (
            <Button variant="ghost" size="sm" asChild>
              <Link
                href={item.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
              >
                <span>Visit Official Site</span>
                <ExternalLinkIcon className="size-3.5" />
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Comparison Table Section (High Information Gain for SEO) */}
      {alternatives.length > 0 && (
        <section className="bg-muted/30 border border-border/60 rounded-2xl p-6 lg:p-8 flex flex-col gap-6">
          <div className="flex items-center gap-2.5">
            <LayersIcon className="size-5 text-indigo-500" />
            <h2 className="text-xl font-bold tracking-tight">
              Quick Comparison: {item.name} vs. Alternatives
            </h2>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border/60 bg-background/80">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[220px]">Tool Name</TableHead>
                  <TableHead>Pricing Model</TableHead>
                  <TableHead>Categories / Focus</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {/* Target Item Row */}
                <TableRow className="bg-indigo-50/50 dark:bg-indigo-950/20 font-medium">
                  <TableCell className="font-semibold flex items-center gap-2">
                    {iconProps && (
                      <Image
                        src={iconProps.src}
                        alt={`icon of ${item.name}`}
                        width={20}
                        height={20}
                        className="rounded object-cover"
                      />
                    )}
                    <span>{item.name}</span>
                    <Badge
                      variant="outline"
                      className="text-[10px] px-1.5 py-0 border-indigo-500/40 text-indigo-600 dark:text-indigo-400"
                    >
                      Baseline
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="capitalize text-xs">
                      {item.pricePlan || "Free / Freemium"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {item.categories?.map((c) => c.name).join(", ") ||
                      "AI Tool"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      asChild
                      className="h-8 text-xs"
                    >
                      <Link href={`/item/${params.slug}`}>View</Link>
                    </Button>
                  </TableCell>
                </TableRow>

                {/* Alternatives Rows */}
                {alternatives.slice(0, 8).map((alt) => (
                  <TableRow key={alt._id}>
                    <TableCell className="font-medium flex items-center gap-2">
                      <Link
                        href={`/item/${alt.slug?.current}`}
                        className="hover:underline text-foreground"
                      >
                        {alt.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize text-xs">
                        {alt.pricePlan || "Free"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-xs">
                      {alt.categories?.map((c) => c.name).join(", ") ||
                        alt.tags
                          ?.map((t) => t.name)
                          .slice(0, 2)
                          .join(", ") ||
                        "AI Tool"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        asChild
                        className="h-8 text-xs"
                      >
                        <Link href={`/item/${alt.slug?.current}`}>Explore</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      )}

      {/* Analytical Section: Why Look for Alternatives? */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border/60 rounded-xl p-6 flex flex-col gap-3">
          <div className="size-9 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
            <ZapIcon className="size-5" />
          </div>
          <h3 className="font-semibold text-base">
            Cost & Pricing Flexibility
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Different tools offer varying tiers, usage credits, or open-source
            self-hosted options that may significantly reduce operating costs.
          </p>
        </div>

        <div className="bg-card border border-border/60 rounded-xl p-6 flex flex-col gap-3">
          <div className="size-9 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <CheckCircle2Icon className="size-5" />
          </div>
          <h3 className="font-semibold text-base">Specialized Features</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            While {item.name} excels in its core strengths, certain alternatives
            may provide tailored workflows or deeper niche features.
          </p>
        </div>

        <div className="bg-card border border-border/60 rounded-xl p-6 flex flex-col gap-3">
          <div className="size-9 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
            <SparklesIcon className="size-5" />
          </div>
          <h3 className="font-semibold text-base">Ecosystem & Integration</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Finding a tool that natively connects with your existing tech stack
            (Slack, Notion, GitHub, APIs) can streamline team productivity.
          </p>
        </div>
      </section>

      {/* Grid of Alternatives */}
      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between border-b pb-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              All Curated Alternatives ({count})
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Browse the complete list of verified tools similar to {item.name}.
            </p>
          </div>
        </div>

        <div>
          {alternatives.length === 0 ? (
            <EmptyGrid />
          ) : (
            <ItemGrid
              items={alternatives}
              sponsorItems={sponsorItems || []}
              showSponsor={true}
            />
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-muted/40 border border-border/60 rounded-2xl p-6 lg:p-8 flex flex-col gap-6 my-4">
        <div className="flex items-center gap-2.5">
          <HelpCircleIcon className="size-5 text-indigo-500" />
          <h2 className="text-xl font-bold tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {faqs.map((faq) => (
            <div
              key={faq.question}
              className="bg-background/90 border border-border/50 rounded-xl p-5 flex flex-col gap-2"
            >
              <h3 className="font-semibold text-sm text-foreground">
                {faq.question}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
