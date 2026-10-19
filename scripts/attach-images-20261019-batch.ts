import fs from "node:fs";
import { createClient } from "@sanity/client";
import dotenv from "dotenv";

dotenv.config();

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "",
  apiVersion: "2024-08-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN || "",
});

interface ItemImageTask {
  type: "item";
  slug: string;
  imagePath: string;
  imageAlt: string;
}

interface BlogImageTask {
  type: "blogPost";
  slug: string;
  imagePath: string;
  imageAlt: string;
}

type Task = ItemImageTask | BlogImageTask;

const TASKS: Task[] = [
  {
    type: "item",
    slug: "minimax-h3",
    imagePath: "tmp-shots/seo-images/minimax-h3-item.png",
    imageAlt:
      "MiniMax H3 official Hugging Face model card - open-weight multimodal video generation with native stereo audio",
  },
  {
    type: "blogPost",
    slug: "gemini-4-argon-vs-claude-opus-5-5",
    imagePath: "tmp-shots/seo-images/argon-opus-blog.png",
    imageAlt:
      "Google official blog announcing Gemini 4 Argon global availability - benchmark comparison against Claude Opus 5.5",
  },
];

async function main() {
  for (const t of TASKS) {
    const doc = await client.fetch<{ _id: string } | undefined>(
      "*[_type == $type && slug.current == $slug][0]{_id}",
      { type: t.type, slug: t.slug },
    );
    if (!doc) {
      console.error(`[error] doc not found: ${t.type}/${t.slug}`);
      continue;
    }

    if (!fs.existsSync(t.imagePath)) {
      console.error(`[error] file not found: ${t.imagePath}`);
      continue;
    }

    const buf = fs.readFileSync(t.imagePath);
    const asset = await client.assets.upload("image", buf, {
      filename: `${t.slug}.png`,
    });

    await client
      .patch(doc._id)
      .set({
        image: {
          _type: "image",
          asset: { _type: "reference", _ref: asset._id },
          alt: t.imageAlt,
        },
      })
      .commit();

    console.log(
      `[ok] ${t.slug} image uploaded & attached (${buf.length} bytes)`,
    );

    const item = await client.fetch(
      '*[_type == $type && slug.current == $slug][0]{"image": image.asset->url, "alt": image.alt}',
      { type: t.type, slug: t.slug },
    );
    console.log(`[verify ${t.slug}]`, JSON.stringify(item));
  }
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
