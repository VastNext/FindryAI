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
  agiTakes,
  benchmarks,
  capabilities,
  faqs,
  gpt6Astra,
  heroStats,
  sources,
  specs,
} from "@/data/gpt-6-astra";
import { cn } from "@/lib/utils";
import { ExternalLink, Quote, Sparkles } from "lucide-react";
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
    <section className="relative overflow-hidden pb-16 pt-14 md:pb-24 md:pt-20">
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
            className="animate-fade-up gap-2 rounded-full px-4 py-1.5 text-sm"
          >
            <Sparkles className="size-4 text-primary" />
            Launched {gpt6Astra.releaseDate} · OpenAI's new flagship
          </Badge>

          <h1
            className="animate-fade-up mt-8 max-w-4xl font-bricolage text-4xl font-bold text-balance sm:text-5xl md:text-6xl"
            style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}
          >
            GPT-6 Astra:{" "}
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

          <div
            className="animate-fade-up mt-10 flex flex-col items-center gap-4 sm:flex-row"
            style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
          >
            <a
              href={gpt6Astra.officialUrl}
              target="_blank"
              rel="noreferrer"
              className={cn(
                buttonVariants({ size: "lg" }),
                "rounded-full px-8 text-base",
              )}
            >
              Visit the Official Homepage
              <Icons.arrowRight className="size-4" />
            </a>
            <a
              href={gpt6Astra.chatgptUrl}
              target="_blank"
              rel="noreferrer"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "rounded-full px-8 text-base",
              )}
            >
              Try it on ChatGPT
              <ExternalLink className="size-4" />
            </a>
          </div>

          <div className="mt-16 grid w-full grid-cols-2 gap-6 md:grid-cols-4">
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center gap-1 rounded-2xl border bg-card/60 px-4 py-6"
              >
                <span className="text-gradient_indigo-purple font-bricolage text-3xl font-bold md:text-4xl">
                  {stat.value}
                </span>
                <span className="text-sm text-muted-foreground">
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
    <section className="border-t bg-muted/30 py-16 md:py-24">
      <Container>
        <div className="flex w-full flex-col gap-12">
          <SectionHeader
            label="Benchmarks"
            title="The numbers behind the moment"
            subtitle={`GPT-6 Astra vs. its predecessor GPT-5.6 "Sol" and the strongest competing models at launch.`}
          />

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
      <AgiEraSection />
      <CapabilitiesSection />
      <BenchmarksSection />
      <SpecsSection />
      <FaqSection />
      <SourcesSection />
      <FinalCta />
    </div>
  );
}
