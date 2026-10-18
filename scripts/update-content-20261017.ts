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

async function updateArtCraftBlog() {
  console.log(
    "=== 1. Updating /blog/artcraft-open-source-adobe-alternatives ===",
  );
  const blog = await client.fetch<{ _id: string; body: Block[] } | undefined>(
    `*[_type == "blogPost" && slug.current == "artcraft-open-source-adobe-alternatives"][0]{_id, body}`,
  );

  if (!blog?.body) {
    console.log("[error] artcraft blog not found");
    return;
  }

  const bodyStr = JSON.stringify(blog.body);
  const hasStorytold = bodyStr.includes("storytold");
  const hasAdobeClones = bodyStr.includes("adobe clones");

  if (hasStorytold && hasAdobeClones) {
    console.log("[skip] blog already covers storytold + adobe clones");
    return;
  }

  const additionalBlocks: Block[] = [];

  if (!hasStorytold) {
    additionalBlocks.push(
      h2(
        "Storytold: The GitHub Organization Behind ArtCraft (Storytold GitHub)",
      ),
      p(
        "If you search ",
        ["storytold github", "https://github.com/storytold"],
        " or ",
        ["github storytold", "https://github.com/storytold"],
        ", you are looking for the open-source GitHub organization that publishes every Crafting App: ",
        ["storytold/photocraft", "https://github.com/storytold/photocraft"],
        " (Photoshop alternative), ",
        ["storytold/figcraft", "https://github.com/storytold/figcraft"],
        " (Figma alternative), plus the official repositories for VectorCraft, FilmCraft, LightCraft, PdfCraft, EffectCraft, DesignCraft, CADCraft, WordCraft, and GridCraft.",
      ),
      p(
        "Each repository is dual-licensed under MIT or Apache-2.0, builds natively on macOS, Windows, Linux, FreeBSD, and the browser via WebAssembly, and ships a command-line interface plus an MCP server so AI agents can drive the full editor programmatically.",
      ),
    );
  }

  if (!hasAdobeClones) {
    additionalBlocks.push(
      h2("Are These Adobe Clones Legal, Safe and Free? (Adobe Clones FAQ)"),
      p(
        `The ArtCraft suite is frequently described as "Adobe clones" — it is the most prominent open-source adobe clone project of 2026. Three clarifications matter:`,
      ),
      li(
        "**Clean-room, not piracy** — every app is built from public specifications and observed behaviour with original assets. No Adobe source code, icons, or brand marks are included, and each repository states it is not affiliated with Adobe Inc.",
        ` (${SITE_URL}/item/photocraft)`,
      ),
      li(
        "**Legal open-source licenses** — the code is MIT or Apache-2.0; using the apps is fully legal, including commercial work.",
      ),
      li(
        "**Free with no strings** — no subscriptions, no accounts, no telemetry. The only trade-off today is alpha maturity: parity checklists in each repo honestly track what still differs from Adobe's finished products.",
      ),
    );
  }

  const newBody = [...blog.body, ...additionalBlocks];
  await client.patch(blog._id).set({ body: newBody }).commit();
  console.log(`[ok] blog updated with ${additionalBlocks.length} new blocks`);
}

async function updateGlmFlashItem() {
  console.log(
    "\n=== 2. Updating /item/glm-5-3-flash with glm flash variants ===",
  );
  const item = await client.fetch<
    { _id: string; introduction: string } | undefined
  >(
    `*[_type == "item" && slug.current == "glm-5-3-flash"][0]{_id, introduction}`,
  );

  if (!item?.introduction) {
    console.log("[error] glm-5-3-flash item not found");
    return;
  }

  const hasGlmFlash =
    item.introduction.includes('"glm flash"') ||
    item.introduction.includes("GLM Flash");

  if (hasGlmFlash) {
    console.log("[skip] item already covers glm flash variants");
    return;
  }

  const addition = `

## GLM Flash: Quick Answers About "GLM Flash" & "GLM Flash 5.3"

Many developers search for **GLM Flash** or **GLM Flash 5.3** — both are common short names for **GLM-5.3-Flash**, Z.ai's 320B-parameter native multimodal model tuned for ultra-low-cost inference (about $0.04 per 1M input tokens on open routers). Whether you call it glm flash, glm flash 5.3, or glm-5.3-flash, the model is the same: it runs locally through Ollama and LM Studio, routes through OpenRouter-compatible endpoints, and is a drop-in replacement in Claude Code, Codex, and Cursor via gateways like [OmniRoute](https://findryai.com/item/omniroute). For full benchmarks, pricing tables, and deployment commands, see the complete GLM-5.3-Flash guide above.`;

  const newIntro = item.introduction + addition;
  await client.patch(item._id).set({ introduction: newIntro }).commit();
  console.log("[ok] glm-5-3-flash introduction updated");
}

async function main() {
  await updateArtCraftBlog();
  await updateGlmFlashItem();
  console.log("\nDone.");
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
