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
    { href: "#overview", label: "概览" },
    { href: "#primitives", label: "01 核心基元" },
    { href: "#architecture", label: "02 RLCD 架构" },
    { href: "#patterns", label: "03 生产设计模式" },
    { href: "#code", label: "04 多框架实战" },
    { href: "#comparison", label: "05 LLM 全面对比" },
    { href: "#simulator", label: "06 交互模拟器" },
    { href: "#faq", label: "07 FAQ 与信源" },
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
                className="whitespace-nowrap rounded-md px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {ch.label}
              </a>
            ))}
          </div>
          <div className="hidden items-center gap-2 md:flex">
            <Link
              href={typesafeJev.officialUrl}
              target="_blank"
              rel="noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "h-7 text-xs",
              )}
            >
              <span>TypeSafe 官网</span>
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
              <span>2026 前沿新范式 · System One 决策模型</span>
            </Badge>
            <Badge variant="secondary" className="font-mono text-xs">
              Model: {typesafeJev.version}
            </Badge>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl text-balance max-w-4xl">
            TypeSafe Jev:{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              彻底告别文本生成的系统一 AI 决策引擎
            </span>
          </h1>

          <p className="max-w-3xl text-balance text-base leading-relaxed text-muted-foreground sm:text-xl">
            {typesafeJev.description}
          </p>

          {/* Key Facts Pills */}
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs sm:text-sm text-muted-foreground/90 font-medium">
            <span className="flex items-center gap-1.5">
              <Sparkles className="size-4 text-indigo-500" />
              创始人：Diogo Almeida (前 OpenAI RLHF 联合发明人)
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              <DollarSign className="size-4 text-emerald-500" />
              DCVC 领投 $40M 种子轮融资
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="size-4 text-amber-500" />
              2026 年 9 月正式发布上线
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
              <span>立即申请官方 API 体验</span>
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
              <span>阅读官方发布论文</span>
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
              <span>Vercel AI Gateway 直连</span>
            </Link>
          </div>

          {/* Hero Stats Grid */}
          <div className="grid w-full grid-cols-2 gap-3 pt-6 sm:grid-cols-4 sm:gap-4">
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center justify-center rounded-xl border border-border/70 bg-card/60 p-4 text-center shadow-xs backdrop-blur-xs transition-colors hover:border-primary/40 hover:bg-card"
              >
                <span className="font-mono text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl lg:text-4xl text-gradient_indigo_purple">
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
          title="三大类型化判定基元：Noul / Choice / Score"
          subtitle="Jev 放弃自回归文本生成，将所有业务逻辑精炼为三个离散数学基元。每个基元均在单次前向传播中输出精准校准的概率与置信度。"
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
                    {primitive.name}
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
          title="突破性底层架构：RLCD 与非自回归并行采样"
          subtitle="为什么 Jev 能做到比传统大模型快 40 到 200 倍？揭秘 TypeSafe AI 在模型拓扑与训练范式上的两大突破。"
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
                杰文斯悖论（Jevons Paradox）在 AI 决策领域的具现
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                传统 LLM 让人们养成了「按 Token
                谨慎提问」的肌肉记忆——生怕多问一个问题就让延迟暴增 3 秒、Token
                账单飙升。而 Jev
                的非自回归并行采样使问题提问的边际成本趋近于零（Speculative
                Fan-out）。开发者可以像调用原生 CPU
                指令一样，在单次请求中无顾虑地派发 30
                个维度的业务断言。智能决策从昂贵的奢侈品变成了充裕的基础设施。
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
          title="五大生产级系统工程设计模式"
          subtitle="如何将 TypeSafe Jev 无缝融入现代分布式架构、Agent 工作流与企业级 API 网关中？"
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
                        传统 LLM 架构痛点：
                      </div>
                      <p className="text-muted-foreground leading-relaxed">
                        {pattern.scenario}
                      </p>
                    </div>
                    <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3.5 text-xs">
                      <div className="font-semibold text-emerald-700 dark:text-emerald-400 mb-1 flex items-center gap-1.5">
                        <CheckCircle2 className="size-3.5" />
                        Jev 优化方案：
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
          title="全栈生态代码实战：TS / Python / LangChain / Vercel"
          subtitle="Jev 提供了极其符合现代软件工程审美的 SDK 与生态接入驱动，支持类型推导、函数装饰器与中间件拦截。"
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
                        <span className="text-emerald-400">已复制</span>
                      </>
                    ) : (
                      <>
                        <Copy className="size-3.5" />
                        <span>复制代码</span>
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
          title="生成式 LLM vs TypeSafe Jev 深度技术对照"
          subtitle="从推理范式、延迟分位数、Token 成本结构到生产可靠性的全方位横向评测。"
        />

        {/* Detailed Comparison Table */}
        <div className="rounded-xl border border-border/80 bg-card overflow-hidden shadow-xs">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[180px] font-bold text-foreground">
                  对比维度
                </TableHead>
                <TableHead className="w-[280px] font-bold text-muted-foreground">
                  传统生成式 LLM (GPT-5/Claude)
                </TableHead>
                <TableHead className="w-[280px] font-bold text-primary">
                  TypeSafe Jev (System One)
                </TableHead>
                <TableHead className="font-bold text-foreground">
                  架构价值解析
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
                  实时算力降本计算器（Cost & Latency ROI）
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground">
                调整您的月度高频决策调用量与单次平均 Token 大小，查看替换为
                TypeSafe Jev 后的直接成本节省：
              </p>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="monthly-queries-input"
                    className="text-xs font-semibold text-foreground flex justify-between"
                  >
                    <span>月度决策调用次数：</span>
                    <span className="font-mono text-primary font-bold">
                      {monthlyQueries.toLocaleString()} 次/月
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
                    <span>单次输入平均 Token：</span>
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
                预计每月可为您节省
              </span>
              <div className="font-mono text-3xl sm:text-4xl font-extrabold text-emerald-600 dark:text-emerald-400">
                ${Math.round(savings).toLocaleString()}
                <span className="text-sm font-normal text-muted-foreground">
                  {" "}
                  / 月
                </span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Badge
                  variant="default"
                  className="bg-emerald-600 hover:bg-emerald-600 text-xs"
                >
                  节省率 {savingsPercentage}%
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Jev 月费仅 ${jevCost.toFixed(2)}
                </Badge>
              </div>
              <span className="text-[11px] text-muted-foreground/80">
                传统 LLM 月均耗费: ~$
                {Math.round(traditionalLlmTotalCost).toLocaleString()}
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
          title="在线决策模拟器 (Interactive Evaluator)"
          subtitle="选择典型企业级业务场景，体验 Jev 如何在单次请求中并行输出强类型布尔值、分类与分级判定。"
        />

        <div className="flex flex-col gap-6 rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-lg">
          {/* Scenario Selector Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-border pb-4">
            <span className="text-xs font-bold text-muted-foreground mr-2">
              场景预设：
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
                  Input State (上下文状态)
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
                  Jev 并行概率求值结果 (~92ms)
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
                          置信度 {(q.confidence * 100).toFixed(1)}%
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
            title="开发者常见疑问全解 (FAQ)"
            subtitle="关于 TypeSafe Jev 的技术细节、能力边界与工程落地关键问题。"
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
            四种官方集成与接入渠道
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
            权威信源与官方参考文档
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
