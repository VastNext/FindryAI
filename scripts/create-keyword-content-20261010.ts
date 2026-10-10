import { createClient } from "@sanity/client";
import dotenv from "dotenv";

dotenv.config();

// Keyword-driven content batch for 2026-10-10:
// items: PhotoCraft / Vidu Q4 Preview / Qwen-Image 2.1
// posts: photocraft / vidu-q4-preview / anthropic-oss-scanner / qwen-image-2-1
// All facts verified against official sources on 2026-10-10 (see body links).

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

const PHOTOCRAFT_ITEM: ItemSpec = {
  slug: "photocraft",
  name: "PhotoCraft",
  link: "https://getartcraft.com/apps/photocraft",
  description:
    "PhotoCraft is a free, open-source image editor written in pure Rust by the ArtCraft team — a clean-room Photoshop alternative with layers, masks, adjustment layers, type, vectors and real PSD file support.",
  categorySlugs: ["design-tools"],
  tagSlugs: ["open-source", "tech"],
  introduction: `## What is PhotoCraft?

PhotoCraft is a free, open-source image editor built as a clean-room reimplementation of Adobe Photoshop in pure Rust, developed in the open by the ArtCraft team. It ships layers, masks, adjustment layers, layer styles, type, vectors and brushes in a native desktop app — with full read/write support for real layered PSD files. No subscription, no account, no cloud: the code is MIT/Apache-2.0 licensed and works fully offline.

## Key Features

- **Real PSD and PSB files** — open, edit and save layered Photoshop documents. Re-saving renders the same for 307 of 309 files in the psd-tools test corpus, and unsupported data is carried over instead of dropped. 16-bit, 32-bit, CMYK and Lab documents open natively.
- **Photoshop-shaped UX** — menus, panels, tools and shortcuts sit where Photoshop users expect, from Cmd+J to Shift+Cmd+D. If you know Photoshop, you already know PhotoCraft.
- **Native and fast** — a GPU compositor built on wgpu (Metal, Vulkan, DirectX 12, WebGPU) with copy-on-write tiles and multithreaded filters. No Electron, no web view.
- **Broad format support** — PSD, PSB, layered TIFF, SVG, PNG, JPEG, WebP, GIF, BMP, TGA, ICO, QOI, PNM, OpenEXR, Radiance HDR, AVIF and more, with 8/16/32-bit symmetric read and write. Affinity documents (.afphoto, .afdesign, .afpub) open read-only.
- **Agent-ready** — every action is a command, drivable from the UI, the CLI, a JSON control channel or an MCP server.
- **Runs everywhere** — native builds for macOS, Windows and Linux (AppImage, deb, rpm, Flatpak, FreeBSD), plus a WebAssembly build for the browser.

## Current Status: Early Alpha

PhotoCraft is honest about where it stands: version 0.5.0 is early alpha. Much of Photoshop's feature surface exists in some form, but generative AI features, roughly twenty tools, advanced typography depth and plug-in compatibility are not there yet. For everyday layered editing, retouching and PSD hand-offs it already works; professionals should run it alongside their current tools.

## PhotoCraft vs Photoshop vs GIMP vs Photopea

- **PhotoCraft** — free, open source, native, Photoshop-style UI, strong PSD round-trips. Young (early alpha), no generative AI yet.
- **Photoshop** — industry standard, full feature set and Firefly AI, subscription-only with an Adobe ID requirement.
- **GIMP** — mature and open source (GPL) with its own interface paradigm and partial PSD support.
- **Photopea** — free with ads, closed source, runs in the browser, very Photoshop-like.

PhotoCraft's niche is the combination: free + open source + native + offline + Photoshop-shaped, which no other editor currently offers together.

## How to Get PhotoCraft

Download installers for macOS, Windows and Linux from the [official ArtCraft page](https://getartcraft.com/apps/photocraft), grab binaries from [GitHub releases](https://github.com/storytold/photocraft), try it in the browser via the WebAssembly build, or build from source with \`cargo run --release -p photocraft\`. Community support lives on the ArtCraft Discord.

PhotoCraft is one of the ArtCraft "Crafting Apps" — a family of free, open-source Rust creative tools that also includes VectorCraft (vector), FilmCraft (video), LightCraft (photo RAW), PdfCraft, EffectCraft (motion graphics) and DesignCraft (page layout).

## Frequently Asked Questions

### Is PhotoCraft really free?

Yes. It is licensed under MIT/Apache-2.0 with no subscription, trial timer, watermark, account or advertising, and commercial use is allowed.

### Can PhotoCraft replace Photoshop?

For many everyday jobs — layered editing, retouching, adjustment layers, layer styles, type and PSD hand-offs — it already can. It is early alpha, so generative AI, some tools and plug-in compatibility are still missing; run it alongside your current editor until those land.

### Does PhotoCraft open and save PSD files?

Yes, including layered PSD and PSB, 16/32-bit, CMYK and Lab files. Its PSD support is a standalone crate written from Adobe's public specification and tested against real-world Photoshop files.`,
};

const VIDU_ITEM: ItemSpec = {
  slug: "vidu-q4-preview",
  name: "Vidu Q4 Preview",
  link: "https://www.vidu.com/vidu-q4",
  description:
    "Vidu Q4 Preview is Shengshu Technology's next-generation AI video model with synchronized native audio, 540p–4K output, up to 15 image references and 3 audio references — launched October 7, 2026.",
  categorySlugs: ["video-generation", "ai-tools"],
  tagSlugs: ["video", "ai"],
  introduction: `## What is Vidu Q4 Preview?

Vidu Q4 Preview is the first public preview of Q4, the next-generation flagship video model from Shengshu Technology (生数科技), released on October 7, 2026. It focuses on lifelike character performance, cinematic camera language and complex effects, and generates video with synchronized native audio — dialogue and sound effects produced together with the visuals. The final Q4 model has no announced release date; the preview exists so creators can apply it to real projects and feed results back into the final build.

## Capabilities

- **Image-to-Video** — one starting image plus a prompt, 3–16 seconds per clip.
- **Reference-to-Video** — up to 15 image references to lock characters, wardrobe, props, products and environments, plus up to 3 reference audio clips to keep a character's voice consistent across a scene. 1–16 seconds.
- **Native audio** — synchronized dialogue and sound effects when audio output is enabled.
- **Up to 4K** — 540p, 720p, 1080p, 2K and 4K output with 10-bit color at higher tiers, 24fps.
- Note: the preview exposes image-to-video and reference-to-video only; no text-to-video or first-and-last-frame endpoints are documented yet.

## Pricing

Launch pricing is genuinely confusing: Shengshu's two same-day press releases quote different starting prices — **$0.014/second** in one and **$0.045/second** at 540p in the other (scaling to $0.39/second at 4K). A 30% launch discount runs through November 30, 2026. Official API pricing in RMB lists 0.03125 RMB per credit, which works out to roughly ¥0.75/second at 1080p and ¥2.44/second at 4K. Treat any cost math this month as provisional until a single rate card is published.

## Benchmarks and Reception

Third-party tracking places Vidu Q4 Preview third on Artificial Analysis's image-to-video leaderboard with an Elo of 1,179, well ahead of the older Vidu Q3 Pro (1,056). CEO Yihang Luo has framed the release as a push for models to "prove themselves beyond carefully selected demos."

## How to Use It

Vidu Q4 Preview is available through [Vidu's web product](https://www.vidu.com/vidu-q4) and the Vidu API platform (model ID \`viduq4-preview\`). Developers should start from the official image-to-video (\`/ent/v2/img2video\`) and reference-to-video (\`/ent/v2/reference2video\`) endpoints.

## How It Compares

- **Seedance 2.5 (ByteDance)** — longer native clips (30s with extensions), up to 50 references, strong audio-video joint generation. Vidu Q4 Preview counters with 15-image + 3-audio references, 4K 10-bit output and aggressive launch pricing.
- **Kling** — strong motion quality and mature tooling; Vidu's differentiator is multi-reference character/voice consistency at 4K.

## Frequently Asked Questions

### Is Vidu Q4 Preview free?

Generation is pay-per-use, but the launch carries a 30% promotional discount through November 30, 2026. Check the official site for current credit pricing and any free trial quota.

### What is the API model ID?

\`viduq4-preview\`. Do not substitute guessed IDs such as \`vidu-q4\` or \`viduq4\`.

### Can it generate video from text only?

Not in the preview — the documented endpoints are image-to-video and reference-to-video. Start from an image.`,
};

const QWEN_ITEM: ItemSpec = {
  slug: "qwen-image-2-1",
  name: "Qwen-Image 2.1",
  link: "https://github.com/QwenLM/Qwen-Image-2.1",
  description:
    "Qwen-Image 2.1 is Alibaba Qwen's open-source unified text-to-image generation and editing model — 7B visual parameters, native RGBA transparency, up to 10 reference images, and an 8-step Turbo variant.",
  categorySlugs: ["image-generation", "ai-tools"],
  tagSlugs: ["image", "ai", "open-source"],
  introduction: `## What is Qwen-Image 2.1?

Qwen-Image 2.1 is the Qwen team's most powerful open-source image model, released on September 20, 2026. It unifies text-to-image generation and image editing in a single 7B-parameter model (32 Single-Stream DiT layers in the visual generation component), balancing quality, inference efficiency and versatility. On October 9, 2026 the team also released **Qwen-Image-2.1-Turbo**, a distilled checkpoint that generates and edits in just 8 denoising steps.

## Key Capabilities

- **Unified generation and editing** — create images from text, edit existing photos, and extract subjects, all in one model.
- **Native transparency (RGBA)** — generate regular or transparent images from a prompt, edit transparent layers directly, and cut subjects out of photographs without a separate tool.
- **Multi-reference editing** — up to 10 reference images for multi-subject composition, with local edits specified via circles, painted annotations or masks; preserves identity for people and products.
- **Better textures and typography** — improved text rendering, portrait lighting and fine details.
- **Efficient** — mixed-granularity attention and prefix KV cache reuse keep the 7B model fast on modest hardware.

## How to Run It

- **Diffusers** — day-0 support via \`QwenImage21Pipeline\` (bf16, CUDA).
- **ComfyUI** — native day-0 support with compatible weights at Comfy-Org/Qwen-Image-2.1 and ready-made text-to-image and editing workflows.
- **ModelScope / DiffSynth-Studio** — generation plus LoRA training.
- **Acceleration** — SGLang (prefix caching, Cache-DiT, CUDA graphs, parallelism) and LightX2V provide day-0 inference acceleration.
- **Hosted APIs** — Qwen-Image-2.1 Pro and Turbo are officially available through Alibaba Cloud Model Studio.

Weights are on [Hugging Face](https://huggingface.co/Qwen/Qwen-Image-2.1) and ModelScope; source and docs live on [GitHub](https://github.com/QwenLM/Qwen-Image-2.1).

## License Note

Qwen-Image 2.1 ships under the **Qwen Research License Agreement** — permissive for research and evaluation, with restrictions on commercial use. Check the license terms before shipping it in a product; for hosted commercial generation, the official APIs are the compliant route.

## How It Compares

- **vs FLUX.1** — FLUX remains a strong open-weights aesthetic baseline, but editing workflows and transparency typically require separate tooling; Qwen-Image 2.1 unifies generation, editing and RGBA in one checkpoint.
- **vs Midjourney / Ideogram** — those are closed hosted products (Ideogram notably strong at text rendering); Qwen-Image 2.1 is the option you can run and fine-tune locally.
- **Turbo vs base** — same 7B architecture, but Turbo needs only 8 denoising steps (CFG=1, saved sampling schedule), trading a little flexibility for 5x-fewer-step speed.

## Frequently Asked Questions

### Is Qwen-Image 2.1 free?

The weights are free to download and run for research purposes under the Qwen Research License. Commercial use is restricted — review the license or use the official APIs.

### What is Qwen-Image-2.1-Turbo?

A distilled version of the same 7B model released on October 9, 2026, doing generation and editing in 8 denoising steps with the recommended sampling schedule baked into the checkpoint.

### Can it edit transparent images?

Yes — native RGBA support means you can generate transparent images from prompts and edit transparent layers (e.g. change a subject's expression while keeping the transparent background).`,
};

// ---------------------------------------------------------------------------
// Blog posts
// ---------------------------------------------------------------------------
interface PostSpec {
  slug: string;
  title: string;
  excerpt: string;
  body: Block[];
  relatedSlug?: string;
}

function photocraftPost(): PostSpec {
  return {
    slug: "photocraft-open-source-photoshop-alternative",
    title:
      "PhotoCraft: The Free Open-Source Photoshop Alternative Built in Rust",
    excerpt:
      "PhotoCraft is the open-source Rust image editor exploding in popularity right now. How it compares to Photoshop, GIMP and Photopea, what it can and can't do in early alpha, and how to get it.",
    relatedSlug: "anthropic-oss-scanner",
    body: [
      p(
        "Last updated: October 10, 2026. A new open-source project called PhotoCraft has been one of the fastest-rising design-tool searches this week — and unlike most hyped launches, it is something you can download and use today. Here is what it is, how good the PSD support really is, and whether it can replace Photoshop for your work.",
      ),
      h2("What is PhotoCraft?"),
      p(
        "PhotoCraft is a free, open-source image editor written entirely in Rust by the ArtCraft team. It is a clean-room reimplementation of Adobe Photoshop: no Adobe code, but the same mental model — layers, masks, adjustment layers, layer styles, type, vectors and brushes — in a native desktop app that works fully offline. The license is MIT/Apache-2.0: no subscription, no trial timer, no watermark, no account.",
      ),
      p(
        "The headline feature is real PSD support. PhotoCraft opens, edits and saves layered Photoshop documents (PSD and PSB), and its fidelity is measured, not marketed: re-saving renders the same for 307 of 309 files in the psd-tools test corpus. Files it does not fully model yet are carried over instead of being destroyed.",
      ),
      h2("Why it is trending in October 2026"),
      p(
        "Three things converged: the project hit version 0.5.0 with its strongest PSD round-trips yet, word spread through developer communities that a 'Photoshop in Rust' actually exists and runs, and a wave of third-party guide sites appeared for the keyword almost overnight. For anyone who has bounced off GIMP's interface or Photopea's browser-only constraints, a free, native, Photoshop-shaped editor is an easy story to share.",
      ),
      h2("PhotoCraft vs Photoshop vs GIMP vs Photopea"),
      ...ul([
        [
          "PhotoCraft — free, open source, native (Rust + GPU), Photoshop-style menus and shortcuts, strong PSD round-trips. Early alpha: no generative AI, about twenty tools still missing.",
        ],
        [
          "Photoshop — the industry standard with Firefly AI and complete plug-in support, but subscription-only and account-gated.",
        ],
        [
          "GIMP — mature, open source (GPL), free — with its own interface paradigm and only partial PSD support.",
        ],
        [
          "Photopea — browser-based, very Photoshop-like, free with ads, closed source.",
        ],
      ]),
      p(
        "PhotoCraft's unique combination is being free + open source + native + offline + Photoshop-shaped at the same time. GIMP is mature but feels different; Photopea feels right but is a closed web app; PhotoCraft is young but checks every box.",
      ),
      h2("What it does well"),
      ...ul([
        ["Layered PSD/PSB files — including 16/32-bit, CMYK and Lab documents"],
        [
          "Photoshop-familiar UX — Cmd+J, Shift+Cmd+D and the menus your hands already know",
        ],
        [
          "Speed — a GPU compositor on wgpu (Metal/Vulkan/DX12/WebGPU) with copy-on-write tiles; no Electron",
        ],
        [
          "Formats — layered TIFF, SVG, PNG, JPEG, WebP, GIF, BMP, TGA, ICO, QOI, PNM, OpenEXR, HDR, AVIF, plus read-only Affinity (.afphoto/.afdesign/.afpub) import",
        ],
        [
          "Automation — every action is a command, drivable via CLI, JSON or an MCP server",
        ],
        [
          "Platforms — macOS, Windows, Linux (AppImage/deb/rpm/Flatpak/FreeBSD) and a browser build",
        ],
      ]),
      h2("What it can't do yet"),
      p(
        "Credit where due: the project is unusually honest about its alpha status. Generative AI features (Firefly equivalents) do not exist, roughly twenty Photoshop tools are missing, advanced typography has gaps, and legacy Photoshop .8BF plug-ins are not supported (a sandboxed WebAssembly plug-in API is planned). If your workflow leans on those, run PhotoCraft alongside your current editor for now.",
      ),
      h2("How to get it"),
      p(
        "Download installers from the ",
        ["official ArtCraft page", "https://getartcraft.com/apps/photocraft"],
        " or the ",
        ["GitHub releases", "https://github.com/storytold/photocraft"],
        ", try the WebAssembly build in a browser, or build from source with cargo. Note: photocraft.im ranks highly in search but is an unofficial community guide — the official page is on getartcraft.com.",
      ),
      p(
        "We have added PhotoCraft to our directory — see the ",
        ["PhotoCraft listing", `${SITE_URL}/item/photocraft`],
        " for details and links.",
      ),
      h2("FAQ"),
      h3("Is PhotoCraft a clone of Photoshop?"),
      p(
        "Legally no — it is a clean-room reimplementation written from scratch in Rust, with no Adobe code. Practically, it reproduces Photoshop's interface conventions and reads and writes Photoshop's file formats, which is entirely legal (the same as GIMP or Photopea).",
      ),
      h3("Can PhotoCraft replace Photoshop in 2026?"),
      p(
        "For everyday layered editing, retouching and PSD hand-offs: largely yes. For professional work depending on generative AI, missing tools, deep typography or plug-ins: not yet. The project publishes an honest parity roadmap — check it before switching cold turkey.",
      ),
      h3("Is PhotoCraft safe and really free?"),
      p(
        "It is MIT/Apache-2.0 open source with no account or telemetry requirements, and free including commercial use. Download binaries from the official GitHub releases or build from source.",
      ),
      h3("Does it work on Linux?"),
      p(
        "Yes — native AppImage, deb and rpm packages, Flatpak, and even FreeBSD, plus the browser build. That native Linux support is something Photoshop has never offered.",
      ),
    ],
  };
}

function viduPost(): PostSpec {
  return {
    slug: "vidu-q4-preview",
    title:
      "Vidu Q4 Preview: Pricing, Features, and How It Compares to Seedance and Kling",
    excerpt:
      "Vidu Q4 Preview launched October 7, 2026 with native audio, 15 image references and 4K output — and two contradictory launch prices. Full feature breakdown, the pricing mess explained, and how it stacks up against Seedance 2.5 and Kling.",
    relatedSlug: "qwen-image-2-1",
    body: [
      p(
        `Last updated: October 10, 2026. Shengshu Technology launched Vidu Q4 Preview on October 7, 2026 — the first public taste of its next flagship video model, with synchronized native audio, up to 15 image references, and 4K 10-bit output. It entered third on Artificial Analysis's image-to-video leaderboard within days. Here is everything verified so far, including a pricing story that is stranger than it should be.`,
      ),
      h2("What is Vidu Q4 Preview?"),
      p(
        "Q4 Preview is a public preview of Vidu's next-generation flagship model, released ahead of the final Q4 so creators can use it on real projects and shape the final build. It emphasizes lifelike character performance, cinematic camera language, complex effects and voice-consistent characters. The full Q4 model has no announced date.",
      ),
      h2("Features and limits"),
      ...ul([
        ["Image-to-Video — one image plus a prompt, 3–16 seconds"],
        [
          "Reference-to-Video — up to 15 image references (characters, wardrobe, props, products, environments) plus up to 3 reference audio clips to hold a voice consistent across a scene; 1–16 seconds",
        ],
        [
          "Native audio — synchronized dialogue and sound effects generated with the video",
        ],
        [
          "Resolution — 540p / 720p / 1080p / 2K / 4K, with 10-bit color at higher tiers, 24fps",
        ],
        [
          "Not in the preview — text-to-video and first-and-last-frame endpoints are not documented yet; start from an image",
        ],
      ]),
      h2("Pricing: two official numbers"),
      p(
        "Vidu's two same-day press releases disagree. One quotes launch pricing starting at ",
        ["$0.014 per second", "https://www.webull.com/news/15708262392742912"],
        "; the other states $0.045 per second at 540p, scaling to $0.39 per second at 4K. The 30% launch promotion (through November 30, 2026) does not reconcile the two. The official API rate card in RMB — 0.03125 per credit — implies roughly ¥0.75/second at 1080p and ¥2.44/second at 4K for a 10-second clip.",
      ),
      quote(
        "Practical takeaway: treat any Vidu Q4 Preview cost estimate this month as provisional, and check your account's actual billing before batch-rendering. The cheapest honest statement is that it costs somewhere between $0.014 and $0.39 per second depending on resolution, plan, region and calendar.",
      ),
      h2("Benchmarks: third on day one"),
      p(
        "Third-party placements on Artificial Analysis's image-to-video leaderboard put Vidu Q4 Preview at an Elo of 1,179 — third overall, and far ahead of the older Vidu Q3 Pro (1,056). Shengshu also claims up to 5x more output for the same budget versus comparable conditions, though it does not name the comparison model. CEO Yihang Luo's launch framing: 'Advanced video models should prove themselves beyond carefully selected demos.'",
      ),
      h2("Vidu Q4 Preview vs Seedance 2.5 vs Kling"),
      p(
        "vs Seedance 2.5 — ByteDance's model generates 30-second native clips with extensions and up to 50 multimodal references; Vidu Q4 Preview counters with 15-image plus 3-audio references, 4K 10-bit, and aggressive launch pricing. See our ",
        ["Seedance 2.5 listing", `${SITE_URL}/item/seedance-2-5`],
        " for the full breakdown.",
      ),
      p(
        "Against Kling, Vidu's differentiators are multi-reference character and voice consistency at 4K, and an API that exposes audio references directly. Kling remains strong on motion quality and mature tooling.",
      ),
      h2("How to use it"),
      p(
        "The preview runs through ",
        ["Vidu's web product", "https://www.vidu.com/vidu-q4"],
        " and the Vidu API. The API model ID is viduq4-preview — don't substitute guessed IDs like vidu-q4. Documented endpoints: /ent/v2/img2video (image-to-video) and /ent/v2/reference2video (reference-to-video with 1–15 images and 0–3 MP3 audio references, each 3–12 seconds).",
      ),
      p(
        "We track it in the directory here: ",
        ["Vidu Q4 Preview", `${SITE_URL}/item/vidu-q4-preview`],
        ".",
      ),
      h2("FAQ"),
      h3("When does the full Vidu Q4 release?"),
      p(
        "No announced date. The preview exists precisely to gather creator feedback before the final build — expect the final release after that feedback cycle.",
      ),
      h3("How much does Vidu Q4 Preview cost?"),
      p(
        "Officially: either $0.014/second or $0.045/second at 540p depending on which press release you read, with a 30% discount through November 30, 2026, and up to $0.39/second at 4K. Verify against the rate card in your account.",
      ),
      h3("Can Vidu Q4 Preview do text-to-video?"),
      p(
        "Not in the preview. Only image-to-video and reference-to-video endpoints are documented — start from an image.",
      ),
      h3("Is it good for consistent characters?"),
      p(
        "That is the headline feature: up to 15 image references lock subjects and environments, and up to 3 audio references keep a character's voice consistent across scenes — useful for series and ad work.",
      ),
    ],
  };
}

function ossScannerPost(): PostSpec {
  return {
    slug: "anthropic-oss-scanner",
    title:
      "Anthropic OSS Scanner: Free Claude-Powered Vulnerability Scans for Open Source",
    excerpt:
      "Anthropic's OSS Scanner gives open-source projects free periodic security scans with its strongest Claude models — no human review before reports land. How to enroll, what the accuracy data really shows, and the triage-burden controversy.",
    relatedSlug: "photocraft-open-source-photoshop-alternative",
    body: [
      p(
        "Last updated: October 10, 2026. On October 8, 2026, Anthropic launched ",
        [
          "OSS Scanner",
          "https://www.anthropic.com/research/launching-opt-in-vuln-finding-service-for-open-source",
        ],
        " — a free, opt-in vulnerability-finding service for open-source projects, scanned periodically by its strongest models including Claude Mythos. It is already one of the most discussed security launches of the year, for both its results and its unusual design choice: reports reach maintainers without human review.",
      ),
      h2("What OSS Scanner is"),
      p(
        "Inspired by Google's OSS-Fuzz, OSS Scanner applies large language models instead of fuzzers. Enrolled projects receive thorough periodic scans at no cost, and Anthropic covers the full bill through a $35 million Defender Advantage Fund of Claude credits. The service builds on Project Glasswing, Anthropic's earlier vulnerability-disclosure work, which had reviewed over 6,000 reports by October 2026.",
      ),
      h2("What reports contain"),
      p(
        "Each finding arrives as a bundle that includes a self-contained reproducer, an explanation of the vulnerability, a bisection to determine when the bug was introduced (where possible), and a candidate patch when available. Scans run in isolated VMs with network access disabled during the audit phase — a design aimed squarely at supply-chain attack vectors.",
      ),
      h2("The accuracy numbers, honestly"),
      ...ul([
        ["29,439 candidate vulnerabilities found to date"],
        [
          "6,123 findings reviewed by external security firms; 5,674 confirmed — a 92.7% confirmation rate",
        ],
        [
          "Of 97 critical/high findings audited by expert penetration testers across 48 projects, 85 (88%) met coordinated-disclosure standards; 11 were real but duplicates; exactly one was a false positive",
        ],
        [
          "Multiple chained vulnerabilities escalating to unauthenticated remote code execution have already been found and disclosed",
        ],
      ]),
      p(
        "The catch: the scanner sends reports fully model-generated, without human review, and Anthropic expects a true-positive rate above 90% — an expectation, not a guarantee. Of 6,157 reports sent to maintainers so far, 4,824 went out without the independent check. Severity ratings skew high: Claude's first rating matched external firms exactly 83% of the time, and matched maintainers only 46% of the time, usually by rating higher than the project's own threat model would.",
      ),
      h2("The controversy: triage shifts to maintainers"),
      p(
        "Security coverage has been broadly positive but not uncritical. Because reports skip human triage, the first human to evaluate each finding is the maintainer receiving it — and the pipeline already outpaces validation capacity. Unvalidated findings carry no mandatory 90-day disclosure clock (that applies only after human validation), and maintainer complaints about noise and inflated severities are on the record. Anthropic's own line is flat: 'We can't guarantee the scanner will be perfect.'",
      ),
      h2("How to enroll your project"),
      ...ul([
        [
          "Eligibility mirrors OSS-Fuzz: projects should have critical impact on infrastructure and user security; decisions are case-by-case",
        ],
        [
          "Core maintainers submit a pull request to the OSS Scanner GitHub repo following the standard project template",
        ],
        [
          "After the first scan, projects receive periodic re-scans for new and previously missed vulnerabilities",
        ],
        ["Projects can pause or exit at any time"],
      ]),
      p(
        "Enrollment details and the FAQ live on ",
        [
          "Anthropic's OSS Scanner page",
          "https://red.anthropic.com/oss-scanner/",
        ],
        ".",
      ),
      h2("Related programs worth knowing"),
      ...ul([
        [
          "Claude Security — Anthropic's commercial code-scanning and patching product for enterprises",
        ],
        [
          "Claude for OSS — free Claude Max 20x subscriptions for open-source maintainers, aimed at remediation work",
        ],
        [
          "Cyber Verification Program — advanced cyber capabilities and reduced blocking for qualifying security professionals",
        ],
      ]),
      h2("What maintainers should do now"),
      p(
        "If you maintain infrastructure-critical open source, enroll — the confirmed-88%-critical-hit rate is far above noise. But set up intake discipline: log every unreviewed report (valid, duplicate, invalid, severity-changed), re-rate severity against your own threat model, and treat reproducer attachments as sensitive until verified. Your own true-positive rate is the only one that matters for your project.",
      ),
      h2("FAQ"),
      h3("Is OSS Scanner really free?"),
      p(
        "Yes for enrolled open-source projects. Anthropic funds it through a $35 million Defender Advantage Fund of Claude credits; the commercial counterpart is Claude Security.",
      ),
      h3("Will I get false positives?"),
      p(
        "Possibly — reports are model-generated without human review. Anthropic's validated sample shows a 92.7% confirmation rate and exactly one false positive among 97 audited critical/high findings, but the 4,824 direct-sent reports carry no such audit.",
      ),
      h3("What models does it use?"),
      p(
        "Anthropic's strongest models, including Claude Mythos, with agent pipelines for double-checking, patching and root-cause analysis.",
      ),
      h3("Does this replace a security audit?"),
      p(
        "No. Treat it as a high-signal complement to your existing review process — it finds real bugs (including RCE chains), but severity and threat-model fit still need a human who knows your project.",
      ),
    ],
  };
}

function qwenPost(): PostSpec {
  return {
    slug: "qwen-image-2-1",
    title:
      "Qwen-Image 2.1: Open-Source Image Generation and Editing — Turbo Update, Local Setup, and How It Compares",
    excerpt:
      "Alibaba's Qwen-Image 2.1 unifies text-to-image, editing and native transparency in one open 7B model — and the new 8-step Turbo checkpoint just landed. How to run it locally, the license catch, and where it beats FLUX.",
    relatedSlug: "vidu-q4-preview",
    body: [
      p(
        `Last updated: October 10, 2026. Qwen-Image 2.1 is the Qwen team's most powerful open-source image model: a unified generation-and-editing model with native transparent-image support, released September 20, 2026 — and on October 9 the team shipped `,
        [
          "Qwen-Image-2.1-Turbo",
          "https://huggingface.co/Qwen/Qwen-Image-2.1-Turbo",
        ],
        ", an 8-step distilled checkpoint that makes it dramatically faster. Here is what it does, how to run it, and where it fits against FLUX and the hosted giants.",
      ),
      h2("What makes Qwen-Image 2.1 different"),
      p(
        "Most open image models do one thing well. Qwen-Image 2.1 unifies four jobs in a single 7B-parameter model (32 Single-Stream DiT layers in the visual generation component):",
      ),
      ...ul([
        [
          "Text-to-image generation — with improved typography, portrait lighting and fine details",
        ],
        [
          "Image editing — up to 10 reference images, local edits specified by circles, painted annotations or masks, and identity preservation for people and products",
        ],
        [
          "Native transparency (RGBA) — generate transparent images from prompts, edit transparent layers directly (say, change a subject's expression while keeping the background clear), and extract subjects from photos",
        ],
        [
          "Efficiency — mixed-granularity attention and prefix KV cache reuse keep quality high at low compute",
        ],
      ]),
      p(
        "The transparency feature is the sleeper hit: it absorbs what previously required a separate model (Qwen-Image-Layered) or a manual cutout workflow, which matters enormously for e-commerce, design and compositing work.",
      ),
      h2("Turbo: 8 steps instead of 40"),
      p(
        "The base model runs well at around 40 denoising steps. The ",
        [
          "Turbo checkpoint",
          "https://huggingface.co/Qwen/Qwen-Image-2.1-Turbo",
        ],
        " (released October 9, 2026) uses the same 7B architecture but generates and edits in 8 steps with CFG=1. The recommended sampling schedule ships inside the checkpoint and Diffusers loads it automatically — setting num_inference_steps alone does not override it.",
      ),
      h2("How to run it locally"),
      ...ul([
        ["Diffusers — day-0 support via QwenImage21Pipeline (bf16 on CUDA)"],
        [
          "ComfyUI — native day-0 support with compatible weights at Comfy-Org/Qwen-Image-2.1 and ready-made text-to-image and editing workflows",
        ],
        ["ModelScope + DiffSynth-Studio — generation plus LoRA training"],
        [
          "Acceleration — SGLang (prefix caching, Cache-DiT, CUDA graphs, parallelism) and LightX2V",
        ],
        [
          "Hosted APIs — Qwen-Image-2.1 Pro and Turbo on Alibaba Cloud Model Studio",
        ],
      ]),
      p(
        "Weights are on ",
        ["Hugging Face", "https://huggingface.co/Qwen/Qwen-Image-2.1"],
        " and ModelScope; source and docs on ",
        ["GitHub", "https://github.com/QwenLM/Qwen-Image-2.1"],
        ".",
      ),
      h2("The license catch"),
      quote(
        "Qwen-Image 2.1 ships under the Qwen Research License Agreement — free for research and evaluation, restricted for commercial use. If you plan to ship it in a product, read the terms carefully or use the official APIs instead.",
      ),
      h2("Qwen-Image 2.1 vs FLUX vs hosted models"),
      p(
        "Against FLUX.1: FLUX remains an excellent open-weights aesthetic baseline, but transparent generation and reference-based editing typically require extra tooling around it — Qwen-Image 2.1 does generation, editing and RGBA in one checkpoint, and its multi-reference editing (10 images) is genuinely uncommon in open source.",
      ),
      p(
        "Against closed hosted tools: Midjourney still leads on pure aesthetics and Ideogram on in-image text, but both are closed services. Qwen-Image 2.1 is the option you can run, fine-tune (LoRA) and automate locally. For more model options, browse our ",
        ["image generation category", `${SITE_URL}/category/image-generation`],
        " — and see the ",
        ["Qwen-Image 2.1 listing", `${SITE_URL}/item/qwen-image-2-1`],
        " for details.",
      ),
      h2("FAQ"),
      h3("Is Qwen-Image 2.1 free for commercial use?"),
      p(
        "No — the weights are under the Qwen Research License (research/evaluation friendly, commercial restrictions). For commercial generation use the official Pro/Turbo APIs.",
      ),
      h3("What hardware do I need?"),
      p(
        "It is a 7B visual-generation model designed for efficiency (bf16, prefix KV cache). Turbo's 8-step schedule cuts iteration time further. For concrete VRAM requirements, check the community guides on the GitHub repo for your setup.",
      ),
      h3("Can it really edit transparent images?"),
      p(
        "Yes — native RGBA support means you can generate transparent images from prompts and edit transparent layers directly, like changing a subject's expression while keeping the transparent background.",
      ),
      h3("Does it work in ComfyUI?"),
      p(
        "Yes, native day-0 support with compatible weights and example workflows for both text-to-image and image editing.",
      ),
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
    body: spec.body,
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

// ---------------------------------------------------------------------------
// main
// ---------------------------------------------------------------------------
async function main() {
  console.log(
    `[Sanity Target] Project: ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}, Dataset: ${process.env.NEXT_PUBLIC_SANITY_DATASET}`,
  );

  const blogCatId = await blogCategoryId("ai-news");

  await upsertItem(PHOTOCRAFT_ITEM);
  await upsertItem(VIDU_ITEM);
  await upsertItem(QWEN_ITEM);

  const photocraft = await upsertPost(photocraftPost(), blogCatId);
  const vidu = await upsertPost(viduPost(), blogCatId);
  const oss = await upsertPost(ossScannerPost(), blogCatId);
  const qwen = await upsertPost(qwenPost(), blogCatId);

  await linkRelated(photocraft, oss);
  await linkRelated(vidu, qwen);

  // post-write verification
  for (const slug of [PHOTOCRAFT_ITEM.slug, VIDU_ITEM.slug, QWEN_ITEM.slug]) {
    const item = await client.fetch(
      `*[_type == "item" && slug.current == $slug][0]{_id, name, "cats": categories[]->.slug.current, "tags": tags[]->.slug.current, publishDate}`,
      { slug },
    );
    console.log(`[verify item ${slug}]`, JSON.stringify(item));
  }
  for (const slug of [
    "photocraft-open-source-photoshop-alternative",
    "vidu-q4-preview",
    "anthropic-oss-scanner",
    "qwen-image-2-1",
  ]) {
    const post = await client.fetch(
      `*[_type == "blogPost" && slug.current == $slug][0]{_id, title, "author": author->.name, "cats": categories[]->.slug.current, "blocks": count(body), "related": relatedPosts[0]->.slug.current}`,
      { slug },
    );
    console.log(`[verify post ${slug}]`, JSON.stringify(post));
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
