import Container from "@/components/container";
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
import {
  comparisonTools,
  faceSwapGifConfig,
  faqs,
  heroStats,
  popularMemeTemplates,
  proTips,
  stepByStepGuide,
  topPicks,
} from "@/data/face-swap-gif";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  Flame,
  HelpCircle,
  Image as ImageIcon,
  Layers,
  Lightbulb,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Users,
  Video,
  Wand2,
  XCircle,
  Zap,
} from "lucide-react";
import Link from "next/link";

/* -------------------------------------------------------------------------
   Chapter Header Component
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
   Sticky Chapter Sub-Navigation
------------------------------------------------------------------------- */
function StickyChapterNav() {
  const chapters = [
    { href: "#picks", label: "Top Picks" },
    { href: "#comparison", label: "01 Full Comparison" },
    { href: "#how-to", label: "02 How-To Guide" },
    { href: "#memes", label: "03 Popular Memes" },
    { href: "#tips", label: "04 Pro Tips & Ethics" },
    { href: "#faq", label: "05 FAQ" },
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
                className="whitespace-nowrap rounded-md px-3 py-1 font-mono text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {ch.label}
              </a>
            ))}
          </div>
          <div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Updated {faceSwapGifConfig.updatedDate}</span>
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
          HERO SECTION
      ==================================================================== */}
      <section className="relative overflow-hidden border-b border-border/60 py-16 sm:py-20 lg:py-24">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]" />

        <Container>
          <div className="flex flex-col items-center text-center">
            {/* Tag Pill */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-medium text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span>2026 Curated Guide • Verified No-Watermark Picks</span>
            </div>

            {/* Main Title */}
            <h1 className="font-bricolage text-3xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl max-w-4xl leading-tight">
              Best AI <span className="text-primary">Face Swap GIF</span> Tools
              Online (Free &amp; No Watermark)
            </h1>

            {/* Subtitle */}
            <p className="mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
              Swap faces into animated reaction GIFs, memes, and movie clips in
              seconds. No credit cards, no fake sign-up loops, and zero
              watermark stamps on your final meme exports.
            </p>

            {/* Quick CTAs */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#picks"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-11 px-6 font-semibold",
                )}
              >
                View Top Free Picks <ArrowRight className="ml-2 h-4 w-4" />
              </a>
              <a
                href="#how-to"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-11 px-6",
                )}
              >
                Step-by-Step Tutorial
              </a>
            </div>

            {/* Hero Stats Snapshot */}
            <div className="mt-12 grid w-full max-w-4xl grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
              {heroStats.map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col items-center justify-center rounded-xl border border-border/60 bg-muted/40 p-4 text-center backdrop-blur-sm"
                >
                  <span className="font-bricolage text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                    {stat.value}
                  </span>
                  <span className="mt-1 text-xs text-muted-foreground">
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
          CHAPTER: TOP PICKS (Quick Answer for Impatient Users)
      ==================================================================== */}
      <section
        id="picks"
        className="scroll-mt-24 py-14 border-b border-border/60"
      >
        <Container>
          <ChapterHeader
            number="00"
            label="Quick Verdict"
            title="Editor's Top Tested Picks"
            subtitle="Skip the trial-and-error. Here are the standout AI face swappers tested for watermark policy, speed, and real meme reliability."
          />

          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
            {topPicks.map((pick) => (
              <div
                key={pick.tool}
                className="group relative flex flex-col justify-between rounded-xl border border-border/60 bg-card p-5 transition-all hover:border-primary/50 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-medium text-muted-foreground">
                      {pick.category}
                    </span>
                    <Badge
                      variant="secondary"
                      className="text-[10px] font-semibold"
                    >
                      {pick.badge}
                    </Badge>
                  </div>
                  <h3 className="mt-3 font-bricolage text-xl font-bold text-foreground">
                    {pick.tool}
                  </h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                    {pick.highlight}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-border/50">
                  <a
                    href={pick.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      buttonVariants({ variant: "outline", size: "sm" }),
                      "w-full justify-between text-xs group-hover:border-primary group-hover:text-primary",
                    )}
                  >
                    <span>Try {pick.tool}</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ====================================================================
          CHAPTER 01: FULL COMPARISON TABLE
      ==================================================================== */}
      <section
        id="comparison"
        className="scroll-mt-24 py-14 border-b border-border/60 bg-muted/20"
      >
        <Container>
          <ChapterHeader
            number="01"
            label="Side-by-Side Review"
            title="Comprehensive Feature & Watermark Matrix"
            subtitle="Most platforms hide their watermark policy until you reach the final download step. Here is the unvarnished breakdown of how each tool performs."
          />

          <div className="mt-8 overflow-hidden rounded-xl border border-border/60 bg-card shadow-sm">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/50">
                  <TableRow>
                    <TableHead className="w-[180px] font-semibold">
                      Tool
                    </TableHead>
                    <TableHead className="w-[140px] font-semibold">
                      Free Allowance
                    </TableHead>
                    <TableHead className="w-[150px] font-semibold">
                      Watermark Status
                    </TableHead>
                    <TableHead className="w-[120px] font-semibold">
                      No Sign-Up?
                    </TableHead>
                    <TableHead className="w-[120px] font-semibold">
                      Multi-Face?
                    </TableHead>
                    <TableHead className="w-[100px] font-semibold">
                      Speed
                    </TableHead>
                    <TableHead className="w-[180px] font-semibold">
                      Best For
                    </TableHead>
                    <TableHead className="w-[100px] text-right font-semibold">
                      Link
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {comparisonTools.map((tool) => (
                    <TableRow key={tool.name} className="hover:bg-muted/40">
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span className="font-bold text-foreground">
                            {tool.name}
                          </span>
                          {tool.badge ? (
                            <span className="text-[10px] text-primary font-medium">
                              {tool.badge}
                            </span>
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {tool.freeTier}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 text-xs">
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
                              <span className="font-medium text-emerald-600 dark:text-emerald-400">
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
                            Yes (Instant)
                          </Badge>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            Login required
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {tool.multiFaceSupport ? (
                          <span className="text-xs font-medium text-primary">
                            Yes (Group)
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            Single only
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-xs font-mono text-muted-foreground">
                        {tool.renderSpeed}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {tool.bestFor}
                      </TableCell>
                      <TableCell className="text-right">
                        <a
                          href={tool.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-mono text-xs text-primary hover:underline"
                        >
                          Visit <ExternalLink className="h-3 w-3" />
                        </a>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
            <Lightbulb className="h-4 w-4 text-amber-500" />
            <span>
              <strong>Pro-tip:</strong> If you frequently swap group reaction
              GIFs (like the 3-person Distracted Boyfriend meme), select tools
              with multi-face support to map individual portraits in one pass.
            </span>
          </div>
        </Container>
      </section>

      {/* ====================================================================
          CHAPTER 02: STEP-BY-STEP TUTORIAL
      ==================================================================== */}
      <section
        id="how-to"
        className="scroll-mt-24 py-14 border-b border-border/60"
      >
        <Container>
          <ChapterHeader
            number="02"
            label="Tutorial"
            title="How to Face Swap an Animated GIF (4 Easy Steps)"
            subtitle="Follow this streamlined walkthrough to create smooth, natural-looking face swap GIFs that do not jitter or flicker."
          />

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            {stepByStepGuide.map((item) => (
              <div
                key={item.step}
                className="relative flex flex-col rounded-xl border border-border/60 bg-card p-6 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 font-mono text-sm font-bold text-primary">
                    {item.step}
                  </div>
                  <h3 className="font-bricolage text-lg font-bold text-foreground">
                    {item.title}
                  </h3>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.description}
                </p>

                <div className="mt-4 rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
                  <strong className="text-foreground">Recommendation:</strong>{" "}
                  {item.tips}
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ====================================================================
          CHAPTER 03: MEME TEMPLATES
      ==================================================================== */}
      <section
        id="memes"
        className="scroll-mt-24 py-14 border-b border-border/60 bg-muted/20"
      >
        <Container>
          <ChapterHeader
            number="03"
            label="Inspiration"
            title="Classic Meme GIF Templates Tested"
            subtitle="These evergreen meme animations consistently deliver the highest comedic payoff when personalized for group chats or Twitter threads."
          />

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {popularMemeTemplates.map((template) => (
              <div
                key={template.name}
                className="flex flex-col justify-between rounded-xl border border-border/60 bg-card p-5"
              >
                <div>
                  <Badge
                    variant="outline"
                    className="text-[10px] mb-2 font-mono"
                  >
                    {template.difficulty} Difficulty
                  </Badge>
                  <h4 className="font-bricolage text-base font-bold text-foreground">
                    {template.name}
                  </h4>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                    {template.scenario}
                  </p>
                </div>

                <div className="mt-4 border-t border-border/40 pt-3 text-[11px] text-muted-foreground">
                  <div>
                    <span className="font-medium text-foreground">Faces:</span>{" "}
                    {template.faces}
                  </div>
                  <div className="mt-1">
                    <span className="font-medium text-foreground">
                      Recommended:
                    </span>{" "}
                    <span className="text-primary">{template.bestTool}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ====================================================================
          CHAPTER 04: PRO TIPS & SAFETY/ETHICS
      ==================================================================== */}
      <section
        id="tips"
        className="scroll-mt-24 py-14 border-b border-border/60"
      >
        <Container>
          <ChapterHeader
            number="04"
            label="Quality & Ethics"
            title="Pro Tips for Seamless Blends & Responsible Use"
            subtitle="Ensure your GIFs look professional while keeping personal data and facial biometrics protected."
          />

          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
            {proTips.map((tip) => (
              <div
                key={tip.title}
                className="flex flex-col rounded-xl border border-border/60 bg-card p-6"
              >
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                  <h4 className="font-bricolage text-base font-bold text-foreground">
                    {tip.title}
                  </h4>
                </div>
                <p className="mt-3 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                  {tip.body}
                </p>
              </div>
            ))}
          </div>

          {/* Ethics Banner */}
          <div className="mt-8 rounded-xl border border-amber-500/20 bg-amber-500/5 p-5 text-xs sm:text-sm leading-relaxed text-muted-foreground">
            <div className="flex items-center gap-2 font-bold text-foreground text-sm">
              <ShieldAlert className="h-4 w-4 text-amber-500" />
              <span>Ethical AI &amp; Fair Use Reminder</span>
            </div>
            <p className="mt-2">
              AI face swap technology is intended for parody, harmless
              entertainment, personal memes, and creative projects with mutual
              consent. Always obtain explicit consent before uploading
              friends&apos; portraits. Never create non-consensual sexual
              material (NCII), defamatory deepfakes, or misleading political
              misinformation.
            </p>
          </div>
        </Container>
      </section>

      {/* ====================================================================
          CHAPTER 05: FAQ (ACCORDION)
      ==================================================================== */}
      <section
        id="faq"
        className="scroll-mt-24 py-14 border-b border-border/60 bg-muted/20"
      >
        <Container>
          <ChapterHeader
            number="05"
            label="Common Questions"
            title="Frequently Asked Questions About GIF Face Swapping"
            subtitle="Everything you need to know regarding watermarks, multi-face algorithms, format compatibility, and data security."
          />

          <div className="mt-8 max-w-3xl">
            <Accordion type="single" collapsible className="w-full space-y-3">
              {faqs.map((faq, idx) => (
                <AccordionItem
                  key={faq.question}
                  value={`faq-${idx}`}
                  className="rounded-lg border border-border/60 bg-card px-4 py-1"
                >
                  <AccordionTrigger className="text-left font-bricolage text-sm font-semibold hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-xs sm:text-sm leading-relaxed text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Container>
      </section>

      {/* ====================================================================
          INTER-LINKING / SISTER TOPIC BANNER
      ==================================================================== */}
      <section className="py-16">
        <Container>
          <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-br from-card via-card to-muted/40 p-8 sm:p-10">
            <div className="max-w-2xl">
              <Badge
                variant="outline"
                className="mb-3 font-mono text-xs text-primary"
              >
                Next in the Series
              </Badge>
              <h3 className="font-bricolage text-2xl font-bold text-foreground sm:text-3xl">
                Need Full HD Video Swaps Instead of GIFs?
              </h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                GIFs are perfect for lightweight loops, but full MP4 videos
                deliver 4K resolution, voice matching, and lip-syncing. Explore
                our in-depth evaluation of the best AI Video Face Swap software.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <Link
                  href="/search?q=video+face+swap"
                  className={cn(
                    buttonVariants({ size: "default" }),
                    "font-semibold text-xs",
                  )}
                >
                  Explore AI Video Tools{" "}
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
                <Link
                  href="/"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "default" }),
                    "text-xs",
                  )}
                >
                  Back to All AI Directory
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}
