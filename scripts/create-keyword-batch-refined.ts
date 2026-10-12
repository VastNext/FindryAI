import { createClient } from "@sanity/client";
import dotenv from "dotenv";

dotenv.config();

// Refined keyword batch (2026-10-12):
// 1. Item: EffectCraft (/item/effectcraft) -> Design Tools (Adobe After Effects alternative)
// 2. Item: GLM-5.3-Flash (/item/glm-5-3-flash) -> AI Chat, AI Tools, Developer Tools
// 3. Post: Claude Code Mods Guide (/blog/claude-code-mods) -> targets: claude code mods, claude mods, security audit skill, ponytail claude
// 4. In-place content enhancements for existing pages:
//    - /item/photocraft: add download and photoshop comparison long-tail sections
//    - /blog/artcraft-open-source-adobe-alternatives: expand WordCraft & EffectCraft sections with internal links

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
// Item Specs
// ---------------------------------------------------------------------------
const EFFECTCRAFT_ITEM = {
  slug: "effectcraft",
  name: "EffectCraft",
  link: "https://getartcraft.com/apps/effectcraft",
  description:
    "EffectCraft is a free, open-source motion graphics and visual effects software written in pure Rust by the ArtCraft team — an After Effects alternative with compositions, 259 effects, expressions, and 3D cameras.",
  categorySlugs: ["design-tools"],
  tagSlugs: ["open-source", "tech", "video"],
  introduction: `## What is EffectCraft?

EffectCraft is the open-source motion graphics and visual effects (VFX) compositor from the ArtCraft team — rebuilding the Adobe After Effects workflow from the ground up in pure Rust. It provides compositions, layers, keyframes, 259 built-in effects, expressions, 3D cameras and lights, and a full render queue in a fast native desktop application. Free, open source, and offline-first.

We also covered the complete family in our [ArtCraft suite review](https://findryai.com/blog/artcraft-open-source-adobe-alternatives), including [PhotoCraft](https://findryai.com/item/photocraft), [VectorCraft](https://findryai.com/item/vectorcraft), and [FilmCraft](https://findryai.com/item/filmcraft).

## Key Features

- **Animate the way you know** — familiar panels, bezier and eased keyframes, value/velocity graphs, and property linking via expressions.
- **259 native effects** — blurs, distorts, color grading, stylized looks, particles, and channel operations, all rendered through a linear-light GPU compositor.
- **3D camera and lights** — real 3D layer positioning, depth of field, point/spot lights, and multi-camera setups inside your compositions.
- **Pure Rust performance** — zero Electron, zero web views; native binary performance on macOS, Windows, Linux, and a browser WebAssembly build.
- **Open file formats** — clean JSON composition files and standard image/video rendering queues.
- **Open source on GitHub** — check the source and development roadmap on [GitHub](https://github.com/storytold/artcraft).

## How to Download EffectCraft

You can install EffectCraft standalone or through the official ArtCraft Launcher (recommended) from [getartcraft.com/apps/effectcraft](https://getartcraft.com/apps/effectcraft). The launcher handles auto-updates across macOS, Windows, and Linux.

## EffectCraft vs Adobe After Effects

- **Adobe After Effects** — the established industry standard with decades of plug-in ecosystem support, but requires an expensive Creative Cloud subscription.
- **EffectCraft** — free and open source (MIT/Apache-2.0), fast native Rust startup, no account or subscription required. Currently in active development: perfect for indie creators, motion designers, and title sequences, though professional plug-in hosting (like Boris FX or Trapcode) is not supported.

## Frequently Asked Questions

### Is EffectCraft free?

Yes. EffectCraft is completely free and open source under permissive licenses, with no subscription, watermark, or cloud account requirement.

### Does EffectCraft run on Windows, Mac, and Linux?

Yes. Native builds exist for macOS, Windows, and Linux, plus a WebAssembly preview in modern browsers.

### Can EffectCraft replace After Effects?

For 2D motion graphics, lower thirds, title cards, particle effects, and YouTube VFX, EffectCraft is already usable and fast. High-end film VFX pipelines that depend on legacy third-party plug-in suites should continue using After Effects as EffectCraft matures.`,
};

const GLM_5_3_FLASH_ITEM = {
  slug: "glm-5-3-flash",
  name: "GLM-5.3-Flash",
  link: "https://huggingface.co/zai-org/GLM-5.3-Flash",
  description:
    "GLM-5.3-Flash is Zhipu AI's natively multimodal open-weights model — 320B total parameters with 18B active (MoE), 1M token context, and reasoning effort controls at one-tenth the serving cost.",
  categorySlugs: ["ai-chat", "ai-tools", "developer-tools"],
  tagSlugs: ["ai", "open-source", "coding"],
  introduction: `## What is GLM-5.3-Flash?

GLM-5.3-Flash is the first natively multimodal flagship model in the GLM-5 series by Zhipu AI (Z.ai). Built on a Mixture-of-Experts (MoE) architecture with **320B total parameters and just 18B active parameters**, it achieves frontier-grade reasoning, coding, and vision understanding while reducing inference costs by nearly 90% compared to dense alternatives.

## Key Capabilities

- **Native Multimodality** — trained from the ground up on a 30T-token multimodal corpus, unifying text, vision, and document analysis.
- **Ultra-Long 1M Context Window** — supports up to 1,048,576 tokens with a hybrid sparse and linear attention architecture, eliminating context degradation.
- **Reasoning Effort Control** — allows developers to control thinking depth via the \`reasoning_effort\` parameter (\`low\`, \`high\`, or \`max\`).
- **High Efficiency & Low Latency** — 18B active parameters mean fast time-to-first-token and cost-effective self-hosting on standard GPU setups.
- **Wide Framework Support** — day-0 deployment recipes for vLLM, SGLang, KTransformers, and Cloudflare Workers AI (\`@cf/zai-org/glm-5.3-flash\`).

## Pricing and API Access

- **Self-Hosting** — open weights in FP8 and BF16 available on [Hugging Face](https://huggingface.co/zai-org/GLM-5.3-Flash) and ModelScope.
- **Cloudflare Workers AI** — available serverless at $0.15 / M input tokens and $0.50 / M output tokens ($0.03 / M cached tokens).
- **Z.ai API Platform** — available via OpenAI-compatible endpoints with full function calling support.

## GLM-5.3-Flash vs Other Open Models

- **vs DeepSeek V3 / Qwen 2.5** — GLM-5.3-Flash combines 1M long-context multimodal understanding with MoE efficiency, competing closely with Claude Opus-tier performance on agentic coding evals.
- **vs Closed Frontier Models** — delivers near-frontier reasoning speed for production pipelines at a fraction of the token cost.

## Frequently Asked Questions

### Is GLM-5.3-Flash open weights?

Yes. Weights are openly downloadable on Hugging Face and ModelScope for research and commercial applications subject to Zhipu's open license agreement.

### How many parameters does GLM-5.3-Flash activate per token?

It activates only 18B parameters per token out of 320B total parameters, giving it the speed and memory profile of a lightweight model with the knowledge capacity of a massive model.`,
};

// ---------------------------------------------------------------------------
// Blog Post: Claude Code Mods
// ---------------------------------------------------------------------------
function claudeCodeModsPost() {
  return {
    slug: "claude-code-mods",
    title:
      "Claude Code Mods: The Complete Guide to TypeScript Plugins, Hooks & Top Mods (2026)",
    excerpt:
      "Anthropic introduced 'mods' for Claude Code — lightweight TypeScript hooks that let you customize AI agent behavior, UI, and permissions. How mods work, how to install and build them, and the top mods to try today.",
    relatedSlug: "anthropic-oss-scanner",
    body: () => [
      p(
        "Last updated: October 12, 2026. Anthropic recently expanded Claude Code from an AI coding assistant into a fully hackable developer platform with the release of ",
        [
          "Claude Code Mods",
          "https://code.claude.com/docs/en/plugins/mods/create",
        ],
        ". Built on an elegant TypeScript event-hook system, mods let you change how Claude Code acts, inspect its tool calls, customize its terminal UI, and enforce strict security boundaries. Here is everything you need to know about what mods are, how to build them, and the top community mods available right now.",
      ),
      h2("What Are Claude Code Mods?"),
      p(
        "In Claude Code, a mod is a plugin whose entry point is a TypeScript or JavaScript hooks module. Rather than configuring static JSON prompts, a mod registers function hooks that intercept Claude Code's internal lifecycle events. Whenever Claude Code wants to call a tool, display an output, ask for permission, or stream a response, it passes control through your registered hooks.",
      ),
      p(
        "Think of it as Koa or Express middleware for an autonomous AI agent: you can inspect the request, modify parameters before the model sees them, block dangerous commands, or inject custom UI elements directly into the CLI and Desktop app.",
      ),
      h2("How Claude Code Mods Differ from Agent Skills"),
      p(
        "If you have used Claude's agent skills or MCP tools (browse our ",
        ["Agent Skills directory", `${SITE_URL}/agent-skills`],
        " for examples), you might wonder where mods fit. Skills provide ",
        ["Claude", `${SITE_URL}/item/claude`],
        " with capabilities it can choose to invoke. Mods, on the other hand, sit ",
        ["around", "https://claude.com/blog/claude-code-mods"],
        " the engine itself: they intercept tool calls automatically, rewrite prompts before inference, and modify the environment regardless of what prompt you give.",
      ),
      h2("How to Install and Run Claude Code Mods"),
      p(
        "Installing a mod is as straightforward as adding a plugin in your terminal. You can install verified community plugins or point directly to a local development directory:",
      ),
      ...ul([
        [
          "Install via CLI — run `/plugin install <plugin-name>` inside any interactive Claude Code session.",
          "",
        ],
        [
          "Run local development mods — launch Claude Code with `claude --plugin-dir ./my-mod` to test hot-reloaded hooks live.",
          "",
        ],
        [
          "Ask Claude to write its own mod — simply tell Claude Code 'build a mod that logs all bash commands to a local audit file', and it writes, tests, and loads the TypeScript module for you.",
          "",
        ],
      ]),
      h2("Top Claude Code Mods to Try in 2026"),
      h3("1. Ponytail (Token Compression & Cost Saver)"),
      p(
        "One of the fastest-rising community mods is Ponytail. By filtering repetitive command output and intelligently pruning verbose stack traces before feeding them back into Claude's context, Ponytail reportedly cuts input token consumption by up to 90% during long refactoring sessions. It is an essential install for teams watching API burn.",
      ),
      h3("2. Cloudflare Security Audit Skill & Mod"),
      p(
        "Following Cloudflare's release of its developer agent tooling, the official ",
        [
          "security-audit-skill",
          "https://github.com/cloudflare/security-audit-skill",
        ],
        " hooks into tool execution to actively check for hardcoded secrets, dangerous bash flags, and unauthenticated outbound requests before commands execute. If you liked our coverage of ",
        ["Anthropic OSS Scanner", `${SITE_URL}/blog/anthropic-oss-scanner`],
        ", this brings defensive security audits directly into your daily terminal workflow.",
      ),
      h3("3. Native `/diff` Mod"),
      p(
        "Even core Claude Code features are now modularized. Anthropic moved the built-in diff viewer into a shipped mod, meaning you can swap in your own custom syntax-highlighted git diff handler or disable it entirely.",
      ),
      h2("How to Create Your First Mod in TypeScript"),
      p(
        "Creating a mod requires zero build steps or bundlers — Claude Code executes `.ts` and `.js` files directly. A minimal mod contains two files:",
      ),
      ...ul([
        [
          ".claude-plugin/plugin.json — manifest declaring the plugin name, version, and description.",
          "",
        ],
        [
          "hooks/register.ts — exports a default `register(on)` function that hooks into events like `tool.call` or `ui.render`.",
          "",
        ],
      ]),
      p(
        "Claude Code automatically generates type definitions in `.claude-plugin/types/`, giving your editor full autocomplete and LSP type-checking for every event, tool argument, and return type.",
      ),
      h2("Security & Enterprise Controls: `sec-default`"),
      p(
        "Because mods run with the same privileges as your local user, Anthropic implemented an onion-layer security model. On Team and Enterprise plans, a built-in immutable mod named `sec-default` loads first. It prevents downstream community mods from overriding permission-denial rules or bypassing sandbox restrictions. Administrators can also supply company-wide allowlists to govern which plugins developers can install.",
      ),
      h2("Frequently Asked Questions"),
      h3("Do Claude Code mods require Node.js or npm to run?"),
      p(
        "No. Claude Code loads and executes TypeScript and JavaScript hooks modules natively with zero external bundling setup.",
      ),
      h3("Are Claude Code mods sandboxed?"),
      p(
        "Mods run with the same access as the Claude Code CLI itself. Always inspect mod source code or install verified plugins from trusted developers.",
      ),
      h3("Can a mod modify the terminal user interface?"),
      p(
        "Yes. Mods can inject interactive UI components, spinners, custom prompts, and buttons into both the CLI terminal and the Claude Code Desktop application.",
      ),
      p(
        "Related reading: explore our breakdown of ",
        ["Anthropic OSS Scanner", `${SITE_URL}/blog/anthropic-oss-scanner`],
        " for open-source software security, or check out our full ",
        ["Claude guide", `${SITE_URL}/item/claude`],
        ".",
      ),
    ],
  };
}

// ---------------------------------------------------------------------------
// Existing Content Enhancements (Long-tail SEO capture)
// ---------------------------------------------------------------------------
async function enhanceExistingContent() {
  console.log("Enhancing existing content with long-tail keywords...");

  // 1. PhotoCraft item: add Download PhotoCraft & PhotoCraft vs Photoshop keywords
  const photocraft = await client.fetch<
    { _id: string; introduction: string } | undefined
  >(`*[_type == "item" && slug.current == "photocraft"][0]{_id, introduction}`);
  if (
    photocraft &&
    !photocraft.introduction.includes("How to Download PhotoCraft")
  ) {
    const downloadSection = `

## How to Download PhotoCraft (Windows, Mac & Linux)

To **download PhotoCraft**, visit the official release portal at [getartcraft.com/apps/photocraft](https://getartcraft.com/apps/photocraft) or the [GitHub releases page](https://github.com/storytold/photocraft). 

Available installation options:
- **ArtCraft Launcher** — one-click installer and auto-updater for PhotoCraft and the entire suite.
- **Standalone Installers** — native DMG for macOS (Apple Silicon & Intel), MSI installer for Windows 10/11, and AppImage / Flatpak / DEB packages for Linux.
- **WebAssembly Version** — run PhotoCraft directly in your browser with zero installation.

## PhotoCraft vs Photoshop: Is it a True Alternative?

**PhotoCraft vs Photoshop** comes down to freedom and speed versus legacy ecosystem depth. PhotoCraft opens and saves layered PSD documents with 307/309 conformance, boots instantly with zero subscription or cloud accounts, and runs natively on Linux where Photoshop has never existed. While Photoshop remains standard for enterprise studios needing Firefly generative fill and legacy .8BF plug-ins, PhotoCraft already handles everyday layered retouching, masks, and PSD hand-offs with ease.`;

    await client
      .patch(photocraft._id)
      .set({ introduction: photocraft.introduction + downloadSection })
      .commit();
    console.log(
      "[ok] photocraft item updated with download & vs photoshop sections",
    );
  }

  // 2. ArtCraft post: enhance WordCraft & EffectCraft sections
  const artcraftPost = await client.fetch<
    { _id: string; body: unknown[] } | undefined
  >(
    `*[_type == "blogPost" && slug.current == "artcraft-open-source-adobe-alternatives"][0]{_id, body}`,
  );
  if (artcraftPost) {
    const body = Array.isArray(artcraftPost.body)
      ? (artcraftPost.body as Block[])
      : [];
    const hasEffectCraftLink = body.some((b) =>
      (b.children || []).some(
        (c) =>
          typeof c?.text === "string" && c.text.includes("/item/effectcraft"),
      ),
    );

    if (!hasEffectCraftLink) {
      // Find the EffectCraft list item and enhance it
      const updatedBody = body.map((block) => {
        const text = (block.children || []).map((c) => c.text).join("");
        if (text.includes("EffectCraft — motion graphics")) {
          return p(
            "EffectCraft — open-source After Effects alternative: motion graphics, visual effects, 259 effects, expressions and 3D cameras built in pure Rust. In development; see the ",
            ["EffectCraft listing", `${SITE_URL}/item/effectcraft`],
            ".",
          );
        }
        if (text.includes("DesignCraft — page layout")) {
          return p(
            "DesignCraft & WordCraft — open-source InDesign and Microsoft Word alternatives. In development with native DOCX and open publishing workflows.",
          );
        }
        return block;
      });

      await client.patch(artcraftPost._id).set({ body: updatedBody }).commit();
      console.log(
        "[ok] artcraft blog post enhanced with EffectCraft & WordCraft keywords",
      );
    }
  }
}

// ---------------------------------------------------------------------------
// Main execution
// ---------------------------------------------------------------------------
async function main() {
  console.log(
    `[Sanity Target] Project: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`,
  );

  const blogCatId = await blogCategoryId("ai-news");

  // 1. Upsert Items
  for (const spec of [EFFECTCRAFT_ITEM, GLM_5_3_FLASH_ITEM]) {
    const existing = await client.fetch<{ _id: string } | undefined>(
      `*[_type == "item" && slug.current == $slug][0]{_id}`,
      { slug: spec.slug },
    );
    const catIds = await Promise.all(spec.categorySlugs.map(categoryId));
    const tagIds = await Promise.all(spec.tagSlugs.map(tagId));

    const doc = {
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
    } else {
      const created = await client.create(doc);
      console.log(`[created] item ${spec.slug} (${created._id})`);
    }
  }

  // 2. Upsert Blog Post
  const postSpec = claudeCodeModsPost();
  const existingPost = await client.fetch<{ _id: string } | undefined>(
    `*[_type == "blogPost" && slug.current == $slug][0]{_id}`,
    { slug: postSpec.slug },
  );

  const postDoc = {
    _type: "blogPost",
    title: postSpec.title,
    slug: { _type: "slug", current: postSpec.slug },
    excerpt: postSpec.excerpt,
    body: postSpec.body(),
    author: { _type: "reference", _ref: AUTHOR_ID },
    categories: [{ _type: "reference", _ref: blogCatId, _key: "bc0" }],
    publishDate: new Date().toISOString(),
    featured: false,
  };

  let postId: string;
  if (existingPost) {
    await client.patch(existingPost._id).set(postDoc).commit();
    console.log(`[patched] blogPost ${postSpec.slug} (${existingPost._id})`);
    postId = existingPost._id;
  } else {
    const created = await client.create(postDoc);
    console.log(`[created] blogPost ${postSpec.slug} (${created._id})`);
    postId = created._id;
  }

  // Related post bidirectional link: claude-code-mods <-> anthropic-oss-scanner
  const ossScanner = await client.fetch<{ _id: string } | undefined>(
    `*[_type == "blogPost" && slug.current == "anthropic-oss-scanner"][0]{_id}`,
  );
  if (ossScanner) {
    await client
      .patch(postId)
      .set({
        relatedPosts: [
          { _type: "reference", _ref: ossScanner._id, _key: "r0" },
        ],
      })
      .commit();
    console.log("[linked] claude-code-mods <-> anthropic-oss-scanner");
  }

  // 3. Enhance existing content
  await enhanceExistingContent();

  console.log("Refined content batch execution complete!");
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
