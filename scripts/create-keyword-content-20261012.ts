import { createClient } from "@sanity/client";
import dotenv from "dotenv";

dotenv.config();

// Keyword-driven content batch for 2026-10-12:
// items: FilmCraft / LightCraft (ArtCraft family, design-tools)
//        Nano Banana 2.1 (image-generation)
//        Melty AI (developer-tools)
// post : Nano Banana 2.1 guide (targets: nano banana 2.1)
// Facts verified 2026-10-12: getartcraft.com/apps/{filmcraft,lightcraft},
// ai.google.dev/gemini-api/docs/image-generation (model id gemini-nano-banana-2.1),
// melty.sh + github.com/meltylabs/melty (note: melty.dev is an unrelated agency).

const SITE_URL = "https://findryai.com";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "",
  apiVersion: "2024-08-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN || "",
});

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
type Part = string | [string, string];

interface Block {
  _type: string;
  _key: string;
  children?: unknown[];
  markDefs?: MarkDef[];
  [k: string]: unknown;
}

function spansOf(parts: Part[]): { spans: Span[]; markDefs: MarkDef[] } {
  const markDefs: MarkDef[] = [];
  const spans: Span[] = parts.map((part): Span => {
    if (typeof part === "string")
      return {
        _type: "span",
        _key: nextKey(),
        text: part,
        marks: [],
      };
    const def: MarkDef = { _type: "link", _key: nextKey(), href: part[1] };
    markDefs.push(def);
    return { _type: "span", _key: nextKey(), text: part[0], marks: [def._key] };
  });
  return { spans, markDefs };
}

function p(...parts: Part[]): Block {
  const { spans, markDefs } = spansOf(parts);
  return {
    _type: "block",
    _key: nextKey(),
    style: "normal",
    markDefs,
    children: spans,
  };
}

function h2(text: string): Block {
  return {
    _type: "block",
    _key: nextKey(),
    style: "h2",
    children: [{ _type: "span", _key: nextKey(), text, marks: [] }],
  };
}
function h3(text: string): Block {
  return {
    _type: "block",
    _key: nextKey(),
    style: "h3",
    children: [{ _type: "span", _key: nextKey(), text, marks: [] }],
  };
}

function ul(items: Part[][]): Block[] {
  return items.map((parts) => {
    const { spans, markDefs } = spansOf(parts);
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
  return {
    _type: "block",
    _key: nextKey(),
    style: "blockquote",
    children: [{ _type: "span", _key: nextKey(), text, marks: [] }],
  };
}

// ---------------------------------------------------------------------------
// Taxonomy lookup
// ---------------------------------------------------------------------------
async function categoryId(slug: string): Promise<string> {
  const doc = await client.fetch<{ _id: string } | undefined>(
    `*[_type == "category" && !(_id in path("drafts.**")) && slug.current == $slug][0]{_id}`,
    { slug },
  );
  if (!doc) throw new Error(`category not found: ${slug}`);
  return doc._id;
}

async function tagId(slug: string): Promise<string> {
  const doc = await client.fetch<{ _id: string } | undefined>(
    `*[_type == "tag" && !(_id in path("drafts.**")) && slug.current == $slug][0]{_id}`,
    { slug },
  );
  if (!doc) throw new Error(`tag not found: ${slug}`);
  return doc._id;
}

async function blogCategoryId(slug: string): Promise<string> {
  const doc = await client.fetch<{ _id: string } | undefined>(
    `*[_type == "blogCategory" && slug.current == $slug][0]{_id}`,
    { slug },
  );
  if (!doc) throw new Error(`blogCategory not found: ${slug}`);
  return doc._id;
}

const AUTHOR_ID = "user.03b839ed-4c2b-4300-b648-a609bfd4d483"; // BeckChan

// ---------------------------------------------------------------------------
// Items
// ---------------------------------------------------------------------------
interface ItemSpec {
  slug: string;
  name: string;
  link: string;
  description: string;
  introduction: string;
  categorySlugs: string[];
  tagSlugs: string[];
}

const FILMCRAFT_ITEM: ItemSpec = {
  slug: "filmcraft",
  name: "FilmCraft",
  link: "https://getartcraft.com/apps/filmcraft",
  description:
    "FilmCraft is a free, open-source video editor written from scratch in pure Rust by the ArtCraft team — a Premiere-style timeline, its own codecs, color grading and broadcast-ready audio in a native app.",
  categorySlugs: ["design-tools"],
  tagSlugs: ["open-source", "tech"],
  introduction: `## What is FilmCraft?

FilmCraft is the ArtCraft team's open-source video editor — professional editing "rebuilt from scratch" in pure Rust, with source and program monitors, a real timeline and every trim mode, down to its own native codecs. Same family as [PhotoCraft](https://findryai.com/item/photocraft) and [VectorCraft](https://findryai.com/item/vectorcraft). Free, open source, no subscription.

## Key Features

- **A timeline you already know** — source and program monitors, three-point editing, every trim mode, J/K/L dynamic trimming.
- **Frame-exact time** — an integer timebase keeps 23.976 and 29.97 drop-frame exact. No drift, no rounding, no mystery frames.
- **Its own codecs** — no FFmpeg inside: native H.264, HEVC, ProRes, VP9, AAC and Opus with bit-exact decoders.
- **Color grading** — curves, color wheels, HSL secondaries, LUTs, HDR and log workflows, plus scopes.
- **Effects and keyframes** — about 55 video effects and 30 transitions, keyframes with value and velocity graphs, and a linear-light GPU compositor.
- **Broadcast-ready audio** — EBU R128 loudness meters, a mixer with automation, native DSP effects.

## Current Status

FilmCraft is in active development with installers already available for macOS, Windows and Linux. Get it standalone or (recommended) via the ArtCraft Launcher, which installs every Crafting App and keeps them updated. See the [ArtCraft suite overview](https://findryai.com/blog/artcraft-open-source-adobe-alternatives) for the full family tour.

## How It Compares

- **vs Adobe Premiere Pro** — Premiere is the mature industry standard; FilmCraft reproduces its workflow conventions natively and is free, but is younger and still growing its feature set.
- **vs DaVinci Resolve** — Resolve leads on color at the free tier; FilmCraft counters with a Rust-native engine, its own bit-exact codecs and no account requirements.
- **vs CapCut** — CapCut wins for quick social edits; FilmCraft targets real timeline editing with pro trim modes and loudness metering.

## Frequently Asked Questions

### Is FilmCraft free?

Yes — free and open source under permissive licenses, with no account, watermark or subscription, including commercial use.

### Can FilmCraft replace Premiere Pro?

Not yet for heavyweight professional pipelines — it is in development. For timeline editing, grading and delivery with pro trim modes, it already works, and it opens/saves through its own bit-exact codecs.`,
};

const LIGHTCRAFT_ITEM: ItemSpec = {
  slug: "lightcraft",
  name: "LightCraft",
  link: "https://getartcraft.com/apps/lightcraft",
  description:
    "LightCraft is a free, open-source photo library and non-destructive raw developer written in pure Rust by the ArtCraft team — a Lightroom alternative with GPU-speed develop and native raw decoding, no cloud required.",
  categorySlugs: ["design-tools"],
  tagSlugs: ["open-source", "tech"],
  introduction: `## What is LightCraft?

LightCraft is the ArtCraft team's open-source photo library and raw developer — "your photos, your pixels, your machine." A fast, non-destructive raw processor built from scratch in pure Rust, with no account, no cloud, no telemetry and no subscription. Same family as [PhotoCraft](https://findryai.com/item/photocraft); also runs in the browser via WebAssembly.

## Key Features

- **Non-destructive by design** — a scene-referred, wide-gamut, 32-bit float pipeline. Your originals are never touched.
- **Every control you reach for** — light, color, effects, tone curve, an 8-band color mixer, 3-way color grading wheels and 18 built-in presets.
- **Precise masking** — brush, linear and radial gradients, luminance and color ranges, plus sky, subject and background masks.
- **Native raw decoding** — pure-Rust decoders for DNG, CR2, ARW, NEF, RAF (including X-Trans), RW2, PEF and ORF, with more on the way.
- **A library that keeps up** — albums, ratings, flags, field search and virtualized grids built for big catalogs.
- **Instant feedback** — the GPU develop pipeline updates a 24 MP raw in about 4 ms per slider move.

## Current Status

LightCraft is in active development with installers for macOS, Windows and Linux plus a browser build. Get it standalone or via the ArtCraft Launcher. See the [ArtCraft suite overview](https://findryai.com/blog/artcraft-open-source-adobe-alternatives) for how it fits with FilmCraft, PhotoCraft and the rest.

## How It Compares

- **vs Adobe Lightroom** — Lightroom is the mature standard with cloud ecosystems; LightCraft is free, local-first, open source and already fast (4 ms slider updates), but younger.
- **vs Darktable** — Darktable is the established open-source raw developer with deep features; LightCraft counters with a Rust-native engine, a Photoshop-adjacent UI philosophy and family integration with PhotoCraft.
- **vs Capture One** — Capture One targets tethered studio workflows at a premium price; LightCraft covers library + develop locally at zero cost.

## Frequently Asked Questions

### Is LightCraft free?

Yes — free and open source, no account, no cloud, no telemetry, no subscription.

### What raw formats does LightCraft support?

Native Rust decoders for DNG, CR2, ARW, NEF, RAF (including X-Trans), RW2, PEF and ORF, with more formats on the way.

### Is LightCraft a Lightroom replacement?

For local library management and non-destructive raw development it is designed to be; it is still in development, so professionals should evaluate against their catalog needs.`,
};

const NANO_BANANA_ITEM: ItemSpec = {
  slug: "nano-banana-2-1",
  name: "Nano Banana 2.1",
  link: "https://ai.google.dev/gemini-api/docs/image-generation",
  description:
    "Nano Banana 2.1 (gemini-nano-banana-2.1) is Google's high-efficiency image generation and conversational editing model in the Gemini API — Flash-level speed and cost with 4K generation and improved text rendering.",
  categorySlugs: ["image-generation", "ai-tools"],
  tagSlugs: ["image", "ai"],
  introduction: `## What is Nano Banana 2.1?

Nano Banana 2.1 is Google's latest image generation and editing model in the Gemini API (model ID \`gemini-nano-banana-2.1\`). Per the official documentation it is an update to Nano Banana 2 and the **primary high-efficiency workhorse** for image generation and conversational editing — maintaining Flash-level speed and cost while improving visual quality, text rendering and multi-turn consistency. Google recommends it for all new projects.

## Key Capabilities

- **Generation and conversational editing** — create images from prompts, then iterate by chatting; multi-turn consistency keeps subjects stable across edits.
- **Up to 4K generation** with strong world knowledge and multi-reference image consistency.
- **Improved text rendering** for images that include legible text.
- **Flash-level cost efficiency** — the workhorse tier of Google's image lineup (reported around $1.50/M input tokens; check the official pricing page for current numbers).

## The Nano Banana Family

- **Nano Banana 2.1** (Gemini Nano Banana 2.1) — the high-efficiency workhorse; recommended default.
- **Nano Banana Pro** (Gemini 3 Pro Image) — the premium tier for complex visual tasks, advanced localization and brand consistency.
- **Nano Banana** (Gemini 2.5 Flash Image) — the original model that started the meme name.

## How to Use It

Nano Banana 2.1 is available through the [Gemini API](https://ai.google.dev/gemini-api/docs/image-generation) (model ID \`gemini-nano-banana-2.1\`) and Google's consumer Gemini surfaces. Start from a prompt for generation, or upload an image for conversational editing.

## How It Compares

- **vs Nano Banana 2** — improved visual quality, text rendering and multi-turn consistency at the same Flash-tier speed/cost class.
- **vs Nano Banana Pro** — Pro trades speed and cost for the highest world knowledge and precision creative control; 2.1 is the everyday default.
- **vs Qwen-Image 2.1** — Google's hosted option versus Alibaba's open-weights model you can run locally; see our [Qwen-Image 2.1 guide](https://findryai.com/blog/qwen-image-2-1).

## Frequently Asked Questions

### What is the model ID for Nano Banana 2.1?

\`gemini-nano-banana-2.1\` in the Gemini API.

### Is Nano Banana 2.1 free?

Generation is pay-per-use via the Gemini API at Flash-tier pricing; consumer access depends on your Gemini plan. Check official pricing for current numbers.

### What changed vs Nano Banana 2?

Better visual quality, better text rendering, stronger multi-turn editing consistency, and 4K generation support in the same high-efficiency tier.`,
};

const MELTY_ITEM: ItemSpec = {
  slug: "melty-ai",
  name: "Melty AI",
  link: "https://melty.sh",
  description:
    "Melty is an open-source AI code editor (YC S24) where every chat message becomes a git commit — revert, branch, reset and squash your chats like a pair programmer that stays in sync.",
  categorySlugs: ["developer-tools", "ai-tools"],
  tagSlugs: ["coding", "ai", "open-source"],
  introduction: `## What is Melty?

Melty is an open-source AI code editor from YC S24 founders Charlie and Jackson with one signature idea: **every chat message is a git commit**. You can revert, branch, reset and squash your chats the way you do with code, and the editor stays in sync with your whole workflow — terminal to GitHub — so you never have to re-explain what you are doing. Note: the editor lives at melty.sh — melty.dev is an unrelated agency.

## Key Features

- **Chat = commit** — each message becomes a granular git commit you can revert, branch, reset or squash.
- **Workflow-aware** — understands your work from terminal to GitHub like a pair programmer.
- **Open source** — code and development happen in the open on [GitHub](https://github.com/meltylabs/melty).
- **Version 0.2 in the works** — the team ships through a waitlist; check the site for early access.

## How It Compares

- **vs Cursor** — Cursor is the mature AI editor with a large feature surface; Melty's differentiator is chat-as-commit history, making AI-assisted changes as reviewable and reversible as normal git work.
- **vs GitHub Copilot** — Copilot autocompletes inside your existing editor; Melty rethinks the editor around conversational, commit-granular AI work.
- **vs Claude Code / agentic CLIs** — agentic CLIs live in your terminal; Melty wraps the same conversational model in a GUI with git-native history.

## Frequently Asked Questions

### Is Melty free?

The project is open source; check the GitHub repo and the official site for current builds and the 0.2 waitlist.

### What does "every chat message is a git commit" mean?

Each conversational step produces a discrete commit, so you can diff, revert, branch or squash AI-assisted changes exactly like manual ones — nothing the AI does is outside git history.

### Is Melty related to melty.dev?

No — melty.dev is an unrelated software agency. The AI code editor is at melty.sh, with source on GitHub (meltylabs/melty).`,
};

// ---------------------------------------------------------------------------
// Blog post: Nano Banana 2.1 guide
// ---------------------------------------------------------------------------
function nanoBananaPost() {
  return {
    slug: "nano-banana-2-1",
    title:
      "Nano Banana 2.1: What Changed vs Nano Banana 2, Pricing, and How to Use It",
    excerpt:
      "Google's Nano Banana 2.1 (gemini-nano-banana-2.1) is the new default image model in the Gemini API — 4K generation, better text rendering and multi-turn consistency at Flash-tier cost. What changed, who it is for, and how it compares.",
    relatedSlug: "qwen-image-2-1",
    body: () => [
      p(
        `Last updated: October 12, 2026. Google quietly promoted a new default image model in the Gemini API: `,
        [
          "Nano Banana 2.1",
          "https://ai.google.dev/gemini-api/docs/image-generation",
        ],
        " (model ID gemini-nano-banana-2.1). The official docs call it the primary high-efficiency workhorse for image generation and conversational editing, and recommend it for all new projects. Here is what changed versus Nano Banana 2 and where it sits in the family.",
      ),
      h2("What is Nano Banana 2.1?"),
      p(
        "Nano Banana 2.1 is an update to Nano Banana 2 in the Gemini API. It keeps Flash-level speed and cost efficiency while improving visual quality, text rendering and multi-turn consistency, and supports 4K generation with multi-reference image consistency. In practice: the meme-named image model got a serious mid-generation refresh.",
      ),
      h2("The Nano Banana family, clarified"),
      ...ul([
        [
          "Nano Banana 2.1 — the high-efficiency workhorse; recommended default for new projects",
        ],
        [
          "Nano Banana Pro (Gemini 3 Pro Image) — premium tier for complex visual tasks, advanced localization and brand consistency",
        ],
        [
          "Nano Banana (Gemini 2.5 Flash Image) — the original model that started the name",
        ],
        [
          "Gemini 3.1 Flash Image — a sibling speed-optimized model in the same lineup",
        ],
      ]),
      h2("What changed vs Nano Banana 2"),
      ...ul([
        ["Visual quality — noticeable improvements in realism and detail"],
        ["Text rendering — more reliable legible text inside images"],
        [
          "Multi-turn consistency — subjects stay stable across conversational edits",
        ],
        ["4K generation — high-resolution output in the workhorse tier"],
      ]),
      h2("Pricing"),
      p(
        "Nano Banana 2.1 sits in the Flash cost tier — third-party tracking around launch put it near $1.50 per million input tokens, but pricing shifts; treat the ",
        [
          "official Gemini API docs",
          "https://ai.google.dev/gemini-api/docs/image-generation",
        ],
        " as the source of truth. Nano Banana Pro costs more and buys you the highest world knowledge and precision creative control.",
      ),
      h2("How to use it"),
      p(
        "Use model ID gemini-nano-banana-2.1 in the Gemini API for generation and conversational editing (upload an image, then iterate by chatting). We track it in the directory here: ",
        ["Nano Banana 2.1 listing", `${SITE_URL}/item/nano-banana-2-1`],
        ".",
      ),
      h2("How it compares"),
      p(
        "Against open weights: Qwen-Image 2.1 is the local, fine-tunable alternative — see our ",
        ["Qwen-Image 2.1 guide", `${SITE_URL}/blog/qwen-image-2-1`],
        " covering the Turbo update and local setup. Nano Banana 2.1 is the zero-setup hosted default; Qwen is the control-everything option.",
      ),
      h2("FAQ"),
      h3("Is Nano Banana 2.1 the same as Nano Banana Pro?"),
      p(
        "No. Pro (Gemini 3 Pro Image) is the premium tier; 2.1 is the fast, cheap workhorse Google recommends as the default.",
      ),
      h3("Can it edit existing images?"),
      p(
        "Yes — conversational editing is a first-class use case, with multi-turn consistency to keep subjects stable while you iterate.",
      ),
      h3("What is the model ID?"),
      p("gemini-nano-banana-2.1 in the Gemini API."),
    ],
  };
}

// ---------------------------------------------------------------------------
// Upsert helpers
// ---------------------------------------------------------------------------
async function upsertItem(spec: ItemSpec): Promise<string> {
  const existing = await client.fetch<{ _id: string } | undefined>(
    `*[_type == "item" && slug.current == $slug][0]{_id}`,
    { slug: spec.slug },
  );

  const catIds = await Promise.all(spec.categorySlugs.map(categoryId));
  const tagIds = await Promise.all(spec.tagSlugs.map(tagId));

  const doc: { _type: "item"; [key: string]: unknown } = {
    _type: "item",
    name: spec.name,
    slug: { _type: "slug", current: spec.slug },
    link: spec.link,
    description: spec.description,
    introduction: spec.introduction,
    publishDate: new Date().toISOString(),
    pricePlan: "free",
    freePlanStatus: "approved",
    categories: catIds.map((id, i) => ({
      _type: "reference",
      _ref: id,
      _key: `c${i}`,
    })),
    tags: tagIds.map((id, i) => ({
      _type: "reference",
      _ref: id,
      _key: `t${i}`,
    })),
  };

  if (existing) {
    await client.patch(existing._id).set(doc).commit();
    console.log(`[patched] item ${spec.slug} (${existing._id})`);
    return existing._id;
  }
  const created = await client.create(doc);
  console.log(`[created] item ${spec.slug} (${created._id})`);
  return created._id;
}

async function upsertPost(
  slug: string,
  title: string,
  excerpt: string,
  body: Block[],
  blogCatId: string,
  relatedSlug?: string,
): Promise<string> {
  const existing = await client.fetch<{ _id: string } | undefined>(
    `*[_type == "blogPost" && slug.current == $slug][0]{_id}`,
    { slug },
  );

  const doc: { _type: "blogPost"; [key: string]: unknown } = {
    _type: "blogPost",
    title,
    slug: { _type: "slug", current: slug },
    excerpt,
    body,
    author: { _type: "reference", _ref: AUTHOR_ID },
    categories: [{ _type: "reference", _ref: blogCatId, _key: "bc0" }],
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

async function main() {
  console.log(
    `[Sanity Target] Project: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}, Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET}`,
  );

  const blogCatId = await blogCategoryId("ai-news");

  await upsertItem(FILMCRAFT_ITEM);
  await upsertItem(LIGHTCRAFT_ITEM);
  await upsertItem(NANO_BANANA_ITEM);
  await upsertItem(MELTY_ITEM);

  const nano = await upsertPost(
    NANO_BANANA_POST.slug,
    NANO_BANANA_POST.title,
    NANO_BANANA_POST.excerpt,
    nanoBananaPost().body(),
    blogCatId,
  );

  // bidirectional relatedPosts: nano banana <-> qwen image guide
  const qwen = await client.fetch<{ _id: string } | undefined>(
    `*[_type == "blogPost" && slug.current == "qwen-image-2-1"][0]{_id}`,
  );
  if (qwen) {
    await client
      .patch(nano)
      .set({
        relatedPosts: [{ _type: "reference", _ref: qwen._id, _key: "r0" }],
      })
      .commit();
    await client
      .patch(qwen._id)
      .set({ relatedPosts: [{ _type: "reference", _ref: nano, _key: "r0" }] })
      .commit();
    console.log("[linked] nano-banana-2-1 <-> qwen-image-2-1");
  }

  // verification
  for (const spec of [
    FILMCRAFT_ITEM,
    LIGHTCRAFT_ITEM,
    NANO_BANANA_ITEM,
    MELTY_ITEM,
  ]) {
    const item = await client.fetch(
      `*[_type == "item" && slug.current == $slug][0]{_id, name, "cats": categories[]->.slug.current, "tags": tags[]->.slug.current, publishDate}`,
      { slug: spec.slug },
    );
    console.log(`[verify item ${spec.slug}]`, JSON.stringify(item));
  }
  const post = await client.fetch(
    `*[_type == "blogPost" && slug.current == "nano-banana-2-1"][0]{_id, title, "author": author->.name, "blocks": count(body), "related": relatedPosts[0]->.slug.current}`,
  );
  console.log("[verify post nano-banana-2-1]", JSON.stringify(post));

  console.log("Done.");
}

// post spec (kept separate for typing clarity)
const NANO_BANANA_POST = {
  slug: "nano-banana-2-1",
  title:
    "Nano Banana 2.1: What Changed vs Nano Banana 2, Pricing, and How to Use It",
  excerpt:
    "Google's Nano Banana 2.1 (gemini-nano-banana-2.1) is the new default image model in the Gemini API — 4K generation, better text rendering and multi-turn consistency at Flash-tier cost. What changed, who it is for, and how it compares.",
};

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
