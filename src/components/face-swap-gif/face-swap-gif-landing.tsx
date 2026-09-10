import Container from "@/components/container";
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
import {
  comparisonTools,
  faceSwapGifConfig,
  faqs,
  heroStats,
  proTips,
  stepByStepGuide,
  topPicks,
  visualComparisonDemonstration,
} from "@/data/face-swap-gif";
import { cn } from "@/lib/utils";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  FileCheck2,
  Lightbulb,
  Sparkles,
  XCircle,
} from "lucide-react";
import Link from "next/link";

/* -------------------------------------------------------------------------
   Chapter Header Component (Editorial Mintlify / Runway Style)
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
    <div className="flex flex-col gap-2.5 pb-3">
      <div className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-primary">
        <span>{number}</span>
        <span className="text-muted-foreground/40">/</span>
        <span>{label}</span>
      </div>
      <h2 className="font-bricolage text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
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
   Sticky Chapter Sub-Navigation (Touch-Friendly, Clean Offset)
------------------------------------------------------------------------- */
function StickyChapterNav() {
  const chapters = [
    { href: "#picks", label: "Top Picks" },
    { href: "#comparison", label: "01 Matrix & Rules" },
    { href: "#visual-guide", label: "02 Visual Scenarios" },
    { href: "#how-to", label: "03 Workflow" },
    { href: "#pro-tips", label: "04 Quality & Privacy" },
    { href: "#faq", label: "05 FAQ" },
  ];

  return (
    <nav
      aria-label="Chapter navigation"
      className="sticky top-16 z-30 w-full border-b border-border/70 bg-background/90 py-2.5 backdrop-blur-md"
    >
      <Container>
        <div className="flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 sm:gap-2">
            {chapters.map((ch) => (
              <a
                key={ch.href}
                href={ch.href}
                className="inline-flex min-h-[36px] items-center whitespace-nowrap rounded-lg px-3.5 py-1.5 font-mono text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {ch.label}
              </a>
            ))}
          </div>
          <div className="hidden items-center gap-2 font-mono text-xs text-muted-foreground md:flex">
            <FileCheck2 className="h-3.5 w-3.5 text-emerald-500" />
            <span>
              Documented &amp; Verified {faceSwapGifConfig.lastVerifiedDate}
            </span>
          </div>
        </div>
      </Container>
    </nav>
  );
}

export function FaceSwapGifLanding() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ====================================================================
          HERO SECTION (High-Contrast Editorial Header)
      ==================================================================== */}
      <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-muted/30 via-background to-background py-16 sm:py-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_70%_50%_at_50%_-10%,rgba(120,119,198,0.12),rgba(255,255,255,0))]" />

        <Container>
          <div className="flex flex-col items-center text-center">
            {/* Tag Pill */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span>
                2026 Curated Guide • Verified Quotas &amp; Watermark Terms
              </span>
            </div>

            {/* Main Title */}
            <h1 className="max-w-4xl font-bricolage text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl leading-[1.15]">
              AI <span className="text-primary">Face Swap GIF</span> Tools: Free
              Quotas, Watermarks &amp; Limits Compared
            </h1>

            {/* Subtitle */}
            <p className="mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg leading-relaxed">
              Looking to swap faces in reaction GIFs and memes? We audited the
              leading web-based AI tools to uncover real guest quotas,
              multi-face detection support, and which platforms offer genuine
              zero-watermark exports.
            </p>

            {/* Quick CTAs */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
              <a
                href="#picks"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-12 px-7 font-bold text-sm shadow-sm",
                )}
              >
                Explore Top Picks <ArrowRight className="ml-2 h-4 w-4" />
              </a>
              <a
                href="#comparison"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-12 px-7 text-sm font-semibold",
                )}
              >
                View Full Comparison Matrix
              </a>
            </div>

            {/* Hero Stats Snapshot */}
            <div className="mt-12 grid w-full max-w-4xl grid-cols-2 gap-3.5 sm:grid-cols-4 sm:gap-4">
              {heroStats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col items-center justify-center rounded-xl border border-border/70 bg-card/60 p-4 text-center backdrop-blur-sm shadow-xs"
                >
                  <span className="font-bricolage text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                    {stat.value}
                  </span>
                  <span className="mt-1 text-xs text-muted-foreground font-medium">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Sticky Chapter Sub-Nav */}
      <StickyChapterNav />

      {/* ====================================================================
          CHAPTER 00: TOP PICKS (Asymmetric Hierarchy / Primary Hero Card)
      ==================================================================== */}
      <section
        id="picks"
        className="scroll-mt-24 py-16 border-b border-border/60"
      >
        <Container>
          <ChapterHeader
            number="00"
            label="Quick Selection"
            title="Top Recommended Tools by Use Case"
            subtitle="Based on documented free tiers, watermark policies, and file format allowances from official portals."
          />

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Primary Highlight Card */}
            <div className="relative flex flex-col justify-between rounded-2xl border-2 border-primary/40 bg-card p-6 shadow-md lg:col-span-2">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <Badge
                    variant="default"
                    className="text-xs font-bold px-3 py-1"
                  >
                    Featured Choice • {topPicks[0].category}
                  </Badge>
                  <span className="font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    100% Free / Clean Export
                  </span>
                </div>
                <h3 className="mt-4 font-bricolage text-2xl font-bold text-foreground">
                  {topPicks[0].tool}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {topPicks[0].highlight}
                </p>

                <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3 rounded-xl bg-muted/40 p-4 text-xs">
                  <div>
                    <span className="text-muted-foreground block font-medium">
                      Cost Model:
                    </span>
                    <span className="font-semibold text-foreground">
                      Free (No Credits)
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block font-medium">
                      Watermark:
                    </span>
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      None on export
                    </span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block font-medium">
                      Account:
                    </span>
                    <span className="font-semibold text-foreground">
                      Instant Guest Use
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between gap-4 pt-4 border-t border-border/50">
                <span className="text-xs text-muted-foreground">
                  Best for single-subject reaction GIFs &amp; stickers
                </span>
                <a
                  href={topPicks[0].url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    buttonVariants({ size: "sm" }),
                    "font-semibold text-xs",
                  )}
                >
                  <span>Visit {topPicks[0].tool}</span>
                  <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            {/* Side Highlights */}
            <div className="flex flex-col gap-4">
              {topPicks.slice(1).map((pick) => (
                <div
                  key={pick.tool}
                  className="flex flex-col justify-between rounded-xl border border-border/70 bg-card p-5 transition-all hover:border-primary/40 shadow-xs"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-semibold text-primary">
                        {pick.category}
                      </span>
                      <Badge
                        variant="outline"
                        className="text-[10px] font-semibold"
                      >
                        {pick.badge}
                      </Badge>
                    </div>
                    <h4 className="mt-2 font-bricolage text-lg font-bold text-foreground">
                      {pick.tool}
                    </h4>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {pick.highlight}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-border/40">
                    <a
                      href={pick.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                    >
                      <span>Open {pick.tool}</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* ====================================================================
          CHAPTER 01: COMPREHENSIVE FEATURE MATRIX
      ==================================================================== */}
      <section
        id="comparison"
        className="scroll-mt-24 py-16 border-b border-border/60 bg-muted/20"
      >
        <Container>
          <ChapterHeader
            number="01"
            label="Specifications"
            title="Feature, Watermark &amp; Data Policy Matrix"
            subtitle="Directly comparing published allowances, export policies, and upload thresholds across vetted platforms."
          />

          <div className="mt-8 overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/60">
                  <TableRow>
                    <TableHead className="w-[170px] font-bold text-foreground">
                      Platform
                    </TableHead>
                    <TableHead className="w-[140px] font-semibold">
                      Free Quota
                    </TableHead>
                    <TableHead className="w-[140px] font-semibold">
                      Watermark Policy
                    </TableHead>
                    <TableHead className="w-[110px] font-semibold">
                      Sign-Up
                    </TableHead>
                    <TableHead className="w-[110px] font-semibold">
                      Multi-Face
                    </TableHead>
                    <TableHead className="w-[110px] font-semibold">
                      Max Upload
                    </TableHead>
                    <TableHead className="w-[160px] font-semibold">
                      Data Retention
                    </TableHead>
                    <TableHead className="w-[90px] text-right font-semibold">
                      Source
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody className="text-sm">
                  {comparisonTools.map((tool) => (
                    <TableRow key={tool.name} className="hover:bg-muted/30">
                      <TableCell className="font-semibold text-foreground">
                        <div className="flex flex-col">
                          <span>{tool.name}</span>
                          {tool.badge ? (
                            <span className="text-[11px] font-mono font-medium text-primary">
                              {tool.badge}
                            </span>
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {tool.freeTier}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-xs font-medium">
                          {tool.watermarkOnFree ? (
                            <>
                              <XCircle className="h-4 w-4 text-amber-500 shrink-0" />
                              <span className="text-muted-foreground">
                                {tool.watermarkNote}
                              </span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                              <span className="text-emerald-600 dark:text-emerald-400">
                                No Watermark
                              </span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {tool.noSignUpNeeded ? (
                          <Badge
                            variant="outline"
                            className="border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-[10px]"
                          >
                            Optional (Guest)
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            Required
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {tool.multiFaceSupport ? (
                          <span className="text-xs font-semibold text-primary">
                            Up to 4 Faces
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            Single Only
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs font-mono text-muted-foreground">
                        {tool.maxFileSize}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {tool.retentionPolicy}
                      </TableCell>
                      <TableCell className="text-right">
                        <a
                          href={tool.sourceDocUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-mono text-xs text-primary hover:underline"
                        >
                          Portal <ExternalLink className="h-3 w-3" />
                        </a>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-border/60 bg-card p-4 text-xs text-muted-foreground">
            <Lightbulb className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Understanding Watermarks:</strong> Some platforms
              advertise free access on search engines but restrict clean
              downloads to paid tiers. If you plan to export reaction GIFs
              directly for Discord, Slack, or X, select tools marked with{" "}
              <em>No Watermark</em>.
            </p>
          </div>
        </Container>
      </section>

      {/* ====================================================================
          CHAPTER 02: VISUAL SCENARIO DEMONSTRATIONS (Runway / Output Style)
      ==================================================================== */}
      <section
        id="visual-guide"
        className="scroll-mt-24 py-16 border-b border-border/60"
      >
        <Container>
          <ChapterHeader
            number="02"
            label="Visual Scenarios"
            title="Choosing the Right Pipeline for Your GIF"
            subtitle="Different animation formats pose distinct challenges for AI landmark detection. Here is how to match your clip type to the optimal tool."
          />

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
            {visualComparisonDemonstration.map((demo, idx) => (
              <div
                key={demo.title}
                className="flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-6 shadow-xs"
              >
                <div>
                  <div className="flex items-center gap-2 font-mono text-xs font-bold text-primary">
                    <span>CASE 0{idx + 1}</span>
                  </div>
                  <h3 className="mt-2 font-bricolage text-lg font-bold text-foreground">
                    {demo.title}
                  </h3>
                  <div className="mt-3 rounded-lg bg-primary/5 p-3 text-xs font-medium text-primary">
                    <strong>Recommended:</strong> {demo.recommendedTool}
                  </div>
                  <p className="mt-3 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                    {demo.whyItWorks}
                  </p>
                </div>

                <div className="mt-5 border-t border-border/50 pt-3 text-xs text-muted-foreground">
                  <strong className="text-foreground">Key Tip:</strong>{" "}
                  {demo.keyCheck}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ====================================================================
          CHAPTER 03: STEP-BY-STEP WORKFLOW
      ==================================================================== */}
      <section
        id="how-to"
        className="scroll-mt-24 py-16 border-b border-border/60 bg-muted/20"
      >
        <Container>
          <ChapterHeader
            number="03"
            label="Walkthrough"
            title="How to Execute a Smooth GIF Face Swap"
            subtitle="A four-step framework to avoid edge jitter, color banding, and misaligned facial landmarks."
          />

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            {stepByStepGuide.map((item) => (
              <div
                key={item.step}
                className="flex flex-col rounded-2xl border border-border/70 bg-card p-6 shadow-xs"
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 font-mono text-base font-bold text-primary">
                    {item.step}
                  </div>
                  <h3 className="font-bricolage text-lg font-bold text-foreground">
                    {item.title}
                  </h3>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>

                <div className="mt-5 rounded-xl bg-muted/50 p-3.5 text-xs text-muted-foreground">
                  <strong className="text-foreground font-semibold">
                    Practical Advice:
                  </strong>{" "}
                  {item.tips}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ====================================================================
          CHAPTER 04: PRO TIPS, ETHICS & PRIVACY
      ==================================================================== */}
      <section
        id="pro-tips"
        className="scroll-mt-24 py-16 border-b border-border/60"
      >
        <Container>
          <ChapterHeader
            number="04"
            label="Technical &amp; Ethics"
            title="Quality Optimizations &amp; Responsible Usage"
            subtitle="Technical strategies to overcome GIF palette compression while respecting individual consent and data privacy."
          />

          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
            {proTips.map((tip) => (
              <div
                key={tip.title}
                className="flex flex-col rounded-xl border border-border/70 bg-card p-6"
              >
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                  <h4 className="font-bricolage text-base font-bold text-foreground">
                    {tip.title}
                  </h4>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {tip.body}
                </p>
              </div>
            ))}
          </div>

          {/* Ethical Disclaimer */}
          <div className="mt-8 rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 text-sm text-muted-foreground leading-relaxed">
            <div className="flex items-center gap-2 font-bold text-foreground text-base">
              <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0" />
              <span>Consent &amp; Ethical AI Guidelines</span>
            </div>
            <p className="mt-2.5">
              Face swap tools should be used strictly for consensual creative
              projects, parody, and entertainment. Never create non-consensual
              sexual imagery (NCII), impersonate individuals for deceptive
              purposes, or infringe on copyrighted media. Reputable tools
              enforce automated data deletion policies to safeguard uploaded
              biometrics.
            </p>
          </div>
        </Container>
      </section>

      {/* ====================================================================
          CHAPTER 05: FAQ (DETAILS/SUMMARY NATIVE DOM PRESERVATION)
      ==================================================================== */}
      <section
        id="faq"
        className="scroll-mt-24 py-16 border-b border-border/60 bg-muted/20"
      >
        <Container>
          <ChapterHeader
            number="05"
            label="Inquiries"
            title="Frequently Asked Questions"
            subtitle="Key answers regarding export watermarks, multi-person support, color artifacts, and account requirements."
          />

          <div className="mt-8 max-w-3xl space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-xl border border-border/70 bg-card p-5 transition-colors open:bg-card/90"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between font-bricolage text-base font-bold text-foreground [&::-webkit-details-marker]:hidden">
                  <span>{faq.question}</span>
                  <ChevronDown className="h-4 w-4 shrink-0 transition-transform duration-200 group-open:rotate-180 text-muted-foreground" />
                </summary>
                <div className="pt-3 text-sm leading-relaxed text-muted-foreground border-t border-border/40 mt-3">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </Container>
      </section>

      {/* ====================================================================
          CROSS-LINKING CALLOUT
      ==================================================================== */}
      <section className="py-16">
        <Container>
          <div className="relative overflow-hidden rounded-2xl border border-border/70 bg-gradient-to-br from-card via-card to-muted/40 p-8 sm:p-12">
            <div className="max-w-2xl">
              <Badge
                variant="outline"
                className="mb-3.5 font-mono text-xs text-primary"
              >
                Explore More AI Tools
              </Badge>
              <h3 className="font-bricolage text-2xl font-bold text-foreground sm:text-3xl">
                Looking for Full Video &amp; Image Editing Suites?
              </h3>
              <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
                Discover hundreds of curated generative AI tools across video
                synthesis, image upscaling, voice cloning, and coding assistants
                in our main directory.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3.5">
                <Link
                  href="/category"
                  className={cn(
                    buttonVariants({ size: "default" }),
                    "font-bold text-xs h-10 px-5",
                  )}
                >
                  Browse AI Categories{" "}
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "default" }),
                    "text-xs h-10 px-5 font-semibold",
                  )}
                >
                  Return to Home
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
