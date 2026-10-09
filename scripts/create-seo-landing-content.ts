import { createClient } from "@sanity/client";
import dotenv from "dotenv";

dotenv.config();

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "",
  apiVersion: "2024-08-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN || "",
});

const SITE_URL = "https://findryai.com";
const AUTHOR_ID = "user.03b839ed-4c2b-4300-b648-a609bfd4d483"; // BeckChan
const CATEGORY_ID_VIDEO = "3K8X69qslHmY3nhkoQEpNB"; // video-generation
const CATEGORY_ID_AI_TOOLS = "YC8O33bPim24nrYgMGuMGy"; // ai-tools
const TAG_ID_VIDEO = "B38JZnX19mtp1hvTHxYWt5"; // video
const TAG_ID_AI = "YC8O33bPim24nrYgMGuMuG"; // ai
const UPDATED = "October 9, 2026";

// ---------------------------------------------------------------------------
// Portable Text helpers
// ---------------------------------------------------------------------------
let keyCounter = 0;
function nextKey(): string {
  keyCounter += 1;
  return `k${Date.now().toString(36)}${keyCounter}`;
}

type Span = { _type: "span"; _key: string; text: string; marks: string[] };
type MarkDef = { _type: "link"; _key: string; href: string };

interface Block {
  _type: string;
  _key: string;
  children?: unknown[];
  markDefs?: MarkDef[];
  [k: string]: unknown;
}

function makeBlock(style: string, spans: Span[], markDefs: MarkDef[] = []): Block {
  return {
    _type: "block",
    _key: nextKey(),
    style,
    markDefs,
    children: spans,
  };
}

function span(text: string, marks: string[] = []): Span {
  return { _type: "span", _key: nextKey(), text, marks };
}

function linkDef(href: string): MarkDef {
  return { _type: "link", _key: nextKey(), href };
}

// p`plain paragraph`, accepts strings and [text, href] tuples
function p(...parts: (string | [string, string])[]): Block {
  const markDefs: MarkDef[] = [];
  const spans = parts.map((part) => {
    if (typeof part === "string") return span(part);
    const def = linkDef(part[1]);
    markDefs.push(def);
    return span(part[0], [def._key]);
  });
  return makeBlock("normal", spans, markDefs);
}

function h2(text: string): Block {
  return makeBlock("h2", [span(text)]);
}
function h3(text: string): Block {
  return makeBlock("h3", [span(text)]);
}
function h4(text: string): Block {
  return makeBlock("h4", [span(text)]);
}

function ul(items: (string | [string, string])[][]): Block[] {
  return items.map((parts) => {
    const markDefs: MarkDef[] = [];
    const spans = parts.map((part) => {
      if (typeof part === "string") return span(part);
      const def = linkDef(part[1]);
      markDefs.push(def);
      return span(part[0], [def._key]);
    });
    return {
      _type: "block",
      _key: nextKey(),
      style: "normal",
      listItem: "bullet",
      level: 1,
      markDefs,
      children: spans,
    };
  });
}

function quote(text: string): Block {
  return makeBlock("blockquote", [span(text)]);
}

// ---------------------------------------------------------------------------
// Blog category
// ---------------------------------------------------------------------------
async function ensureBlogCategory(): Promise<string> {
  const existing = await client.fetch<{ _id: string }[]>(
    `*[_type == "blogCategory" && slug.current == "ai-news"][0]{_id}`,
  );
  if (existing) return existing._id;
  const created = await client.create({
    _type: "blogCategory",
    name: "AI News",
    slug: { _type: "slug", current: "ai-news" },
    description:
      "Model launches, rumors, and release-date trackers for the latest AI models.",
    priority: 10,
  });
  console.log(`[created] blogCategory ai-news (${created._id})`);
  return created._id;
}

// ---------------------------------------------------------------------------
// Item: Seedance 2.5
// ---------------------------------------------------------------------------
const SEEDANCE_INTRODUCTION = `## What is Seedance 2.5?

Seedance 2.5 is ByteDance's next-generation AI video generation model, officially released on July 31, 2026. Built on a unified multimodal audio-video joint-generation architecture, it can produce complete 30-second videos with synchronized sound in a single pass — and extend them twice for longer stories — at up to 4K resolution. It is the successor to Seedance 2.0 and currently one of the strongest options for long-form, controllable AI video.

## Key Capabilities

- **30-second native generation** with synchronized audio, extendable twice for richer, more complete storytelling
- **Multimodal inputs**: text prompts, images, video clips, audio, scripts, and up to 50 subject/style references (R2V)
- **Reference-based control** for consistent characters, stable camera flow, and precise scene layout across long scenes
- **Clean 4K output** with improved stability — no random subtitles or unwanted background music
- **Multilingual creation** including Chinese, English, Spanish, Indonesian, Malay, Thai, Arabic, Portuguese, Vietnamese, Japanese, and Korean
- **Local editing** to refine parts of a generated video without regenerating the whole clip

## Where to Try Seedance 2.5 Free

Seedance 2.5 rolled out on ByteDance's own consumer platforms first, and third-party aggregators followed:

- **Dreamina (CapCut)** — the international flagship entry. Seedance 2.5 is live worldwide on Dreamina with free daily credits, so you can test real generations before subscribing. Best starting point for most users.
- **Jimeng AI (即梦)** — the original Chinese-language entry (Jimeng Web → Video Generation → Seedance 2.5).
- **Doubao Pro** — ByteDance's assistant app, with Seedance 2.5 available in its video generation mode.
- **Third-party aggregators** — platforms such as Pollo AI, Higgsfield, OpenArt, fal.ai, and Replicate expose Seedance 2.5 alongside competing models, which is handy for side-by-side comparisons, though pricing and version availability vary by platform.

## Seedance 2.5 Platform Comparison

- **Dreamina** — easiest free entry, 4K support, up to 50 multimodal references, editing tools built in. Best for creators who want an end-to-end workflow.
- **Jimeng AI** — first-party access with the newest features in China; interface primarily in Chinese.
- **CapCut integration** — generate with Seedance, then edit in the same ecosystem CapCut provides; ideal for short-form social content.
- **BytePlus ModelArk (API)** — the official enterprise API for developers building Seedance into products, with usage-based pricing.
- **fal.ai / Replicate** — developer-friendly hosted APIs, useful for prototyping without a ByteDance cloud account.

## Prompt Tips for Seedance 2.5

Seedance 2.5 responds well to structured prompts. A reliable template:

**[Shot type] + [Subject + action] + [Scene] + [Camera movement] + [Style] + [Audio]**

Example: *"Medium tracking shot, a young chef plate pasta in a rustic kitchen, warm evening light through the window, slow dolly-in, cinematic film look, ambient kitchen sounds and soft jazz."*

Additional tips:

- Put camera language explicitly (dolly, pan, orbit, handheld) — the model respects cinematography terms well.
- For reference-based (R2V) work, describe *how* references should be used ("keep the character's face from image 1, place her in the scene from image 2").
- For 30-second videos, structure the prompt as a mini-storyboard with a beginning, middle, and end instead of one static description.
- Use the extend feature rather than cramming everything into one prompt: generate a strong opening scene first, then extend.

## API Access

Developers can access Seedance 2.5 through **BytePlus ModelArk**, ByteDance's official model platform, with text-to-video and image-to-video endpoints. Hosted alternatives like **fal.ai** and **Replicate** also offer pay-per-generation APIs if you prefer not to manage a BytePlus account. All of them bill per second of generated video, so prototype prompts on the free Dreamina credits before moving to API volume.

## Is Seedance 2.5 Free?

Testing is free: Dreamina provides daily free credits, and Jimeng offers free trials within its quota. Sustained or commercial use requires a subscription on consumer platforms, or usage-based API billing on ModelArk/fal/Replicate.

## Frequently Asked Questions

### What is Seedance 2.5?

It is ByteDance's 2026 flagship AI video generation model, supporting text, image, video, audio, and reference inputs, and generating up to 30 seconds of 1080p–4K video with synchronized audio in one pass.

### How long can Seedance 2.5 videos be?

30 seconds natively, with the option to extend the clip twice for longer narratives.

### Does Seedance 2.5 generate audio?

Yes. It uses audio-video joint generation, so dialogue, ambient sound, and music cues are generated in sync with the visuals.

### Where can I use Seedance 2.5 for free?

Dreamina (by CapCut) offers free daily credits, and Jimeng AI provides trial quota. Both are official ByteDance surfaces.

### Is there an API?

Yes — the official route is BytePlus ModelArk, with third-party hosted APIs on fal.ai and Replicate.`;

async function upsertSeedanceItem(): Promise<string> {
  const existing = await client.fetch<{ _id: string }[]>(
    `*[_type == "item" && slug.current == "seedance-2-5"][0]{_id}`,
  );

  const baseDoc: Record<string, unknown> = {
    _type: "item",
    name: "Seedance 2.5",
    slug: { _type: "slug", current: "seedance-2-5" },
    link: "https://seed.bytedance.com/en/seedance2_5",
    description:
      "Seedance 2.5 is ByteDance's audio-video joint generation model that creates 30-second 4K videos with synchronized sound from text, images, and video references.",
    introduction: SEEDANCE_INTRODUCTION,
    publishDate: new Date().toISOString(),
    pricePlan: "free",
    freePlanStatus: "approved",
    categories: [
      { _type: "reference", _ref: CATEGORY_ID_VIDEO, _key: "c0" },
      { _type: "reference", _ref: CATEGORY_ID_AI_TOOLS, _key: "c1" },
    ],
    tags: [
      { _type: "reference", _ref: TAG_ID_VIDEO, _key: "t0" },
      { _type: "reference", _ref: TAG_ID_AI, _key: "t1" },
    ],
  };

  if (existing) {
    await client.patch(existing._id).set(baseDoc).commit();
    console.log(`[patched] item seedance-2-5 (${existing._id})`);
    return existing._id;
  }
  const created = await client.create(baseDoc);
  console.log(`[created] item seedance-2-5 (${created._id})`);
  return created._id;
}

// ---------------------------------------------------------------------------
// Blog posts
// ---------------------------------------------------------------------------
const HAIKU_SLUG = "claude-haiku-5-5";
const FABLE_SLUG = "claude-fable-5-5";

function haikuBody(): Block[] {
  const claudeLink = p(
    "For context on the current lineup, see our ",
    ["Claude overview", `${SITE_URL}/item/claude`],
    ".",
  );
  return [
    p(`Last updated: ${UPDATED}. Claude Haiku 5.5 has not been officially announced by Anthropic. Everything below is based on credible leaks, supply-chain chatter, and the pattern of previous Anthropic releases — treat it accordingly.`),
    h2("What is Claude Haiku 5.5?"),
    p(
      "Claude Haiku 5.5 is the expected successor to Anthropic's Haiku line — the small, fast, cost-optimized tier of the Claude family. Where Opus and Sonnet models handle complex reasoning and agentic work, Haiku models exist for high-volume, latency-sensitive, cost-sensitive jobs: classification, extraction, moderation, customer-facing chat, and routing inside larger pipelines.",
    ),
    p(
      "Interest in Haiku 5.5 spiked sharply in early October 2026 as signs of an imminent launch accumulated, making it one of the fastest-rising model queries right now.",
    ),
    h2("Release date: what we know"),
    p(
      "Anthropic has not confirmed a date. Based on the current leak cadence and how quickly Haiku-tier models typically follow a major flagship release, a public launch in the coming weeks is the working expectation. This section is updated as new information lands — check back or watch Anthropic's official channels for the announcement.",
    ),
    ...ul([
      [string("No official announcement or documentation page exists yet.")],
      [string("Third-party tracking and app-indexing chatter accelerated in the first week of October 2026.")],
      [string("Previous Haiku generations shipped quietly, often alongside or shortly after a larger model launch.")],
    ]),
    h2("Expected capabilities"),
    p(
      "If Haiku 5.5 follows the line's trajectory, expect a model tuned for throughput and price-to-intelligence rather than frontier reasoning:",
    ),
    ...ul([
      [string("Meaningful quality jump over Haiku 4.5, closing part of the gap to Sonnet-class models on routine tasks")],
      [string("Fast time-to-first-token and high output throughput for real-time and bulk workloads")],
      [string("A significantly lower price band than Sonnet — the reason most teams pick Haiku at all")],
      [string("Strong instruction-following and tool use for agentic sub-tasks, where small models do most of the calls")],
    ]),
    h2("Expected pricing"),
    p(
      "Anthropic has not published pricing. Historically, the Haiku tier has cost roughly a fifth to a tenth of the concurrent Opus tier, with Haiku 4.5 positioned aggressively for API volume work. Expect Haiku 5.5 to stay in that budget bracket — cheap per million tokens, priced to win high-volume pipelines rather than benchmarks. We will replace this section with exact figures the moment they are official.",
    ),
    h2("Haiku 5.5 vs Sonnet vs Opus"),
    h3("Choose Haiku 5.5 when…"),
    ...ul([
      [string("Volume dominates: millions of calls per day where per-call cost is the deciding factor")],
      [string("Latency matters: user-facing chat, autocomplete, and streaming UX")],
      [string("Tasks are bounded: classification, extraction, rewriting, tagging, routing")],
    ]),
    h3("Choose Sonnet-class when…"),
    ...ul([
      [string("Tasks need multi-step reasoning, long documents, or nuanced judgment")],
      [string("A single high-quality answer is worth many cheap ones")],
    ]),
    h3("Choose Opus-class when…"),
    ...ul([
      [string("You need the frontier: hardest reasoning, agentic autonomy, research-grade analysis")],
    ]),
    h2("How to prepare for launch"),
    ...ul([
      [string("Identify the calls in your stack that are over-provisioned today — running Sonnet where Haiku would suffice.")],
      [string("Write evals now: a small golden set lets you A/B the new model on day one.")],
      [string("Keep prompts provider-agnostic so switching model IDs is a config change, not a rewrite.")],
    ]),
    h2("FAQ"),
    h3("When will Claude Haiku 5.5 be released?"),
    p("Not officially confirmed. Leak activity in early October 2026 points to a launch in the coming weeks. We update this page as soon as anything is confirmed."),
    h3("How much will Haiku 5.5 cost?"),
    p("Pricing is unannounced. The Haiku tier has historically been the cheapest Claude API option, roughly 5–10x cheaper than Opus-tier models. Expect the same positioning."),
    h3("Will Haiku 5.5 be good for coding?"),
    p("Haiku models handle routine coding assistance fine, but for complex implementation work Sonnet- or Opus-class models remain the recommendation. Haiku 5.5's likely sweet spot is high-volume, lower-complexity code tasks: reviews of small diffs, test generation, and boilerplate."),
    h3("Haiku 5.5 vs Sonnet 5.5 — which should I use?"),
    p("Use Haiku 5.5 for cost- and latency-sensitive volume; use Sonnet when task complexity justifies the premium. Many production systems route between the two dynamically."),
    quote("Rumor disclaimer: Claude Haiku 5.5 is an unreleased product. Details on this page are speculative and based on public leaks and release-pattern analysis. We correct this page promptly once Anthropic confirms specifics."),
    claudeLink,
  ];
}

function fableBody(): Block[] {
  const claudeLink = p(
    "Tracking the rest of the lineup too? Start with our ",
    ["Claude page", `${SITE_URL}/item/claude`],
    ", and see also our ",
    ["Claude Haiku 5.5 tracker", `${SITE_URL}/blog/${HAIKU_SLUG}`],
    ".",
  );
  return [
    p(`Last updated: ${UPDATED}. "Claude Fable 5.5" is not an officially announced Anthropic product. This page tracks credible rumors, leaked demos, and community analysis — clearly labeled as such — and is updated frequently as the situation develops.`),
    h2("What is Claude Fable 5.5?"),
    p(
      "Fable 5.5 is the name currently circulating in leaks and community discussion for an unannounced Anthropic model. Details are fragmentary, but the consistent picture across sources is a model positioned near the top of the Claude lineup — adjacent to or above Opus 5.5 — with particular attention on its long-context and agentic behavior.",
    ),
    h2("Rumor tracker"),
    p("A running log of what has been reported, and how reliable it looks:"),
    ...ul([
      [string("Community demos and screenshots attributed to an unannounced Claude model have circulated since June 2026; none are verified.")],
      [string("Chatter intensified after references appeared in third-party app indexes and benchmark chatter on r/singularity and X.")],
      [string("No Anthropic statement, documentation, or model card exists. Treat all capability claims as unconfirmed.")],
    ]),
    h2("Leaked demos and benchmark chatter"),
    p(
      "Screenshots and short clips making the rounds claim large gains in multi-step reasoning and noticeably better long-document comprehension versus Opus 5.5. Independent verification is impossible before launch — leaked demos are trivially easy to fabricate, and several 'Fable' screenshots in circulation have already been debunked as edits. The most useful signal so far is indirect: API changelog watchers and app integrators have flagged new unlisted model identifiers appearing in tests, which historically precedes real launches.",
    ),
    h2("Fable 5.5 vs Opus 5.5: what people expect"),
    ...ul([
      [string("Positioning: a step above the current Opus flagship, or a parallel 'specialist' tier — sources disagree.")],
      [string("Benchmarks: if real, expect Anthropic to position it against frontier peers on reasoning and agentic evals rather than raw speed.")],
      [string("Pricing: unknown. A new top tier would presumably command Opus-plus pricing, but there is no data yet.")],
    ]),
    h2("Community discussion"),
    p(
      "The conversation is concentrated on r/singularity, the ClaudeAI subreddit, and X, where compilation threads track each new screenshot and anonymous claim. The tone is the usual rumor-cycle mix — genuine signal buried in noise. We recommend treating any 'hands-on' report without reproducible output as entertainment until launch.",
    ),
    h2("FAQ"),
    h3("Is Claude Fable 5.5 real?"),
    p("Anthropic has not acknowledged it. The volume and consistency of leaks suggest something is in testing, but the name, positioning, and capabilities remain unconfirmed."),
    h3("When will Fable 5.5 be released?"),
    p("There is no credible date. We update this page as new evidence appears — that is the point of a tracker."),
    h3("How will Fable 5.5 compare to Opus 5.5?"),
    p("If leaks are accurate, expect a flagship-adjacent model with stronger long-context and agentic performance. Until an official model card exists, all comparisons are speculation."),
    h3("Where did the name 'Fable' come from?"),
    p("It surfaced in third-party leak aggregators and community posts in mid-2026 and stuck. Anthropic's actual naming for the model — if the model ships — may differ entirely."),
    quote("Rumor disclaimer: everything on this page concerns an unannounced product. We label the confidence level of each claim and will update or correct this page as official information becomes available."),
    claudeLink,
  ];
}

// helper used inside body builders (plain string list item)
function string(s: string): string {
  return s;
}

async function upsertBlogPost(
  slug: string,
  title: string,
  excerpt: string,
  body: Block[],
  blogCategoryId: string,
  relatedSlug: string,
): Promise<string> {
  const existing = await client.fetch<{ _id: string }[]>(
    `*[_type == "blogPost" && slug.current == $slug][0]{_id}`,
    { slug },
  );

  const doc: Record<string, unknown> = {
    _type: "blogPost",
    title,
    slug: { _type: "slug", current: slug },
    excerpt,
    body,
    author: { _type: "reference", _ref: AUTHOR_ID },
    categories: [{ _type: "reference", _ref: blogCategoryId, _key: "bc0" }],
    publishDate: new Date().toISOString(),
    featured: false,
  };

  if (existing) {
    await client.patch(existing._id).set(doc).commit();
    console.log(`[patched] blogPost ${slug} (${existing._id})`);
    return existing._id;
  }
  const created = await client.create(doc);
  console.log(`[created] blogPost ${slug} (${created._id})`);
  return created._id;
}

async function linkRelatedPosts(haikuId: string, fableId: string) {
  await client
    .patch(haikuId)
    .set({ relatedPosts: [{ _type: "reference", _ref: fableId, _key: "r0" }] })
    .commit();
  await client
    .patch(fableId)
    .set({ relatedPosts: [{ _type: "reference", _ref: haikuId, _key: "r0" }] })
    .commit();
  console.log("[linked] relatedPosts between the two trackers");
}

// ---------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------
async function main() {
  console.log(`[Sanity Target] Project: ${projectId()}, Dataset: ${dataset()}`);

  const blogCategoryId = await ensureBlogCategory();
  await upsertSeedanceItem();

  const haikuId = await upsertBlogPost(
    HAIKU_SLUG,
    "Claude Haiku 5.5: Release Date, Expected Pricing, and Everything We Know",
    "Anthropic's next lightweight model is ramping up. Everything we know about Claude Haiku 5.5 — rumored release window, expected pricing, and how it stacks up against Sonnet and Opus.",
    haikuBody(),
    blogCategoryId,
    FABLE_SLUG,
  );

  const fableId = await upsertBlogPost(
    FABLE_SLUG,
    "Claude Fable 5.5: Rumors, Leaked Demos, and What to Expect",
    "A frequently updated tracker for Claude Fable 5.5 — the rumor log, leaked-demo reality check, expected positioning versus Opus 5.5, and what a launch would mean.",
    fableBody(),
    blogCategoryId,
    HAIKU_SLUG,
  );

  await linkRelatedPosts(haikuId, fableId);

  // post-write verification
  const item = await client.fetch(
    `*[_type == "item" && slug.current == "seedance-2-5"][0]{_id, name, "cats": categories[]->.slug.current, "tags": tags[]->.slug.current, publishDate}`,
  );
  console.log("[verify item]", JSON.stringify(item));

  for (const slug of [HAIKU_SLUG, FABLE_SLUG]) {
    const post = await client.fetch(
      `*[_type == "blogPost" && slug.current == $slug][0]{_id, title, "author": author->.name, "cats": categories[]->.slug.current, "blocks": count(body), relatedPosts}`,
      { slug },
    );
    console.log(`[verify post ${slug}]`, JSON.stringify(post));
  }

  console.log("Done.");
}

function projectId(): string {
  return process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
}
function dataset(): string {
  return process.env.NEXT_PUBLIC_SANITY_DATASET || "";
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
