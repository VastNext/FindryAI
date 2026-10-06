"use client";

import Container from "@/components/container";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  accessStages,
  codeExamples,
  comparisonTable,
  corePillars,
  faqs,
  frontierSafeguards,
  gemini4Argon,
  heroStats,
  pricingComparison,
  sources,
} from "@/data/gemini-4-argon";
import { cn } from "@/lib/utils";
import {
  Activity,
  ArrowRight,
  Bot,
  BrainCircuit,
  Calculator,
  CheckCircle2,
  Clock,
  Code2,
  Copy,
  Cpu,
  DollarSign,
  ExternalLink,
  FastForward,
  Filter,
  Flame,
  Globe2,
  Layers,
  Lock,
  Network,
  Play,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Terminal,
  Trophy,
  Video,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

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
      <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
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

function StickyChapterNav() {
  const [activeHash, setActiveHash] = useState("#overview");

  const chapters = [
    { href: "#overview", label: "Overview" },
    { href: "#pillars", label: "01 Core Pillars" },
    { href: "#benchmarks", label: "02 vs GPT & Claude" },
    { href: "#pricing", label: "03 Pricing & ROI" },
    { href: "#safeguards", label: "04 Safety & Fairwind" },
    { href: "#code", label: "05 SDKs & Code" },
    { href: "#faq", label: "06 FAQ & Sources" },
  ];

  return (
    <nav
      aria-label="Chapter navigation"
      className="sticky top-16 z-30 w-full border-b border-border/70 bg-background/95 py-2.5 backdrop-blur-md transition-all"
    >
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Segmented Pill Tabs Container */}
          <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 rounded-xl border border-border/80 bg-muted/70 p-1 shadow-2xs">
            {chapters.map((ch) => {
              const isActive = activeHash === ch.href;
              return (
                <a
                  key={ch.href}
                  href={ch.href}
                  onClick={() => setActiveHash(ch.href)}
                  className={cn(
                    "whitespace-nowrap rounded-lg px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-semibold transition-all duration-200",
                    isActive
                      ? "bg-background text-primary shadow-xs border border-border/60 font-bold"
                      : "text-muted-foreground hover:bg-background/60 hover:text-foreground",
                  )}
                >
                  {ch.label}
                </a>
              );
            })}
          </div>

          <div className="hidden items-center gap-2 xl:flex">
            <Link
              href={gemini4Argon.officialUrl}
              target="_blank"
              rel="noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "h-9 px-3.5 text-xs sm:text-sm font-semibold rounded-lg shadow-2xs border-border/80 hover:border-primary/40 hover:bg-primary/5 hover:text-primary transition-all",
              )}
            >
              <span>Google DeepMind Blog</span>
              <ExternalLink className="ml-1.5 size-3.5" />
            </Link>
          </div>
        </div>
      </Container>
    </nav>
  );
}

export function Gemini4ArgonLanding() {
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  // Interactive Cost Comparison Calculator
  const [outputTokensNeeded, setOutputTokensNeeded] = useState<number>(250000);
  const [inputTokensContext, setInputTokensContext] = useState<number>(500000);
  const [isCached, setIsCached] = useState<boolean>(true);

  // Calculations
  const argonInputRate = isCached ? 0.1 : 2.0;
  const argonCost =
    (inputTokensContext / 1000000) * argonInputRate +
    (outputTokensNeeded / 1000000) * 10.0;

  const opusInputRate = isCached ? 0.2 : 4.0;
  const opusCost =
    (inputTokensContext / 1000000) * opusInputRate +
    (outputTokensNeeded / 1000000) * 20.0;

  const astraInputRate = isCached ? 1.0 : 10.0;
  const astraCost =
    (inputTokensContext / 1000000) * astraInputRate +
    (outputTokensNeeded / 1000000) * 50.0;

  const savingsVsAstra = Math.max(0, astraCost - argonCost);
  const savingsPercentVsAstra =
    astraCost > 0 ? Math.round((savingsVsAstra / astraCost) * 100) : 80;

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  return (
    <div className="flex flex-col gap-16 pb-24">
      {/* ----------------- Hero Section ----------------- */}
      <section id="overview" className="relative pt-6 sm:pt-10">
        <div className="flex flex-col items-center text-center gap-6">
          {/* Header Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Badge
              variant="outline"
              className="border-blue-500/40 bg-blue-500/10 text-blue-600 dark:text-blue-400 gap-1.5 px-3 py-1 text-xs font-semibold"
            >
              <Sparkles className="size-3.5 fill-blue-500 text-blue-500 animate-pulse" />
              <span>Google DeepMind · Released Sep 30, 2026</span>
            </Badge>
            <Badge variant="secondary" className="font-mono text-xs">
              Model: {gemini4Argon.name}
            </Badge>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl text-balance max-w-4xl">
            Gemini 4 Argon:{" "}
            <span className="bg-gradient-to-r from-blue-600 via-cyan-600 to-indigo-600 bg-clip-text text-transparent">
              1M Output Tokens & Frontier Cyber Defense
            </span>
          </h1>

          <p className="max-w-3xl text-balance text-base leading-relaxed text-muted-foreground sm:text-xl">
            {gemini4Argon.description}
          </p>

          {/* Key Facts Pills */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs sm:text-sm text-muted-foreground/90 font-medium">
            <span className="flex items-center gap-1.5">
              <Cpu className="size-4 text-blue-500" />
              Chief Architect: Koray Kavukcuoglu (Google DeepMind)
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="size-4 text-emerald-500" />
              Fairwind Program: 650+ Cyber Defense Partners
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              <DollarSign className="size-4 text-amber-500" />
              $2/$10 Launch Pricing (50% of Opus 5.5)
            </span>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href={gemini4Argon.officialUrl}
              target="_blank"
              rel="noreferrer"
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "gap-2 font-semibold shadow-md",
              )}
            >
              <span>Read Official Announcement</span>
              <ArrowRight className="size-4" />
            </Link>

            <Link
              href="#benchmarks"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "gap-2",
              )}
            >
              <span>View vs GPT & Claude Benchmarks</span>
              <Trophy className="size-4" />
            </Link>

            <Link
              href="#pricing"
              className={cn(
                buttonVariants({ variant: "ghost", size: "lg" }),
                "gap-2 text-muted-foreground hover:text-foreground",
              )}
            >
              <span>Token Pricing Calculator</span>
            </Link>
          </div>

          {/* Hero Stats Grid */}
          <div className="grid w-full grid-cols-2 gap-3 pt-6 sm:grid-cols-4 sm:gap-4">
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center justify-center rounded-xl border border-border/70 bg-card/60 p-4 text-center shadow-xs backdrop-blur-xs transition-colors hover:border-primary/40 hover:bg-card"
              >
                <span className="font-mono text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl lg:text-4xl text-gradient_indigo-purple">
                  {stat.value}
                </span>
                <span className="mt-1 text-xs font-semibold text-foreground/90 sm:text-sm">
                  {stat.label}
                </span>
                {stat.sublabel && (
                  <span className="mt-0.5 text-[11px] text-muted-foreground">
                    {stat.sublabel}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sticky Chapter Navigation */}
      <StickyChapterNav />

      {/* ----------------- Chapter 01: Core Pillars ----------------- */}
      <section id="pillars" className="flex flex-col gap-8 scroll-mt-28">
        <ChapterHeader
          number="CHAPTER 01"
          label="Core Breakthroughs"
          title="Four Flagship Capabilities: Reasoning, Cyber, Code & Knowledge"
          subtitle="Gemini 4 Argon is purposefully engineered for sustained enterprise workflows where multi-step reasoning, massive generation capacity, and autonomous validation are critical."
        />

        <div className="grid gap-6 md:grid-cols-2">
          {corePillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <Card
                key={pillar.title}
                className="flex flex-col justify-between border-border/80 transition-all hover:border-primary/40 hover:shadow-md"
              >
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                      <Icon className="size-5" />
                    </div>
                    <Badge variant="outline" className="font-mono text-[11px]">
                      {pillar.badge}
                    </Badge>
                  </div>
                  <CardTitle className="mt-3 text-lg font-bold">
                    {pillar.title}
                  </CardTitle>
                  <CardDescription className="text-xs font-semibold text-primary">
                    Metric: {pillar.metric}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 text-xs">
                  <p className="leading-relaxed text-muted-foreground">
                    {pillar.description}
                  </p>
                  <div className="rounded-lg bg-muted/50 p-3.5 space-y-1.5">
                    <div className="font-semibold text-foreground text-[11px]">
                      Key Breakthroughs:
                    </div>
                    {pillar.highlights.map((hl) => (
                      <div
                        key={hl}
                        className="flex items-start gap-1.5 text-muted-foreground text-[11px]"
                      >
                        <CheckCircle2 className="size-3.5 text-blue-500 shrink-0 mt-0.5" />
                        <span>{hl}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* ----------------- Chapter 02: Benchmarks vs GPT & Claude ----------------- */}
      <section id="benchmarks" className="flex flex-col gap-8 scroll-mt-28">
        <ChapterHeader
          number="CHAPTER 02"
          label="Benchmark Showdown"
          title="Gemini 4 Argon vs GPT-6 Astra & Claude Opus 5.5"
          subtitle="Detailed head-to-head comparison across 12 rigorous industry benchmarks spanning coding, legal, finance, video understanding, and cybersecurity."
        />

        {/* Detailed Benchmark Table */}
        <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-xs">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[180px] font-bold text-foreground">
                  Benchmark & Domain
                </TableHead>
                <TableHead className="w-[130px] font-bold text-blue-600 dark:text-blue-400">
                  Gemini 4 Argon
                </TableHead>
                <TableHead className="w-[120px] font-bold text-foreground">
                  GPT-6 Astra
                </TableHead>
                <TableHead className="w-[120px] font-bold text-foreground">
                  Claude Opus 5.5
                </TableHead>
                <TableHead className="w-[120px] font-bold text-muted-foreground hidden sm:table-cell">
                  Claude Fable 5.1
                </TableHead>
                <TableHead className="font-bold text-foreground">
                  Analysis & Winner
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comparisonTable.map((row) => (
                <TableRow
                  key={row.benchmark}
                  className="transition-colors hover:bg-muted/30"
                >
                  <TableCell className="font-semibold text-foreground text-xs sm:text-sm">
                    <div>{row.benchmark}</div>
                    <div className="text-[10px] font-normal text-muted-foreground">
                      {row.category}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400">
                    {row.gemini4Argon}
                  </TableCell>
                  <TableCell className="font-mono text-xs sm:text-sm text-foreground">
                    {row.gpt6Astra}
                  </TableCell>
                  <TableCell className="font-mono text-xs sm:text-sm text-foreground">
                    {row.claudeOpus55}
                  </TableCell>
                  <TableCell className="font-mono text-xs sm:text-sm text-muted-foreground hidden sm:table-cell">
                    {row.claudeFable51}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      {row.winner === "argon" && (
                        <Badge
                          variant="default"
                          className="bg-blue-600 hover:bg-blue-600 text-[10px] h-5 px-1.5"
                        >
                          Argon SOTA
                        </Badge>
                      )}
                      {row.winner === "astra" && (
                        <Badge
                          variant="secondary"
                          className="text-[10px] h-5 px-1.5"
                        >
                          Astra Lead
                        </Badge>
                      )}
                      {row.winner === "opus" && (
                        <Badge
                          variant="secondary"
                          className="text-[10px] h-5 px-1.5"
                        >
                          Opus Lead
                        </Badge>
                      )}
                      {row.winner === "tie" && (
                        <Badge
                          variant="outline"
                          className="text-[10px] h-5 px-1.5"
                        >
                          Tied #1
                        </Badge>
                      )}
                      <span>{row.notes}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Deep Analysis Summary Callout */}
        <div className="rounded-2xl border border-border/80 bg-muted/40 p-6 sm:p-8">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                <Trophy className="size-4 text-blue-500" />
                <span>Where Argon Dominates</span>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Argon crushes knowledge work (Vals Index, Harvey Legal Agent
                19.6% vs 5.4%), Zapier automation (51.3%), multi-file software
                refactoring (DeepSWE 77.9%), and long-video parsing (LVBench
                91.7%).
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                <BrainCircuit className="size-4 text-purple-500" />
                <span>Where Astra Leads</span>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                GPT-6 Astra maintains competitive advantages on extreme
                algorithmic puzzles (FrontierSWE v2 65.5%) and direct screen
                computer-use GUI execution (OSWorld 2.0 72.6%).
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                <Terminal className="size-4 text-amber-500" />
                <span>Where Opus 5.5 Shines</span>
              </div>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Anthropic's Claude Opus 5.5 retains mastery over deep shell and
                CLI engineering automation (Terminal-Bench 4.0 66.4% vs Argon's
                57.4%).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- Chapter 03: Pricing & Cost Calculator ----------------- */}
      <section id="pricing" className="flex flex-col gap-8 scroll-mt-28">
        <ChapterHeader
          number="CHAPTER 03"
          label="Pricing & Economics"
          title="API Pricing & 1M Output ROI Calculator"
          subtitle="Argon introduces aggressive introductory pricing ($2 in / $10 out) with a 95% prompt caching discount, cutting enterprise inference bills by up to 80%."
        />

        {/* Pricing Table */}
        <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-xs">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="font-bold text-foreground">
                  Model & Provider
                </TableHead>
                <TableHead className="font-bold text-foreground">
                  Input / 1M
                </TableHead>
                <TableHead className="font-bold text-foreground">
                  Output / 1M
                </TableHead>
                <TableHead className="font-bold text-primary">
                  Cached Input / 1M
                </TableHead>
                <TableHead className="font-bold text-foreground">
                  Max Output Limit
                </TableHead>
                <TableHead className="font-bold text-muted-foreground">
                  Context Window
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pricingComparison.map((p) => (
                <TableRow
                  key={p.model}
                  className="transition-colors hover:bg-muted/30"
                >
                  <TableCell className="font-semibold text-foreground text-xs sm:text-sm">
                    <div>{p.model}</div>
                    <div className="text-[10px] text-muted-foreground">
                      {p.provider}
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-xs sm:text-sm">
                    {p.inputPrice}
                  </TableCell>
                  <TableCell className="font-mono text-xs sm:text-sm font-semibold">
                    {p.outputPrice}
                  </TableCell>
                  <TableCell className="font-mono text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    {p.cachedInputPrice}
                  </TableCell>
                  <TableCell className="font-mono text-xs sm:text-sm font-bold text-blue-600 dark:text-blue-400">
                    {p.maxOutputLimit}
                  </TableCell>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {p.contextWindow}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Interactive Generation Cost Calculator */}
        <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-md">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Calculator className="size-5 text-primary" />
                <h3 className="text-lg font-bold text-foreground sm:text-xl">
                  Long-Horizon Generation Cost Calculator
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Simulate large repository refactorings or comprehensive legal
                research runs to compare single-turn cost across frontier
                models:
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="input-tokens-input"
                    className="text-xs font-semibold text-foreground flex justify-between"
                  >
                    <span>Input Context Size:</span>
                    <span className="font-mono text-primary font-bold">
                      {inputTokensContext.toLocaleString()} Tokens
                    </span>
                  </label>
                  <input
                    id="input-tokens-input"
                    type="range"
                    min="50000"
                    max="1000000"
                    step="50000"
                    value={inputTokensContext}
                    onChange={(e) =>
                      setInputTokensContext(Number(e.target.value))
                    }
                    className="w-full accent-primary"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                    <span>50K</span>
                    <span>1M Tokens</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="output-tokens-input"
                    className="text-xs font-semibold text-foreground flex justify-between"
                  >
                    <span>Target Output Generation:</span>
                    <span className="font-mono text-primary font-bold">
                      {outputTokensNeeded.toLocaleString()} Tokens
                    </span>
                  </label>
                  <input
                    id="output-tokens-input"
                    type="range"
                    min="10000"
                    max="1000000"
                    step="10000"
                    value={outputTokensNeeded}
                    onChange={(e) =>
                      setOutputTokensNeeded(Number(e.target.value))
                    }
                    className="w-full accent-primary"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                    <span>10K</span>
                    <span>1M Tokens (Argon Full Trajectory)</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="cache-checkbox"
                  checked={isCached}
                  onChange={(e) => setIsCached(e.target.checked)}
                  className="rounded border-border accent-primary size-4"
                />
                <label
                  htmlFor="cache-checkbox"
                  className="text-xs text-muted-foreground cursor-pointer"
                >
                  Apply 95% Prompt Caching Discount on Input Tokens
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-3 rounded-xl border border-blue-500/20 bg-blue-500/5 p-6 lg:w-[360px] shrink-0 text-center">
              <span className="text-xs font-medium text-muted-foreground">
                Single Trajectory Cost Comparison
              </span>
              <div className="font-mono text-3xl sm:text-4xl font-extrabold text-blue-600 dark:text-blue-400">
                ${argonCost.toFixed(2)}
                <span className="text-sm font-normal text-muted-foreground">
                  {" "}
                  (Argon)
                </span>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs">
                <Badge variant="outline" className="font-mono">
                  Opus 5.5: ${opusCost.toFixed(2)}
                </Badge>
                <Badge variant="outline" className="font-mono">
                  Astra: ${astraCost.toFixed(2)}
                </Badge>
              </div>
              <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                Saves ${savingsVsAstra.toFixed(2)} ({savingsPercentVsAstra}%) vs
                GPT-6 Astra
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- Chapter 04: Safeguards & Fairwind Program ----------------- */}
      <section id="safeguards" className="flex flex-col gap-8 scroll-mt-28">
        <ChapterHeader
          number="CHAPTER 04"
          label="Safety & Access"
          title="The Fairwind Program & Frontier Safeguards"
          subtitle="Why Google is taking a phased rollout approach and partnering with global cybersecurity institutions."
        />

        <div className="grid gap-6 md:grid-cols-2">
          {frontierSafeguards.map((sf) => {
            const Icon = sf.icon;
            return (
              <div
                key={sf.title}
                className="flex gap-4 rounded-xl border border-border/80 bg-card p-5 shadow-xs transition-colors hover:border-primary/40"
              >
                <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Icon className="size-6" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-foreground text-base sm:text-lg">
                      {sf.title}
                    </h3>
                  </div>
                  <span className="font-mono text-xs text-primary/80">
                    {sf.category}
                  </span>
                  <p className="mt-1 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                    {sf.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Rollout Stages Pipeline */}
        <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8">
          <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Clock className="size-5 text-primary" />
            <span>Phased Access Roadmap</span>
          </h3>
          <div className="grid gap-4 md:grid-cols-3">
            {accessStages.map((st) => (
              <div
                key={st.stage}
                className={cn(
                  "flex flex-col justify-between rounded-xl border p-4 text-xs transition-all",
                  st.status === "active"
                    ? "border-emerald-500/40 bg-emerald-500/5 shadow-xs"
                    : "border-border/70 bg-muted/30",
                )}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-foreground text-sm">
                      {st.stage}
                    </span>
                    {st.status === "active" ? (
                      <Badge className="bg-emerald-600 text-[10px]">
                        Active Now
                      </Badge>
                    ) : st.status === "next" ? (
                      <Badge
                        variant="outline"
                        className="text-[10px] text-blue-500 border-blue-500/40"
                      >
                        Next Up
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[10px]">
                        Planned
                      </Badge>
                    )}
                  </div>
                  <span className="font-semibold text-primary">
                    {st.audience}
                  </span>
                  <p className="text-muted-foreground leading-relaxed">
                    {st.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------- Chapter 05: Code & SDK Integrations ----------------- */}
      <section id="code" className="flex flex-col gap-8 scroll-mt-28">
        <ChapterHeader
          number="CHAPTER 05"
          label="Developer SDKs"
          title="SDK Implementation: TypeScript / Python / Vertex AI"
          subtitle="Code snippets demonstrating how to allocate 1M token output budgets and thinking parameters in modern stacks."
        />

        <Tabs defaultValue="google-genai-ts" className="w-full">
          <div className="overflow-x-auto pb-2 no-scrollbar">
            <TabsList className="inline-flex h-11 items-center justify-start rounded-lg bg-muted p-1 text-muted-foreground">
              {codeExamples.map((example) => (
                <TabsTrigger
                  key={example.id}
                  value={example.id}
                  className="rounded-md px-3.5 py-1.5 text-xs font-semibold"
                >
                  {example.title}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {codeExamples.map((example) => (
            <TabsContent key={example.id} value={example.id} className="mt-4">
              <div className="relative rounded-xl border border-zinc-800 bg-zinc-950 p-4 sm:p-6 shadow-xl">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="size-3 rounded-full bg-red-500/80" />
                    <span className="size-3 rounded-full bg-yellow-500/80" />
                    <span className="size-3 rounded-full bg-green-500/80" />
                    <span className="ml-2 font-mono text-xs text-zinc-400">
                      Framework: {example.framework}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyCode(example.id, example.code)}
                    className="h-8 gap-1.5 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
                  >
                    {copiedCodeId === example.id ? (
                      <>
                        <CheckCircle2 className="size-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="size-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </Button>
                </div>

                <pre className="overflow-x-auto font-mono text-xs sm:text-sm leading-relaxed text-zinc-200">
                  <code>{example.code}</code>
                </pre>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </section>

      {/* ----------------- Chapter 06: FAQs & Sources ----------------- */}
      <section id="faq" className="flex flex-col gap-10 scroll-mt-28">
        <div className="flex flex-col gap-8">
          <ChapterHeader
            number="CHAPTER 06"
            label="FAQ & Verified Citations"
            title="Frequently Asked Questions (FAQ)"
            subtitle="Essential technical facts, deployment rules, and verified primary sources regarding Google's Gemini 4 Argon."
          />

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, idx) => (
              <AccordionItem key={faq.question} value={`item-${idx}`}>
                <AccordionTrigger className="text-left text-sm font-semibold text-foreground sm:text-base hover:no-underline">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Sources & References */}
        <div className="flex flex-col gap-4 rounded-xl border border-border/60 bg-muted/30 p-6">
          <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
            <ExternalLink className="size-4 text-primary" />
            Verified Documentation & Press Citations
          </h4>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sources.map((src) => (
              <Link
                key={src.url}
                href={src.url}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col gap-1 rounded-lg border border-border/50 bg-card/60 p-3 transition-colors hover:border-primary/40 hover:bg-card"
              >
                <span className="font-semibold text-xs text-foreground group-hover:text-primary transition-colors flex items-center justify-between">
                  <span>{src.label}</span>
                  <ExternalLink className="size-3 text-muted-foreground group-hover:text-primary" />
                </span>
                <span className="text-[11px] text-muted-foreground line-clamp-2">
                  {src.description}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
