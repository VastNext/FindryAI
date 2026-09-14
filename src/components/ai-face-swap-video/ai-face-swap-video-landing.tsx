import Container from "@/components/container";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  aiFaceSwapVideoConfig,
  videoComparisonTools,
  videoFaqs,
  videoHeroStats,
  videoTopPicks,
  videoTutorialSteps,
} from "@/data/ai-face-swap-video";
import { cn } from "@/lib/utils";
import {
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  Clock,
  Film,
  Flame,
  HelpCircle,
  Image as ImageIcon,
  Layers,
  ShieldCheck,
  Sparkles,
  Video,
  XCircle,
  Zap,
} from "lucide-react";
import Link from "next/link";

export function AiFaceSwapVideoLanding() {
  return (
    <div className="flex flex-col w-full pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 md:pt-14 md:pb-20 border-b border-border/40">
        <div className="absolute inset-0 -z-10 flex items-center justify-center overflow-hidden pointer-events-none">
          <div className="h-[360px] w-[650px] rounded-full bg-gradient-to-tr from-primary/20 via-purple-500/15 to-indigo-500/10 blur-3xl opacity-75" />
        </div>

        <Container>
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-6">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Badge
                variant="secondary"
                className="px-3 py-1 gap-1.5 text-xs font-semibold bg-primary/10 text-primary border border-primary/20 rounded-full"
              >
                <Video className="h-3.5 w-3.5" />
                <span>Verified 2026 Comparison</span>
              </Badge>
              <Badge
                variant="outline"
                className="px-3 py-1 text-xs text-muted-foreground border-border/60 rounded-full"
              >
                Updated {aiFaceSwapVideoConfig.lastVerifiedDate}
              </Badge>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-balance">
              Best AI Video Face Swap Tools (2026)
            </h1>

            <p className="text-muted-foreground text-base sm:text-lg md:text-xl max-w-3xl leading-relaxed text-balance">
              Detailed breakdown of the best AI video face replacement tools.
              Compare verified free clip durations, temporal tracking stability,
              watermark policies, and multi-actor support from direct hands-on
              testing.
            </p>

            {/* Quick Links / Anchors */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <a
                href="#comparison-matrix"
                className={cn(
                  buttonVariants({ variant: "default", size: "lg" }),
                  "gap-2 font-semibold shadow-md",
                )}
              >
                <span>View Comparison Table</span>
                <ChevronDown className="h-4 w-4" />
              </a>

              <Link
                href="/face-swap-gif"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "gap-2 border-primary/30 hover:bg-primary/5 text-foreground",
                )}
              >
                <ImageIcon className="h-4 w-4 text-primary" />
                <span>Need GIFs instead? Read GIF Guide</span>
              </Link>
            </div>

            {/* Stats bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full pt-8 max-w-3xl">
              {videoHeroStats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col items-center justify-center p-4 rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm shadow-sm"
                >
                  <span className="text-2xl font-bold text-foreground sm:text-3xl">
                    {stat.value}
                  </span>
                  <span className="text-xs text-muted-foreground mt-1 text-center font-medium">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Cross-linking Banner: Video vs GIF Format Decision */}
      <section className="py-8 bg-muted/30 border-b border-border/40">
        <Container>
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-2xl border border-primary/20 bg-primary/5">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0 mt-0.5">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">
                  Video vs. Animated GIF: Which Format Fits Your Goal?
                </h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-2xl leading-relaxed">
                  Video face swapping produces 30–60 FPS cinematic results with
                  lip sync, but consumes high rendering credits. If you only
                  need short looping memes or Discord/WhatsApp reactions, our
                  free GIF guide has zero-cost, watermark-free recommendations.
                </p>
              </div>
            </div>

            <Link
              href="/face-swap-gif"
              className={cn(
                buttonVariants({ variant: "default" }),
                "shrink-0 gap-2 font-medium group",
              )}
            >
              <span>Explore Face Swap GIF Guide</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </Container>
      </section>

      {/* Top Recommendations */}
      <section className="py-12 md:py-16">
        <Container>
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs uppercase">
                Editor Picks
              </Badge>
            </div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Top Verified AI Video Face Swappers
            </h2>
            <p className="text-muted-foreground text-sm max-w-2xl">
              Tested across action clips, multi-character dialogues, and viral
              dance footage for tracking stability and realistic boundary
              blending.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {videoTopPicks.map((pick) => (
              <div
                key={pick.tool}
                className="flex flex-col justify-between rounded-xl border border-border/80 bg-card p-5 shadow-sm transition-all duration-200 hover:border-primary/50 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-primary">
                      {pick.category}
                    </span>
                    <Badge variant="secondary" className="text-[10px]">
                      {pick.badge}
                    </Badge>
                  </div>
                  <h3 className="text-xl font-bold text-foreground">
                    {pick.tool}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                    {pick.highlight}
                  </p>
                </div>

                <div className="pt-5 mt-4 border-t border-border/50">
                  <Link
                    href={pick.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline"
                  >
                    <span>Visit Tool</span>
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Comprehensive Comparison Matrix */}
      <section
        id="comparison-matrix"
        className="py-12 md:py-16 bg-muted/20 border-y border-border/40 scroll-mt-16"
      >
        <Container>
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs uppercase">
                Detailed Matrix
              </Badge>
            </div>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Side-by-Side Video Face Swap Comparison
            </h2>
            <p className="text-muted-foreground text-sm max-w-2xl">
              Verified specifications including free trial limitations,
              resolution ceilings, and multi-actor tracking capabilities.
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border/80 bg-card shadow-sm">
            <table className="w-full text-left text-sm border-collapse min-w-[750px]">
              <thead>
                <tr className="border-b border-border/80 bg-muted/60 text-muted-foreground">
                  <th className="p-4 font-semibold text-foreground">Tool</th>
                  <th className="p-4 font-semibold">Free Tier Quota</th>
                  <th className="p-4 font-semibold">Watermark Policy</th>
                  <th className="p-4 font-semibold">Max Duration</th>
                  <th className="p-4 font-semibold">Resolution</th>
                  <th className="p-4 font-semibold">Multi-Face</th>
                  <th className="p-4 font-semibold">Pricing</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {videoComparisonTools.map((tool) => (
                  <tr
                    key={tool.name}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    <td className="p-4">
                      <div className="font-bold text-foreground flex items-center gap-1.5">
                        <span>{tool.name}</span>
                        {tool.badge && (
                          <Badge
                            variant="secondary"
                            className="text-[10px] px-1.5 py-0"
                          >
                            {tool.badge}
                          </Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground block mt-0.5">
                        {tool.bestFor}
                      </span>
                    </td>
                    <td className="p-4 text-foreground/90 font-medium">
                      {tool.freeTier}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1.5">
                        {tool.watermarkOnFree ? (
                          <XCircle className="h-4 w-4 text-amber-500 shrink-0" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                        )}
                        <span className="text-xs">{tool.watermarkNote}</span>
                      </div>
                    </td>
                    <td className="p-4 text-muted-foreground font-mono text-xs">
                      {tool.maxVideoDuration}
                    </td>
                    <td className="p-4 text-foreground font-mono text-xs">
                      {tool.maxResolution}
                    </td>
                    <td className="p-4">
                      {tool.multiFaceSupport ? (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          Supported
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          Single Face
                        </span>
                      )}
                    </td>
                    <td className="p-4 font-medium text-foreground">
                      {tool.startingPrice}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      {/* Detailed Tool Profiles */}
      <section className="py-12 md:py-16">
        <Container>
          <div className="space-y-4 mb-10">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Deep-Dive Profiles & Testing Notes
            </h2>
            <p className="text-muted-foreground text-sm max-w-2xl">
              Honest pros, cons, and performance notes based on rendering speed,
              facial fidelity, and motion blur handling.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {videoComparisonTools.map((tool) => (
              <div
                key={tool.name}
                className="flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-6 shadow-sm hover:border-border transition-all"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-4 mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-foreground">
                        {tool.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {tool.tagline}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {tool.startingPrice}
                    </Badge>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1 mb-2">
                        <CheckCircle2 className="h-3.5 w-3.5" /> Strengths
                      </span>
                      <ul className="space-y-1.5 text-xs text-muted-foreground list-disc list-inside">
                        {tool.pros.map((pro) => (
                          <li key={pro} className="leading-relaxed">
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <span className="text-xs font-semibold text-rose-500 flex items-center gap-1 mb-2">
                        <XCircle className="h-3.5 w-3.5" /> Limitations
                      </span>
                      <ul className="space-y-1.5 text-xs text-muted-foreground list-disc list-inside">
                        {tool.cons.map((con) => (
                          <li key={con} className="leading-relaxed">
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="rounded-xl bg-muted/40 p-3 text-xs">
                      <span className="font-semibold text-foreground">
                        Best Application:{" "}
                      </span>
                      <span className="text-muted-foreground">
                        {tool.bestFor}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Resolution:{" "}
                    <strong className="text-foreground">
                      {tool.maxResolution}
                    </strong>
                  </span>
                  <Link
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
                  >
                    <span>Visit {tool.name}</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* 4-Step Practical Guide */}
      <section className="py-12 md:py-16 bg-muted/20 border-y border-border/40">
        <Container>
          <div className="space-y-4 mb-10 text-center max-w-2xl mx-auto">
            <Badge variant="outline" className="text-xs uppercase">
              How-To Tutorial
            </Badge>
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              How to Face Swap a Video in 4 Steps
            </h2>
            <p className="text-muted-foreground text-sm">
              Follow this proven workflow to minimize boundary jitter, prevent
              flickering, and achieve natural lighting balance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {videoTutorialSteps.map((step) => (
              <div
                key={step.step}
                className="flex flex-col justify-between rounded-xl border border-border/70 bg-card p-6 shadow-sm relative"
              >
                <div>
                  <span className="text-3xl font-extrabold text-primary/30 block mb-2 font-mono">
                    {step.step}
                  </span>
                  <h3 className="text-base font-bold text-foreground leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                    {step.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-border/40 text-[11px] text-primary/90 bg-primary/5 p-2.5 rounded-lg">
                  <strong>Pro Tip:</strong> {step.tip}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* FAQ Section */}
      <section className="py-12 md:py-16">
        <Container className="max-w-4xl">
          <div className="space-y-3 mb-8 text-center">
            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground text-sm">
              Common questions on rendering speed, watermarks, free credits, and
              multi-face support.
            </p>
          </div>

          <div className="space-y-4">
            {videoFaqs.map((faq) => (
              <div
                key={faq.question}
                className="rounded-xl border border-border/80 bg-card p-5 shadow-sm"
              >
                <h3 className="text-base font-semibold text-foreground flex items-start gap-2">
                  <HelpCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>{faq.question}</span>
                </h3>
                <p className="mt-2.5 text-sm text-muted-foreground leading-relaxed pl-7">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Related Guides & Internal Links Cluster */}
      <section className="py-10 bg-muted/40 border-t border-border/40">
        <Container>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-semibold text-foreground">
                Explore More AI Media Guides & Tools
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Navigate between high-intent AI tool comparisons and verified
                playbooks.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/face-swap-gif"
                className="text-xs font-semibold text-primary hover:underline px-3 py-1.5 rounded-lg border border-primary/20 bg-primary/5 inline-flex items-center gap-1"
              >
                <Film className="h-3.5 w-3.5" />
                <span>Face Swap GIF Guide</span>
              </Link>
              <Link
                href="/item/fakeface"
                className="text-xs font-semibold text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg border border-border/60 bg-card inline-flex items-center gap-1"
              >
                <Flame className="h-3.5 w-3.5 text-amber-500" />
                <span>FakeFace Profile</span>
              </Link>
              <Link
                href="/gpt-6-astra"
                className="text-xs font-semibold text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg border border-border/60 bg-card inline-flex items-center gap-1"
              >
                <Zap className="h-3.5 w-3.5 text-indigo-500" />
                <span>GPT-6 Astra Dossier</span>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
