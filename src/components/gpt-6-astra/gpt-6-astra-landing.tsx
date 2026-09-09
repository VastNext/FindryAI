import Container from "@/components/container";
import { Icons } from "@/components/icons/icons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { siteConfig } from "@/config/site";
import {
  accessRoutes,
  agiTakes,
  benchmarks,
  capabilities,
  effortLadder,
  faqs,
  gpt6Astra,
  heroStats,
  sources,
  specs,
  tokenTips,
} from "@/data/gpt-6-astra";
import { cn } from "@/lib/utils";
import {
  ArrowDown,
  ArrowRight,
  Cloud,
  Code2,
  ExternalLink,
  MessageSquare,
  Quote,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

/* -------------------------------------------------------------------------
   Chapter Header Component: Replaces repetitive centered headers with
   clean, left-aligned technical chapter markers (Linear / Cursor style)
------------------------------------------------------------------------- */
function ChapterHeader({
  number,
  label,
  title,
  subtitle,
}: {
  number: string;
  label: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="flex flex-col gap-2 pb-2">
      <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest text-primary">
        <span>{number}</span>
        <span className="text-muted-foreground/40">/</span>
        <span>{label}</span>
      </div>
      <h2 className="font-bricolage text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        {title}
      </h2>
      {subtitle ? (
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

/* -------------------------------------------------------------------------
   Sticky Chapter Sub-Navigation: Solves "don't know there is a 2nd screen"
------------------------------------------------------------------------- */
function StickyChapterNav() {
  const chapters = [
    { href: "#overview", label: "Overview" },
    { href: "#access", label: "01 How to Try" },
    { href: "#benchmarks", label: "02 Benchmarks & AGI" },
    { href: "#cost-tokens", label: "03 Token Guide & Pricing" },
    { href: "#faq-sources", label: "04 FAQ & Sources" },
  ];

  return (
    <nav
      aria-label="Chapter navigation"
      className="sticky top-16 z-30 w-full border-b border-border/60 bg-background/85 py-2.5 backdrop-blur-md"
    >
      <Container>
        <div className="flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1 sm:gap-2">
            {chapters.map((ch) => (
              <a
                key={ch.href}
                href={ch.href}
                className="whitespace-nowrap rounded-lg px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {ch.label}
              </a>
            ))}
          </div>

          <a
            href={gpt6Astra.chatgptUrl}
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-1 text-xs font-semibold text-primary transition-opacity hover:opacity-80 sm:flex"
          >
            <span>Try on ChatGPT</span>
            <ExternalLink className="size-3" />
          </a>
        </div>
      </Container>
    </nav>
  );
}

/* -------------------------------------------------------------------------
   Hero Section: Compact, narrative-first, peeks into content below
------------------------------------------------------------------------- */
function Hero() {
  return (
    <section
      id="overview"
      className="scroll-mt-32 pt-8 pb-10 md:pt-12 md:pb-12"
    >
      <Container>
        <div className="flex flex-col gap-6">
          {/* Eyebrow & Badges */}
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge
              variant="outline"
              className="gap-1.5 rounded-full border-primary/30 bg-primary/5 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-primary"
            >
              <Sparkles className="size-3" />
              <span>Frontier Intelligence · Sep 2026</span>
            </Badge>
            <span className="text-xs text-muted-foreground">
              Official announcement by OpenAI
            </span>
          </div>

          {/* Title & Tagline */}
          <div className="space-y-3">
            <h1 className="font-bricolage text-3xl font-bold tracking-tight text-balance sm:text-5xl md:text-6xl">
              Try {gpt6Astra.name} —{" "}
              <span className="text-gradient_indigo-purple">
                {gpt6Astra.tagline}
              </span>
            </h1>
            <p className="max-w-3xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg">
              {gpt6Astra.heroSubtitle}
            </p>
          </div>

          {/* Actions Bar */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <a
              href={gpt6Astra.chatgptUrl}
              target="_blank"
              rel="noreferrer"
              className={cn(
                buttonVariants({ size: "default" }),
                "rounded-full px-6 font-semibold shadow-sm",
              )}
            >
              Try on ChatGPT
              <ExternalLink className="size-4" />
            </a>
            <a
              href="#access"
              className={cn(
                buttonVariants({ variant: "outline", size: "default" }),
                "rounded-full px-6",
              )}
            >
              How to Try
              <ArrowDown className="size-4" />
            </a>
            <a
              href="#cost-tokens"
              className={cn(
                buttonVariants({ variant: "ghost", size: "default" }),
                "gap-1.5 rounded-full px-4 text-muted-foreground hover:text-foreground",
              )}
            >
              <span>Token-Saving Guide</span>
              <ArrowDown className="size-3.5" />
            </a>
          </div>

          {/* At-a-glance Metric Strip: Bridges the Hero into the Dossier */}
          <div className="mt-4 grid grid-cols-2 gap-3 border-y border-border/60 py-5 sm:grid-cols-4">
            {heroStats.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-0.5 px-2">
                <span className="font-bricolage text-2xl font-bold text-foreground sm:text-3xl">
                  {stat.value}
                </span>
                <span className="text-xs text-muted-foreground">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------
   Chapter 1: Access Routes (#access)
------------------------------------------------------------------------- */
function ChapterAccess() {
  return (
    <section id="access" className="scroll-mt-32 py-10 md:py-14">
      <Container>
        <div className="flex flex-col gap-8">
          <ChapterHeader
            number="01"
            label="Access Routes"
            title="How to try GPT-6 Astra in minutes"
            subtitle="Three verified deployment routes. Choose the access point that fits your current toolchain."
          />

          <div className="grid gap-5 md:grid-cols-3">
            {accessRoutes.map((route, i) => (
              <div
                key={route.title}
                className="flex flex-col justify-between rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <route.icon className="size-5" />
                    </div>
                    <span className="font-mono text-xs font-semibold text-muted-foreground">
                      ROUTE 0{i + 1}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bricolage text-lg font-semibold text-foreground">
                      {route.title}
                    </h3>
                    <Badge
                      variant="secondary"
                      className="mt-1.5 text-xs font-normal"
                    >
                      {route.requirement}
                    </Badge>
                  </div>

                  <ol className="space-y-2 border-t border-border/40 pt-4 text-xs leading-relaxed text-muted-foreground">
                    {route.steps.map((step, idx) => (
                      <li key={step} className="flex gap-2">
                        <span className="font-mono font-semibold text-foreground">
                          {idx + 1}.
                        </span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/40 px-5 py-3 text-xs text-muted-foreground">
            <span>
              API requests require OpenAI's new Responses API. Custom
              temperature and top_p are rejected.
            </span>
            <a
              href={gpt6Astra.officialUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-foreground hover:text-primary hover:underline"
            >
              <span>Official Model Documentation</span>
              <ArrowRight className="size-3.5" />
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------
   Chapter 2: Benchmarks & The AGI Debate (#benchmarks)
------------------------------------------------------------------------- */
function ChapterBenchmarks() {
  return (
    <section id="benchmarks" className="scroll-mt-32 py-10 md:py-14">
      <Container>
        <div className="flex flex-col gap-8">
          <ChapterHeader
            number="02"
            label="Frontier Intelligence"
            title="Benchmarks & the AGI debate"
            subtitle="ARC-AGI-3 human parity, software engineering state-of-the-art, and what evaluators are actually saying."
          />

          {/* Benchmark Table Card */}
          <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
            <div className="border-b border-border/60 bg-muted/30 px-6 py-4">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Frontier Evaluation Matrix (September 2026)
              </span>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="border-border/60">
                  <TableHead className="w-[40%] font-semibold">
                    Benchmark
                  </TableHead>
                  <TableHead className="text-right font-semibold">
                    GPT-6 Astra
                  </TableHead>
                  <TableHead className="text-right font-semibold">
                    GPT-5.6 Sol
                  </TableHead>
                  <TableHead className="text-right font-semibold">
                    Competing Frontier
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {benchmarks.map((b) => (
                  <TableRow key={b.name} className="border-border/40">
                    <TableCell className="font-medium text-foreground">
                      {b.name}
                    </TableCell>
                    <TableCell className="text-right font-mono font-bold text-primary">
                      {b.astra}
                    </TableCell>
                    <TableCell className="text-right font-mono text-muted-foreground">
                      {b.sol}
                    </TableCell>
                    <TableCell className="text-right font-mono text-muted-foreground">
                      {b.other}
                      {b.otherLabel ? (
                        <span className="block text-[11px] text-muted-foreground/70">
                          {b.otherLabel}
                        </span>
                      ) : null}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="border-t border-border/40 bg-muted/10 px-6 py-3 text-xs leading-relaxed text-muted-foreground">
              ARC-AGI-3's 99.9% was recorded under the provider-adapter harness
              (62.7% under standard harness). Astra used 51.7% fewer actions per
              level than the median human tester across 96% of tested
              environments.
            </div>
          </div>

          {/* AGI Perspectives: Side-by-side Discourse */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Direct Quotes */}
            <div className="flex flex-col justify-between gap-4 rounded-2xl border border-border/60 bg-card p-6">
              <div className="space-y-4">
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Evaluator Testimonials
                </span>
                <div className="space-y-4 divide-y divide-border/40">
                  {agiTakes.map((take) => (
                    <div key={take.author} className="pt-3 first:pt-0">
                      <p className="text-sm font-medium italic text-foreground">
                        “{take.quote}”
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        —{" "}
                        <span className="font-semibold text-foreground">
                          {take.author}
                        </span>
                        , {take.role}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Is it AGI: Analytical stance */}
            <div className="flex flex-col justify-between gap-4 rounded-2xl border border-primary/25 bg-primary/5 p-6">
              <div className="space-y-3">
                <span className="font-mono text-xs font-semibold uppercase tracking-wider text-primary">
                  Critical Assessment · Is this AGI?
                </span>
                <h3 className="font-bricolage text-lg font-semibold text-foreground">
                  The boundary has shifted, but open-endedness remains
                </h3>
                <ul className="space-y-2.5 text-xs leading-relaxed text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="font-bold text-primary">•</span>
                    <span>
                      <strong className="text-foreground">
                        OpenAI perspective:
                      </strong>{" "}
                      Marketed as "a new generation of intelligence" and its
                      closest step toward AGI to date.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-primary">•</span>
                    <span>
                      <strong className="text-foreground">
                        ARC Prize perspective:
                      </strong>{" "}
                      Succeeded in demonstrating human parity on deterministic
                      interactive levels, but explicitly notes this is not a
                      proof of real-world open-ended AGI.
                    </span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-primary">•</span>
                    <span>
                      <strong className="text-foreground">
                        The consensus:
                      </strong>{" "}
                      A clear step-function leap in computer use and reasoning
                      efficiency.
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Capabilities Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((c) => (
              <div
                key={c.title}
                className="flex flex-col gap-2.5 rounded-2xl border border-border/60 bg-card p-5 transition-all hover:border-primary/40"
              >
                <div className="flex items-center justify-between">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <c.icon className="size-4" />
                  </div>
                  <Badge variant="outline" className="font-mono text-[11px]">
                    {c.metric}
                  </Badge>
                </div>
                <h4 className="font-bricolage text-base font-semibold text-foreground">
                  {c.title}
                </h4>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {c.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------
   Chapter 3: Cost Efficiency & Best Practices (#cost-tokens)
------------------------------------------------------------------------- */
function ChapterCostAndTokens() {
  return (
    <section id="cost-tokens" className="scroll-mt-32 py-10 md:py-14">
      <Container>
        <div className="flex flex-col gap-8">
          <ChapterHeader
            number="03"
            label="Economics & Practice"
            title="Token-saving guide & reasoning effort ladder"
            subtitle="Astra's $10/$50 token pricing makes configuration discipline essential. Here is how production teams cut per-task costs by up to 60%."
          />

          {/* Effort Ladder Table */}
          <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
            <div className="flex items-center justify-between border-b border-border/60 bg-muted/30 px-6 py-4">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Reasoning Effort Ladder (Artificial Analysis Index v4.2)
              </span>
              <span className="font-mono text-xs text-primary">
                Default: medium
              </span>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="border-border/60">
                  <TableHead className="w-[120px] font-semibold">
                    Tier
                  </TableHead>
                  <TableHead className="text-right font-semibold">
                    Score
                  </TableHead>
                  <TableHead className="text-right font-semibold">
                    Cost / Task
                  </TableHead>
                  <TableHead className="w-[50%] font-semibold">
                    When to Use
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {effortLadder.map((row) => (
                  <TableRow key={row.effort} className="border-border/40">
                    <TableCell className="font-mono font-semibold uppercase text-foreground">
                      {row.effort}
                      {row.effort === "medium" ? (
                        <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary">
                          SWEET SPOT
                        </span>
                      ) : null}
                    </TableCell>
                    <TableCell className="text-right font-mono font-semibold">
                      {row.score}
                    </TableCell>
                    <TableCell className="text-right font-mono font-semibold text-foreground">
                      {row.costPerTask}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {row.guidance}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="border-t border-border/40 bg-muted/10 px-6 py-3 text-xs leading-relaxed text-muted-foreground">
              Astra on <strong className="text-foreground">medium</strong>{" "}
              scores 52, outperforming GPT-5.6 Sol at max effort (51) while
              costing $0.09 less per task. Do not jump to high or max without
              measured failure data.
            </div>
          </div>

          {/* 6 Rules of Token Optimization */}
          <div>
            <div className="mb-4">
              <h3 className="font-bricolage text-lg font-semibold text-foreground">
                The 6 Rules of GPT-6 Astra Token Optimization
              </h3>
              <p className="text-xs text-muted-foreground">
                Actionable practices compiled from production deployments and
                developer benchmarks.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {tokenTips.map((tip, i) => (
                <div
                  key={tip.title}
                  className="flex flex-col gap-2 rounded-2xl border border-border/60 bg-card p-5 transition-all hover:border-primary/40"
                >
                  <div className="flex items-center gap-2">
                    <span className="flex size-5 items-center justify-center rounded-full bg-primary/10 font-mono text-[10px] font-bold text-primary">
                      {i + 1}
                    </span>
                    <h4 className="text-sm font-semibold text-foreground">
                      {tip.title}
                    </h4>
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {tip.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Specifications Matrix */}
          <div className="rounded-2xl border border-border/60 bg-card p-6">
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Technical Specifications Summary
            </span>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
              {specs.map((s) => (
                <div
                  key={s.label}
                  className="border-l-2 border-primary/30 pl-3"
                >
                  <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    {s.label}
                  </span>
                  <p className="font-bricolage text-sm font-semibold text-foreground">
                    {s.value}
                  </p>
                  {s.note ? (
                    <p className="text-[11px] text-muted-foreground">
                      {s.note}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------
   Chapter 4: FAQ & Primary Source References (#faq-sources)
   Unified 2-column layout to prevent separate sparse sections
------------------------------------------------------------------------- */
function ChapterFaqAndSources() {
  return (
    <section id="faq-sources" className="scroll-mt-32 py-10 md:py-14">
      <Container>
        <div className="flex flex-col gap-8">
          <ChapterHeader
            number="04"
            label="Inquiries & Evidence"
            title="Frequently asked questions & primary documentation"
            subtitle="Direct answers to operational queries alongside links to official deployment cards and independent benchmark reports."
          />

          <div className="grid gap-8 lg:grid-cols-12">
            {/* Left Column: FAQ Accordion (7 cols) */}
            <div className="lg:col-span-7">
              <Accordion
                type="single"
                collapsible
                className="w-full space-y-2.5"
              >
                {faqs.map((faq, index) => (
                  <AccordionItem
                    key={faq.question}
                    value={`faq-${index}`}
                    className="rounded-xl border border-border/60 bg-card px-4"
                  >
                    <AccordionTrigger className="text-left text-sm font-semibold text-foreground hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-xs leading-relaxed text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>

            {/* Right Column: Primary Sources Cards (5 cols) */}
            <div className="flex flex-col gap-3 lg:col-span-5">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Primary Documentation & Reports
              </span>
              <div className="flex flex-col gap-2.5">
                {sources.map((src) => (
                  <a
                    key={src.url}
                    href={src.url}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex flex-col gap-1 rounded-xl border border-border/60 bg-card p-3.5 transition-all hover:border-primary/40 hover:bg-muted/30"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-foreground group-hover:text-primary">
                        {src.label}
                      </span>
                      <ExternalLink className="size-3 text-muted-foreground transition-colors group-hover:text-primary" />
                    </div>
                    <p className="line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
                      {src.description}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------
   Closing Dossier Banner: Understated, coherent callout
------------------------------------------------------------------------- */
function ClosingBanner() {
  return (
    <section className="pt-6 pb-16 md:pb-24">
      <Container>
        <div className="rounded-3xl border border-border/70 bg-gradient-to-br from-indigo-500/10 via-background to-purple-500/10 p-8 text-center sm:p-12">
          <div className="mx-auto max-w-2xl space-y-4">
            <h2 className="font-bricolage text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Ready to explore GPT-6 Astra?
            </h2>
            <p className="text-sm leading-relaxed text-muted-foreground">
              OpenAI's most capable system is accessible today across ChatGPT
              Plus, Pro, Enterprise, and the Responses API.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a
                href={gpt6Astra.chatgptUrl}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  buttonVariants({ size: "default" }),
                  "rounded-full px-6 font-semibold",
                )}
              >
                Launch in ChatGPT
                <ExternalLink className="size-3.5" />
              </a>
              <Link
                href={siteConfig.url}
                className={cn(
                  buttonVariants({ variant: "outline", size: "default" }),
                  "rounded-full px-6",
                )}
              >
                Explore More AI Tools on Findry
              </Link>
            </div>
            <p className="pt-4 text-[11px] text-muted-foreground/80">
              Independent technical dossier published by Findry AI. GPT-6 Astra
              is a product of OpenAI.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

/* -------------------------------------------------------------------------
   Root Landing Component Assembly
------------------------------------------------------------------------- */
export function Gpt6AstraLanding() {
  return (
    <div className="relative flex w-full flex-col">
      <StickyChapterNav />
      <Hero />
      <ChapterAccess />
      <ChapterBenchmarks />
      <ChapterCostAndTokens />
      <ChapterFaqAndSources />
      <ClosingBanner />
    </div>
  );
}
