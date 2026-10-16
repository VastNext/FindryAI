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
    slug: "figcraft",
    name: "FigCraft",
    link: "https://getartcraft.com/apps/figcraft",
    description:
      "FigCraft is a free, open-source clean-room reimplementation of Figma in pure Rust by the ArtCraft team — with auto layout, components, variants, variables, offline .figcraft storage, and zero telemetry.",
    categorySlugs: ["design-tools"],
    tagSlugs: ["open-source", "productivity", "no-code"],
    introduction: `## What is FigCraft?

FigCraft is a free, open-source interface design and prototyping tool rebuilt from the ground up in pure Rust by Brandon Thomas and the [ArtCraft team](https://findryai.com/blog/artcraft-open-source-adobe-alternatives). Designed as a clean-room, privacy-first alternative to Figma, FigCraft brings Figma's beloved collaborative design workflow to a blazing-fast, 100% offline desktop experience.

Where Figma locks essential team features, dev mode inspections, and version histories behind subscription paywalls while requiring constant cloud connectivity, FigCraft saves your design files as standalone \`.figcraft\` archives directly on your disk. It includes auto layout rules, components with variants, variables with multi-mode tokens (light/dark themes), and interactive state machines without sending telemetry or harvesting your intellectual property.

FigCraft expands the thriving open-source Crafting Apps ecosystem alongside [PhotoCraft](https://findryai.com/item/photocraft) (Photoshop alternative), [VectorCraft](https://findryai.com/item/vectorcraft) (Illustrator clone), [WordCraft](https://findryai.com/item/wordcraft) (open-source Word), and [CADCraft](https://findryai.com/item/cadcraft).

## Key Features & Comparison to Figma

- **Familiar UI & Muscle Memory** — Toolbar, layers hierarchy, design properties panel, keyboard shortcuts, and canvas controls sit exactly where Figma designers expect.
- **Pure Rust Performance** — Zero Electron bloat, zero heavy Chromium web views. Powered by a persistent document model and GPU-accelerated egui shell; edits to 20,000+ node canvas files execute in sub-milliseconds.
- **Robust Auto Layout & Components** — Full support for flexbox-style auto layout (padding, gap, wrap), reusable components, variants, and multi-tier design tokens.
- **Offline & Zero-Telemetry Privacy** — Works completely offline. No forced account registration, no background tracking, and no cloud leaks.
- **Interoperability (.fig & SVG Export)** — Reads and parses existing \`.fig\` files (best-effort), imports Figma REST API JSON exports, and exports clean SVG, PDF, PNG, JPG, and WebP assets.
- **Agent-Ready Design API** — Every canvas action, layer mutation, and styling adjustment is exposed via CLI, JSON control channel, and Model Context Protocol (MCP) server for autonomous AI design agents.

## How to Download FigCraft & GitHub Source

FigCraft is dual-licensed under MIT or Apache-2.0:
- **Official Web Portal & Web Editor:** [getartcraft.com/apps/figcraft](https://getartcraft.com/apps/figcraft) or [figcraft.run](https://figcraft.run)
- **GitHub Repository:** [github.com/storytold/figcraft](https://github.com/storytold/figcraft)
- **Full Suite Exploration:** Browse the complete collection in the [ArtCraft Open-Source Suite Guide](https://findryai.com/blog/artcraft-open-source-adobe-alternatives).`,
  },
  {
    slug: "omniroute",
    name: "OmniRoute",
    link: "https://github.com/diegosouzapw/OmniRoute",
    description:
      "OmniRoute is an open-source AI routing gateway for coding assistants — enabling Claude Code, Codex, Aider, and Cursor to route requests across GLM, Kimi, DeepSeek, and GPT with automatic fallbacks and unified token pricing.",
    categorySlugs: ["developer-tools", "ai-tools"],
    tagSlugs: ["open-source", "coding", "automation"],
    introduction: `## What is OmniRoute?

OmniRoute is an open-source, high-performance multi-provider AI routing gateway and proxy developed by Diego Souza. Built specifically for developers using command-line coding agents like **Claude Code**, OpenAI Codex, OpenCode, Aider, Cursor, and Cline, OmniRoute allows you to point all your developer tools to a single endpoint while it intelligently routes prompts across dozens of frontier LLMs with automatic latency optimization and failover fallbacks.

One of the biggest obstacles developers encounter when adopting [Claude Code](https://findryai.com/blog/claude-code-mods) is the rigid reliance on Anthropic's native API keys and the absence of a simple \`--base-url\` switch. OmniRoute solves this by natively emulating the Anthropic Messages API at its root while serving standard OpenAI \`/v1/chat/completions\` and Google Gemini \`/v1beta\` endpoints simultaneously.

## Why Developers Use OmniRoute with Claude Code

- **Route Any Model to Claude Code** — Run Claude Code CLI against high-efficiency, cost-effective models like GLM-5.3-Flash, Kimi K2.7, DeepSeek-V3, and GPT-6 without writing custom shims.
- **One-Command Setup (omniroute setup-claude)** — Automatically writes model profiles to \`~/.claude/profiles/<model>/settings.json\`. Launch instantly using \`omniroute launch --profile glm52\` or \`omniroute launch --profile kimi\`.
- **Automatic Fallback & Redundancy** — If an upstream AI provider experiences rate-limiting, downtime, or billing exhaustion, OmniRoute automatically shifts the prompt to your configured fallback provider without interrupting your coding flow.
- **Unified Cost & Token Auditing** — Real-time web dashboard tracks prompt token consumption, cached inputs, latency curves, and request success rates across all connected local and remote coding sessions.
- **Compatible with Modern Agent Frameworks** — Integrates seamlessly with [DeepSeek Harness](https://findryai.com/item/deepseek-harness), [Reverse Engineer Anything (REA)](https://findryai.com/item/reverse-engineer-anything), and [Taste Skill](https://findryai.com/item/taste-skill).

## Quickstart & Installation

Deploy OmniRoute locally or connect to a remote VPS gateway:
\`\`\`bash
# 1. Install or run OmniRoute via Docker / Node
docker run -d -p 20128:20128 diegosouzapw/omniroute:latest

# 2. Configure Claude Code profiles automatically
omniroute setup-claude

# 3. Launch Claude Code with preferred model profile
omniroute launch --profile deepseek-v3
\`\`\`

- **Official GitHub Repository:** [github.com/diegosouzapw/OmniRoute](https://github.com/diegosouzapw/OmniRoute)
- **Documentation & Configuration Guides:** [OmniRoute Claude Code Setup Guide](https://github.com/diegosouzapw/OmniRoute/blob/main/docs/guides/CLAUDE-CODE-CONFIGURATION.md)
- **Developer Ecosystem:** Explore related AI tooling in [FindryAI Developer Tools](https://findryai.com/category/developer-tools).`,
  },
  {
    slug: "pavo-ai",
    name: "Pavo AI",
    link: "https://app.pavo-ai.work",
    description:
      "Pavo AI is a free AI video generator and automated micro-drama platform by Agnes AI — featuring multi-modal storytelling, prompt-to-video pipelines, unlimited Agnes model rendering, and seamless scene composition.",
    categorySlugs: ["video-generation", "image-generation"],
    tagSlugs: ["video", "image", "free-trial", "ai"],
    introduction: `## What is Pavo AI?

Pavo AI is an all-in-one AI video generator and short-form drama creation platform developed by Singapore Sapiens Technology (Agnes AI). Designed to eliminate complex timeline editing and storyboard choreography, Pavo AI lets creators, marketers, and storytellers go from a single sentence prompt to a fully rendered 1080p video with synchronized audio and consistent characters.

Pavo AI integrates four core creation modules: Automated Scriptwriting, Intelligent Agent Interaction, High-Resolution Image Generation (up to 4K), and Cinematic Video Synthesis. By employing an interactive 7-stage workflow — from premise, outline, character/scene design to storyboard frames, motion clips, and final audio mixing — users maintain full creative direction at every phase without starting over when a single shot needs revision.

## Key Features & Model Architecture

- **100% Free Unlimited Creation on Agnes Models** — Unlimited text-to-video and image-to-video generation using Agnes AI's in-house models (Agnes-Video and Agnes-Image) with zero duration caps and no mandatory subscription fees.
- **One-Sentence to Full Short Drama** — Enter a prompt like *"A suspenseful 1-minute sci-fi thriller set in an abandoned orbital station"*, and Pavo automatically drafts the script, generates reference characters, generates keyframes, and compiles the final video.
- **Character & Visual Consistency** — Generated character designs and props are locked and referenced across subsequent scenes, maintaining costume and facial continuity throughout multiple cuts.
- **Hybrid Multi-Model Router** — Seamlessly toggle between free Agnes native models and premium third-party diffusion models (including [Seedance 2.5](https://findryai.com/item/seedance-2-5) and NanoBanana) for high-end cinematic shots.
- **Direct Web & Mobile Access** — Access directly from modern desktop web browsers or download the official iOS app (*Pavo - AI Image & Video Maker*).

## Crucial Domain & Access Notice (Avoiding Phishing Clones)

> **⚠️ Important Notice:** The domain \`pavo.ai\` does not have DNS resolution and is **not** the official website. The official and verified access portals are:
> - **International Web Portal:** [app.pavo-ai.work](https://app.pavo-ai.work)
> - **Chinese Portal:** [app.pavo-ai.cn](https://app.pavo-ai.cn)
> - **Parent Company:** [agnes-ai.com](https://agnes-ai.com)

Explore more leading AI media tools in [FindryAI Video Generation](https://findryai.com/category/video-generation) and [OpenCut](https://findryai.com/item/opencut).`,
  },
];

// ---------------------------------------------------------------------------
// 2. Enhance Existing Content
// ---------------------------------------------------------------------------

async function enhanceExistingContent() {
  console.log(
    "\n=== Enhancing ArtCraft Blog Post with FigCraft & High-Heat Keywords ===",
  );
  const blog = await client.fetch<{ _id: string; body: Block[] } | undefined>(
    `*[_type == "blogPost" && slug.current == "artcraft-open-source-adobe-alternatives"][0]{_id, body}`,
  );

  if (blog?.body) {
    const hasFigCraft = JSON.stringify(blog.body).includes("figcraft");
    if (!hasFigCraft) {
      const additionalBlocks: Block[] = [
        h2(
          "The Ultimate Free Figma Alternative: FigCraft (Interface Design in Rust)",
        ),
        p(
          "As the Crafting Apps ecosystem continues its meteoric rise — crossing over 35x search heat growth across ",
          [
            "ArtCraft download",
            `${SITE_URL}/blog/artcraft-open-source-adobe-alternatives`,
          ],
          " and ",
          [
            "Adobe clone apps",
            `${SITE_URL}/blog/artcraft-open-source-adobe-alternatives`,
          ],
          " — developer Brandon Thomas has officially shipped ",
          ["FigCraft", `${SITE_URL}/item/figcraft`],
          ": a clean-room reimplementation of Figma written in pure Rust.",
        ),
        p(
          "FigCraft bridges the gap between UI/UX design and autonomous AI development. Running locally on macOS, Windows, and Linux via egui GPU acceleration, FigCraft stores native .figcraft files on your own disk, supports auto layout, components, and variables, and includes a first-class Model Context Protocol (MCP) server for agents.",
        ),
        li(
          ["FigCraft Overview & Download Guide", `${SITE_URL}/item/figcraft`],
          ": Explore offline capabilities, .fig file import compatibility, and MCP agent integration.",
        ),
        li(
          [
            "Complete Crafting Apps Directory",
            `${SITE_URL}/blog/artcraft-open-source-adobe-alternatives`,
          ],
          ": Free, open-source alternatives to Photoshop (PhotoCraft), Illustrator (VectorCraft), Premiere (FilmCraft), AutoCAD (CADCraft), Word (WordCraft), and Excel (GridCraft).",
        ),
      ];

      const newBody = [...blog.body, ...additionalBlocks];
      await client.patch(blog._id).set({ body: newBody }).commit();
      console.log(
        "[ok] ArtCraft blog post updated with FigCraft and long-tail cluster.",
      );
    } else {
      console.log("[skip] ArtCraft blog already contains FigCraft.");
    }
  }
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

  await enhanceExistingContent();

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
