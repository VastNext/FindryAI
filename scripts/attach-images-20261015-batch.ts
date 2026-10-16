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

interface ImageTask {
  slug: string;
  imagePath: string;
  imageAlt: string;
}

const TASKS: ImageTask[] = [
  {
    slug: "opencut",
    imagePath: "tmp-shots/seo-images/opencut-item.png",
    imageAlt:
      "OpenCut official GitHub repository - free open-source CapCut alternative for video editing",
  },
  {
    slug: "deepseek-harness",
    imagePath: "tmp-shots/seo-images/deepseek-harness-item.png",
    imageAlt:
      "DeepSeek Harness official GitHub repository - open-source AI agent runtime by DeepSeek AI",
  },
  {
    slug: "taste-skill",
    imagePath: "tmp-shots/seo-images/taste-skill-item.png",
    imageAlt:
      "Taste Skill official GitHub repository - anti-slop frontend design framework for Claude Code and AI agents",
  },
];

async function main() {
  for (const t of TASKS) {
    const doc = await client.fetch<{ _id: string } | undefined>(
      `*[_type == "item" && slug.current == $slug][0]{_id}`,
      { slug: t.slug },
    );
    if (!doc) {
      console.error(`[error] item not found: ${t.slug}`);
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
      `*[_type == "item" && slug.current == $slug][0]{"image": image.asset->url, "alt": image.alt}`,
      { slug: t.slug },
    );
    console.log(`[verify ${t.slug}]`, JSON.stringify(item));
  }
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
