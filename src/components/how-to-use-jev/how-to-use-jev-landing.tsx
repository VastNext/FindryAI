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
  type AccessRoute,
  accessRoutes,
  howToUseJevFaqs,
  howToUseJevMeta,
  primitivesQuickRef,
  productionRecipes,
} from "@/data/how-to-use-jev";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Bot,
  Check,
  CheckCircle2,
  Clock,
  Code2,
  Copy,
  Cpu,
  DollarSign,
  ExternalLink,
  Filter,
  Layers,
  Network,
  Scale,
  ShieldCheck,
  Sparkles,
  Terminal,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function HowToUseJevLanding() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const handleCopy = (id: string, text: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const filteredRoutes =
    activeCategory === "all"
      ? accessRoutes
      : accessRoutes.filter((r) => r.category === activeCategory);

  return (
    <div className="flex flex-col gap-16 pb-24">
      {/* ----------------- Hero / TL;DR Section ----------------- */}
      <section className="relative pt-6 sm:pt-10">
        <div className="flex flex-col items-center text-center gap-6">
          {/* Top Category Badge */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Badge
              variant="outline"
              className="border-indigo-500/40 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 gap-1.5 px-3 py-1 text-xs font-semibold"
            >
              <Terminal className="size-3.5" />
              <span>Integration Guide & Access Playbook</span>
            </Badge>
            <Badge variant="secondary" className="font-mono text-xs">
              Verified: {howToUseJevMeta.lastUpdated}
            </Badge>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl text-balance max-w-4xl">
            How to Use Jev AI:{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              7 Access Routes & Working Code
            </span>
          </h1>

          <p className="max-w-3xl text-balance text-base leading-relaxed text-muted-foreground sm:text-xl">
            A battle-tested engineering guide to obtaining API keys, selecting
            the lowest-latency access route, installing SDKs, and deploying 4
            copy-paste production recipes.
          </p>

          {/* Hub Deep Dive Banner */}
          <Link
            href={howToUseJevMeta.hubUrl}
            className="group flex items-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-4 py-2 text-xs sm:text-sm font-medium text-foreground transition-all hover:border-primary hover:bg-primary/10 shadow-xs"
          >
            <Sparkles className="size-4 text-primary" />
            <span>
              Need RLCD mathematical proofs & System One architecture? Read our{" "}
              <strong className="text-primary underline-offset-4 group-hover:underline">
                TypeSafe Jev Deep Dive Hub
              </strong>
            </span>
            <ArrowRight className="size-4 text-primary transition-transform group-hover:translate-x-0.5" />
          </Link>

          {/* TL;DR 5-Sentence Box */}
          <div className="w-full max-w-4xl text-left rounded-2xl border border-border/80 bg-card/60 p-5 sm:p-6 shadow-xs backdrop-blur-xs">
            <div className="flex items-center gap-2 border-b border-border/70 pb-3 mb-4">
              <Zap className="size-4 text-amber-500" />
              <h2 className="font-mono text-xs sm:text-sm font-bold uppercase tracking-wider text-foreground">
                TL;DR — 5-Bullet Executive Summary
              </h2>
            </div>
            <ul className="space-y-2.5 text-xs sm:text-sm leading-relaxed text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="font-bold text-foreground shrink-0">
                  • What it is:
                </span>
                <span>
                  TypeSafe Jev is a non-autoregressive decision model built for
                  structured boolean, choice, and score outputs in 70–500ms
                  without text hallucinations.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-foreground shrink-0">
                  • Fastest access:
                </span>
                <span>
                  Create an early-access key on TypeSafe Console ($5 free
                  credit), or route via Vercel AI Gateway / OpenRouter for
                  instant evaluation.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-foreground shrink-0">
                  • Minimal call:
                </span>
                <span>
                  Send unstructured text via{" "}
                  <code>POST https://api.typesafe.ai/v1/systemone</code> with
                  typed questions; results return in ~100ms.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-foreground shrink-0">
                  • Pricing math:
                </span>
                <span>
                  Billed at $0.042 per 1M input tokens. Parallel question output
                  sampling is free, costing ~$0.00004 per decision.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-foreground shrink-0">
                  • Critical limit:
                </span>
                <span>
                  64k combined token window, pure text input (no multimodal
                  audio/vision), and zero ungrounded world-knowledge generation.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ----------------- Section 1: 7 Access Routes ----------------- */}
      <section className="flex flex-col gap-6 scroll-mt-24" id="access-routes">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest text-primary">
            <span>01</span>
            <span className="text-muted-foreground/40">/</span>
            <span>PROVIDER SELECTION</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Where to Access Jev: 7 Routes Compared
          </h2>
          <p className="text-sm text-muted-foreground sm:text-base">
            Detailed breakdown separating direct official providers from cloud
            aggregators and self-hosted orchestration proxies.
          </p>
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={activeCategory === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory("all")}
            className="text-xs h-8"
          >
            All 7 Routes
          </Button>
          <Button
            variant={
              activeCategory === "direct_provider" ? "default" : "outline"
            }
            size="sm"
            onClick={() => setActiveCategory("direct_provider")}
            className="text-xs h-8"
          >
            Official Direct
          </Button>
          <Button
            variant={
              activeCategory === "gateway_aggregator" ? "default" : "outline"
            }
            size="sm"
            onClick={() => setActiveCategory("gateway_aggregator")}
            className="text-xs h-8"
          >
            Cloud Gateways
          </Button>
          <Button
            variant={
              activeCategory === "framework_orchestration"
                ? "default"
                : "outline"
            }
            size="sm"
            onClick={() => setActiveCategory("framework_orchestration")}
            className="text-xs h-8"
          >
            Self-Hosted & Frameworks
          </Button>
        </div>

        {/* Responsive Comparison Table */}
        <div className="rounded-xl border border-border/70 bg-card overflow-hidden shadow-xs">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[180px] font-bold">Route</TableHead>
                <TableHead className="min-w-[200px] font-bold">
                  Key / Auth Method
                </TableHead>
                <TableHead className="min-w-[220px] font-bold">
                  Pricing & Terms
                </TableHead>
                <TableHead className="min-w-[250px] font-bold">
                  Best Used For
                </TableHead>
                <TableHead className="w-[120px] text-right font-bold">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRoutes.map((route) => (
                <TableRow key={route.id} className="hover:bg-muted/30">
                  <TableCell className="align-top font-semibold">
                    <div className="flex flex-col gap-1">
                      <span className="text-foreground">{route.name}</span>
                      <Badge
                        variant="outline"
                        className="w-fit text-[10px] px-1.5 py-0"
                      >
                        {route.categoryLabel}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell className="align-top text-xs text-muted-foreground">
                    {route.authRequirement}
                  </TableCell>
                  <TableCell className="align-top text-xs">
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-foreground">
                        {route.pricingTerms}
                      </span>
                      {route.notes && (
                        <span className="text-[11px] text-muted-foreground/80">
                          {route.notes}
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="align-top text-xs text-muted-foreground">
                    {route.bestFor}
                  </TableCell>
                  <TableCell className="align-top text-right">
                    <Link
                      href={route.consoleUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        buttonVariants({ variant: "outline", size: "sm" }),
                        "h-7 px-2.5 text-xs gap-1 border-border/80 hover:text-primary",
                      )}
                    >
                      <span>Visit</span>
                      <ExternalLink className="size-3" />
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* ----------------- Section 2: 10-Minute Quickstart ----------------- */}
      <section className="flex flex-col gap-6 scroll-mt-24" id="quickstart">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest text-primary">
            <span>02</span>
            <span className="text-muted-foreground/40">/</span>
            <span>GETTING STARTED</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            10-Minute Quickstart (Python & TS)
          </h2>
          <p className="text-sm text-muted-foreground sm:text-base">
            Install SDKs, configure your environment, and send your first typed
            decision call.
          </p>
        </div>

        <Tabs defaultValue="python" className="w-full">
          <TabsList className="bg-muted p-1 rounded-lg">
            <TabsTrigger value="python" className="text-xs font-semibold px-4">
              Python SDK (typesafe_sdk)
            </TabsTrigger>
            <TabsTrigger
              value="typescript"
              className="text-xs font-semibold px-4"
            >
              TypeScript / REST API
            </TabsTrigger>
          </TabsList>

          <TabsContent value="python" className="mt-4">
            <div className="relative rounded-xl border border-zinc-800 bg-zinc-950 p-4 sm:p-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
                <span className="font-mono text-xs text-zinc-400">
                  quickstart.py
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    handleCopy(
                      "py-quickstart",
                      `# 1. Install SDK\n# pip install typesafe-sdk\n\nimport os\nfrom typesafe_sdk import TypeSafeClient, Noul\n\nclient = TypeSafeClient(api_key=os.environ.get("TYPESAFE_API_KEY"))\n\nresult = client.system_one(\n    model="jev-latest",\n    state="Customer message: Please refund my subscription immediately. This is ridiculous.",\n    questions={\n        "is_urgent": Noul(instructions="Does this message require immediate attention within 1 hour?")\n    }\n)\n\nprint("Urgency probability:", result.answers["is_urgent"].noul)`,
                    )
                  }
                  className="h-8 gap-1.5 text-xs text-zinc-300 hover:text-white hover:bg-zinc-800"
                >
                  {copiedId === "py-quickstart" ? (
                    <>
                      <Check className="size-3.5 text-emerald-400" />
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
              <pre className="overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed text-zinc-200">
                <code>{`# 1. Install official SDK
# pip install typesafe-sdk

import os
from typesafe_sdk import TypeSafeClient, Noul

# 2. Initialize authenticated client
client = TypeSafeClient(api_key=os.environ.get("TYPESAFE_API_KEY"))

# 3. Dispatch System One decision call
result = client.system_one(
    model="jev-latest",
    state="Customer message: Please cancel and refund my subscription immediately. This is ridiculous.",
    questions={
        "is_urgent": Noul(instructions="Does this message require immediate attention within 1 hour?")
    }
)

# 4. Result is an empirical calibrated float [0.0 - 1.0]
urgency_prob = result.answers["is_urgent"].noul
print(f"Urgency probability: {urgency_prob:.2f}")

if urgency_prob > 0.80:
    print("Action: Auto-escalate to priority manager")`}</code>
              </pre>
            </div>
          </TabsContent>

          <TabsContent value="typescript" className="mt-4">
            <div className="relative rounded-xl border border-zinc-800 bg-zinc-950 p-4 sm:p-6 shadow-xl">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
                <span className="font-mono text-xs text-zinc-400">
                  quickstart.ts (Native fetch API)
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    handleCopy(
                      "ts-quickstart",
                      `const response = await fetch("https://api.typesafe.ai/v1/systemone", {\n  method: "POST",\n  headers: {\n    "Content-Type": "application/json",\n    Authorization: \`Bearer \${process.env.TYPESAFE_API_KEY}\`,\n  },\n  body: JSON.stringify({\n    model: "jev-latest",\n    state: "Invoice #1092 shows overdue balance despite confirmation email received.",\n    questions: {\n      needs_billing_agent: {\n        type: "noul",\n        instructions: "Does this inquiry concern billing dispute or payments?",\n      },\n    },\n  }),\n});\n\nconst data = await response.json();\nconsole.log("Billing agent needed:", data.answers.needs_billing_agent.noul);`,
                    )
                  }
                  className="h-8 gap-1.5 text-xs text-zinc-300 hover:text-white hover:bg-zinc-800"
                >
                  {copiedId === "ts-quickstart" ? (
                    <>
                      <Check className="size-3.5 text-emerald-400" />
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
              <pre className="overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed text-zinc-200">
                <code>{`// Zero external SDK dependency — native HTTP fetch
const response = await fetch("https://api.typesafe.ai/v1/systemone", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: \`Bearer \${process.env.TYPESAFE_API_KEY}\`,
  },
  body: JSON.stringify({
    model: "jev-latest",
    state: "Invoice #1092 shows overdue balance despite confirmation email received.",
    questions: {
      needs_billing_agent: {
        type: "noul",
        instructions: "Does this inquiry concern billing dispute or payments?",
      },
    },
  }),
});

const data = await response.json();
console.log("Billing inquiry probability:", data.answers.needs_billing_agent.noul);`}</code>
              </pre>
            </div>
          </TabsContent>
        </Tabs>
      </section>

      {/* ----------------- Section 3: 4 Production Recipes ----------------- */}
      <section className="flex flex-col gap-6 scroll-mt-24" id="recipes">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest text-primary">
            <span>03</span>
            <span className="text-muted-foreground/40">/</span>
            <span>PRODUCTION RECIPES</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            4 Copy-Paste Production Recipes
          </h2>
          <p className="text-sm text-muted-foreground sm:text-base">
            Tested architectural patterns addressing common high-frequency
            automation bottlenecks.
          </p>
        </div>

        <Tabs defaultValue={productionRecipes[0].id} className="w-full">
          <div className="overflow-x-auto pb-2 no-scrollbar">
            <TabsList className="inline-flex h-11 items-center justify-start rounded-lg bg-muted p-1 text-muted-foreground">
              {productionRecipes.map((r, idx) => (
                <TabsTrigger
                  key={r.id}
                  value={r.id}
                  className="rounded-md px-3.5 py-1.5 text-xs font-semibold"
                >
                  Recipe {idx + 1}: {r.title.split("(")[0].trim()}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {productionRecipes.map((recipe) => (
            <TabsContent
              key={recipe.id}
              value={recipe.id}
              className="mt-4 flex flex-col gap-6"
            >
              <Card>
                <CardHeader>
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-1">
                    <Badge variant="outline" className="text-xs">
                      Primitives: {recipe.primitivesUsed}
                    </Badge>
                    <Badge
                      variant="secondary"
                      className="text-[11px] font-mono"
                    >
                      Schema: Verified
                    </Badge>
                  </div>
                  <CardTitle className="text-xl sm:text-2xl">
                    {recipe.title}
                  </CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {recipe.scenario}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                  {/* Why Jev Box */}
                  <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4 text-xs sm:text-sm">
                    <div className="flex items-center gap-2 font-semibold text-foreground mb-1">
                      <Zap className="size-4 text-indigo-500" />
                      <span>Why Jev Outperforms Standard LLMs Here:</span>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {recipe.whyJevOverLlm}
                    </p>
                  </div>

                  {/* Code Block */}
                  <div className="relative rounded-xl border border-zinc-800 bg-zinc-950 p-4 sm:p-6 shadow-xl">
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-3 mb-4">
                      <span className="font-mono text-xs text-zinc-400">
                        {recipe.id}.py
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopy(recipe.id, recipe.code)}
                        className="h-8 gap-1.5 text-xs text-zinc-300 hover:text-white hover:bg-zinc-800"
                      >
                        {copiedId === recipe.id ? (
                          <>
                            <Check className="size-3.5 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="size-3.5" />
                            <span>Copy Recipe</span>
                          </>
                        )}
                      </Button>
                    </div>
                    <pre className="overflow-x-auto text-xs sm:text-sm font-mono leading-relaxed text-zinc-200">
                      <code>{recipe.code}</code>
                    </pre>
                  </div>

                  {/* Input / Output Mock */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="rounded-xl border border-border/80 bg-muted/30 p-4 text-xs">
                      <span className="font-semibold text-foreground block mb-1">
                        Sample State Input:
                      </span>
                      <p className="text-muted-foreground font-mono leading-relaxed">
                        {recipe.sampleInput}
                      </p>
                    </div>
                    <div className="rounded-xl border border-border/80 bg-muted/30 p-4 text-xs">
                      <span className="font-semibold text-foreground block mb-1">
                        Resulting Decision Output:
                      </span>
                      <p className="text-muted-foreground font-mono leading-relaxed">
                        {recipe.sampleOutput}
                      </p>
                    </div>
                  </div>

                  {/* Tuning & Limitation Guardrails */}
                  <div className="flex flex-col sm:flex-row gap-4 text-xs border-t border-border/70 pt-4">
                    <div className="flex-1 flex items-start gap-2">
                      <Scale className="size-4 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-foreground">
                          Threshold Tuning Advice:
                        </span>
                        <p className="text-muted-foreground mt-0.5">
                          {recipe.thresholdTuning}
                        </p>
                      </div>
                    </div>
                    <div className="flex-1 flex items-start gap-2">
                      <AlertTriangle className="size-4 text-rose-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-foreground">
                          Operational Limitation:
                        </span>
                        <p className="text-muted-foreground mt-0.5">
                          {recipe.limitations}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
      </section>

      {/* ----------------- Section 4: Primitives Gotchas ----------------- */}
      <section
        className="flex flex-col gap-6 scroll-mt-24"
        id="primitives-gotchas"
      >
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest text-primary">
            <span>04</span>
            <span className="text-muted-foreground/40">/</span>
            <span>SPECIFICATION REFERENCE</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Jev Question Types & Gotchas Quick-Ref
          </h2>
          <p className="text-sm text-muted-foreground sm:text-base">
            Understand the exact signatures and avoid subtle schema mistakes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {primitivesQuickRef.map((p) => (
            <Card key={p.name} className="flex flex-col justify-between">
              <CardHeader className="pb-3">
                <Badge variant="outline" className="w-fit text-xs mb-2">
                  {p.type}
                </Badge>
                <CardTitle className="text-xl font-bold">{p.name}</CardTitle>
                <CardDescription className="font-mono text-xs text-foreground/80 break-all">
                  {p.signature}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 text-xs">
                <div className="rounded-lg bg-muted p-2 font-mono text-[11px] text-muted-foreground">
                  Returns: {p.returnValue}
                </div>
                <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-3 text-amber-700 dark:text-amber-300">
                  <span className="font-semibold block mb-0.5">
                    Critical Gotcha:
                  </span>
                  {p.criticalGotcha}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* ----------------- Section 5: FAQs ----------------- */}
      <section className="flex flex-col gap-6 scroll-mt-24" id="faq">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 font-mono text-xs font-semibold uppercase tracking-widest text-primary">
            <span>05</span>
            <span className="text-muted-foreground/40">/</span>
            <span>FREQUENTLY ASKED QUESTIONS</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Integration & Operational FAQs
          </h2>
          <p className="text-sm text-muted-foreground sm:text-base">
            Direct, practical answers regarding keys, SDK capabilities, and
            architectural limits.
          </p>
        </div>

        <Accordion type="single" collapsible className="w-full">
          {howToUseJevFaqs.map((faq, idx) => (
            <AccordionItem key={faq.question} value={`faq-${idx}`}>
              <AccordionTrigger className="text-left font-semibold text-sm sm:text-base">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* ----------------- Section 6: Bottom Navigation ----------------- */}
      <section className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-border/80 bg-muted/40 p-6">
        <div className="flex flex-col gap-1 text-center sm:text-left">
          <h3 className="font-bold text-foreground text-base sm:text-lg">
            Ready to explore the mathematical architecture?
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Learn about RLCD calibration, speculative fan-out sampling, and
            Kahneman System One mechanics.
          </p>
        </div>
        <Link
          href={howToUseJevMeta.hubUrl}
          className={cn(
            buttonVariants({ variant: "default", size: "lg" }),
            "gap-2 font-semibold shadow-xs shrink-0",
          )}
        >
          <span>Read Jev Architecture Hub</span>
          <ArrowRight className="size-4" />
        </Link>
      </section>
    </div>
  );
}
