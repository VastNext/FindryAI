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
    slug: "opencut",
    name: "OpenCut",
    link: "https://opencut.app",
    description:
      "OpenCut is a free, open-source video editor and clean-room CapCut alternative — featuring zero watermarks, zero tracking, a native Rust/GPUI engine, and agent-driven automation.",
    categorySlugs: ["video-generation", "design-tools"],
    tagSlugs: ["open-source", "video", "productivity"],
    introduction: `## What is OpenCut?

OpenCut is a free, open-source video editing platform built from the ground up as a privacy-first alternative to CapCut. With CapCut increasingly gating basic features behind paid subscriptions, adding mandatory watermarks, and collecting user data, OpenCut gives creators a community-driven desktop and web application with complete creative freedom.

Under the hood, OpenCut uses a high-performance **Rust core** with a GPU-accelerated compositor, native GPUI desktop shell, and WebAssembly compilation for instant in-browser editing. There are no watermarks, no account paywalls, and no cloud uploads — your video footage never leaves your local hardware.

OpenCut integrates naturally with modern AI workflows, offering an Editor API and Model Context Protocol (MCP) hooks so autonomous video agents can assemble, trim, and score footage programmatically.

## Key Features & Comparison to CapCut

- **100% Free Forever (MIT License)** — No subscriptions, no credits, and no watermark on exported MP4/ProRes videos.
- **Privacy by Default** — Zero telemetry, zero cloud roundtrips, and zero tracking. All encoding and rendering happens on your local GPU.
- **Modern Multi-Track Timeline** — Seamless video slicing, ripple edits, picture-in-picture tracks, keyframe animations, audio waveforms, and magnetic snapping.
- **Built-in Effects & Transitions** — Curated shaders, color grading LUTs, text titles, and auto-caption alignment.
- **Agent & MCP Extensibility** — Headless CLI and MCP server mode for AI agents (such as Claude Code or Codex) to automate b-roll selection and video rough cuts.
- **Cross-Platform Availability** — Native apps for macOS, Windows, and Linux, plus full in-browser WebAssembly editing.

## How to Download OpenCut & GitHub Source

OpenCut is open-source under the MIT license:
- **Web App & Portal:** [opencut.app](https://opencut.app)
- **GitHub Repository:** [github.com/OpenCut-app/OpenCut](https://github.com/OpenCut-app/OpenCut)
- **Related Open-Source Tools:** Explore the [ArtCraft Open-Source Creative Suite](https://findryai.com/blog/artcraft-open-source-adobe-alternatives) and [PhotoCraft](https://findryai.com/item/photocraft).`,
  },
  {
    slug: "deepseek-harness",
    name: "DeepSeek Harness",
    link: "https://deepseek.com/en/harness",
    description:
      "DeepSeek Harness (dsh) is an official open-source AI agent runtime by DeepSeek AI with 250k+ GitHub stars — featuring an 'everything-is-a-plugin' architecture, desktop and web interfaces, and turnkey tool orchestration.",
    categorySlugs: ["developer-tools", "ai-tools"],
    tagSlugs: ["open-source", "coding", "automation"],
    introduction: `## What is DeepSeek Harness?

DeepSeek Harness (\`dsh\`) is the official open-source autonomous agent runtime developed by DeepSeek AI (\`deepseek-ai/deepseek-harness\`), amassing over **250,000 GitHub stars**. Built on an **"everything-is-a-plugin"** spatiotemporal composability architecture (powered by Cordis), DeepSeek Harness transforms frontier LLMs from passive text predictors into self-directed agents capable of executing multi-hour software engineering, web automation, and system administration workflows.

Unlike monolithic agent frameworks, DeepSeek Harness separates core scheduling from tools, skills, and user interfaces. Everything — from shell execution, terminal multiplexing, and web browsers to git automation and custom domain skills — is dynamically loaded as modular plugins.

## Key Capabilities & Architecture

- **Everything is a Plugin** — Easily compose, fork, and hot-reload agent capabilities. Create new plugins on the fly using the built-in natural language "Creator Mode".
- **Turnkey Dual Interfaces** — Run as a native cross-platform desktop application or launch the lightweight web UI with a single command (\`npx @deepseek-ai/dsh web\`).
- **Multi-Model Support** — Native integration with DeepSeek-V3, DeepSeek-Coder, Claude, GPT, and local Ollama models.
- **Full Execution Trace & Sandboxing** — Inspect agent thoughts, planned tool calls, and step rollbacks in real time with fine-grained security permission tiers.
- **Complementary Ecosystem** — Pairs directly with [Reverse Engineer Anything (REA)](https://findryai.com/item/reverse-engineer-anything) and [Claude Code](https://findryai.com/blog/claude-code-mods).

## Quickstart & Official Installation

Launch DeepSeek Harness instantly via npx:
\`\`\`bash
# 1. Start the interactive Web UI
npx @deepseek-ai/dsh web

# 2. Or build locally from source
git clone https://github.com/deepseek-ai/deepseek-harness.git
cd deepseek-harness
pnpm install
pnpm run build
pnpm dsh web
\`\`\`

- **Official Webpage:** [deepseek.com/en/harness](https://deepseek.com/en/harness)
- **GitHub Repository:** [github.com/deepseek-ai/deepseek-harness](https://github.com/deepseek-ai/deepseek-harness)
- **Documentation:** [deepseek-harness.github.io](https://deepseek-harness.github.io/deepseek-harness/)`,
  },
  {
    slug: "taste-skill",
    name: "Taste Skill",
    link: "https://www.tasteskill.dev",
    description:
      "Taste Skill is the anti-slop frontend design framework for AI agents — a portable skill suite for Claude Code, Cursor, Codex, and Gemini CLI that prevents generic AI templates and enforces professional design systems.",
    categorySlugs: ["developer-tools", "design-tools"],
    tagSlugs: ["open-source", "coding", "ai"],
    introduction: `## What is Taste Skill?

Taste Skill (\`Leonxlnx/taste-skill\`) is an open-source frontend design framework for AI agents designed to solve a universal developer frustration: **"AI slop"** — the generic, uninspired, template-looking UIs produced by LLMs when writing frontend code. 

Created by Leonxlnx and distributed via portable \`SKILL.md\` files, Taste Skill equips AI coding agents (such as Claude Code, Cursor, Codex, and Gemini CLI) with strict, battle-tested rules for layout variance, typography hierarchy, fluid motion, design system mapping (shadcn/ui, Radix, Tailwind), and responsive density.

## How Taste Skill Works

When an agent loads Taste Skill, it follows an explicit pre-flight design protocol before writing a single line of CSS or TSX:
1. **Brief Inference** — Analyzes the project domain, target audience, brand mood, and information density.
2. **Design System Mapping** — Determines whether to use modern Tailwind, shadcn/ui, Radix, or custom native CSS instead of falling back to default Tailwind utilities.
3. **Three Controllable Dials** — Allows developers to tune:
   - \`DESIGN_VARIANCE\`: From clean/minimalist to bold asymmetric layouts.
   - \`MOTION_INTENSITY\`: From subtle hover states to immersive GSAP/Framer Motion interactions.
   - \`VISUAL_DENSITY\`: From spacious marketing pages to data-dense enterprise dashboards.
4. **Audit-First Redesigns** — Respects existing codebases and avoids breaking existing component hierarchies during refactors.

## Quickstart & Installation

Install Taste Skill across any agent supporting \`npx skills add\` or Claude Code plugins:
\`\`\`bash
# Install the core anti-slop frontend skill
npx skills add https://github.com/Leonxlnx/taste-skill --skill "design-taste-frontend"

# Or install directly in Claude Code as a plugin
/plugin marketplace add Leonxlnx/taste-skill
/plugin install taste-skill@taste-skill
\`\`\`

- **Official Web Portal:** [tasteskill.dev](https://www.tasteskill.dev)
- **GitHub Repository:** [github.com/Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill)
- **Claude Code Guide:** Read our complete walkthrough on [Claude Code Mods & Plugins](https://findryai.com/blog/claude-code-mods).`,
  },
];

// ---------------------------------------------------------------------------
// 2. Enhance Existing Content
// ---------------------------------------------------------------------------

async function enhanceExistingContent() {
  console.log("\n=== Enhancing /blog/claude-code-mods with Taste Skill ===");
  const blog = await client.fetch<{ _id: string; body: Block[] } | undefined>(
    `*[_type == "blogPost" && slug.current == "claude-code-mods"][0]{_id, body}`,
  );

  if (blog?.body) {
    const hasTasteSkill = JSON.stringify(blog.body).includes("taste-skill");
    if (!hasTasteSkill) {
      const additionalBlocks: Block[] = [
        h2(
          "Essential UI Skill: Taste Skill (The Anti-Slop Frontend Framework)",
        ),
        p(
          "One of the fastest-growing community additions to Claude Code is ",
          ["Taste Skill", `${SITE_URL}/item/taste-skill`],
          " (tasteskill.dev). While Claude Code writes excellent backend algorithms, default frontend generation often falls into predictable 'AI slop' with repetitive cards and purple gradients.",
        ),
        p(
          "By installing Taste Skill via ",
          "`/plugin marketplace add Leonxlnx/taste-skill`",
          ", your Claude Code agent gains strict aesthetic pre-flight guidelines: deliberate typography scale, asymmetric layout variance, GSAP motion curves, and explicit design system mapping (shadcn/ui, Radix, Tailwind).",
        ),
        li(
          [
            "Taste Skill Overview & Installation",
            `${SITE_URL}/item/taste-skill`,
          ],
          ": Complete installation commands, dial configurations, and supported agent platforms.",
        ),
      ];

      const newBody = [...blog.body, ...additionalBlocks];
      await client.patch(blog._id).set({ body: newBody }).commit();
      console.log(
        "[ok] /blog/claude-code-mods updated with Taste Skill section.",
      );
    } else {
      console.log("[skip] blog already mentions taste-skill.");
    }
  }

  console.log("\n=== Enhancing /item/qwen-image-2-1 with Qwen 2.1 Turbo ===");
  const qwen = await client.fetch<
    { _id: string; introduction: string } | undefined
  >(
    `*[_type == "item" && slug.current == "qwen-image-2-1"][0]{_id, introduction}`,
  );

  if (qwen?.introduction) {
    const hasTurbo = qwen.introduction.includes("Qwen-Image 2.1 Turbo");
    if (!hasTurbo) {
      const turboSection = `

## Qwen-Image 2.1 Turbo: 8-Step Ultra-Fast Diffusion

In October 2026, the Qwen team released **Qwen-Image 2.1 Turbo**, an accelerated distilled variant engineered for real-time generative workflows and edge deployment.

### Key Turbo Enhancements:
- **5x Faster Generation** — High-fidelity 1024x1024 photorealistic output in just **8 sampling steps**, down from 40-50 steps on the base model.
- **ComfyUI & GGUF Support** — Native ComfyUI workflow nodes and quantized GGUF weights, running smoothly on consumer 12GB/16GB VRAM GPUs.
- **Zero Loss in Text Rendering** — Retains full bilingual Chinese/English typography and multi-line poster composition capabilities.
- **Instant Photo Editing** — Sub-second localized inpainting, subject swaps, and reference-guided style transfer.`;

      const newIntro = qwen.introduction + turboSection;
      await client.patch(qwen._id).set({ introduction: newIntro }).commit();
      console.log(
        "[ok] /item/qwen-image-2-1 enhanced with Qwen 2.1 Turbo section.",
      );
    } else {
      console.log("[skip] qwen item already mentions turbo.");
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
