import Container from "@/components/container";
import { Icons } from "@/components/icons/icons";
import { HeaderSection } from "@/components/shared/header-section";
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
  Cloud,
  Code2,
  ExternalLink,
  MessageSquare,
  Quote,
  Sparkles,
} from "lucide-react";
import Link from "next/link";

function SectionHeader(props: {
  label: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <HeaderSection
      label={props.label}
      titleAs="h2"
      title={props.title}
      subtitle={props.subtitle}
      className="mx-auto max-w-3xl"
    />
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden pb-12 pt-10 md:pb-16 md:pt-14">
      {/* decorative glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-[-12rem] size-[36rem] -translate-x-1/2 rounded-full bg-purple-500/15 blur-3xl" />
        <div className="absolute left-[8%] top-[35%] size-[22rem] rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="absolute right-[8%] top-[20%] size-[22rem] rounded-full bg-fuchsia-500/10 blur-3xl" />
      </div>

      <Container>
        <div className="flex flex-col items-center text-center">
          <Badge
            variant="outline"
            className="animate-fade-up gap-2 rounded-full px-4 py-1.5 text-sm uppercase tracking-wider"
          >
            <Sparkles className="size-4 text-primary" />
            The AGI Era · The Future Is Here
          </Badge>

          <h1
            className="animate-fade-up mt-8 max-w-4xl font-bricolage text-4xl font-bold text-balance sm:text-5xl md:text-6xl"
            style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}
          >
            Try {gpt6Astra.name} —{" "}
            <span className="text-gradient_indigo-purple">
              {gpt6Astra.tagline}
            </span>
          </h1>

          <p
            className="animate-fade-up mt-6 max-w-3xl text-balance text-lg leading-8 text-muted-foreground sm:text-xl"
            style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
          >
            {gpt6Astra.heroSubtitle}
          </p>

          {/* Primary Action Buttons */}
          <div
            className="animate-fade-up mt-8 flex flex-col items-center gap-4 sm:flex-row"
            style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
          >
            <a
              href={gpt6Astra.chatgptUrl}
              target="_blank"
              rel="noreferrer"
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-full px-8 text-base",
              )}
            >
              Try on ChatGPT
              <ExternalLink className="size-4" />
            </a>
            <a
              href="#how-to-try"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "rounded-full px-8 text-base",
              )}
            >
              Read Setup & Token Guide
              <ArrowDown className="size-4" />
            </a>
          </div>

          <p className="mt-3 text-xs text-muted-foreground">
            Official announcement:{" "}
            <a
              href={gpt6Astra.officialUrl}
              target="_blank"
              rel="noreferrer"
              className="text-foreground underline underline-offset-4 hover:text-primary"
            >
              openai.com/index/gpt-6-astra ↗
            </a>
          </p>

          {/* 3 Quick Access Cards right above the fold */}
          <div className="mt-10 grid w-full max-w-4xl grid-cols-1 gap-4 text-left sm:grid-cols-3">
            <a
              href="#how-to-try"
              className="group flex flex-col justify-between rounded-2xl border bg-card/80 p-5 transition-all hover:border-primary/50 hover:bg-card hover:shadow-md"
            >
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <MessageSquare className="size-4" />
                  </div>
                  <span className="font-bricolage text-base font-semibold">
                    1. ChatGPT
                  </span>
                </div>
                <Badge variant="secondary" className="mt-2.5 text-[11px]">
                  Plus, Pro & Enterprise
                </Badge>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  Pick from the model dropdown. Pro plans also unlock GPT-6
                  Astra Pro.
                </p>
              </div>
              <span className="mt-4 flex items-center gap-1 text-xs font-medium text-primary group-hover:underline">
                View access steps <ArrowDown className="size-3" />
              </span>
            </a>

            <a
              href="#how-to-try"
              className="group flex flex-col justify-between rounded-2xl border bg-card/80 p-5 transition-all hover:border-primary/50 hover:bg-card hover:shadow-md"
            >
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Code2 className="size-4" />
                  </div>
                  <span className="font-bricolage text-base font-semibold">
                    2. OpenAI API
                  </span>
                </div>
                <Badge
                  variant="secondary"
                  className="mt-2.5 font-mono text-[11px]"
                >
                  model: gpt-6-astra
                </Badge>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  $10 in / $50 out per 1M tokens. Cached input is $1. Responses
                  API only.
                </p>
              </div>
              <span className="mt-4 flex items-center gap-1 text-xs font-medium text-primary group-hover:underline">
                View pricing & API details <ArrowDown className="size-3" />
              </span>
            </a>

            <a
              href="#how-to-try"
              className="group flex flex-col justify-between rounded-2xl border bg-card/80 p-5 transition-all hover:border-primary/50 hover:bg-card hover:shadow-md"
            >
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Cloud className="size-4" />
                  </div>
                  <span className="font-bricolage text-base font-semibold">
                    3. Cloud Platforms
                  </span>
                </div>
                <Badge variant="secondary" className="mt-2.5 text-[11px]">
                  Azure & AWS Bedrock
                </Badge>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  Available in supported enterprise regions. Off by default for
                  enterprise.
                </p>
              </div>
              <span className="mt-4 flex items-center gap-1 text-xs font-medium text-primary group-hover:underline">
                View cloud details <ArrowDown className="size-3" />
              </span>
            </a>
          </div>

          {/* Downward Hook: Guides users to read below */}
          <div className="mt-8 flex items-center justify-center">
            <a
              href="#best-practices"
              className="group inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-xs font-medium text-foreground transition-all hover:border-primary/40 hover:bg-primary/10"
            >
              <span>
                💡 Before you start: see our Token-Saving Guide & Reasoning
                Effort Ladder below
              </span>
              <ArrowDown className="size-3 text-primary transition-transform group-hover:translate-y-0.5" />
            </a>
          </div>
        </div>
      </Container>
    </section>
  );
}

function HowToTrySection() {
  return (
    <section
      id="how-to-try"
      className="scroll-mt-16 border-t bg-muted/30 py-16 md:py-24"
    >
      <Container>
        <div className="flex w-full flex-col gap-12">
          <SectionHeader
            label="Get Access"
            title="How to try GPT-6 Astra in minutes"
            subtitle="Three ways in — pick the one that matches how you already work."
          />

          <div className="grid gap-6 md:grid-cols-3">
            {accessRoutes.map((route) => (
              <div
                key={route.title}
                className="flex flex-col gap-4 rounded-2xl border bg-card p-6"
              >
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <route.icon className="size-5" />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="font-bricolage text-lg font-semibold">
                    {route.title}
                  </h3>
                  <Badge
                    variant="secondary"
                    className="w-fit rounded-full text-xs"
                  >
                    {route.requirement}
                  </Badge>
                </div>
                <ol className="flex flex-col gap-2 text-sm leading-6 text-muted-foreground">
                  {route.steps.map((step, index) => (
                    <li key={step} className="flex gap-2">
                      <span className="font-mono text-primary">
                        {index + 1}.
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>

          <p className="mx-auto max-w-3xl text-center text-sm leading-6 text-muted-foreground">
            Rolling out to paid ChatGPT plans since {gpt6Astra.releaseDate}.
            Full API details live on the{" "}
            <a
              href={gpt6Astra.officialUrl}
              target="_blank"
              rel="noreferrer"
              className="font-medium text-primary underline-offset-4 hover:underline"
            >
              official GPT-6 Astra homepage
            </a>
            .
          </p>
        </div>
      </Container>
    </section>
  );
}

function AgiEraSection() {
  return (
    <section className="border-t bg-muted/30 py-16 md:py-24">
      <Container>
        <div className="flex w-full flex-col gap-12">
          <SectionHeader
            label="The AGI Era"
            title="Welcome to the AGI era"
            subtitle={`Within a day of launch, GPT-6 Astra moved the AGI conversation from theory to front pages. On ARC-AGI-3 it used fewer actions than the median human tester on 96% of levels — what ARC Prize calls "effectively reaching human parity on the benchmark". Here is what independent evaluators are saying.`}
          />

          <div className="grid gap-6 md:grid-cols-3">
            {agiTakes.map((take) => (
              <figure
                key={take.author}
                className="flex flex-col gap-4 rounded-2xl border bg-card p-6"
              >
                <Quote className="size-6 text-primary/60" />
                <blockquote className="flex-1 text-lg font-medium leading-7">
                  “{take.quote}”
                </blockquote>
                <figcaption className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">
                    {take.author}
                  </span>{" "}
                  · {take.role}
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="mx-auto w-full max-w-3xl rounded-2xl border border-primary/20 bg-primary/5 p-6 text-left md:p-8">
            <h3 className="font-bricolage text-xl font-semibold">
              Is it actually AGI? The honest answer.
            </h3>
            <ul className="mt-4 flex flex-col gap-3 text-muted-foreground">
              <li className="flex gap-3">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                OpenAI markets Astra as "the world's most intelligent and
                aligned model" — a new generation of intelligence, and its
                closest step toward AGI.
              </li>
              <li className="flex gap-3">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                ARC Prize, whose benchmark Astra essentially saturated, is
                explicit: "we are not claiming that it is AGI" — deterministic
                benchmarks don't capture real-world open-endedness.
              </li>
              <li className="flex gap-3">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                What's not in dispute: the frontier moved further in one release
                than in years — and the future it points at is no longer
                hypothetical.
              </li>
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}

function CapabilitiesSection() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <div className="flex w-full flex-col gap-12">
          <SectionHeader
            label="Capabilities"
            title="One model, every frontier"
            subtitle="Astra pairs state-of-the-art raw intelligence with the practical ability to do professional work end to end."
          />

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {capabilities.map((capability) => (
              <div
                key={capability.title}
                className="group flex flex-col gap-4 rounded-2xl border bg-card p-6 transition-colors hover:border-primary/40"
              >
                <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <capability.icon className="size-5" />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="font-bricolage text-lg font-semibold">
                    {capability.title}
                  </h3>
                  <Badge
                    variant="secondary"
                    className="w-fit rounded-full font-mono text-xs"
                  >
                    {capability.metric}
                  </Badge>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {capability.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

function BenchmarksSection() {
  return (
    <section
      id="benchmarks"
      className="scroll-mt-16 border-t bg-muted/30 py-16 md:py-24"
    >
      <Container>
        <div className="flex w-full flex-col gap-12">
          <SectionHeader
            label="Benchmarks"
            title="The numbers behind the moment"
            subtitle={`GPT-6 Astra vs. its predecessor GPT-5.6 "Sol" and the strongest competing models at launch.`}
          />

          {/* 4 Key Benchmark Metric Cards */}
          <div className="mx-auto grid w-full max-w-4xl grid-cols-2 gap-4 md:grid-cols-4">
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-1 rounded-2xl border bg-card px-4 py-5 text-center"
              >
                <span className="text-gradient_indigo-purple font-bricolage text-2xl font-bold md:text-3xl">
                  {stat.value}
                </span>
                <span className="text-xs text-muted-foreground">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          <div className="mx-auto w-full max-w-4xl overflow-hidden rounded-2xl border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[38%]">Benchmark</TableHead>
                  <TableHead className="text-right">GPT-6 Astra</TableHead>
                  <TableHead className="text-right">GPT-5.6 Sol</TableHead>
                  <TableHead className="text-right">Best other</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {benchmarks.map((benchmark) => (
                  <TableRow key={benchmark.name}>
                    <TableCell className="font-medium">
                      {benchmark.name}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="text-gradient_indigo-purple font-semibold">
                        {benchmark.astra}
                      </span>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {benchmark.sol}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {benchmark.other}
                      {benchmark.otherLabel ? (
                        <span className="block text-xs">
                          {benchmark.otherLabel}
                        </span>
                      ) : null}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <p className="mx-auto max-w-4xl text-sm leading-6 text-muted-foreground">
            ARC-AGI-3's 99.9% is under the provider-adapter harness (62.7% under
            the standard harness — both state of the art). On action efficiency,
            Astra used ~51.7% fewer actions per level than the median human
            tester. Scores as reported by OpenAI and ARC Prize, September 2026.
          </p>
        </div>
      </Container>
    </section>
  );
}

function SpecsSection() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <div className="flex w-full flex-col gap-12">
          <SectionHeader
            label="Specifications"
            title="Under the hood"
            subtitle="Key facts for builders evaluating the API and teams choosing a plan."
          />

          <div className="mx-auto grid w-full max-w-4xl gap-4 sm:grid-cols-2">
            {specs.map((spec) => (
              <div
                key={spec.label}
                className="flex flex-col gap-1 rounded-2xl border bg-card p-6"
              >
                <span className="text-sm uppercase tracking-wider text-muted-foreground">
                  {spec.label}
                </span>
                <span className="font-bricolage text-lg font-semibold">
                  {spec.value}
                </span>
                {spec.note ? (
                  <span className="text-sm text-muted-foreground">
                    {spec.note}
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

function BestPracticesSection() {
  return (
    <section
      id="best-practices"
      className="scroll-mt-16 border-t bg-muted/30 py-16 md:py-24"
    >
      <Container>
        <div className="flex w-full flex-col gap-12">
          <SectionHeader
            label="Tips & Best Practices"
            title="GPT-6 Astra best practices: save tokens, get better answers"
            subtitle="Astra's API pricing rewards the right defaults. These are the settings and habits that cut bills without cutting quality."
          />

          <div className="mx-auto w-full max-w-4xl overflow-hidden rounded-2xl border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[110px]">Effort</TableHead>
                  <TableHead className="text-right">Quality score</TableHead>
                  <TableHead className="text-right">Cost / task</TableHead>
                  <TableHead className="w-[46%]">When to use</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {effortLadder.map((row) => (
                  <TableRow key={row.effort}>
                    <TableCell className="font-medium">
                      {row.effort}
                      {row.effort === "medium" ? (
                        <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                          default
                        </span>
                      ) : null}
                    </TableCell>
                    <TableCell className="text-right">{row.score}</TableCell>
                    <TableCell className="text-right">
                      {row.costPerTask}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {row.guidance}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="mx-auto grid w-full max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tokenTips.map((tip) => (
              <div
                key={tip.title}
                className="flex flex-col gap-2 rounded-2xl border bg-card p-5"
              >
                <h3 className="font-medium">{tip.title}</h3>
                <p className="text-sm leading-6 text-muted-foreground">
                  {tip.description}
                </p>
              </div>
            ))}
          </div>

          <p className="mx-auto max-w-4xl text-sm leading-6 text-muted-foreground">
            Prompting essentials: give Astra a finish line ("implement and
            verify" beats "look into it"), feed it error messages and what
            you've already tried before raising effort, ask for prose when you
            don't want tables, and request "the smallest clear change that
            satisfies the requirement". Effort scores and per-task costs from
            the Artificial Analysis Index v4.2, September 2026.
          </p>
        </div>
      </Container>
    </section>
  );
}

function FaqSection() {
  return (
    <section className="border-t bg-muted/30 py-16 md:py-24">
      <Container>
        <div className="flex w-full flex-col gap-12">
          <SectionHeader label="FAQ" title="Frequently asked questions" />
          <Accordion
            type="single"
            collapsible
            className="mx-auto w-full max-w-3xl"
          >
            {faqs.map((faq, index) => (
              <AccordionItem key={faq.question} value={`faq-${index}`}>
                <AccordionTrigger className="text-left text-base font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-base leading-7 text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </Container>
    </section>
  );
}

function SourcesSection() {
  return (
    <section className="py-16 md:py-24">
      <Container>
        <div className="flex w-full flex-col gap-12">
          <SectionHeader
            label="Deep dives"
            title="Read the primary sources"
            subtitle="Everything on this page is drawn from official releases and independent evaluations."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sources.map((source) => (
              <a
                key={source.url}
                href={source.url}
                target="_blank"
                rel="noreferrer"
                className="group flex flex-col gap-2 rounded-2xl border bg-card p-5 transition-colors hover:border-primary/40"
              >
                <span className="flex items-center justify-between gap-3 font-medium">
                  {source.label}
                  <ExternalLink className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
                </span>
                <span className="text-sm text-muted-foreground">
                  {source.description}
                </span>
              </a>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="pb-20 md:pb-28">
      <Container>
        <div className="relative overflow-hidden rounded-3xl border bg-gradient-to-br from-indigo-500/10 via-background to-purple-500/10 px-6 py-16 text-center md:py-20">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-0 size-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-3xl"
          />
          <div className="relative flex flex-col items-center gap-6">
            <h2 className="max-w-2xl font-bricolage text-3xl font-bold text-balance sm:text-4xl">
              The future is here.{" "}
              <span className="text-gradient_indigo-purple">Go meet it.</span>
            </h2>
            <p className="max-w-xl text-balance text-muted-foreground">
              GPT-6 Astra is rolling out now across ChatGPT, the OpenAI API,
              Azure and AWS Bedrock.
            </p>
            <div className="flex flex-col items-center gap-4 sm:flex-row">
              <a
                href={gpt6Astra.officialUrl}
                target="_blank"
                rel="noreferrer"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "rounded-full px-8 text-base",
                )}
              >
                GPT-6 Astra Homepage
                <Icons.arrowRight className="size-4" />
              </a>
              <Link
                href={siteConfig.url}
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "rounded-full px-8 text-base",
                )}
              >
                Explore more AI tools
              </Link>
            </div>
            <p className="mt-4 max-w-2xl text-xs leading-5 text-muted-foreground">
              This page is an independent overview published by Findry AI, an AI
              tools directory. GPT-6 Astra is a product of OpenAI — benchmark
              figures as reported in the sources above, September 2026.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

export function Gpt6AstraLanding() {
  return (
    <div className="flex w-full flex-col">
      <Hero />
      <HowToTrySection />
      <AgiEraSection />
      <CapabilitiesSection />
      <BenchmarksSection />
      <SpecsSection />
      <BestPracticesSection />
      <FaqSection />
      <SourcesSection />
      <FinalCta />
    </div>
  );
}
