import { createClient } from "@sanity/client";
import dotenv from "dotenv";

dotenv.config();

// Keyword batch: CADCraft + ArtCraft / PhotoCraft long-tail absorption
// 1. Item: CADCraft (/item/cadcraft) -> AutoCAD open-source alternative in pure Rust
//    Targets: cadcraft, cadcraft github, cadcraft autocad, cadcraft download, open source cad
// 2. Enhance /item/photocraft:
//    Targets: ai photoshop clone, craft photoshop, photocraft windows, artcraft photocraft
// 3. Enhance /blog/artcraft-open-source-adobe-alternatives:
//    Add CADCraft to the suite and naturally weave art craft apps, craft adobe, get craft apps

const SITE_URL = "https://findryai.com";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "",
  apiVersion: "2024-08-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN || "",
});

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
  children?: Span[];
  markDefs?: MarkDef[];
  style?: string;
  listItem?: string;
  level?: number;
  [k: string]: unknown;
}

function spansOf(parts: Part[]): { spans: Span[]; markDefs: MarkDef[] } {
  const markDefs: MarkDef[] = [];
  const spans: Span[] = parts.map((part): Span => {
    if (typeof part === "string")
      return { _type: "span", _key: nextKey(), text: part, marks: [] };
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

const CADCRAFT_ITEM = {
  slug: "cadcraft",
  name: "CADCraft",
  link: "https://getartcraft.com/apps/cadcraft",
  description:
    "CADCraft is a free, open-source 2D CAD drafting software written in pure Rust by the ArtCraft team — an AutoCAD alternative with DWG/DXF support, command line, layers, viewports, and native desktop speed.",
  categorySlugs: ["design-tools", "developer-tools"],
  tagSlugs: ["open-source", "tech"],
  introduction: `## What is CADCraft?

CADCraft is an open-source 2D computer-aided design and drafting (CAD) software "reimagined in pure Rust" by the ArtCraft team. It rebuilds the classic AutoCAD drafting workflow — command line input, object snaps, layers, dimensions, hatches, blocks, and scale-exact plotting — inside a fast, native desktop application. It is completely free, open source under permissive licenses, and built for both human engineers and AI coding agents.

CADCraft is part of the broader [ArtCraft open-source creative suite](https://findryai.com/blog/artcraft-open-source-adobe-alternatives), standing alongside [PhotoCraft](https://findryai.com/item/photocraft), [VectorCraft](https://findryai.com/item/vectorcraft), [FilmCraft](https://findryai.com/item/filmcraft), and [EffectCraft](https://findryai.com/item/effectcraft).

## Key Features

- **The Drafting Workflow You Know** — type standard CAD commands, click points, use direct distance entry, object snaps (endpoint, midpoint, intersection), polar tracking, ortho mode, grips, and right-click-to-repeat.
- **Open Drawing Formats (DWG & DXF)** — reads and writes DXF files (both ASCII and binary, R12 through 2018), opens DWG files (R13 through 2018), and exports clean vector drawings to PDF, SVG, and PNG.
- **Paper Space & Floating Viewports** — layout sheets with floating viewports, per-viewport layer overrides, page setups, and scale-exact architectural plotting.
- **Associative Annotations** — linear, aligned, angular, radial, and diameter dimensions, multileader annotations, and associative hatch patterns that update when boundary geometry shifts.
- **Native Rust Engine** — zero Electron, zero web views; instantaneous startup, smooth 120 fps panning/zooming on large architectural drawings, and full offline functionality.
- **Agent-Ready Architecture** — every drafting tool, command, and layer action is accessible via CLI, JSON API, or MCP server for autonomous design agents.

## How to Download CADCraft (Windows, Mac, Linux & Web)

To download CADCraft, visit the official release portal on [getartcraft.com/apps/cadcraft](https://getartcraft.com/apps/cadcraft) or check [CADCraft on GitHub](https://github.com/storytold/cadcraft).

Available installation options:
- **ArtCraft Launcher** — recommended one-click manager that installs CADCraft, checks cryptographic checksums, and handles automatic updates across platforms.
- **Standalone Installers (v0.5.0+)** — native DMG for macOS (Apple Silicon & Intel), MSI installer for Windows 10/11, AppImage / DEB packages for Linux, and FreeBSD binaries.
- **WebAssembly Build** — run CADCraft directly inside modern web browsers with no installation needed.

## CADCraft vs AutoCAD: Open Source vs Enterprise Drafting

- **Autodesk AutoCAD** — the decades-old enterprise standard with extensive 3D toolsets and legacy AutoLISP scripts, but locked behind a steep yearly subscription.
- **CADCraft** — free, open source (MIT / Apache-2.0), fast native Rust startup, privacy-first local storage, and real DXF/DWG compatibility. Ideal for architects, mechanical drafters, hobbyists, and maker communities seeking a modern, unencumbered 2D drafting workbench.

## Frequently Asked Questions

### Is CADCraft really free?

Yes. CADCraft is free and open source under permissive licenses (MIT/Apache-2.0). There is no subscription, trial period, account, or cloud dependency.

### Can CADCraft open AutoCAD DWG and DXF files?

Yes. CADCraft reads and writes standard DXF files (R12 to 2018) and opens DWG drawings (R13 to 2018), allowing seamless collaboration with AutoCAD users.

### Does CADCraft work on Linux and Windows?

Yes. Native 64-bit binaries are available for Windows 10/11, macOS, and Linux (AppImage and DEB), with full offline support.`,
};

// --- Enhancements for existing PhotoCraft and ArtCraft content ----------------
async function enhanceExistingContent() {
  console.log("Infusing long-tail keywords into existing content...");

  // 1. /item/photocraft: add AI photoshop clone, craft photoshop, photocraft windows
  const photocraft = await client.fetch<
    { _id: string; introduction: string } | undefined
  >(`*[_type == "item" && slug.current == "photocraft"][0]{_id, introduction}`);
  if (photocraft) {
    let intro = photocraft.introduction;
    if (!intro.includes("AI Photoshop clone")) {
      // Add keyword paragraph right after the first sentence
      intro = intro.replace(
        "No subscription, no account, no cloud: the code is MIT/Apache-2.0 licensed and works fully offline.",
        "No subscription, no account, no cloud: the code is MIT/Apache-2.0 licensed and works fully offline. Frequently dubbed the community's favorite **AI Photoshop clone** and **craft photoshop** project, PhotoCraft delivers an authentic Photoshop feel with 100% open-source transparency.",
      );
    }
    if (!intro.includes("CADCraft")) {
      intro = intro.replace(
        "and DesignCraft (page layout).",
        "DesignCraft (page layout), and [CADCraft](https://findryai.com/item/cadcraft) (AutoCAD drafting).",
      );
    }
    await client.patch(photocraft._id).set({ introduction: intro }).commit();
    console.log(
      "[ok] photocraft item infused with 'AI Photoshop clone', 'craft photoshop', and CADCraft link",
    );
  }

  // 2. /blog/artcraft-open-source-adobe-alternatives: add CADCraft to list & keywords
  const post = await client.fetch<{ _id: string; body: Block[] } | undefined>(
    `*[_type == "blogPost" && slug.current == "artcraft-open-source-adobe-alternatives"][0]{_id, body}`,
  );
  if (post && Array.isArray(post.body)) {
    const hasCad = post.body.some((b) =>
      (b.children || []).some((c) => (c.text || "").includes("CADCraft")),
    );
    if (!hasCad) {
      const updatedBody = post.body.map((block) => {
        const text = (block.children || []).map((c) => c.text).join("");
        if (text.includes("DesignCraft & WordCraft")) {
          // add CADCraft block after it or in same line
          return p(
            "DesignCraft, WordCraft & CADCraft — open-source InDesign, Word, and AutoCAD alternatives in pure Rust. In development; check out our new ",
            ["CADCraft listing", `${SITE_URL}/item/cadcraft`],
            " for 2D DWG/DXF drafting.",
          );
        }
        if (text.includes("Searches for artcraft software")) {
          return p(
            "Last updated: October 13, 2026. If you have been following the PhotoCraft story, here is the bigger picture: PhotoCraft is part of the open-source creative suite from the ArtCraft team (frequently searched as art craft apps, get craft apps, and craft adobe alternatives) — free, open-source rewrites of Adobe and Autodesk tools in pure Rust. Here is the complete tour.",
          );
        }
        return block;
      });
      await client.patch(post._id).set({ body: updatedBody }).commit();
      console.log(
        "[ok] artcraft suite blog infused with CADCraft, craft adobe, art craft apps keywords",
      );
    }
  }
}

async function main() {
  console.log(
    `[Sanity Target] Project: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`,
  );

  // 1. Create CADCraft item
  const existing = await client.fetch<{ _id: string } | undefined>(
    `*[_type == "item" && slug.current == $slug][0]{_id}`,
    { slug: CADCRAFT_ITEM.slug },
  );
  const catIds = await Promise.all(CADCRAFT_ITEM.categorySlugs.map(categoryId));
  const tagIds = await Promise.all(CADCRAFT_ITEM.tagSlugs.map(tagId));

  const doc = {
    _type: "item",
    name: CADCRAFT_ITEM.name,
    slug: { _type: "slug", current: CADCRAFT_ITEM.slug },
    link: CADCRAFT_ITEM.link,
    description: CADCRAFT_ITEM.description,
    introduction: CADCRAFT_ITEM.introduction,
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
    console.log(`[patched] item ${CADCRAFT_ITEM.slug} (${existing._id})`);
  } else {
    const created = await client.create(doc);
    console.log(`[created] item ${CADCRAFT_ITEM.slug} (${created._id})`);
  }

  // 2. Enhance existing content
  await enhanceExistingContent();

  console.log("CADCraft batch complete!");
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
