import fs from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";
import dotenv from "dotenv";

dotenv.config();

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "";
const token = process.env.SANITY_API_TOKEN || "";

if (!projectId || !dataset || !token) {
  console.error("Missing Sanity credentials");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-08-01",
  useCdn: false,
  perspective: "published",
  token,
});

const PATCH_MAP: Record<string, string> = {
  makelog: "https://makelog.io",
  "morise-ai": "https://morise.ai",
  "summarize-tech": "https://summarize.tech",
  turbosite: "https://turbosite.ai",
};

async function main() {
  console.log("Fixing remaining 4 polluted external links...");
  for (const [slug, cleanUrl] of Object.entries(PATCH_MAP)) {
    const item = await client.fetch<{
      _id: string;
      name: string;
      link?: string;
    }>(`*[_type == "item" && slug.current == $slug][0]`, { slug });
    if (!item) {
      console.warn(`Item with slug ${slug} not found.`);
      continue;
    }

    console.log(`Patching [${item.name}] from "${item.link}" to "${cleanUrl}"`);
    await client.patch(item._id).set({ link: cleanUrl }).commit();

    // Verify
    const updated = await client.fetch<{ link?: string }>(
      `*[_type == "item" && _id == $id][0]{ link }`,
      { id: item._id },
    );
    if (updated?.link !== cleanUrl) {
      console.error(
        `Verification failed for ${slug}: expected ${cleanUrl}, got ${updated?.link}`,
      );
      process.exit(1);
    }
    console.log(`[Verified] ${slug} -> ${updated.link}`);
  }
  console.log("Done patching polluted links.");
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
