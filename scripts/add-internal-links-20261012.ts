import { createClient } from "@sanity/client";
import dotenv from "dotenv";

dotenv.config();

// Strengthen in-body internal linking across the keyword-batch content.
// 2026-10-12: posts get a "Related reading" closer paragraph (inline in the
// article flow, not the bottom widget); item introductions get a coverage
// links section (markdown). All operations are idempotent via markers.

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

function p(...parts: Part[]): Record<string, unknown> {
  const markDefs: MarkDef[] = [];
  const children = parts.map((part) => {
    if (typeof part === "string") {
      return { _type: "span", _key: nextKey(), text: part, marks: [] };
    }
    const def: MarkDef = { _type: "link", _key: nextKey(), href: part[1] };
    markDefs.push(def);
    return { _type: "span", _key: nextKey(), text: part[0], marks: [def._key] };
  });
  return {
    _type: "block",
    _key: nextKey(),
    style: "normal",
    markDefs,
    children,
  };
}

async function fetchPost(
  slug: string,
): Promise<{ _id: string; body: unknown[] } | undefined> {
  return client.fetch(
    `*[_type == "blogPost" && slug.current == $slug][0]{_id, body}`,
    { slug },
  );
}

async function fetchItem(
  slug: string,
): Promise<{ _id: string; introduction: string } | undefined> {
  return client.fetch(
    `*[_type == "item" && slug.current == $slug][0]{_id, introduction}`,
    { slug },
  );
}

const MARKER_POST = "Related reading:";
const MARKER_ITEM = "## Findry coverage";

// --- post closers -------------------------------------------------------------
const POST_CLOSERS: Record<string, () => Record<string, unknown>> = {
  "photocraft-open-source-photoshop-alternative": () =>
    p(
      `${MARKER_POST} the open-source theme continues with `,
      ["Anthropic OSS Scanner", `${SITE_URL}/blog/anthropic-oss-scanner`],
      " — free Claude-powered vulnerability scans for open-source projects — and the full ",
      [
        "ArtCraft suite tour",
        `${SITE_URL}/blog/artcraft-open-source-adobe-alternatives`,
      ],
      ", where PhotoCraft is one of seven free Rust apps.",
    ),
  "vidu-q4-preview": () =>
    p(
      `${MARKER_POST} launching the same season, `,
      ["Qwen-Image 2.1", `${SITE_URL}/blog/qwen-image-2-1`],
      " is Alibaba's open-source answer for image generation and editing — see how the open-weights side of the AI stack is evolving.",
    ),
  "anthropic-oss-scanner": () =>
    p(
      `${MARKER_POST} open source is having a big month: `,
      [
        "PhotoCraft, the open-source Photoshop alternative in Rust",
        `${SITE_URL}/blog/photocraft-open-source-photoshop-alternative`,
      ],
      " (",
      ["directory listing", `${SITE_URL}/item/photocraft`],
      ") is part of the same ecosystem momentum OSS Scanner protects.",
    ),
  "qwen-image-2-1": () =>
    p(
      `${MARKER_POST} for the video side of this launch cycle, see our `,
      ["Vidu Q4 Preview breakdown", `${SITE_URL}/blog/vidu-q4-preview`],
      " — pricing details, native audio, and how it stacks up against Seedance and Kling.",
    ),
};

// --- item coverage sections (markdown appended to introduction) ---------------
const ITEM_SECTIONS: Record<string, string> = {
  photocraft: `${MARKER_ITEM}

- [PhotoCraft review: the open-source Photoshop alternative](${SITE_URL}/blog/photocraft-open-source-photoshop-alternative) — full comparison vs Photoshop, GIMP and Photopea
- [ArtCraft suite: 7 free open-source Adobe alternatives](${SITE_URL}/blog/artcraft-open-source-adobe-alternatives) — where PhotoCraft fits in the family`,
  "vidu-q4-preview": `${MARKER_ITEM}

- [Vidu Q4 Preview: pricing, features, and comparisons](${SITE_URL}/blog/vidu-q4-preview) — the two official launch prices explained, plus Seedance/Kling context`,
  "qwen-image-2-1": `${MARKER_ITEM}

- [Qwen-Image 2.1 guide](${SITE_URL}/blog/qwen-image-2-1) — Turbo 8-step update, local setup, license notes, and the FLUX comparison`,
  vectorcraft: `${MARKER_ITEM}

- [ArtCraft suite: 7 free open-source Adobe alternatives](${SITE_URL}/blog/artcraft-open-source-adobe-alternatives) — VectorCraft in the context of PhotoCraft, FilmCraft and the rest of the family`,
  "seedance-2-5": `${MARKER_ITEM}

- [Vidu Q4 Preview breakdown](${SITE_URL}/blog/vidu-q4-preview) — how the newest competitor prices and positions against Seedance 2.5`,
};

// --- relatedPosts fix: photocraft should point at both paired posts -----------
async function fixPhotocraftRelated() {
  const photocraft = await fetchPost(
    "photocraft-open-source-photoshop-alternative",
  );
  const oss = await fetchPost("anthropic-oss-scanner");
  const artcraft = await fetchPost("artcraft-open-source-adobe-alternatives");
  if (!photocraft || !oss || !artcraft) return;
  await client
    .patch(photocraft._id)
    .set({
      relatedPosts: [
        { _type: "reference", _ref: oss._id, _key: "r0" },
        { _type: "reference", _ref: artcraft._id, _key: "r1" },
      ],
    })
    .commit();
  console.log("[related] photocraft -> [oss-scanner, artcraft]");
}

async function main() {
  for (const [slug, makeCloser] of Object.entries(POST_CLOSERS)) {
    const post = await fetchPost(slug);
    if (!post) {
      console.error(`skip post ${slug}: not found`);
      continue;
    }
    const body = Array.isArray(post.body) ? post.body : [];
    const hasMarker = body.some(
      (b: any) =>
        typeof b?.children?.[0]?.text === "string" &&
        (b.children[0].text as string).includes(MARKER_POST),
    );
    if (hasMarker) {
      console.log(`[skip] post ${slug}: closer already present`);
      continue;
    }
    await client
      .patch(post._id)
      .set({ body: [...body, makeCloser()] })
      .commit();
    console.log(
      `[ok] post ${slug}: closer appended (body ${body.length} -> ${body.length + 1} blocks)`,
    );
  }

  for (const [slug, section] of Object.entries(ITEM_SECTIONS)) {
    const item = await fetchItem(slug);
    if (!item) {
      console.error(`skip item ${slug}: not found`);
      continue;
    }
    if (item.introduction?.includes(MARKER_ITEM)) {
      console.log(`[skip] item ${slug}: coverage section already present`);
      continue;
    }
    const intro = (item.introduction || "").trimEnd();
    await client
      .patch(item._id)
      .set({ introduction: `${intro}\n\n${section}` })
      .commit();
    console.log(`[ok] item ${slug}: coverage section appended`);
  }

  await fixPhotocraftRelated();

  // verification
  for (const slug of Object.keys(POST_CLOSERS)) {
    const post = await client.fetch(
      `*[_type == "blogPost" && slug.current == $slug][0]{"lastBlock": body[-1].children[0].text, "blocks": count(body), "related": relatedPosts[0...2]->slug.current}`,
      { slug },
    );
    console.log(`[verify post ${slug}]`, JSON.stringify(post));
  }
  for (const slug of Object.keys(ITEM_SECTIONS)) {
    const item = await client.fetch(
      `*[_type == "item" && slug.current == $slug][0]{"hasSection": string(introduction) match "*${MARKER_ITEM}*"}`,
      { slug },
    );
    console.log(`[verify item ${slug}]`, JSON.stringify(item));
  }
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
