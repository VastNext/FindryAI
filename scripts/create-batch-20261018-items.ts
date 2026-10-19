import { createClient } from "@sanity/client";
import dotenv from "dotenv";

dotenv.config();

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

function li(...parts: Part[]): Block {
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

// ---------------------------------------------------------------------------
// 1. Items Definition
// ---------------------------------------------------------------------------

const ITEMS = [
  {
    slug: "pdfcraft",
    name: "PdfCraft",
    link: "https://getartcraft.com/apps/pdfcraft",
    description:
      "PdfCraft is a free, open-source PDF workbench by the ArtCraft team — an Adobe Acrobat alternative for reading, organizing, annotating, filling forms, and protecting PDF documents, built in pure Rust.",
    categorySlugs: ["office-tools", "design-tools"],
    tagSlugs: ["open-source", "productivity"],
    introduction: `## What is PdfCraft?

PdfCraft is a free, open-source PDF workbench developed in pure Rust by the [ArtCraft team](https://findryai.com/blog/artcraft-open-source-adobe-alternatives) — a clean-room alternative to Adobe Acrobat DC. It covers the everyday document workflow that Acrobat gates behind a subscription: reading, organizing, annotating, filling forms, and protecting PDF files, all in a native desktop app that works fully offline.

Where Acrobat pushes cloud sign-in, telemetry, and recurring billing, PdfCraft keeps files local. Documents never leave your disk unless you share them, there is no account requirement, and the dual MIT / Apache-2.0 license makes both personal and commercial use completely free.

PdfCraft is one of the Crafting Apps, standing alongside [PhotoCraft](https://findryai.com/item/photocraft) (Photoshop), [VectorCraft](https://findryai.com/item/vectorcraft) (Illustrator), [FigCraft](https://findryai.com/item/figcraft) (Figma), [WordCraft](https://findryai.com/item/wordcraft) (Word), [GridCraft](https://findryai.com/item/gridcraft) (Excel), and [CADCraft](https://findryai.com/item/cadcraft) (AutoCAD).

## Key Features

- **Reading & Organizing** — Multi-tab reader with bookmarks, thumbnail navigation, full-text search, and drag-and-drop page reordering, merging, and splitting across documents.
- **Annotations & Markup** — Highlights, underlines, freehand ink, shapes, text boxes, and sticky notes with full comment export.
- **Forms & Signatures** — Fill and save interactive AcroForm fields, insert typed signatures, and flatten forms for distribution.
- **Protection & Redaction** — Password-protect documents, set permissions (print/copy/edit), and redact sensitive content before sharing.
- **Export & Conversion** — Export pages to PNG, JPG, and SVG images; print with precise page-range control.
- **Agent-Ready Automation** — Like every Crafting App, PdfCraft exposes its full command set via CLI, a JSON control channel, and an MCP server, so AI agents can batch-merge, stamp, and route documents programmatically.

## How to Download PdfCraft

PdfCraft is free and open source under MIT / Apache-2.0:
- **Official Portal:** [getartcraft.com/apps/pdfcraft](https://getartcraft.com/apps/pdfcraft)
- **GitHub Repository:** [github.com/storytold/pdfcraft](https://github.com/storytold/pdfcraft)
- **Full Suite Guide:** Browse every tool in the [ArtCraft Open-Source Suite](https://findryai.com/blog/artcraft-open-source-adobe-alternatives).`,
  },
  {
    slug: "solidcraft",
    name: "SolidCraft",
    link: "https://github.com/bherbruck/solidcraft",
    description:
      "SolidCraft is a free, open-source parametric 3D CAD application written in pure Rust — parametric feature timeline, constraint sketching, desktop (egui + wgpu), browser (WebAssembly), and a built-in MCP server so AI agents can model 3D parts directly.",
    categorySlugs: ["developer-tools", "design-tools"],
    tagSlugs: ["open-source", "tech"],
    introduction: `## What is SolidCraft?

SolidCraft is a free, open-source parametric 3D CAD application built in pure Rust by developer bherbruck (Apache-2.0, ~2.9K GitHub stars and climbing fast since its October 2026 launch). It brings the SOLIDWORKS-style parametric workflow — sketch, constrain, and build solids with a feature timeline — to a native desktop app, a browser sandbox, and an AI-agent-ready command layer.

Change a dimension and the whole model rebuilds: features on the parametric timeline re-evaluate in dependency order, exactly like commercial parametric CAD, but with no license server, no subscription, and no cloud dependency.

Note: SolidCraft is an independent project and is not part of the ArtCraft Crafting Apps suite — though it complements [CADCraft](https://findryai.com/item/cadcraft) (ArtCraft's 2D AutoCAD-style drafter) naturally, and a community proposal to adopt a parametric 3D kernel into the suite is under discussion.

## Key Features

- **Constraint-Based Sketching** — Sketch on origin, offset, or face-attached planes with a full constraint set (coincident, tangent, parallel, symmetry, G2 curvature) solved by a purpose-built solver; fully constrained geometry locks black, and dragging re-solves the sketch in real time.
- **Parametric Feature Timeline** — Extrude, revolve, sweep, loft, fillet/chamfer, shell, draft, holes, threads, patterns, mirror, split, and combine — driven by named parameters, so a single dimension edit rebuilds the entire model.
- **Assemblies & Components** — Components with joints, sheet-metal basics, and a plastic-enclosure workflow (standoffs, vent slots, port cut-outs, engraved labels) proven in its reference build of a Raspberry Pi 4 case.
- **Runs Everywhere** — Native desktop app (egui + wgpu) for Windows and Linux, a WebAssembly/WebGPU browser build, a headless CLI (\`solidcraft-cli\`) for scripted modelling and export, and an MCP server so AI agents can create and measure 3D models directly.
- **Verified Geometry** — 75 of 76 public reference parts match analytic or FreeCAD-computed volume, area, center of mass, and bounding box (docs/oracle.md), an unusually rigorous test regime for an early-stage CAD project.
- **Interoperable Formats** — DXF export (with hidden-line control) today, with STEP/STL/3MF exchange on the roadmap.

## How to Download SolidCraft & GitHub Repository

SolidCraft is open source under Apache-2.0:
- **GitHub Repository:** [github.com/bherbruck/solidcraft](https://github.com/bherbruck/solidcraft)
- **Documentation & Web Sandbox:** [docs.solidcraft.io](https://docs.solidcraft.io/)
- **Related 2D CAD:** For AutoCAD-style 2D drafting, see [CADCraft](https://findryai.com/item/cadcraft); for the full open-source creative suite, see the [ArtCraft guide](https://findryai.com/blog/artcraft-open-source-adobe-alternatives).`,
  },
];

// ---------------------------------------------------------------------------
// 2. Enhance Existing Content
// ---------------------------------------------------------------------------

async function enhanceReaItem() {
  console.log(
    "\n=== 2. Enhancing /item/reverse-engineer-anything with new long-tails ===",
  );
  const item = await client.fetch<
    { _id: string; introduction: string } | undefined
  >(
    `*[_type == "item" && slug.current == "reverse-engineer-anything"][0]{_id, introduction}`,
  );

  if (!item?.introduction) {
    console.log("[error] REA item not found");
    return;
  }

  if (item.introduction.includes("rea reverse engineer anything github")) {
    console.log("[skip] REA item already covers new long-tails");
    return;
  }

  const addition = `

## REA on GitHub: Repo, Variants and Related Searches (October 2026 Update)

REA's momentum keeps compounding — the repository has now passed 230K stars, and search demand is splintering into specific variants:

- **\`rea reverse engineer anything github\`** and **\`github rea reverse engineer anything\`** — the most common repo-hunting queries; they all land on the canonical repository at github.com/morluto/rea (beware of the fake "rea-tools" mirror that distributed a trojan — only trust the official repo, rea.tools, or the rea-agents npm package).
- **\`reverse engineer anything github repo\`** — the project now ships \`rea-agents\` on npm (v6.5.0+, 230K+ weekly installs), so \`npx rea-agents setup\` remains the only safe install path.
- **\`reverse engineer anything github adobe\`** — a direct consequence of the ArtCraft phenomenon: developers use REA to trace how legacy Adobe plug-ins and formats behave, then rebuild equivalent features clean-room in Rust with AI agents.
- **\`reverse engineer github repo\`** — beyond binaries, REA's agent bridge also reconstructs behavior of obfuscated JavaScript bundles and web apps.

For a complementary workflow — local agentic runtimes that pair well with REA — see [DeepSeek Harness](https://findryai.com/item/deepseek-harness) and the [Claude Code mods guide](https://findryai.com/blog/claude-code-mods).`;

  const newIntro = item.introduction + addition;
  await client.patch(item._id).set({ introduction: newIntro }).commit();
  console.log("[ok] REA introduction updated with long-tail section");
}

async function enhanceArtCraftBlog() {
  console.log("\n=== 3. Enhancing ArtCraft blog with PdfCraft suite link ===");
  const blog = await client.fetch<{ _id: string; body: Block[] } | undefined>(
    `*[_type == "blogPost" && slug.current == "artcraft-open-source-adobe-alternatives"][0]{_id, body}`,
  );

  if (!blog?.body) {
    console.log("[error] artcraft blog not found");
    return;
  }

  if (JSON.stringify(blog.body).includes("item/pdfcraft")) {
    console.log("[skip] blog already links pdfcraft");
    return;
  }

  const additionalBlocks: Block[] = [
    h2("PdfCraft: The Free Adobe Acrobat Alternative in the Suite"),
    p(
      "The suite's newest widely-searched member is ",
      ["PdfCraft", `${SITE_URL}/item/pdfcraft`],
      " — an Acrobat-style PDF workbench for reading, organizing, annotating, filling forms, and protecting documents. Like every Crafting App it is pure Rust, MIT/Apache-2.0 licensed, fully offline, and drivable by agents through its MCP server — search interest in ",
      "artcraft pdf",
      " and ",
      "pdfcraft",
      " has more than quintupled (+402%) since its release.",
    ),
  ];

  const newBody = [...blog.body, ...additionalBlocks];
  await client.patch(blog._id).set({ body: newBody }).commit();
  console.log("[ok] artcraft blog updated with PdfCraft section");
}

// ---------------------------------------------------------------------------
// 3. Main Routine
// ---------------------------------------------------------------------------

async function main() {
  console.log("=== 1. Inserting/Updating New Items ===");
  for (const item of ITEMS) {
    const existing = await client.fetch<{ _id: string } | undefined>(
      `*[_type == "item" && slug.current == $slug][0]{_id}`,
      { slug: item.slug },
    );

    const catRefs = await Promise.all(
      item.categorySlugs.map(async (s) => ({
        _type: "reference",
        _ref: await categoryId(s),
        _key: nextKey(),
      })),
    );

    const tagRefs = await Promise.all(
      item.tagSlugs.map(async (s) => ({
        _type: "reference",
        _ref: await tagId(s),
        _key: nextKey(),
      })),
    );

    const doc = {
      _type: "item",
      name: item.name,
      slug: { _type: "slug", current: item.slug },
      link: item.link,
      description: item.description,
      introduction: item.introduction,
      pricePlan: "free",
      freePlanStatus: "approved",
      publishDate: new Date().toISOString(),
      categories: catRefs,
      tags: tagRefs,
    };

    if (existing) {
      await client.patch(existing._id).set(doc).commit();
      console.log(`[updated item] ${item.slug} (${existing._id})`);
    } else {
      const created = await client.create(doc);
      console.log(`[created item] ${item.slug} (${created._id})`);
    }
  }

  await enhanceReaItem();
  await enhanceArtCraftBlog();

  console.log("\n=== 4. Verifying Items in Sanity ===");
  for (const item of ITEMS) {
    const verified = await client.fetch<
      { _id: string; publishDate: string; name: string } | undefined
    >(
      `*[_type == "item" && slug.current == $slug][0]{_id, name, publishDate}`,
      { slug: item.slug },
    );
    console.log(`[verified] ${item.slug}:`, verified);
  }
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
