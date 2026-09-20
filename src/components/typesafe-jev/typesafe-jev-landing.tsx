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
  accessRoutes,
  architectureInnovations,
  codeExamples,
  comparisonTable,
  corePrimitives,
  designPatterns,
  faqs,
  heroStats,
  interactiveScenarios,
  sources,
  typesafeJev,
} from "@/data/typesafe-jev";
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
  Layers,
  Network,
  Play,
  Scale,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Terminal,
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
  const chapters = [
    { href: "#overview", label: "Overview" },
    { href: "#primitives", label: "01 Primitives" },
    { href: "#architecture", label: "02 Architecture" },
    { href: "#patterns", label: "03 Patterns" },
    { href: "#code", label: "04 SDKs" },
    { href: "#comparison", label: "05 LLM vs Jev" },
    { href: "#simulator", label: "06 Playground" },
    { href: "#faq", label: "07 FAQ" },
  ];

  return (
    <nav
      aria-label="Chapter navigation"
      className="sticky top-16 z-30 w-full border-b border-border/60 bg-background/90 py-2 backdrop-blur-md"
    >
      <Container>
        <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1.5 overflow-hidden">
          <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
            {chapters.map((ch) => (
              <a
                key={ch.href}
                href={ch.href}
                className="whitespace-nowrap rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {ch.label}
              </a>
            ))}
          </div>
          <div className="hidden items-center gap-2 lg:flex">
            <Link
              href={typesafeJev.officialUrl}
              target="_blank"
              rel="noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "h-7 px-2.5 text-xs font-medium",
              )}
            >
              <span>TypeSafe Official</span>
              <ExternalLink className="ml-1 size-3" />
            </Link>
          </div>
        </div>
      </Container>
    </nav>
  );
}

export function TypesafeJevLanding() {
  const [activeScenarioId, setActiveScenarioId] = useState(
    interactiveScenarios[0].id,
  );
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  // Simple interactive cost calculator
  const [monthlyQueries, setMonthlyQueries] = useState<number>(500000);
  const [avgTokensPerQuery, setAvgTokensPerQuery] = useState<number>(800);

  const activeScenario =
    interactiveScenarios.find((s) => s.id === activeScenarioId) ||
    interactiveScenarios[0];

  // Calculations
  const totalInputTokensMillions =
    (monthlyQueries * avgTokensPerQuery) / 1000000;
  const jevCost = totalInputTokensMillions * 0.042;
  const traditionalLlmInputCost = totalInputTokensMillions * 3.0; // average $3/M
  const traditionalLlmOutputCost = (monthlyQueries * 150 * 15.0) / 1000000; // 150 output tokens @ $15/M
  const traditionalLlmTotalCost =
    traditionalLlmInputCost + traditionalLlmOutputCost;
  const savings = Math.max(0, traditionalLlmTotalCost - jevCost);
  const savingsPercentage =
    traditionalLlmTotalCost > 0
      ? Math.round((savings / traditionalLlmTotalCost) * 100)
      : 99;

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
              className="border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 gap-1.5 px-3 py-1 text-xs font-semibold"
            >
              <Flame className="size-3.5 fill-amber-500 text-amber-500 animate-pulse" />
              <span>2026 Frontier Paradigm · System One Decision Model</span>
            </Badge>
            <Badge variant="secondary" className="font-mono text-xs">
              Model: {typesafeJev.version}
            </Badge>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl text-balance max-w-4xl">
            TypeSafe Jev:{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              The First System One AI Decision Model
            </span>
          </h1>

          <p className="max-w-3xl text-balance text-base leading-relaxed text-muted-foreground sm:text-xl">
            {typesafeJev.description}
          </p>

          {/* Key Facts Pills */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs sm:text-sm text-muted-foreground/90 font-medium">
            <span className="flex items-center gap-1.5">
              <Sparkles className="size-4 text-indigo-500" />
              Founder: Diogo Almeida (Former OpenAI Researcher, Co-inventor of
              RLHF)
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              <DollarSign className="size-4 text-emerald-500" />
              $40M Seed led by DCVC
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="size-4 text-amber-500" />
              Released September 2026
            </span>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href={typesafeJev.consoleUrl}
              target="_blank"
              rel="noreferrer"
              className={cn(
                buttonVariants({ variant: "default", size: "lg" }),
                "gap-2 font-semibold shadow-md",
              )}
            >
              <span>Get Early Access API Key</span>
              <ArrowRight className="size-4" />
            </Link>

            <Link
              href={typesafeJev.blogUrl}
              target="_blank"
              rel="noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "gap-2",
              )}
            >
              <span>Read Research Announcement</span>
              <ExternalLink className="size-4" />
            </Link>

            <Link
              href={typesafeJev.vercelGatewayUrl}
              target="_blank"
              rel="noreferrer"
              className={cn(
                buttonVariants({ variant: "ghost", size: "lg" }),
                "gap-2 text-muted-foreground hover:text-foreground",
              )}
            >
              <span>Vercel AI Gateway Model</span>
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

      {/* Sticky Chapter Sub-Navigation */}
      <StickyChapterNav />

      {/* ----------------- Chapter 01: Core Primitives ----------------- */}
      <section id="primitives" className="flex flex-col gap-8 scroll-mt-28">
        <ChapterHeader
          number="CHAPTER 01"
          label="Three Core Primitives"
          title="Three Typed Primitives: Noul / Choice / Score"
          subtitle="Jev abandons open-ended text generation, distilling all software decisions into three discrete mathematical primitives evaluated in parallel with calibrated confidence."
        />

        <div className="grid gap-6 md:grid-cols-3">
          {corePrimitives.map((primitive) => {
            const Icon = primitive.icon;
            return (
              <Card
                key={primitive.name}
                className="flex flex-col justify-between border-border/80 transition-all hover:border-primary/40 hover:shadow-md"
              >
                <CardHeader>
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </div>
                    <Badge variant="outline" className="font-mono text-[11px]">
                      Typed Return
                    </Badge>
                  </div>
                  <CardTitle className="mt-3 text-lg font-bold">
                    {primitive.name} ({primitive.nameEn})
                  </CardTitle>
                  <CardDescription className="text-xs font-medium text-foreground/80">
                    {primitive.typeDesc}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 text-xs">
                  <p className="leading-relaxed text-muted-foreground">
                    {primitive.description}
                  </p>
                  <div className="rounded-md bg-muted/60 p-3 font-mono text-[11px] text-foreground">
                    <div className="text-muted-foreground/70 mb-1">
                      # Output Shape:
                    </div>
                    <code className="text-indigo-600 dark:text-indigo-400 break-all">
                      {primitive.outputShape}
                    </code>
                  </div>
                  <div className="rounded-md bg-zinc-950 p-3 text-zinc-200 font-mono text-[11px]">
                    <div className="text-zinc-500 mb-1">
                      {/* Example Definition */}
                    </div>
                    <pre className="overflow-x-auto whitespace-pre-wrap">
                      {primitive.exampleCode}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* ----------------- Chapter 02: Architecture & RLCD ----------------- */}
      <section id="architecture" className="flex flex-col gap-8 scroll-mt-28">
        <ChapterHeader
          number="CHAPTER 02"
          label="Architecture & RLCD"
          title="Under the Hood: RLCD & Non-Autoregressive Sampling"
          subtitle="Why is Jev 40x to 200x faster than traditional LLMs? Inside TypeSafe AI's breakthrough training paradigm and model topology."
        />

        <div className="grid gap-6 md:grid-cols-2">
          {architectureInnovations.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="flex gap-4 rounded-xl border border-border/80 bg-card p-5 shadow-xs transition-colors hover:border-primary/40"
              >
                <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <Icon className="size-6" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-bold text-foreground text-base sm:text-lg">
                      {item.title}
                    </h3>
                  </div>
                  <span className="font-mono text-xs text-primary/80">
                    {item.badge}
                  </span>
                  <p className="mt-1 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Deep Dive Callout Box */}
        <div className="rounded-2xl border border-indigo-500/30 bg-indigo-500/5 p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:gap-6">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md">
              <BrainCircuit className="size-6" />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-lg font-bold text-foreground sm:text-xl">
                The Jevons Paradox in Machine Decision-Making
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                Traditional LLMs trained developers to be token-frugal — asking
                fewer questions to avoid latency spikes and bloated API bills.
                Jev's parallel sampler drops the marginal cost of additional
                questions to near zero (Speculative Fan-out). Engineers can now
                dispatch 30+ business assertions in a single sub-100ms
                round-trip, turning automated intelligence into ubiquitous
                infrastructure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- Chapter 03: 5 Production Patterns ----------------- */}
      <section id="patterns" className="flex flex-col gap-8 scroll-mt-28">
        <ChapterHeader
          number="CHAPTER 03"
          label="Design Patterns"
          title="Five Production-Grade System Architecture Patterns"
          subtitle="How to integrate TypeSafe Jev into microservices, agent loops, RAG pipelines, and enterprise API gateways."
        />

        <div className="grid gap-6">
          {designPatterns.map((pattern) => {
            const Icon = pattern.icon;
            return (
              <div
                key={pattern.number}
                className="flex flex-col gap-4 rounded-xl border border-border/80 bg-card p-6 shadow-xs transition-all hover:border-primary/40 hover:shadow-md sm:flex-row sm:items-start sm:gap-6"
              >
                <div className="flex items-center gap-3 sm:flex-col sm:items-center sm:gap-1.5">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-6" />
                  </div>
                  <span className="font-mono text-xs font-bold text-muted-foreground">
                    PATTERN {pattern.number}
                  </span>
                </div>

                <div className="flex-1 flex flex-col gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-bold text-foreground">
                      {pattern.title}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-primary">
                    {pattern.tagline}
                  </p>

                  <div className="mt-2 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg bg-muted/40 p-3.5 text-xs">
                      <div className="font-semibold text-foreground/90 mb-1 flex items-center gap-1.5">
                        <span className="size-1.5 rounded-full bg-red-500" />
                        Traditional LLM Bottleneck:
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {pattern.scenario}
                      </p>
                    </div>
                    <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3.5 text-xs">
                      <div className="font-semibold text-emerald-700 dark:text-emerald-400 mb-1 flex items-center gap-1.5">
                        <CheckCircle2 className="size-3.5" />
                        Jev Optimization:
                      </div>
                      <p className="text-foreground/80 leading-relaxed">
                        {pattern.solution}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ----------------- Chapter 04: Code Implementations ----------------- */}
      <section id="code" className="flex flex-col gap-8 scroll-mt-28">
        <ChapterHeader
          number="CHAPTER 04"
          label="Developer Code Snippets"
          title="Full-Stack SDK Integration: TS / Python / LangChain / Vercel"
          subtitle="Jev offers developer-first SDKs supporting static type inference, decorator compilation, and agent middleware."
        />

        <Tabs defaultValue="typescript-sdk" className="w-full">
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

      {/* ----------------- Chapter 05: Comparison & Cost Calculator ----------------- */}
      <section id="comparison" className="flex flex-col gap-8 scroll-mt-28">
        <ChapterHeader
          number="CHAPTER 05"
          label="Benchmarks & ROI"
          title="Generative LLMs vs TypeSafe Jev: Full Comparison"
          subtitle="A comprehensive architectural, financial, and latency comparison between traditional LLMs and System One models."
        />

        {/* Detailed Comparison Table */}
        <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-xs">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[180px] font-bold text-foreground">
                  Dimension
                </TableHead>
                <TableHead className="w-[280px] font-bold text-muted-foreground">
                  Traditional Generative LLM (GPT-5/Claude)
                </TableHead>
                <TableHead className="w-[280px] font-bold text-primary">
                  TypeSafe Jev (System One)
                </TableHead>
                <TableHead className="font-bold text-foreground">
                  Architectural Impact
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comparisonTable.map((row) => (
                <TableRow
                  key={row.feature}
                  className="transition-colors hover:bg-muted/30"
                >
                  <TableCell className="font-semibold text-foreground text-xs sm:text-sm">
                    {row.feature}
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm text-muted-foreground">
                    {row.traditionalLlm}
                  </TableCell>
                  <TableCell className="text-xs sm:text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                    {row.typesafeJev}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground/90">
                    {row.whyItMatters}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Interactive Cost & Latency Savings Calculator */}
        <div className="rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-md">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Calculator className="size-5 text-primary" />
                <h3 className="text-lg font-bold text-foreground sm:text-xl">
                  Interactive Cost & Latency ROI Calculator
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Adjust monthly decision volume and average state token size to
                evaluate direct infrastructure savings:
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="monthly-queries-input"
                    className="text-xs font-semibold text-foreground flex justify-between"
                  >
                    <span>Monthly Decision Volume:</span>
                    <span className="font-mono text-primary font-bold">
                      {monthlyQueries.toLocaleString()} calls/mo
                    </span>
                  </label>
                  <input
                    id="monthly-queries-input"
                    type="range"
                    min="50000"
                    max="10000000"
                    step="50000"
                    value={monthlyQueries}
                    onChange={(e) => setMonthlyQueries(Number(e.target.value))}
                    className="w-full accent-primary"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                    <span>50K</span>
                    <span>10M</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="avg-tokens-input"
                    className="text-xs font-semibold text-foreground flex justify-between"
                  >
                    <span>Avg Input Tokens Per Query:</span>
                    <span className="font-mono text-primary font-bold">
                      {avgTokensPerQuery} Tokens
                    </span>
                  </label>
                  <input
                    id="avg-tokens-input"
                    type="range"
                    min="100"
                    max="8000"
                    step="100"
                    value={avgTokensPerQuery}
                    onChange={(e) =>
                      setAvgTokensPerQuery(Number(e.target.value))
                    }
                    className="w-full accent-primary"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                    <span>100</span>
                    <span>8,000</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 rounded-xl border border-primary/20 bg-primary/5 p-6 lg:w-[360px] shrink-0 text-center">
              <span className="text-xs font-medium text-muted-foreground">
                Estimated Monthly Savings
              </span>
              <div className="font-mono text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">
                ${Math.round(savings).toLocaleString()}
                <span className="text-sm font-normal text-muted-foreground">
                  {" "}
                  / mo
                </span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Badge
                  variant="default"
                  className="bg-emerald-600 hover:bg-emerald-600 text-xs"
                >
                  {savingsPercentage}% Cost Reduction
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Jev: ${jevCost.toFixed(2)}/mo
                </Badge>
              </div>
              <span className="text-[11px] text-muted-foreground/80">
                Traditional LLM Estimate: ~$
                {Math.round(traditionalLlmTotalCost).toLocaleString()}/mo
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- Chapter 06: Interactive Simulator ----------------- */}
      <section id="simulator" className="flex flex-col gap-8 scroll-mt-28">
        <ChapterHeader
          number="CHAPTER 06"
          label="Live Playground"
          title="Interactive Decision Playground"
          subtitle="Test how Jev simultaneously evaluates Boolean truth values, categorical classifications, and ordinal ratings on identical context in ~100ms."
        />

        <div className="flex flex-col gap-6 rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-lg">
          {/* Scenario Selector Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-border pb-4">
            <span className="text-xs font-bold text-muted-foreground mr-2">
              Preset Scenarios:
            </span>
            {interactiveScenarios.map((sc) => (
              <Button
                key={sc.id}
                variant={activeScenarioId === sc.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveScenarioId(sc.id)}
                className="gap-1.5 text-xs"
              >
                <Play className="size-3" />
                <span>{sc.name}</span>
                <span className="ml-1 opacity-70 text-[10px]">
                  ({sc.badge})
                </span>
              </Button>
            ))}
          </div>

          {/* Playground Simulation Display */}
          <div className="grid gap-6 lg:grid-cols-12">
            {/* Input State Panel */}
            <div className="flex flex-col gap-2 lg:col-span-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Input State Context
                </span>
                <Badge variant="outline" className="text-[10px] font-mono">
                  JSON / Text
                </Badge>
              </div>
              <div className="h-full rounded-xl bg-zinc-950 p-4 font-mono text-xs text-zinc-200 overflow-x-auto shadow-inner">
                <pre>{JSON.stringify(activeScenario.state, null, 2)}</pre>
              </div>
            </div>

            {/* Jev Parallel Output Panel */}
            <div className="flex flex-col gap-2 lg:col-span-7">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Zap className="size-3.5 text-amber-500" />
                  Jev Parallel Output (~92ms)
                </span>
                <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                  RLCD Calibrated
                </span>
              </div>

              <div className="flex flex-col gap-3">
                {activeScenario.questions.map((q) => (
                  <div
                    key={q.id}
                    className="flex flex-col gap-2 rounded-xl border border-border/80 bg-background/60 p-4 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs sm:text-sm text-foreground">
                        {q.label}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-bold text-primary">
                          Confidence {(q.confidence * 100).toFixed(1)}%
                        </span>
                        {q.probability !== undefined && (
                          <Badge
                            variant="secondary"
                            className="font-mono text-[10px]"
                          >
                            p = {(q.probability * 100).toFixed(1)}%
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="rounded-md bg-primary/10 px-2.5 py-1 font-mono text-xs font-bold text-primary">
                        {String(q.result)}
                      </div>
                      {q.details && (
                        <p className="text-xs text-muted-foreground leading-snug">
                          {q.details}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ----------------- Chapter 07: FAQs & Access Routes ----------------- */}
      <section id="faq" className="flex flex-col gap-10 scroll-mt-28">
        <div className="flex flex-col gap-8">
          <ChapterHeader
            number="CHAPTER 07"
            label="FAQ & Getting Started"
            title="Frequently Asked Questions (FAQ)"
            subtitle="Essential technical details, boundaries, and architectural guidance for deploying TypeSafe Jev."
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

        {/* Access Pathways */}
        <div className="flex flex-col gap-6 pt-6">
          <h3 className="text-xl font-bold text-foreground">
            Official Access Routes & SDK Channels
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {accessRoutes.map((route) => {
              const Icon = route.icon;
              return (
                <div
                  key={route.title}
                  className="flex flex-col justify-between rounded-xl border border-border/80 bg-card p-5 shadow-xs transition-colors hover:border-primary/40"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="size-4.5" />
                      </div>
                      <Badge variant="outline" className="text-[10px]">
                        {route.badge}
                      </Badge>
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-foreground">
                        {route.title}
                      </h4>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">
                        {route.requirement}
                      </p>
                    </div>
                    <ul className="mt-2 space-y-1.5 text-[11px] text-muted-foreground/90">
                      {route.steps.map((st) => (
                        <li key={st} className="flex items-start gap-1.5">
                          <span className="text-primary font-bold">›</span>
                          <span>{st}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sources & References */}
        <div className="flex flex-col gap-4 rounded-xl border border-border/60 bg-muted/30 p-6">
          <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
            <ExternalLink className="size-4 text-primary" />
            Official Documentation & Technical Citations
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
