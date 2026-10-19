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
    slug: "pdfcraft",
    imagePath: "tmp-shots/seo-images/pdfcraft-item.png",
    imageAlt:
      "PdfCraft official GitHub repository - free open-source Adobe Acrobat alternative by ArtCraft in pure Rust",
  },
  {
    slug: "solidcraft",
    imagePath: "tmp-shots/seo-images/solidcraft-item.png",
    imageAlt:
      "SolidCraft official GitHub repository - open-source parametric 3D CAD application in pure Rust with MCP server",
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
