// Attach cover images for the 20261012 keyword batch.
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
    docSlug: "filmcraft",
    docType: "item",
    imagePath: "tmp-shots/seo-images/filmcraft-item.png",
    imageAlt:
      "FilmCraft official page - professional video editing rebuilt from scratch in Rust",
  },
  {
    docSlug: "lightcraft",
    docType: "item",
    imagePath: "tmp-shots/seo-images/lightcraft-item.png",
    imageAlt:
      "LightCraft official page - open-source photo library and raw developer",
  },
  {
    docSlug: "nano-banana-2-1",
    docType: "item",
    imagePath: "tmp-shots/seo-images/nanobanana-item.png",
    imageAlt: "Nano Banana image generation documentation in the Gemini API",
  },
  {
    docSlug: "nano-banana-2-1",
    docType: "blogPost",
    imagePath: "tmp-shots/seo-images/nanobanana-blog.png",
    imageAlt:
      "Nano Banana 2 on Google DeepMind - pro-level image generation and editing",
  },
  {
    docSlug: "melty-ai",
    docType: "item",
    imagePath: "tmp-shots/seo-images/melty-item.png",
    imageAlt:
      "Melty GitHub repository - the chat-first AI code editor where every message is a git commit",
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
    console.log(
      `[ok] ${spec.docType} ${spec.docSlug} <- ${spec.imagePath} (${buf.length} bytes)`,
    );
  }

  for (const spec of SPECS) {
    const doc = await client.fetch(
      `*[_type == $type && slug.current == $slug][0]{"image": image.asset->.url, "alt": image.alt}`,
      { type: spec.docType, slug: spec.docSlug },
    );
    console.log(
      `[verify ${spec.docSlug}${spec.docType === "blogPost" ? " (post)" : ""}]`,
      JSON.stringify(doc),
    );
  }
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
