import fs from "node:fs";
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

async function fix9RouterImage() {
  console.log(
    "=== 1. Replacing 9Router cover with product-page screenshot ===",
  );
  const doc = await client.fetch<{ _id: string } | undefined>(
    '*[_type == "item" && slug.current == "9router"][0]{_id}',
  );
  if (!doc) throw new Error("9router item not found");

  const imagePath = "tmp-shots/seo-images/9router-product.png";
  const buf = fs.readFileSync(imagePath);
  const asset = await client.assets.upload("image", buf, {
    filename: "9router-product.png",
  });

  await client
    .patch(doc._id)
    .set({
      image: {
        _type: "image",
        asset: { _type: "reference", _ref: asset._id },
        alt: "9Router official website - one smart AI router connecting Claude Code, Codex, Cursor and Cline to 60+ AI providers with zero downtime",
      },
    })
    .commit();
  console.log(`[ok] 9router product image attached (${buf.length} bytes)`);

  const verify = await client.fetch(
    '*[_type == "item" && slug.current == "9router"][0]{"img": image.asset->url, "alt": image.alt}',
  );
  console.log("[verify 9router]", JSON.stringify(verify));
}

async function addInternalLinksToOpencodeGo() {
  console.log("\n=== 2. Adding internal links to /item/opencode-go intro ===");
  const item = await client.fetch<
    { _id: string; introduction: string } | undefined
  >(
    '*[_type == "item" && slug.current == "opencode-go"][0]{_id, introduction}',
  );

  if (!item?.introduction) throw new Error("opencode-go item not found");
  if (item.introduction.includes("findryai.com/item/omniroute")) {
    console.log("[skip] internal links already present");
    return;
  }

  const addition = `

## How OpenCode Go Compares in the Local Agent Stack

OpenCode Go pairs naturally with the rest of the open-source coding-agent stack covered on FindryAI:

- **Routing instead of subscribing** — if you already hold API keys, [OmniRoute](https://findryai.com/item/omniroute) routes Claude Code, Codex and OpenCode across 290+ providers with automatic fallback at cost price, while 9Router-style gateways keep subscriptions from idle-limiting. Go's flat $10/$40 plans make sense when you want zero configuration; a gateway makes sense when you want provider freedom.
- **Pairing with Claude Code** — our [Claude Code mods guide](https://findryai.com/blog/claude-code-mods) covers profiles and plugins that work identically when pointed at OpenCode Go's OpenAI-compatible endpoint.
- **Browse more** — see the full [developer tools directory](https://findryai.com/category/developer-tools) for gateways, agent frameworks and open-source alternatives.`;

  const newIntro = item.introduction + addition;
  await client.patch(item._id).set({ introduction: newIntro }).commit();
  console.log("[ok] opencode-go intro extended with internal links");
}

async function main() {
  await fix9RouterImage();
  await addInternalLinksToOpencodeGo();
}
main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
