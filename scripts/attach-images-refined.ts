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

interface ImageSpec {
  docSlug: string;
  docType: "item" | "blogPost";
  imagePath: string;
  imageAlt: string;
}

const SPECS: ImageSpec[] = [
  {
    docSlug: "effectcraft",
    docType: "item",
    imagePath: "tmp-shots/seo-images/effectcraft-item.png",
    imageAlt: "EffectCraft official page - open-source motion graphics and VFX compositor in pure Rust",
  },
  {
    docSlug: "glm-5-3-flash",
    docType: "item",
    imagePath: "tmp-shots/seo-images/glm-flash-item.png",
    imageAlt: "GLM-5.3-Flash model repository by Zhipu AI on Hugging Face",
  },
  {
    docSlug: "claude-code-mods",
    docType: "blogPost",
    imagePath: "tmp-shots/seo-images/claude-mods-blog.png",
    imageAlt: "Anthropic Claude Code documentation for building TypeScript mods",
  },
];

async function main() {
  for (const spec of SPECS) {
    const doc = await client.fetch<{ _id: string } | undefined>(
      "*[_type == $type && slug.current == $slug][0]{_id}",
      { type: spec.docType, slug: spec.docSlug },
    );
    if (!doc) {
      console.error(`skip: ${spec.docType} ${spec.docSlug} not found`);
      continue;
    }
    const buf = fs.readFileSync(spec.imagePath);
    const asset = await client.assets.upload("image", buf, {
      filename: `${spec.docSlug}${spec.docType === "blogPost" ? "-blog" : ""}.png`,
    });
    await client
      .patch(doc._id)
      .set({
        image: {
          _type: "image",
          asset: { _type: "reference", _ref: asset._id },
          alt: spec.imageAlt,
        },
      })
      .commit();
    console.log(`[ok] ${spec.docType} ${spec.docSlug} <- ${spec.imagePath} (${buf.length} bytes)`);
  }

  for (const spec of SPECS) {
    const doc = await client.fetch(
      `*[_type == $type && slug.current == $slug][0]{"image": image.asset->.url, "alt": image.alt}`,
      { type: spec.docType, slug: spec.docSlug },
    );
    console.log(`[verify ${spec.docSlug}]`, JSON.stringify(doc));
  }
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
