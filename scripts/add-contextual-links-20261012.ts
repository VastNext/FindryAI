import { createClient } from "@sanity/client";
import dotenv from "dotenv";

dotenv.config();

// Add TOP-AREA contextual internal links (user feedback 2026-10-12: the
// appended end-of-page sections were not visible enough). Markdown intros get
// an early in-paragraph sentence; the ArtCraft post gets a context paragraph
// right after the intro. Idempotent via unique sentence markers.

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

// --- markdown intro patches: [needle, replacement] -----------------------------
const INTRO_PATCHES: Record<string, [string, string][]> = {
  photocraft: [
    [
      "the code is MIT/Apache-2.0 licensed and works fully offline.",
      "the code is MIT/Apache-2.0 licensed and works fully offline. We also published a [full PhotoCraft review](https://findryai.com/blog/photocraft-open-source-photoshop-alternative) comparing it with Photoshop, GIMP and Photopea.",
    ],
  ],
  vectorcraft: [
    [
      "It rebuilds the Illustrator-style workflow (pen tool, direct selection, shape booleans, snapping guides, appearance panel) in a native desktop app, and it also runs in the browser via WebAssembly. Free, open source, no subscription.",
      "It rebuilds the Illustrator-style workflow (pen tool, direct selection, shape booleans, snapping guides, appearance panel) in a native desktop app, and it also runs in the browser via WebAssembly. Free, open source, no subscription. For the bigger picture, see our [ArtCraft suite overview](https://findryai.com/blog/artcraft-open-source-adobe-alternatives).",
    ],
  ],
};

// --- artcraft post: context paragraph inserted right after the intro block -----
const ARTCRAFT_MARKER = "busy October for AI launches";

function contextBlock(): Record<string, unknown> {
  const l0 = nextKey();
  const l1 = nextKey();
  return {
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
}

async function main() {
  // markdown intros
  for (const [slug, patches] of Object.entries(INTRO_PATCHES)) {
    const item = await client.fetch<
      { _id: string; introduction: string } | undefined
    >(`*[_type == "item" && slug.current == $slug][0]{_id, introduction}`, {
      slug,
    });
    if (!item) {
      console.error(`skip item ${slug}: not found`);
      continue;
    }
    let intro = item.introduction || "";
    let changed = false;
    for (const [needle, replacement] of patches) {
      if (intro.includes(replacement)) {
        console.log(`[skip] item ${slug}: patch already applied`);
        continue;
      }
      if (!intro.includes(needle)) {
        console.log(
          `[warn] item ${slug}: needle not found, skipping this patch`,
        );
        continue;
      }
      intro = intro.replace(needle, replacement);
      changed = true;
    }
    if (changed) {
      await client.patch(item._id).set({ introduction: intro }).commit();
      console.log(`[ok] item ${slug}: early contextual link added`);
    }
  }

  // artcraft post body insertion
  const slug = "artcraft-open-source-adobe-alternatives";
  const post = await client.fetch<{ _id: string; body: unknown[] } | undefined>(
    `*[_type == "blogPost" && slug.current == $slug][0]{_id, body}`,
    { slug },
  );
  if (!post) {
    console.error(`skip post ${slug}: not found`);
    return;
  }
  const body = Array.isArray(post.body) ? post.body : [];
  const hasContext = body.some((b) => {
    const block = b as { children?: Array<{ text?: unknown }> };
    return (block.children || []).some(
      (c) => typeof c?.text === "string" && c.text.includes(ARTCRAFT_MARKER),
    );
  });
  if (hasContext) {
    console.log(`[skip] post ${slug}: context paragraph already present`);
    return;
  }
  await client
    .patch(post._id)
    .set({ body: [body[0], contextBlock(), ...body.slice(1)] })
    .commit();
  console.log(
    `[ok] post ${slug}: context paragraph inserted at position 2 (body ${body.length} -> ${body.length + 1})`,
  );
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
