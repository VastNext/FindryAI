import { Badge } from "@/components/ui/badge";
import type { CuratedItemData } from "@/data/item-curated/fakeface";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  DollarSign,
  HelpCircle,
  Layers,
  Sparkles,
  Zap,
} from "lucide-react";
import Link from "next/link";

interface ItemCuratedDossierProps {
  data: CuratedItemData;
}

export function ItemCuratedDossier({ data }: ItemCuratedDossierProps) {
  return (
    <section
      aria-label={`${data.name} Editorial Dossier & Practical Analysis`}
      className="mt-10 flex flex-col gap-10 rounded-2xl border border-primary/20 bg-card/70 p-6 md:p-8 shadow-sm backdrop-blur-sm"
    >
      {/* Dossier Header */}
      <div className="border-b border-border/60 pb-6">
        <div className="flex items-center gap-2 mb-2">
          <Badge
            variant="secondary"
            className="px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary border border-primary/20 rounded-full"
          >
            <Sparkles className="h-3 w-3 mr-1" />
            Verified Editorial Dossier
          </Badge>
          <span className="text-xs text-muted-foreground">
            In-Depth Hands-On Analysis
          </span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {data.name} In-Depth Review & Feature Breakdown
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
          {data.tagline}
        </p>
      </div>

      {/* Capabilities Breakdown */}
      <div>
        <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" />
          <span>Core Capabilities & Performance</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.keyCapabilities.map((cap) => (
            <div
              key={cap.title}
              className="rounded-xl border border-border/60 bg-background/80 p-4 shadow-sm"
            >
              <h4 className="font-semibold text-sm text-foreground">
                {cap.title}
              </h4>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                {cap.description}
              </p>
              <div className="mt-3 pt-2.5 border-t border-border/40 text-[11px] text-primary flex items-center gap-1 font-medium">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                <span>{cap.highlight}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing & Free Quota Breakdown */}
      <div className="rounded-xl border border-border/60 bg-muted/20 p-5">
        <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-emerald-500" />
          <span>Pricing, Free Trial & Watermark Terms</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          <div className="rounded-lg bg-card p-3 border border-border/50">
            <span className="text-xs text-muted-foreground block">
              Free Trial
            </span>
            <span className="text-sm font-semibold text-foreground mt-0.5 block">
              {data.realPricingOverview.freeTrial}
            </span>
          </div>
          <div className="rounded-lg bg-card p-3 border border-border/50">
            <span className="text-xs text-muted-foreground block">
              Starting Tier
            </span>
            <span className="text-sm font-semibold text-foreground mt-0.5 block">
              {data.realPricingOverview.starterPaid}
            </span>
          </div>
          <div className="rounded-lg bg-card p-3 border border-border/50">
            <span className="text-xs text-muted-foreground block">
              Billing Model
            </span>
            <span className="text-sm font-semibold text-foreground mt-0.5 block">
              {data.realPricingOverview.creditsSystem}
            </span>
          </div>
          <div className="rounded-lg bg-card p-3 border border-border/50">
            <span className="text-xs text-muted-foreground block">
              Watermark Rules
            </span>
            <span className="text-sm font-semibold text-emerald-600 mt-0.5 block">
              {data.realPricingOverview.watermarkPolicy}
            </span>
          </div>
        </div>
      </div>

      {/* Comparison Matrix */}
      <div>
        <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <Layers className="h-5 w-5 text-primary" />
          <span>How {data.name} Compares to Alternatives</span>
        </h3>
        <div className="overflow-x-auto rounded-xl border border-border/70 bg-background">
          <table className="w-full text-left text-xs border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b border-border/70 bg-muted/40 text-muted-foreground">
                <th className="p-3 font-semibold text-foreground">Feature</th>
                <th className="p-3 font-semibold text-primary">{data.name}</th>
                <th className="p-3 font-semibold">Remaker AI</th>
                <th className="p-3 font-semibold">DeepSwap</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {data.comparisonWithCompetitors.map((row) => (
                <tr key={row.feature} className="hover:bg-muted/20">
                  <td className="p-3 font-medium text-foreground">
                    {row.feature}
                  </td>
                  <td className="p-3 font-semibold text-foreground">
                    {row.fakeface}
                  </td>
                  <td className="p-3 text-muted-foreground">{row.remaker}</td>
                  <td className="p-3 text-muted-foreground">{row.deepswap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div>
        <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
          <HelpCircle className="h-5 w-5 text-primary" />
          <span>Frequently Asked Questions about {data.name}</span>
        </h3>
        <div className="space-y-3">
          {data.faqs.map((faq) => (
            <div
              key={faq.question}
              className="rounded-xl border border-border/60 bg-background/80 p-4"
            >
              <h4 className="font-semibold text-sm text-foreground">
                {faq.question}
              </h4>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Cross-linking to Cluster Guides */}
      <div className="rounded-xl border border-primary/20 bg-primary/5 p-6">
        <h4 className="font-bold text-sm text-foreground mb-1">
          Explore Related Face Swap Formats &amp; In-Depth Guides
        </h4>
        <p className="text-xs text-muted-foreground mb-4">
          Compare broader categories and discover dedicated playbooks for
          animated GIFs and motion video face tracking:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.recommendedGuides.map((guide) => (
            <Link
              key={guide.href}
              href={guide.href}
              className="flex flex-col justify-between p-4 rounded-lg border border-border/70 bg-card hover:border-primary/50 hover:shadow-sm transition-all group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors">
                    {guide.title}
                  </span>
                  <Badge
                    variant="secondary"
                    className="text-[10px] px-1.5 py-0"
                  >
                    {guide.badge}
                  </Badge>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {guide.description}
                </p>
              </div>
              <div className="mt-3 text-[11px] font-semibold text-primary inline-flex items-center gap-1">
                <span>View Full Guide</span>
                <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
