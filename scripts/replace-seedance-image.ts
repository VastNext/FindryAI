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

const IMAGE_PATH = "tmp-shots/seo-images/seedance-user-hero.jpg";
const ALT =
  "Seedance 2.5 official hero by ByteDance Seed — audio-video joint generation for 30-second storytelling";

async function main() {
  const item = await client.fetch<{ _id: string } | undefined>(
    `*[_type == "item" && slug.current == "seedance-2-5"][0]{_id}`,
  );
  if (!item) {
    console.error("item seedance-2-5 not found");
    process.exit(1);
  }

  const buf = fs.readFileSync(IMAGE_PATH);
  const asset = await client.assets.upload("image", buf, {
    filename: "seedance-2-5_hero.jpg",
  });

  await client
    .patch(item._id)
    .set({
      image: {
        _type: "image",
        asset: { _type: "reference", _ref: asset._id },
        alt: ALT,
      },
    })
    .commit();

  const verify = await client.fetch(
    `*[_type == "item" && slug.current == "seedance-2-5"][0]{"url": image.asset->url, alt: image.alt}`,
  );
  console.log("[patched] seedance-2-5 image:", JSON.stringify(verify));
}

main().catch((e) => {
  console.error("Fatal:", e);
  process.exit(1);
});
