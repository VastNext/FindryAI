// Attach cover images for the 20261010 keyword batch.
// Mirrors scripts/attach-images-seo-landing.ts: upload tmp-shots/seo-images/*.png
// as Sanity assets, patch item.image / blogPost.image, then verify.
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
    docSlug: "photocraft",
    docType: "item",
    imagePath: "tmp-shots/seo-images/photocraft-item.png",
    imageAlt:
      "PhotoCraft official website - the open-source Photoshop alternative built in Rust",
  },
  {
    docSlug: "photocraft-open-source-photoshop-alternative",
    docType: "blogPost",
    imagePath: "tmp-shots/seo-images/photocraft-blog.png",
    imageAlt:
      "PhotoCraft GitHub repository - clean-room Photoshop reimplementation in Rust",
  },
  {
    docSlug: "vidu-q4-preview",
    docType: "item",
    imagePath: "tmp-shots/seo-images/vidu-item.png",
    imageAlt:
      "Vidu Q4 Preview official page - next-gen flagship for expressive audio and video",
  },
  {
    docSlug: "vidu-q4-preview",
    docType: "blogPost",
    imagePath: "tmp-shots/seo-images/vidu-blog.png",
    imageAlt: "Vidu official homepage featuring Vidu Q4 Preview",
  },
  {
    docSlug: "qwen-image-2-1",
    docType: "item",
    imagePath: "tmp-shots/seo-images/qwen-item.png",
    imageAlt: "Qwen-Image 2.1 GitHub repository by the Qwen team",
  },
  {
    docSlug: "qwen-image-2-1",
    docType: "blogPost",
    imagePath: "tmp-shots/seo-images/qwen-blog.png",
    imageAlt: "Qwen-Image 2.1 model page on Hugging Face",
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

  // verify
  for (const spec of SPECS) {
    const doc = await client.fetch(
      `*[_type == $type && slug.current == $slug][0]{"image": image.asset->_url, "imageAlt": image.alt}`,
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
