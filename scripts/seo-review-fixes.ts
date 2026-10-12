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

// ---------------------------------------------------------------------------
// 1. Fix claude-code-mods blog post
// ---------------------------------------------------------------------------
async function fixClaudeCodeModsPost() {
  console.log("Fixing claude-code-mods blog post...");
  const post = await client.fetch<{ _id: string } | undefined>(
    `*[_type == "blogPost" && slug.current == "claude-code-mods"][0]{_id}`,
  );
  if (!post) throw new Error("claude-code-mods post not found");

  const body: Block[] = [
    p(
      "Last updated: October 12, 2026. Anthropic recently expanded Claude Code into a fully customizable developer platform with the introduction of ",
      [
        "Claude Code Mods",
        "https://code.claude.com/docs/en/plugins/mods/create",
      ],
      " (popularly searched by developers as ",
      ["claude mods", "https://code.claude.com/docs/en/plugins/mods/create"],
      "). Built on an elegant TypeScript event-hook system, these mods let you change how Claude Code acts, inspect its tool calls, customize its terminal UI, and enforce strict security boundaries. Here is everything you need to know about what mods are, how to build them, and the top community mods available right now.",
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
      " with capabilities it can choose to invoke. Mods, on the other hand, sit directly inside and wrap around the ",
      ["Claude Code engine itself", "https://claude.com/blog/claude-code-mods"],
      ": they intercept tool calls automatically, rewrite prompts before inference, and modify the environment regardless of what prompt you give.",
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
    h3("1. Ponytail Claude Mod (Token Compression & Cost Saver)"),
    p(
      "One of the fastest-rising community plugins is the Ponytail Claude mod. By filtering repetitive command output and intelligently pruning verbose stack traces before feeding them back into Claude's context, Ponytail reportedly cuts input token consumption by up to 90% during long refactoring sessions. It is an essential install for developers watching API burn.",
    ),
    h3("2. Cloudflare Security Audit Skill & Mod"),
    p(
      "Following Cloudflare's release of its developer agent tooling, the official ",
      [
        "security audit skill",
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
  ];

  await client.patch(post._id).set({ body }).commit();
  console.log(
    "[ok] claude-code-mods post updated with high-value keywords and clean anchors",
  );
}

// ---------------------------------------------------------------------------
// 2. Fix artcraft blog post (clean ul list & all item links)
// ---------------------------------------------------------------------------
async function fixArtcraftSuitePost() {
  console.log("Fixing artcraft suite blog post...");
  const post = await client.fetch<{ _id: string } | undefined>(
    `*[_type == "blogPost" && slug.current == "artcraft-open-source-adobe-alternatives"][0]{_id}`,
  );
  if (!post) throw new Error("artcraft post not found");

  const l0 = nextKey();
  const l1 = nextKey();
  const contextBlock: Block = {
    _type: "block",
    _key: nextKey(),
    style: "normal",
    markDefs: [
      {
        _type: "link",
        _key: l0,
        href: `${SITE_URL}/blog/anthropic-oss-scanner`,
      },
      { _type: "link", _key: l1, href: `${SITE_URL}/blog/vidu-q4-preview` },
    ],
    children: [
      {
        _type: "span",
        _key: nextKey(),
        text: "It lands in a busy October for AI launches — Anthropic shipped ",
        marks: [],
      },
      {
        _type: "span",
        _key: nextKey(),
        text: "OSS Scanner",
        marks: [l0],
      },
      {
        _type: "span",
        _key: nextKey(),
        text: " for open-source security, and Shengshu's ",
        marks: [],
      },
      {
        _type: "span",
        _key: nextKey(),
        text: "Vidu Q4 Preview",
        marks: [l1],
      },
      {
        _type: "span",
        _key: nextKey(),
        text: " took on the video side. PhotoCraft is where this suite started — see our hands-on review below.",
        marks: [],
      },
    ],
  };

  const body: Block[] = [
    p(
      "Last updated: October 12, 2026. If you have been following the PhotoCraft story, here is the bigger picture: PhotoCraft is one of ",
      ["seven Crafting Apps", "https://getartcraft.com/apps"],
      " from the ArtCraft team — a full suite of free, open-source rewrites of Adobe-grade creative tools, all in pure Rust. Searches for artcraft software and the getartcraft apps page have spiked this week as the suite gains traction. Here is the complete tour.",
    ),
    contextBlock,
    h2("What is ArtCraft?"),
    p(
      "ArtCraft is a team building clean-room, open-source replacements for the Adobe creative suite — written from scratch in Rust, shipped as native desktop apps (no Electron, no web views), and drivable by agents via CLI. Every app is free under permissive licenses, works offline on your own files, and follows the menu/shortcut conventions professionals already know. The umbrella repo is on ",
      ["GitHub (storytold/artcraft)", "https://github.com/storytold/artcraft"],
      ".",
    ),
    h2("The seven Crafting Apps"),
    ...ul([
      [
        "PhotoCraft — image editing: layers, masks, adjustment layers, type and real PSD files. See our ",
        [
          "PhotoCraft review",
          `${SITE_URL}/blog/photocraft-open-source-photoshop-alternative`,
        ],
        " or the ",
        ["PhotoCraft listing", `${SITE_URL}/item/photocraft`],
        ". (Early alpha)",
      ],
      [
        "VectorCraft — vector illustration: pen, exact curve booleans, live editable effects, image tracing with 12 presets. See the ",
        ["VectorCraft listing", `${SITE_URL}/item/vectorcraft`],
        ". (In development)",
      ],
      [
        "FilmCraft — professional video editing, color grading and real timeline trimming with native codecs. See the ",
        ["FilmCraft listing", `${SITE_URL}/item/filmcraft`],
        ". (In development)",
      ],
      [
        "LightCraft — photo library and non-destructive raw developer running locally on your GPU. See the ",
        ["LightCraft listing", `${SITE_URL}/item/lightcraft`],
        ". (In development)",
      ],
      [
        "EffectCraft — open-source After Effects alternative: motion graphics, visual effects, 259 effects, expressions, 3D cameras. See the ",
        ["EffectCraft listing", `${SITE_URL}/item/effectcraft`],
        ". (In development)",
      ],
      [
        "PdfCraft — PDF workbench: read, organize, combine, split and secure documents offline. (Early alpha)",
      ],
      [
        "DesignCraft & WordCraft — page layout, publishing, and open document editing with native DOCX support. (In development)",
      ],
    ]),
    h2("ArtCraft Launcher: one install for all seven"),
    p(
      "The recommended route is the ",
      ["ArtCraft Launcher", "https://getartcraft.com/apps"],
      " (currently v0.2.0): it installs every Crafting App, picks the right build for your machine, verifies downloads and keeps all of them updated with one click. Standalone installers exist for each app if you only want one. macOS, Windows and Linux are covered, and most apps ship a WebAssembly build for the browser.",
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
    h2("Spotlight: VectorCraft & EffectCraft"),
    p(
      "The team's newest pushes are ",
      ["VectorCraft", "https://getartcraft.com/apps/vectorcraft"],
      " (the Illustrator alternative) and ",
      ["EffectCraft", `${SITE_URL}/item/effectcraft`],
      " (the After Effects VFX compositor). VectorCraft handles 20,000 shapes at retina resolution in about 27 ms, while EffectCraft delivers 259 built-in GPU effects and 3D camera controls.",
    ),
    h2("Can they replace Adobe in 2026?"),
    p(
      "Honest answer: not across the board, yet. PhotoCraft and PdfCraft are early alphas that already handle everyday jobs; the other five are in development with installers shipping. None offer generative AI features today, and plug-in ecosystems do not exist. But the fundamentals are unusual in this space — native speed, real open formats (PSD, SVG, PDF), offline operation and zero cost — which is why the suite has been trending. Run them alongside your current tools and watch the parity pages improve.",
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
  ];

  await client.patch(post._id).set({ body }).commit();
  console.log(
    "[ok] artcraft suite post updated with continuous 7-app ul list and full internal links",
  );
}

// ---------------------------------------------------------------------------
// 3. Fix photocraft item (remove duplicate download section)
// ---------------------------------------------------------------------------
async function fixPhotocraftItem() {
  console.log("Fixing photocraft item...");
  const item = await client.fetch<
    { _id: string; introduction: string } | undefined
  >(`*[_type == "item" && slug.current == "photocraft"][0]{_id, introduction}`);
  if (!item) throw new Error("photocraft item not found");

  let intro = item.introduction;
  // Remove the old duplicate "How to Get PhotoCraft" section
  const oldSectionRegex =
    /## How to Get PhotoCraft[\s\S]*?(?=## PhotoCraft vs Photoshop|$)/;
  if (oldSectionRegex.test(intro)) {
    intro = intro.replace(oldSectionRegex, "");
  }

  // Ensure clean download section
  if (!intro.includes("## How to Download PhotoCraft (Windows, Mac & Linux)")) {
    intro += `

## How to Download PhotoCraft (Windows, Mac & Linux)

To **download PhotoCraft**, visit the official release portal at [getartcraft.com/apps/photocraft](https://getartcraft.com/apps/photocraft) or the official [PhotoCraft on GitHub](https://github.com/storytold/photocraft) releases page. 

Installation options:
- **ArtCraft Launcher** — one-click installer and auto-updater for PhotoCraft and the entire suite.
- **Standalone Installers** — native DMG for macOS (Apple Silicon & Intel), MSI installer for Windows 10/11, and AppImage / Flatpak / DEB packages for Linux.
- **WebAssembly Version** — run PhotoCraft directly in your browser with zero installation.

## PhotoCraft vs Photoshop: Is it a True Alternative?

**PhotoCraft vs Photoshop** comes down to freedom and speed versus legacy depth. PhotoCraft opens and saves layered PSD documents with 307/309 test file conformance, boots instantly with zero subscription or cloud accounts, and runs natively on Linux where Photoshop has never existed. While Photoshop remains standard for enterprise studios needing Firefly generative fill and legacy .8BF plug-ins, PhotoCraft already handles everyday layered retouching, masks, and PSD hand-offs with ease.`;
  }

  await client.patch(item._id).set({ introduction: intro.trim() }).commit();
  console.log("[ok] photocraft item deduplicated and streamlined");
}

// ---------------------------------------------------------------------------
// 4. Fix effectcraft item (long-tail anchors)
// ---------------------------------------------------------------------------
async function fixEffectCraftItem() {
  console.log("Fixing effectcraft item...");
  const item = await client.fetch<
    { _id: string; introduction: string } | undefined
  >(
    `*[_type == "item" && slug.current == "effectcraft"][0]{_id, introduction}`,
  );
  if (!item) throw new Error("effectcraft item not found");

  let intro = item.introduction;
  intro = intro.replace(
    /check the source and development roadmap on \[GitHub\]\(https:\/\/github.com\/storytold\/artcraft\)/,
    "check the source and development roadmap on [EffectCraft on GitHub](https://github.com/storytold/artcraft)",
  );

  await client.patch(item._id).set({ introduction: intro }).commit();
  console.log(
    "[ok] effectcraft item updated with 'EffectCraft on GitHub' anchor",
  );
}

// ---------------------------------------------------------------------------
// 5. Fix glm-5-3-flash item (spacing variants, zhipu ai glm, internal links)
// ---------------------------------------------------------------------------
async function fixGlmFlashItem() {
  console.log("Fixing glm-5-3-flash item...");
  const item = await client.fetch<
    { _id: string; introduction: string } | undefined
  >(
    `*[_type == "item" && slug.current == "glm-5-3-flash"][0]{_id, introduction}`,
  );
  if (!item) throw new Error("glm-5-3-flash item not found");

  const enhancedIntro = `## What is GLM-5.3-Flash (GLM 5.3 Flash)?

**GLM-5.3-Flash** (commonly searched as **GLM 5.3 Flash**) is the first natively multimodal flagship model in the **Zhipu AI GLM** series (Z.ai). Built on a Mixture-of-Experts (MoE) architecture with **320B total parameters and just 18B active parameters**, it achieves frontier-grade reasoning, coding, and vision understanding while reducing inference costs by nearly 90% compared to dense alternatives.

For developers exploring open-source models, see also our [AI Chat tools directory](https://findryai.com/category/ai-chat) and our review of [Claude](https://findryai.com/item/claude).

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

## GLM 5.3 Flash vs Other Frontier Models

- **vs DeepSeek V3 / Qwen 2.5** — GLM 5.3 Flash combines 1M long-context multimodal understanding with MoE efficiency, competing closely with Claude Opus-tier performance on agentic coding evals.
- **vs Closed Frontier Models** — delivers near-frontier reasoning speed for production pipelines at a fraction of the token cost.

## Frequently Asked Questions

### Is GLM 5.3 Flash open weights?

Yes. Weights are openly downloadable on Hugging Face and ModelScope for research and commercial applications subject to Zhipu's open license agreement.

### How many parameters does GLM-5.3-Flash activate per token?

It activates only 18B parameters per token out of 320B total parameters, giving it the speed and memory profile of a lightweight model with the knowledge capacity of a massive model.`;

  await client.patch(item._id).set({ introduction: enhancedIntro }).commit();
  console.log(
    "[ok] glm-5-3-flash item updated with 'GLM 5.3 Flash', 'Zhipu AI GLM', and internal links",
  );
}

async function main() {
  await fixClaudeCodeModsPost();
  await fixArtcraftSuitePost();
  await fixPhotocraftItem();
  await fixEffectCraftItem();
  await fixGlmFlashItem();
  console.log("All 5 SEO fixes applied successfully!");
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
