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

async function main() {
  const doc = await client.fetch<{ _id: string } | undefined>(
    `*[_type == "item" && slug.current == "cadcraft"][0]{_id}`,
  );
  if (!doc) throw new Error("cadcraft item not found");

  const imagePath = "tmp-shots/seo-images/cadcraft-item.png";
  const imageAlt =
    "CADCraft official page - open-source 2D CAD drafting software in pure Rust with DWG and DXF support";

  const buf = fs.readFileSync(imagePath);
  const asset = await client.assets.upload("image", buf, {
    filename: "cadcraft-item.png",
  });

  await client
    .patch(doc._id)
    .set({
      image: {
        _type: "image",
        asset: { _type: "reference", _ref: asset._id },
        alt: imageAlt,
      },
    })
    .commit();
  console.log(
    `[ok] cadcraft image uploaded and attached (${buf.length} bytes)`,
  );

  const item = await client.fetch(
    `*[_type == "item" && slug.current == "cadcraft"][0]{"image": image.asset->.url, "alt": image.alt}`,
  );
  console.log("[verify cadcraft image]", JSON.stringify(item));
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
