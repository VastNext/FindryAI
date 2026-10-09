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
  iconPath?: string;
  imagePath?: string;
  imageAlt: string;
  iconAlt?: string;
}

// Source images pre-downloaded to tmp-shots/seo-images/ via proxy
// (direct connections to thum.io/googleusercontent time out locally).
const SPECS: ImageSpec[] = [
  {
    docSlug: "seedance-2-5",
    docType: "item",
    iconPath: "tmp-shots/seo-images/seedance-icon.png",
    imagePath: "tmp-shots/seo-images/seedance-image.png",
    imageAlt: "Seedance 2.5 official model page by ByteDance Seed",
    iconAlt: "Seedance 2.5 logo",
  },
  {
    docSlug: "claude-haiku-5-5",
    docType: "blogPost",
    imagePath: "tmp-shots/seo-images/haiku-image.png",
    imageAlt: "Anthropic Claude product page",
  },
  {
    docSlug: "claude-fable-5-5",
    docType: "blogPost",
    imagePath: "tmp-shots/seo-images/fable-image.png",
    imageAlt: "Anthropic homepage",
  },
];

async function uploadImage(buffer: Buffer, filename: string): Promise<string> {
  const asset = await client.assets.upload("image", buffer, { filename });
  return asset._id;
}

async function main() {
  for (const spec of SPECS) {
    const doc = await client.fetch<{ _id: string; name: string } | undefined>(
      "*[_type == $type && slug.current == $slug][0]{_id, name}",
      { type: spec.docType, slug: spec.docSlug },
    );
    if (!doc) {
      console.error(`skip: ${spec.docType} ${spec.docSlug} not found`);
      continue;
    }

    const patches: Record<string, unknown> = {};

    if (spec.imagePath) {
      const buf = fs.readFileSync(spec.imagePath);
      const assetId = await uploadImage(buf, `${spec.docSlug}_image.png`);
      patches.image = {
        _type: "image",
        asset: { _type: "reference", _ref: assetId },
        alt: spec.imageAlt,
      };
      console.log(`[ok] ${spec.docSlug} image uploaded (${buf.length} bytes)`);
    }

    if (spec.iconPath) {
      const buf = fs.readFileSync(spec.iconPath);
      const assetId = await uploadImage(buf, `${spec.docSlug}_icon.png`);
      patches.icon = {
        _type: "image",
        asset: { _type: "reference", _ref: assetId },
        alt: spec.iconAlt || `Icon for ${spec.docSlug}`,
      };
      console.log(`[ok] ${spec.docSlug} icon uploaded (${buf.length} bytes)`);
    }

    await client.patch(doc._id).set(patches).commit();
    console.log(`[patched] ${spec.docType} ${spec.docSlug} (${doc._id})`);
  }

  // verify
  const item = await client.fetch(
    `*[_type == "item" && slug.current == "seedance-2-5"][0]{"icon": icon.asset->_url, "image": image.asset->_url, "imageAlt": image.alt}`,
  );
  console.log("[verify item]", JSON.stringify(item));
  for (const slug of ["claude-haiku-5-5", "claude-fable-5-5"]) {
    const post = await client.fetch(
      `*[_type == "blogPost" && slug.current == $slug][0]{"image": image.asset->_url, "imageAlt": image.alt}`,
      { slug },
    );
    console.log(`[verify ${slug}]`, JSON.stringify(post));
  }
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
