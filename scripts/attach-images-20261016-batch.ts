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
    slug: "figcraft",
    imagePath: "tmp-shots/seo-images/figcraft-item.png",
    imageAlt:
      "FigCraft official GitHub repository - open-source clean-room Figma alternative in pure Rust",
  },
  {
    slug: "omniroute",
    imagePath: "tmp-shots/seo-images/omniroute-item.png",
    imageAlt:
      "OmniRoute official GitHub repository - open-source AI routing gateway for Claude Code and coding agents",
  },
  {
    slug: "pavo-ai",
    imagePath: "tmp-shots/seo-images/pavo-ai-item.png",
    imageAlt:
      "Pavo AI official web platform - free automated AI video generator and short drama creation by Agnes AI",
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
