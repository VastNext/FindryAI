import { createClient } from "@sanity/client";
import dotenv from "dotenv";

dotenv.config();

const SITE_URL = "https://findryai.com";
const AUTHOR_BECKCHAN = "user.03b839ed-4c2b-4300-b648-a609bfd4d483";
const CATEGORY_AI_NEWS = "jcGyoZ3vp3g0JERbe4b9fC";

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
// 1. New Item: MiniMax H3
// ---------------------------------------------------------------------------

const MINIMAX_H3_ITEM = {
  slug: "minimax-h3",
  name: "MiniMax H3",
  link: "https://hailuoai.video/zh-Intl/tools/minimax-h3",
  description:
    "MiniMax H3 is an open-weight multimodal generation model — text, image, video and audio in one context, generating 2K video with native stereo audio (up to 15s), with day-0 ComfyUI support, 4-step Turbo LoRAs, and an 8GB VRAM NF4 path.",
  categorySlugs: ["video-generation", "ai-tools"],
  tagSlugs: ["video", "open-source", "audio"],
  introduction: `## What is MiniMax H3?

MiniMax H3 is a general-purpose multimodal generation model released by MiniMax on July 31, 2026. It understands unified context across text, images, video, and audio, and generates video with **native stereo sound** at up to **15 seconds and 2K resolution**. MiniMax positions H3 for commercial content creation — advertising, branding, e-commerce, product design, UI/UX, and gaming — with strong instruction following, accurate text/brand rendering, and video-to-video motion transfer.

The architecture combines Contextual Omni Representation, H3-VAE, an H3-Omni Transformer, and In-Context Regeneration. Pricing is a headline feature: at 2K, H3's per-second price is less than a third of mainstream closed models (and less than half at 768p vs their 720p). Base weights are open under the MiniMax H3 Community License; the higher-capability H3 Max family remains closed and hosted-only.

## Two Open Checkpoints: FL2VA and Ref2VA

H3-Base ships as two task-specific, CFG-distilled checkpoints of the same size:

- **H3-Base-FL2VA** — text-to-audio-video (t2va) and first/last-frame-to-audio-video (fl2va): accepts zero, one, or two input images. Trained only with keyframes, it typically yields the best raw output quality.
- **H3-Base-Ref2VA** — omni-reference mode: accepts up to **9 images, 3 video clips (2–15s each), and 3 audio clips** (12 files total) as character/scene/motion references. The Ref Patch technique partially bridges its base-quality gap vs FL2VA.

## Run MiniMax H3 Locally (ComfyUI, DiffSynth, Turbo LoRAs)

The open ecosystem around H3 is unusually rich for a video model:

- **ComfyUI — day-0 native support**, with official T2V and R2V workflow templates; INT8 quantization is in mainline ComfyUI.
- **DiffSynth-Studio** — \`MiniMaxH3Pipeline\` with **NF4 quantized inference on an 8 GB VRAM floor**, the cheapest local path.
- **Turbo 4-step LoRAs** (LightX2V, Apache-2.0) — 768p fast generation; parallelism, quantized DiT, and feature caching scripts included.
- **Reference runtimes** — SGLang, vLLM, and diffusers \`ModularPipeline\` recipes are first-party; NVIDIA's Sol-Engine ships optimized configs (3.55–4.52x speedup on RTX 4090/5090, H100 and GB200).
- **Apple Silicon** — \`antirez/h3.c\` is a native Metal engine (MIT) with t2v, first-last-frame, and ordered Ref2VA references working.

## Prompt Guides & Free Online Access

- **Try online (official):** [hailuoai.video/tools/minimax-h3](https://hailuoai.video/zh-Intl/tools/minimax-h3)
- **Model card & weights:** [huggingface.co/MiniMaxAI/MiniMax-H3](https://huggingface.co/MiniMaxAI/MiniMax-H3)
- **Official repo & prompt guides:** [github.com/MiniMax-AI/MiniMax-H3](https://github.com/MiniMax-AI/MiniMax-H3) (Video Prompt Writing Guides for both FL2VA and Ref2VA)
- **ComfyUI templates:** official T2V/R2V JSON workflows ship with ComfyUI.

For comparison with other frontier video models, see [Seedance 2.5](https://findryai.com/item/seedance-2-5) and the [video generation category](https://findryai.com/category/video-generation).`,
};

// ---------------------------------------------------------------------------
// 2. New Blog Post: Gemini 4 Argon vs Claude Opus 5.5
// ---------------------------------------------------------------------------

const COMPARISON_BLOG = {
  title:
    "Gemini 4 Argon vs Claude Opus 5.5: Full Benchmark, Pricing & Use-Case Comparison (2026)",
  slug: "gemini-4-argon-vs-claude-opus-5-5",
  excerpt:
    "Gemini 4 Argon vs Claude Opus 5.5 compared on 17 official benchmarks, token pricing, output limits and real workloads — plus a clear verdict on which frontier model to pick for coding agents, knowledge work, and terminal automation.",
  blocks: (): Block[] => [
    p(
      "Both models are now generally available: Google DeepMind's ",
      ["Gemini 4 Argon", `${SITE_URL}/gemini-4-argon`],
      " launched worldwide on October 13, 2026, and Anthropic's Claude Opus 5.5 went live in September 2026. Searches for ",
      '"argon vs opus"',
      " keep climbing, so here is the full head-to-head using Google's official Model Card numbers — benchmarks, pricing, output limits, and a verdict by workload.",
    ),
    h2("Quick Verdict: Argon vs Opus 5.5"),
    li(
      "**Pick Gemini 4 Argon** for massive monolithic code migrations, multi-hour agent runs, long-video understanding, and enterprise legal/financial knowledge work.",
    ),
    li(
      "**Pick Claude Opus 5.5** for deep bash/CLI terminal automation, interactive shell engineering, and ML system tuning.",
    ),
    li(
      "**Price:** Argon's introductory rate is exactly half of Opus 5.5 ($2/$10 vs $4/$20 per 1M tokens through November 30, 2026), with the same 95% cached-input discount.",
    ),
    li(
      "**Output headroom:** Argon generates up to 1,000,000 tokens per trajectory (via background continuation hops) vs Opus 5.5's 128,000-token cap — a 7.8x difference that matters for whole-repository refactors.",
    ),
    h2("Benchmark Comparison: Where Each Model Wins"),
    p(
      "Google's Model Card reports 17 evaluations across both rivals. The scoreboard: **Argon leads 12, Opus 5.5 leads 3, and 2 are near-ties** (CWE-bench v1 is an exact tie at 68.0%).",
    ),
    h3("Where Gemini 4 Argon dominates"),
    li(
      "**DeepSWE v1.1 (agentic coding):** 77.9% vs Opus 5.5's 74.2% — #1 overall.",
    ),
    li("**Vals Index (GDP-weighted knowledge work):** 68.9% vs 67.0%."),
    li(
      "**Zapier AutomationBench:** 51.3% vs 42.5% — multi-app business execution.",
    ),
    li(
      "**Harvey Legal Agent:** 19.6% vs 3.8% — a 5x lead on legal research and drafting.",
    ),
    li("**Vals Finance Agent v2:** 65.4% vs 58.6%."),
    li(
      "**LABBench 2 (lab science):** 88.8% vs 73.1%; **RiemannBench (math):** 76.0% vs 69.6%.",
    ),
    li(
      "**LVBench (long video):** 91.7% vs 83.7%; **Chartography:** 71.6% vs 66.3%.",
    ),
    li(
      "**GraphWalks 256K–1M (long-context needle):** 84.2% vs 66.8% — a +17.4 point lead on million-token retrieval.",
    ),
    li(
      "**Agent's Last Exam:** 39.5% vs 38.2%; **Vibe Code Bench:** 91.9% vs 90.3%.",
    ),
    h3("Where Claude Opus 5.5 fights back"),
    li(
      "**Terminal-Bench 4.0 (CLI automation):** 66.4% vs Argon's 57.4% — the largest Opus lead, and the reason terminal-heavy agent users stay on Claude.",
    ),
    li("**PostTrainBench (ML engineering):** 49.3% vs 45.3%."),
    li(
      "**FrontierSWE v2 (extreme puzzle coding):** 62.3% vs Argon's 55.0% — though GPT-6 Astra tops this one at 65.5%.",
    ),
    li(
      "**CWE-bench v1 (security remediation):** 67.0% vs 68.0% — statistically a tie at the top.",
    ),
    h2("Pricing: Argon vs Opus 5.5 Cost Math"),
    li(
      "**Introductory (through Nov 30, 2026):** Argon $2.00 in / $10.00 out per 1M tokens vs Opus 5.5's $4.00 / $20.00 — 50% cheaper on both sides.",
    ),
    li(
      "**Standard (from Dec 1, 2026):** Argon moves to $4 / $20, matching Opus exactly.",
    ),
    li(
      "**Cached input:** both discount cached tokens 95% (Argon $0.10 intro / $0.20 standard; Opus $0.20 flat) — long agent sessions cost roughly the same after December.",
    ),
    li(
      "**Thinking tokens:** Argon bills output tokens including thinking at $10 intro; Opus includes extended thinking in its output price.",
    ),
    h2("Context, Output Limits and Ecosystem"),
    li(
      "**Context window:** effectively equal — Argon 1,048,576 unified tokens vs Opus 5.5's 1,000,000.",
    ),
    li(
      "**Max output:** Argon 1,000,000 tokens (64K continuation hops in background execution) vs Opus 5.5's 128,000.",
    ),
    li(
      "**Multimodality:** Argon natively ingests audio and hour-long video; Opus 5.5 covers text, code, and vision.",
    ),
    li(
      "**Tunability:** Argon offers thinking levels (low/medium/high) plus token budgets; Opus offers extended-thinking budgets.",
    ),
    h2("Bottom Line: Which One Should You Use?"),
    p(
      "If your day is agentic coding at repository scale, document-heavy knowledge work, or video/long-context analysis, Argon's benchmark lead plus half-price introductory billing makes it the default pick. If your day lives in the terminal — deep shell automation, infrastructure scripts, ML experiment tuning — Opus 5.5 remains the specialist. Many teams run both: Argon via ",
      "Google AI Studio",
      " for heavy generation, Opus 5.5 inside Claude Code for terminal work.",
    ),
    p(
      "For the interactive cost calculator, the full 17-benchmark table and SDK examples, see the complete ",
      ["Gemini 4 Argon deep dive", `${SITE_URL}/gemini-4-argon`],
      ". For terminal-side setups, read our ",
      ["Claude Code mods guide", `${SITE_URL}/blog/claude-code-mods`],
      ".",
    ),
  ],
};

// ---------------------------------------------------------------------------
// 3. Enhancements to Existing Items
// ---------------------------------------------------------------------------

async function enhanceItems() {
  console.log("\n=== 3. Enhancing existing items ===");

  // 3a. seedance-2-5
  const seedance = await client.fetch<
    { _id: string; introduction: string } | undefined
  >(
    `*[_type == "item" && slug.current == "seedance-2-5"][0]{_id, introduction}`,
  );
  if (seedance?.introduction && !seedance.introduction.includes("dreamina")) {
    const addition = `

## Seedance 2.5 Free Access: Higgsfield, Dreamina & Release FAQ

Searches for **free Seedance 2.5** access keep growing, so here are the verified routes:

- **Dreamina (ByteDance's own creator platform)** — \`dreamina seedance 2.5\` is the first-party route: Seedance 2.5 is available in Dreamina with daily free credits on a standard account.
- **Higgsfield** — \`higgsfield seedance 2.5\` refers to the third-party creative platform that integrated Seedance 2.5 for camera-control and effect templates; it offers a limited free trial tier before paid plans.
- **Release timing** — Seedance 2.5 rolled out in October 2026 as an upgrade focused on 30-second, 1080p clips with synchronized audio; "seedance 2.5 release date" searches spike around each platform rollout wave.
- **Fully open-source alternative** — if you need unlimited local generation with zero per-clip cost, [MiniMax H3](https://findryai.com/item/minimax-h3) releases open weights with a ComfyUI day-0 workflow and an 8 GB VRAM NF4 path.`;
    await client
      .patch(seedance._id)
      .set({ introduction: seedance.introduction + addition })
      .commit();
    console.log("[ok] seedance-2-5 enhanced");
  } else {
    console.log("[skip] seedance-2-5");
  }

  // 3b. REA — rea skill section
  const rea = await client.fetch<
    { _id: string; introduction: string } | undefined
  >(
    `*[_type == "item" && slug.current == "reverse-engineer-anything"][0]{_id, introduction}`,
  );
  if (
    rea?.introduction &&
    !rea.introduction.toLowerCase().includes("rea skill")
  ) {
    const addition = `

## REA Skill: Installing REA as a Claude Code Skill ("rea skill" Setup)

The fastest-growing REA-related query is **"rea skill"** — because REA ships as a proper agent skill, not just an MCP server. Running the official installer:

\`\`\`bash
npx rea-agents setup
\`\`\`

does two things: it registers the REA MCP server in your agent config, **and it copies the reverse-engineering skill into \`~/.claude/skills/\`**, so every Claude Code session can invoke REA workflows (binary inspection, evidence-backed explanation, feature reconstruction) without re-prompting.

- **\`rea skill github\`** — the skill files live inside the canonical repo ([github.com/morluto/rea](https://github.com/morluto/rea)); there is no separate skill repository.
- **\`claude rea\` / \`rea claude\`** — both refer to the same Claude Code + REA pairing; the installer shows every config change and asks for confirmation before writing.
- **Isolation tip** — to keep REA out of your everyday projects, install it under a dedicated profile via \`CLAUDE_CONFIG_DIR\`, exactly as the project's security guide recommends.
- **\`reverse engineering skill\`** — beyond REA, the same skills folder pattern is how Ghidra-MCP and similar bridges install; REA is the most-starred entry in that category.

For a full Claude Code customization walkthrough, see our [Claude Code mods guide](https://findryai.com/blog/claude-code-mods), and for pairing REA with a full agent runtime, see [DeepSeek Harness](https://findryai.com/item/deepseek-harness).`;
    await client
      .patch(rea._id)
      .set({ introduction: rea.introduction + addition })
      .commit();
    console.log("[ok] reverse-engineer-anything enhanced (rea skill)");
  } else {
    console.log("[skip] reverse-engineer-anything");
  }

  // 3c. omniroute — claude code variants
  const omni = await client.fetch<
    { _id: string; introduction: string } | undefined
  >(`*[_type == "item" && slug.current == "omniroute"][0]{_id, introduction}`);
  if (
    omni?.introduction &&
    !omni.introduction.toLowerCase().includes("claude code omniroute")
  ) {
    const addition = `

## OmniRoute + Claude Code: Every Search Variant Explained

People arrive at OmniRoute through a handful of interchangeable queries — **"omniroute claude"**, **"omniroute claude code"**, **"claude code omniroute"**, and **"omniroute github"** — and they all resolve to the same setup:

- **\`omniroute claude\` / \`claude omniroute\`** — pointing the Claude family of tools at the gateway. The root URL serves the native Anthropic Messages API, so no \`/v1\` suffix is needed.
- **\`omniroute claude code\` / \`claude code omniroute\`** — the CLI pairing: \`omniroute setup-claude\` writes one settings.json per model under \`~/.claude/profiles/\`, then \`omniroute launch --profile <model>\` spawns Claude Code with the right environment injected. The native \`/model\` picker can even list gateway models when \`CLAUDE_CODE_ENABLE_GATEWAY_MODEL_DISCOVERY=1\`.
- **\`omniroute github\` / \`github omniroute\`** — the source and docs live at [github.com/diegosouzapw/OmniRoute](https://github.com/diegosouzapw/OmniRoute), including the per-CLI configuration guides (Claude Code, Codex, OpenCode, Cline, Cursor).
- **Free-token angle** — routing Claude Code through cost-efficient models like GLM-5.3-Flash or DeepSeek via profiles is the main reason developers install it; see our [GLM-5.3-Flash page](https://findryai.com/item/glm-5-3-flash) for the model side.`;
    await client
      .patch(omni._id)
      .set({ introduction: omni.introduction + addition })
      .commit();
    console.log("[ok] omniroute enhanced");
  } else {
    console.log("[skip] omniroute");
  }

  // 3d. photocraft — reddit/safety section
  const photo = await client.fetch<
    { _id: string; introduction: string } | undefined
  >(`*[_type == "item" && slug.current == "photocraft"][0]{_id, introduction}`);
  if (
    photo?.introduction &&
    !photo.introduction.toLowerCase().includes("photocraft reddit")
  ) {
    const addition = `

## PhotoCraft on Reddit: Is PhotoCraft Safe and How Does It Compare?

**"Photocraft reddit"** searches cluster around three questions, so here are the evidence-based answers:

- **Is PhotoCraft safe?** Yes by construction: the code is public on GitHub ([storytold/photocraft](https://github.com/storytold/photocraft)), it runs fully offline with no telemetry, and it's clean-room built from public specifications with original assets. Download only from getartcraft.com or the official repo — the same rule that protects you from fake REA installers applies here.
- **PhotoCraft vs Photopea vs Photon Studio** — Photopea is browser-based (convenient, but uploads stay server-side), Photon Studio is a free PSD editor by Tenzen Studio, and PhotoCraft is the native Rust option: GPU-rendered, instant startup, real PSD read/write, and an MCP/CLI channel for automation. Redditors tend to pick PhotoCraft for speed and privacy, Photopea for zero-install quick edits.
- **Can it replace Photoshop today?** For layers, adjustments, selections, and layered PSD documents — yes. The project's own parity checklist is honest about what's still alpha (advanced SmartArt-style objects and some filter depth), which is why we track it in the [ArtCraft suite guide](https://findryai.com/blog/artcraft-open-source-adobe-alternatives).`;
    await client
      .patch(photo._id)
      .set({ introduction: photo.introduction + addition })
      .commit();
    console.log("[ok] photocraft enhanced");
  } else {
    console.log("[skip] photocraft");
  }
}

// ---------------------------------------------------------------------------
// 4. Main Routine
// ---------------------------------------------------------------------------

async function main() {
  console.log("=== 1. Creating MiniMax H3 item ===");
  const existing = await client.fetch<{ _id: string } | undefined>(
    `*[_type == "item" && slug.current == $slug][0]{_id}`,
    { slug: MINIMAX_H3_ITEM.slug },
  );

  const catRefs = await Promise.all(
    MINIMAX_H3_ITEM.categorySlugs.map(async (s) => ({
      _type: "reference",
      _ref: await categoryId(s),
      _key: nextKey(),
    })),
  );
  const tagRefs = await Promise.all(
    MINIMAX_H3_ITEM.tagSlugs.map(async (s) => ({
      _type: "reference",
      _ref: await tagId(s),
      _key: nextKey(),
    })),
  );

  const itemDoc = {
    _type: "item",
    name: MINIMAX_H3_ITEM.name,
    slug: { _type: "slug", current: MINIMAX_H3_ITEM.slug },
    link: MINIMAX_H3_ITEM.link,
    description: MINIMAX_H3_ITEM.description,
    introduction: MINIMAX_H3_ITEM.introduction,
    pricePlan: "free",
    freePlanStatus: "approved",
    publishDate: new Date().toISOString(),
    categories: catRefs,
    tags: tagRefs,
  };

  if (existing) {
    await client.patch(existing._id).set(itemDoc).commit();
    console.log(`[updated item] ${MINIMAX_H3_ITEM.slug} (${existing._id})`);
  } else {
    const created = await client.create(itemDoc);
    console.log(`[created item] ${MINIMAX_H3_ITEM.slug} (${created._id})`);
  }

  console.log("\n=== 2. Creating Argon vs Opus comparison blog ===");
  const blogSlug = COMPARISON_BLOG.slug;
  const existingBlog = await client.fetch<{ _id: string } | undefined>(
    `*[_type == "blogPost" && slug.current == $slug][0]{_id}`,
    { slug: blogSlug },
  );

  const blogDoc = {
    _type: "blogPost",
    title: COMPARISON_BLOG.title,
    slug: { _type: "slug", current: blogSlug },
    author: { _type: "reference", _ref: AUTHOR_BECKCHAN },
    categories: [
      { _type: "reference", _ref: CATEGORY_AI_NEWS, _key: nextKey() },
    ],
    excerpt: COMPARISON_BLOG.excerpt,
    body: COMPARISON_BLOG.blocks(),
    publishDate: new Date().toISOString(),
    featured: false,
  };

  if (existingBlog) {
    await client.patch(existingBlog._id).set(blogDoc).commit();
    console.log(`[updated blog] ${blogSlug} (${existingBlog._id})`);
  } else {
    const createdBlog = await client.create(blogDoc);
    console.log(`[created blog] ${blogSlug} (${createdBlog._id})`);
  }

  // link related posts
  const artcraftBlog = await client.fetch<{ _id: string } | undefined>(
    `*[_type == "blogPost" && slug.current == "artcraft-open-source-adobe-alternatives"][0]{_id}`,
  );
  const claudeMods = await client.fetch<{ _id: string } | undefined>(
    `*[_type == "blogPost" && slug.current == "claude-code-mods"][0]{_id}`,
  );
  const newBlog = await client.fetch<{ _id: string } | undefined>(
    `*[_type == "blogPost" && slug.current == $slug][0]{_id}`,
    { slug: blogSlug },
  );
  if (newBlog && (artcraftBlog || claudeMods)) {
    const related: { _key: string; _type: "reference"; _ref: string }[] = [];
    if (claudeMods)
      related.push({
        _key: nextKey(),
        _type: "reference",
        _ref: claudeMods._id,
      });
    if (artcraftBlog)
      related.push({
        _key: nextKey(),
        _type: "reference",
        _ref: artcraftBlog._id,
      });
    await client.patch(newBlog._id).set({ relatedPosts: related }).commit();
    console.log(`[ok] relatedPosts set (${related.length})`);
  }

  await enhanceItems();

  console.log("\n=== 5. Verification ===");
  const verifyItem = await client.fetch(
    `*[_type == "item" && slug.current == "minimax-h3"][0]{name, publishDate}`,
  );
  console.log("[verified minimax-h3]", JSON.stringify(verifyItem));
  const verifyBlog = await client.fetch(
    `*[_type == "blogPost" && slug.current == "gemini-4-argon-vs-claude-opus-5-5"][0]{title, publishDate, "blocks": count(body)}`,
  );
  console.log("[verified blog]", JSON.stringify(verifyBlog));
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
