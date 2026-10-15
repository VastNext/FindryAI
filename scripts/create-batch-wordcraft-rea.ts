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
    slug: "wordcraft",
    name: "WordCraft",
    link: "https://getartcraft.com/apps/wordcraft",
    description:
      "WordCraft is a free, open-source clean-room reimplementation of Microsoft Word in pure Rust by the ArtCraft team — with ribbon, DOCX read/write, PDF export, track changes, and native desktop speed.",
    categorySlugs: ["office-tools", "writing-tools"],
    tagSlugs: ["open-source", "productivity", "writing"],
    introduction: `## What is WordCraft?

WordCraft is a fast, free, and open-source word processor built from the ground up in pure Rust by Brandon Thomas and the [ArtCraft team](https://findryai.com/blog/artcraft-open-source-adobe-alternatives). Designed as a clean-room, privacy-respecting alternative to Microsoft Word, WordCraft recreates the familiar ribbon-based document design workflow you already know — complete with dynamic styles galleries, tables, tracked changes, footnotes, references, and mail merge.

Unlike bloated Electron-based document editors or web-only office suites that harvest user telemetry, WordCraft runs as a native desktop application powered by \`egui\` directly on the GPU. It opens and saves native **DOCX** (OOXML) files alongside ODT, RTF, HTML, Markdown, and TXT, and exports publication-ready vector PDFs with selectable text, bookmarks, and clickable hyperlinks.

WordCraft is a cornerstone of the expanding open-source productivity ecosystem, working alongside [GridCraft](https://findryai.com/item/gridcraft) (open-source Excel), [CADCraft](https://findryai.com/item/cadcraft) (AutoCAD alternative), and [PhotoCraft](https://findryai.com/item/photocraft) (Photoshop clone).

## Key Features & Highlights

- **Native Word Ribbon & Workflow** — Recreates 88% of Word's ribbon commands including styles galleries, rulers, margins, columns, section breaks, and navigation pane.
- **Bi-Directional DOCX Compatibility** — Opens real-world \`.docx\` documents and writes compliant OOXML files without cloud roundtrips or mandatory Microsoft subscriptions.
- **Full Format Support** — Import and export ODT, RTF, HTML, Markdown, plain text, and high-fidelity vector PDF files.
- **Collaborative Review Tools** — In-document tracked changes, revisions, strike-throughs, and contextual comments for editorial collaboration.
- **Agent-Ready Automation (wordcraft-mcp)** — Built-in Model Context Protocol (MCP) server (\`wordcraft-mcp\`) and JSON control channel, allowing AI coding agents to programmatically generate, inspect, and format multi-page enterprise documents.
- **GPU-Accelerated Native Rust Engine** — Zero web runtime dependencies; instant cold startup, sub-millisecond keystroke latency, and rock-solid stability across macOS, Windows, Linux, and WebAssembly.

## How to Download WordCraft & GitHub Repository

WordCraft is dual-licensed under MIT and Apache-2.0. You can download the latest pre-compiled desktop binaries or build from source:
- **Official Portal:** [getartcraft.com/apps/wordcraft](https://getartcraft.com/apps/wordcraft)
- **GitHub Repository:** [github.com/storytold/wordcraft](https://github.com/storytold/wordcraft)
- **All Crafting Apps:** Explore the full open-source suite via [ArtCraft Suite Overview](https://findryai.com/blog/artcraft-open-source-adobe-alternatives).

### Frequently Searched Queries & FAQ
- **Is WordCraft free to download?** Yes, WordCraft is 100% free and open-source with no subscription fees, registration gates, or telemetric trackers.
- **Can WordCraft replace Microsoft Word?** For core word processing, report drafting, DOCX reading/writing, and PDF exports, WordCraft delivers rapid offline execution. Professional complex SmartArt and macro parity continue to expand in ongoing alpha releases.`,
  },
  {
    slug: "gridcraft",
    name: "GridCraft",
    link: "https://getartcraft.com/apps/gridcraft",
    description:
      "GridCraft is a free, open-source clean-room reimplementation of Microsoft Excel in pure Rust by the ArtCraft team — native XLSX format, 513 worksheet functions including LET/LAMBDA, dynamic arrays, and zero cloud telemetry.",
    categorySlugs: ["office-tools", "data-tools"],
    tagSlugs: ["open-source", "productivity", "spreadsheet-ai"],
    introduction: `## What is GridCraft?

GridCraft is an open-source, high-performance spreadsheet software rebuilt in pure Rust by the ArtCraft team as a clean-room alternative to Microsoft Excel. Replicating the classic spreadsheet grid and ribbon interface, GridCraft gives power users, analysts, and developers a lightning-fast, zero-cloud desktop application that natively reads and writes **XLSX** workbooks.

In an era where spreadsheet data is increasingly locked into proprietary cloud subscriptions and subject to privacy concerns, GridCraft keeps your financial models, corporate data, and formulas 100% local. It implements 513 of Excel's 523 worksheet functions — including modern dynamic arrays, structured table formulas, and advanced functional programming primitives like \`LET\` and \`LAMBDA\`.

GridCraft pairs seamlessly with [WordCraft](https://findryai.com/item/wordcraft) and [PhotoCraft](https://findryai.com/item/photocraft), forming an agent-addressable local office and creative workspace.

## Key Features

- **513 Excel Worksheet Functions** — Near-total function parity covering mathematical, statistical, financial, lookup, and text operations with exact IEEE-754 calculation parity.
- **Modern Dynamic Arrays & Formulas** — Full support for spill ranges, \`XLOOKUP\`, \`FILTER\`, \`SORT\`, \`UNIQUE\`, alongside lambda functions (\`LET\`, \`LAMBDA\`).
- **Native XLSX Compatibility** — Opens and saves standard \`.xlsx\` workbooks with cell formatting, merged ranges, conditional formatting, and multi-sheet references.
- **Interactive Charts & Sparklines** — Embed live column, line, bar, and area charts directly inside sheets with GPU-rendered smooth zooming.
- **Agent Automation via MCP (gridcraft-mcp)** — Exposes granular cell range reads/writes, formula evaluation, and batch table population over the Model Context Protocol (MCP) for autonomous data analysis agents.
- **Zero Telemetry & Local Execution** — No accounts, no license verification servers, and no background tracking. Your data never leaves your device.

## How to Download GridCraft (GitHub & Release Builds)

GridCraft is licensed under MIT / Apache-2.0:
- **Download & Releases:** [getartcraft.com/apps/gridcraft](https://getartcraft.com/apps/gridcraft)
- **GitHub Repository:** [github.com/storytold/gridcraft](https://github.com/storytold/gridcraft)
- **Office & Creative Suite Guide:** Learn how GridCraft integrates with other tools in the [ArtCraft Open-Source Guide](https://findryai.com/blog/artcraft-open-source-adobe-alternatives).

### Frequently Searched Questions
- **Is GridCraft compatible with Microsoft Excel?** Yes, GridCraft uses \`.xlsx\` as its native file format, allowing seamless bidirectional sharing of spreadsheets without conversion loss on standard tables and formulas.
- **Does GridCraft support macros?** GridCraft prioritizes modern dynamic array functions and native Rust / Python / MCP automation over legacy VBA macros.`,
  },
  {
    slug: "reverse-engineer-anything",
    name: "Reverse Engineer Anything (REA)",
    link: "https://github.com/morluto/rea",
    description:
      "Reverse Engineer Anything (REA) is a viral open-source AI reverse-engineering framework and MCP server with 230k+ GitHub stars — connects Claude Code, Codex, and Cursor to Ghidra, Hopper, and IDA for evidence-backed binary inspection.",
    categorySlugs: ["developer-tools", "ai-tools"],
    tagSlugs: ["open-source", "coding", "automation"],
    introduction: `## What is Reverse Engineer Anything (REA)?

Reverse Engineer Anything (REA, \`morluto/rea\`) is an open-source AI reverse-engineering tool and Model Context Protocol (MCP) server that went viral in October 2026, amassing over **230,000 GitHub stars** in record time. Developed as an MIT-licensed bridge between AI coding agents (such as Claude Code, Codex, Cursor, and Gemini CLI) and industry-standard reverse-engineering engines, REA enables agents to analyze compiled software without needing original source code.

Rather than relying on LLM hallucinations or guesswork, REA is fundamentally **evidence-backed**. It drives headless or GUI instances of Ghidra, Hopper, IDA Pro, LLDB, and jadx, extracting exact function offsets, decompiled pseudocode, assembly snippets, and call graphs so your AI agent can verify its findings against real execution binaries.

## What Can REA Analyze?

REA supports multi-architecture binary inspection across virtually every software format:
- **Native Desktop Binaries** — PE (.exe/.dll), ELF (Linux binaries), and Mach-O (macOS binaries).
- **Mobile Applications** — Android APK/AAB packages via jadx decompilation and iOS IPA binaries.
- **Managed Runtimes & Frameworks** — .NET assemblies, Electron apps, unpacked JavaScript bundles, and web applications.
- **Hardware Firmware & Kernels** — Raw microcontroller firmware images and GPU compute shaders.

## Key Features & MCP Architecture

- **Autonomous Agent Exploration** — Ask your coding agent: *"Investigate how this proprietary binary handles protocol encryption and draft a clean-room Rust client"*, and REA will autonomously trace function symbols, extract cryptographic routines, and provide verifiable proof.
- **Turnkey MCP Server Setup** — Easily integrated into your AI coding assistant with a single terminal command: \`npx rea-agents setup\`.
- **Evidence-Based Explanations** — Every finding references concrete memory offsets, disassembly listings, and cross-references, eliminating hallucinated APIs.
- **Ghidra & Hopper Integration** — Leverages existing local installations of Ghidra or Hopper with token-authenticated local IPC channels.

## Quickstart & Official Installation

> **⚠️ Critical Security Warning:** Due to REA's explosive popularity on GitHub Trending, malicious actors created fake repository mirrors distributing malware disguised as "REA Windows Standalone .exe". Always obtain REA **exclusively** from the official GitHub repository and npm registry.

Install the official npm package:
\`\`\`bash
# 1. Ensure Node.js 22+ is installed
node -v

# 2. Run the official REA agent setup wizard
npx rea-agents setup

# 3. Verify tool doctor status
npx rea-agents doctor
\`\`\`

- **Official GitHub:** [github.com/morluto/rea](https://github.com/morluto/rea)
- **Official Web Portal:** [rea.tools](https://rea.tools)
- **Related AI Engineering Tools:** Explore top developer companions in [FindryAI Developer Tools](https://findryai.com/category/developer-tools).`,
  },
];

// ---------------------------------------------------------------------------
// 2. Main Ingestion & Cross-Linking Logic
// ---------------------------------------------------------------------------

async function main() {
  console.log("=== 1. Inserting/Updating Items ===");
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

  console.log(
    "\n=== 2. Enhancing ArtCraft Blog Post with Office Suite Expansion ===",
  );
  const post = await client.fetch<{ _id: string; body: Block[] } | undefined>(
    `*[_type == "blogPost" && slug.current == "artcraft-open-source-adobe-alternatives"][0]{_id, body}`,
  );

  if (post?.body) {
    // Check if WordCraft already mentioned in the blog
    const alreadyMentionsWordCraft = JSON.stringify(post.body).includes(
      "wordcraft",
    );
    if (!alreadyMentionsWordCraft) {
      console.log("Adding WordCraft & GridCraft section to ArtCraft blog...");
      const additionalBlocks: Block[] = [
        h2(
          "Expanding from Creative Tools into Open-Source Office: WordCraft & GridCraft",
        ),
        p(
          "Following the breakthrough success of its Adobe creative alternatives, the ArtCraft team has officially expanded into office productivity software, taking on Microsoft Word, Excel, and PowerPoint with clean-room implementations written in pure Rust.",
        ),
        li(
          ["WordCraft", `${SITE_URL}/item/wordcraft`],
          ": A clean-room reimplementation of Microsoft Word rebuilt in pure Rust. Features native .docx reading/writing, PDF export, track changes, tables, styles, and an integrated MCP server for coding agents.",
        ),
        li(
          ["GridCraft", `${SITE_URL}/item/gridcraft`],
          ": A clean-room spreadsheet built in Rust targeting Microsoft Excel. Supports native .xlsx files, dynamic arrays, 513 worksheet functions (including LET and LAMBDA), charts, and zero telemetry.",
        ),
        p(
          "Like ",
          ["PhotoCraft", `${SITE_URL}/item/photocraft`],
          ", ",
          ["VectorCraft", `${SITE_URL}/item/vectorcraft`],
          ", and ",
          ["CADCraft", `${SITE_URL}/item/cadcraft`],
          ", these office applications bypass bloated web wrappers in favor of native GPU rendering via egui, providing privacy-first, subscription-free desktop productivity.",
        ),
      ];

      const newBody = [...post.body, ...additionalBlocks];
      await client.patch(post._id).set({ body: newBody }).commit();
      console.log("[ok] ArtCraft blog updated with WordCraft & GridCraft.");
    } else {
      console.log(
        "[skip] ArtCraft blog already contains WordCraft references.",
      );
    }
  }

  console.log("\n=== 3. Verification ===");
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
