import { createClient } from "@sanity/client";
import dotenv from "dotenv";
dotenv.config();

const dirtySlugs = [
  "three-sigma",
  "aire",
  "mailr",
  "poe",
  "fastcut",
  "chorus",
  "flowpoint",
  "elephas",
  "delibr-ai",
];

async function main() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "8pdw6hih";
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const token = process.env.SANITY_API_TOKEN;

  if (!token) {
    console.error(
      "❌ SANITY_API_TOKEN is not set in environment or .env file.",
    );
    console.log(
      "To unpublish these 9 items, run with SANITY_API_TOKEN=<your_token> npx tsx scripts/unpublish-dirty-data-tools.ts",
    );
    process.exit(1);
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion: "2024-08-01",
    useCdn: false,
    token,
  });

  console.log(
    `🔍 Finding ${dirtySlugs.length} dirty data items to unpublish...`,
  );

  let failed = 0;

  for (const slug of dirtySlugs) {
    try {
      const item = await client.fetch(
        `*[_type == "item" && slug.current == $slug][0]{ _id, name }`,
        { slug },
      );

      if (!item) {
        console.log(`⚠️ Item with slug "${slug}" not found in dataset.`);
        failed++;
        continue;
      }

      await client
        .patch(item._id)
        .set({ forceHidden: true, publishDate: null })
        .commit();

      console.log(`✅ Successfully unpublished: ${item.name} (${slug})`);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : String(error);
      console.error(`❌ Failed to unpublish ${slug}:`, msg);
      failed++;
    }
  }

  if (failed > 0) {
    console.error(`⚠️ Finished with ${failed} failure(s).`);
    process.exitCode = 1;
    return;
  }

  console.log("🎉 Done unpublishing dirty data tools.");
}

main().catch((error: unknown) => {
  const msg = error instanceof Error ? error.message : String(error);
  console.error("❌ Unpublish failed:", msg);
  process.exitCode = 1;
});
