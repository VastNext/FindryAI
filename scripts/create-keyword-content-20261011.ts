import { createClient } from "@sanity/client";
import dotenv from "dotenv";

dotenv.config();

// Keyword-driven content batch for 2026-10-11:
// item: VectorCraft
// post: ArtCraft suite overview (targets: artcraft software / getartcraft apps / vectorcraft github)
// All facts verified 2026-10-11 against getartcraft.com/apps, getartcraft.com/apps/vectorcraft
// and github.com/storytold/* links on those pages.

const SITE_URL = "https://findryai.com";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "",
  apiVersion: "2024-08-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN || "",
});

// ---------------------------------------------------------------------------
// Portable Text helpers (same pattern as create-keyword-content-20261010.ts)
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

function makeBlock(
  style: string,
  spans: Span[],
  markDefs: MarkDef[] = [],
): Block {
  return { _type: "block", _key: nextKey(), style, markDefs, children: spans };
}

function span(text: string, marks: string[] = []): Span {
  return { _type: "span", _key: nextKey(), text, marks };
}

function linkDef(href: string): MarkDef {
  return { _type: "link", _key: nextKey(), href };
}

type Part = string | [string, string];

function spansOf(parts: Part[]): { spans: Span[]; markDefs: MarkDef[] } {
  const markDefs: MarkDef[] = [];
  const spans = parts.map((part) => {
    if (typeof part === "string") return span(part);
    const def = linkDef(part[1]);
    markDefs.push(def);
    return span(part[0], [def._key]);
  });
  return { spans, markDefs };
}

function p(...parts: Part[]): Block {
  const { spans, markDefs } = spansOf(parts);
  return makeBlock("normal", spans, markDefs);
}

function h2(text: string): Block {
  return makeBlock("h2", [span(text)]);
}
function h3(text: string): Block {
  return makeBlock("h3", [span(text)]);
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
  return makeBlock("blockquote", [span(text)]);
}

// ---------------------------------------------------------------------------
// Taxonomy lookup (by slug, published documents only)
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
// Item: VectorCraft
// ---------------------------------------------------------------------------
const VECTORCRAFT_ITEM = {
  slug: "vectorcraft",
  name: "VectorCraft",
  link: "https://getartcraft.com/apps/vectorcraft",
  description:
    "VectorCraft is a free, open-source vector illustration app written in pure Rust by the ArtCraft team — pen, booleans, live effects and image tracing in a fast native app, with SVG and PDF support.",
  categorySlugs: ["design-tools"],
  tagSlugs: ["open-source", "tech"],
  introduction: `## What is VectorCraft?

VectorCraft is an open-source vector illustration app "reimagined in pure Rust" by the ArtCraft team — the same group behind the PhotoCraft image editor. It rebuilds the Illustrator-style workflow (pen tool, direct selection, shape booleans, snapping guides, appearance panel) in a native desktop app, and it also runs in the browser via WebAssembly. Free, open source, no subscription.

## Key Features

- **The workflow you know** — pen, direct selection, shape booleans, snapping guides and an appearance panel, laid out the way working illustrators expect.
- **Genuinely fast** — 20,000 shapes render in about 27 ms at retina resolution, and the interface targets 120 fps.
- **Exact curve booleans** — no more "cannot perform operation" errors; unlimited undo throughout.
- **Live, editable effects** — blends, envelope distort, gradient mesh, radial/grid/mirror repeats, glows and drop shadows, all still editable after the fact.
- **Image tracing** — turn raster images into clean vector paths with 12 tracing presets.
- **Open formats** — native JSON documents, SVG and PDF import/export, PNG, JPEG and WebP output, plus multi-size export for screens.

## Current Status

VectorCraft is in active development ("in development" per the official page), but installers are already available for macOS, Windows and Linux, alongside the WebAssembly build. Expect rough edges; the project publishes honest status pages rather than marketing gloss.

## How to Get VectorCraft

Two routes from the [official page](https://getartcraft.com/apps/vectorcraft): the **ArtCraft Launcher** (recommended — installs VectorCraft and every other Crafting App, picks the right build for your machine and keeps everything updated; currently v0.1.2), or a **standalone installer** for just VectorCraft. Source code lives on [GitHub](https://github.com/storytold/vectorcraft).

## How It Compares

- **vs Adobe Illustrator** — Illustrator is the mature industry standard with decades of features; VectorCraft is young but free, native, open source and surprisingly quick. Good as a companion or budget machine tool today, not yet a full replacement for professional Illustrator pipelines.
- **vs Inkscape** — Inkscape is the established free vector editor; VectorCraft counters with a native Rust engine (no GTK), 120 fps UI, exact curve booleans and live editable effects.
- **vs Figma** — Figma is collaborative and browser-first; VectorCraft is local-first, offline, open source and file-based.

VectorCraft sits in the ArtCraft "Crafting Apps" family alongside PhotoCraft (image editing), FilmCraft (video), LightCraft (photo RAW), PdfCraft, EffectCraft (motion graphics) and DesignCraft (page layout). See also our [PhotoCraft listing](https://findryai.com/item/photocraft).

## Frequently Asked Questions

### Is VectorCraft free?

Yes — free and open source under permissive licenses, with no subscription, account or watermark, and the browser build included.

### Can VectorCraft replace Illustrator?

Not yet for professional production pipelines — it is in development. For logo sketching, tracing, boolean-heavy icon work and learning vector design, it already delivers, and it imports/exports SVG and PDF.

### Does it open SVG and PDF files?

Yes — SVG and PDF import and export are supported, alongside PNG/JPEG/WebP output and a native JSON document format.`,
};

// ---------------------------------------------------------------------------
// Blog post: ArtCraft suite overview
// ---------------------------------------------------------------------------
const ARTCRAFT_POST = {
  slug: "artcraft-open-source-adobe-alternatives",
  title:
    "ArtCraft Suite: 7 Free Open-Source Adobe Alternatives (PhotoCraft, VectorCraft & More)",
  excerpt:
    "ArtCraft is rebuilding the Adobe suite as seven free, open-source Rust apps — PhotoCraft, VectorCraft, FilmCraft, LightCraft, PdfCraft, EffectCraft and DesignCraft. What each does, their status, and how to install them all with one launcher.",
  relatedSlug: "photocraft-open-source-photoshop-alternative",
  body(): Block[] {
    return [
      p(
        "Last updated: October 11, 2026. If you have been following the PhotoCraft story, here is the bigger picture: PhotoCraft is one of ",
        ["seven Crafting Apps", "https://getartcraft.com/apps"],
        " from the ArtCraft team — a full suite of free, open-source rewrites of Adobe-grade creative tools, all in pure Rust. Searches for artcraft software and the getartcraft apps page have spiked this week as the suite gains traction. Here is the complete tour.",
      ),
      h2("What is ArtCraft?"),
      p(
        "ArtCraft is a team building clean-room, open-source replacements for the Adobe creative suite — written from scratch in Rust, shipped as native desktop apps (no Electron, no web views), and drivable by agents via CLI. Every app is free under permissive licenses, works offline on your own files, and follows the menu/shortcut conventions professionals already know. The umbrella repo is on ",
        [
          "GitHub (storytold/artcraft)",
          "https://github.com/storytold/artcraft",
        ],
        ".",
      ),
      h2("The seven Crafting Apps"),
      ...ul([
        [
          "PhotoCraft — image editing: layers, masks, adjustment layers, type and real PSD files. The most mature of the suite (early alpha), and the one that started the buzz. See our ",
          [
            "PhotoCraft review",
            `${SITE_URL}/blog/photocraft-open-source-photoshop-alternative`,
          ],
          " or the ",
          ["PhotoCraft listing", `${SITE_URL}/item/photocraft`],
          ".",
        ],
        [
          "VectorCraft — vector illustration: pen, exact curve booleans, live editable effects, image tracing with 12 presets. In development with installers ready; 20,000 shapes render in about 27 ms. See the ",
          ["VectorCraft listing", `${SITE_URL}/item/vectorcraft`],
          ".",
        ],
        [
          "FilmCraft — video editing, color and sound. Rebuilt from scratch in Rust. In development.",
        ],
        [
          "LightCraft — photo library and raw development that runs on your machine. In development.",
        ],
        [
          "PdfCraft — PDF workbench: read, organize, combine, split and secure. Early alpha.",
        ],
        ["EffectCraft — motion graphics and visual effects. In development."],
        ["DesignCraft — page layout and publishing. In development."],
      ]),
      h2("ArtCraft Launcher: one install for all seven"),
      p(
        "The recommended route is the ",
        ["ArtCraft Launcher", "https://getartcraft.com/apps"],
        " (currently v0.1.2): it installs every Crafting App, picks the right build for your machine, verifies downloads and keeps all of them updated with one click. Standalone installers exist for each app if you only want one. macOS, Windows and Linux are covered, and most apps ship a WebAssembly build for the browser.",
      ),
      h2("What they share"),
      ...ul([
        [
          "Open source — every line on GitHub under permissive licenses (MIT/Apache-2.0 family)",
        ],
        [
          "Native, not wrapped — pure Rust compiled to real desktop apps; no Electron, no web views",
        ],
        [
          "Familiar from day one — layouts, tools and shortcuts that professionals already know",
        ],
        [
          "Your files, your machine — everything runs locally; no cloud round-trips",
        ],
        [
          "Agent-ready — every action is a command, drivable from a CLI or automation",
        ],
      ]),
      h2("Spotlight: VectorCraft, the newest release"),
      p(
        "The team's latest push is ",
        ["VectorCraft", "https://getartcraft.com/apps/vectorcraft"],
        " (source on ",
        ["GitHub", "https://github.com/storytold/vectorcraft"],
        "). It is an Illustrator-shaped vector editor with exact curve booleans that never fail, live editable effects (blends, envelope distort, gradient mesh, repeats), raster-to-vector image tracing with 12 presets, and SVG/PDF round-trips. Performance is the headline: 20,000 shapes at retina resolution in about 27 ms, with a 120 fps interface. See our ",
        ["VectorCraft listing", `${SITE_URL}/item/vectorcraft`],
        ".",
      ),
      h2("Can they replace Adobe in 2026?"),
      p(
        "Honest answer: not across the board, yet. PhotoCraft and PdfCraft are early alphas that already handle everyday jobs; the other five are in development with installers shipping. None offer generative AI features today, and plug-in ecosystems do not exist. But the fundamentals are unusual in this space — native speed, real open formats (PSD, SVG, PDF), offline operation and zero cost — which is why the suite has been trending. Run them alongside your current tools and watch the parity pages improve.",
      ),
      quote(
        "Status disclaimer: the ArtCraft apps evolve quickly and version numbers above reflect the official pages as of October 11, 2026. Check getartcraft.com for current status.",
      ),
      h2("FAQ"),
      h3("Is ArtCraft related to Adobe?"),
      p(
        "No. ArtCraft is an independent open-source project; the apps are clean-room rewrites inspired by Adobe's workflows and file formats, with no Adobe code.",
      ),
      h3("Is the ArtCraft suite free?"),
      p(
        "Yes — free and open source across all seven apps and the launcher, including commercial use. No subscriptions, accounts or watermarks.",
      ),
      h3("Which ArtCraft app is the most mature?"),
      p(
        "PhotoCraft (image editing) is the flagship and most complete — read our ",
        [
          "dedicated PhotoCraft review",
          `${SITE_URL}/blog/photocraft-open-source-photoshop-alternative`,
        ],
        ". PdfCraft is also in early alpha; the rest are in active development.",
      ),
      h3("VectorCraft vs Inkscape — which should I use?"),
      p(
        "Inkscape is the mature, feature-rich choice today. VectorCraft is younger but faster (native Rust engine, 120 fps UI), has exact curve booleans and live editable effects, and uses an Illustrator-like layout. Try VectorCraft for speed and fresh workflows, Inkscape for depth and stability.",
      ),
    ];
  },
};

// ---------------------------------------------------------------------------
// Upsert helpers
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

interface PostSpec {
  slug: string;
  title: string;
  excerpt: string;
  body: Block[];
  relatedSlug?: string;
}

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

async function upsertPost(spec: PostSpec, blogCatId: string): Promise<string> {
  const existing = await client.fetch<{ _id: string } | undefined>(
    `*[_type == "blogPost" && slug.current == $slug][0]{_id}`,
    { slug: spec.slug },
  );

  const doc: { _type: "blogPost"; [key: string]: unknown } = {
    _type: "blogPost",
    title: spec.title,
    slug: { _type: "slug", current: spec.slug },
    excerpt: spec.excerpt,
    body: spec.body(),
    author: { _type: "reference", _ref: AUTHOR_ID },
    categories: [{ _type: "reference", _ref: blogCatId, _key: "bc0" }],
    publishDate: new Date().toISOString(),
    featured: false,
  };

  if (existing) {
    await client.patch(existing._id).set(doc).commit();
    console.log(`[patched] blogPost ${spec.slug} (${existing._id})`);
    return existing._id;
  }
  const created = await client.create(doc);
  console.log(`[created] blogPost ${spec.slug} (${created._id})`);
  return created._id;
}

async function linkRelated(aId: string, bId: string) {
  await client
    .patch(aId)
    .set({ relatedPosts: [{ _type: "reference", _ref: bId, _key: "r0" }] })
    .commit();
  await client
    .patch(bId)
    .set({ relatedPosts: [{ _type: "reference", _ref: aId, _key: "r0" }] })
    .commit();
}

async function main() {
  console.log(
    `[Sanity Target] Project: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}, Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET}`,
  );

  const blogCatId = await blogCategoryId("ai-news");
  await upsertItem(VECTORCRAFT_ITEM);

  const artcraft = await upsertPost(ARTCRAFT_POST, blogCatId);

  // link the suite post back to yesterday's PhotoCraft review (bidirectional)
  const photocraftPost = await client.fetch<{ _id: string } | undefined>(
    `*[_type == "blogPost" && slug.current == "photocraft-open-source-photoshop-alternative"][0]{_id}`,
  );
  if (photocraftPost) {
    await linkRelated(artcraft, photocraftPost._id);
    console.log("[linked] artcraft suite <-> photocraft review");
  }

  // post-write verification
  const item = await client.fetch(
    `*[_type == "item" && slug.current == "vectorcraft"][0]{_id, name, "cats": categories[]->.slug.current, "tags": tags[]->.slug.current, publishDate}`,
  );
  console.log("[verify item vectorcraft]", JSON.stringify(item));
  const post = await client.fetch(
    `*[_type == "blogPost" && slug.current == "artcraft-open-source-adobe-alternatives"][0]{_id, title, "author": author->.name, "cats": categories[]->.slug.current, "blocks": count(body), "related": relatedPosts[0]->.slug.current}`,
  );
  console.log("[verify post artcraft]", JSON.stringify(post));

  console.log("Done.");
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
