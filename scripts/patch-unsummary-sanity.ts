import fs from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";
import dotenv from "dotenv";

dotenv.config();

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "";
const token = process.env.SANITY_API_TOKEN || "";

if (!projectId || !dataset) {
  console.error(
    "Error: NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET is missing.",
  );
  process.exit(1);
}

if (!token) {
  console.error(
    "Error: SANITY_API_TOKEN is not configured in .env. Cannot modify production dataset.",
  );
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

const BACKUP_FILE = path.join(
  process.cwd(),
  "tmp-shots",
  "unsummary-backup.json",
);

interface ItemRecord {
  _id: string;
  name: string;
  slug?: { current?: string };
  link?: string;
  description?: string;
  introduction?: string;
}

const TARGET_NEW_DATA = {
  link: "https://unsummary.com",
  description:
    "Unsummary uses AI to condense books, movies, podcasts, and long articles into structured, high-signal summaries and key takeaways.",
  introduction: `## What is Unsummary?

Unsummary is an AI-powered content summarizer designed to help readers, researchers, and learners digest long-form media in minutes. Whether you are tackling an extensive book, reviewing an in-depth documentary, listening to a multi-hour podcast, or analyzing long articles, Unsummary distills the core arguments, narrative beats, and key takeaways without losing critical nuance.

### Key Features
- **Extensive Media Database**: Access instant summaries across millions of cataloged books and hundreds of thousands of films and podcasts.
- **Structured Chapter Breakdowns**: Read chapter-by-chapter highlights and synthesized arguments rather than blunt text truncation.
- **Key Takeaways & Quotes**: Extract memorable quotations and actionable insights quickly.
- **Audio & Video Summaries**: Convert audiovisual media into clear, digestible reading formats.

### Pricing & Credits
Unsummary offers free starter credits for new users to test summaries on books and movies, with flexible credit packages and subscriptions available for frequent readers.

### Official Website
Visit the official service directly at [unsummary.com](https://unsummary.com).`,
};

async function main() {
  const isRollback = process.argv.includes("--rollback");

  console.log(`[Sanity Target] Project: ${projectId}, Dataset: ${dataset}`);

  if (isRollback) {
    if (!fs.existsSync(BACKUP_FILE)) {
      console.error(`Rollback failed: Backup file not found at ${BACKUP_FILE}`);
      process.exit(1);
    }
    const backupData: ItemRecord[] = JSON.parse(
      fs.readFileSync(BACKUP_FILE, "utf-8"),
    );
    console.log(
      `[Rollback] Restoring ${backupData.length} item(s) from backup...`,
    );
    for (const item of backupData) {
      await client
        .patch(item._id)
        .set({
          link: item.link,
          description: item.description,
          introduction: item.introduction,
        })
        .commit();
      console.log(
        `Restored item ${item._id} (${item.name}) to original values.`,
      );
    }
    console.log("[Rollback Complete]");
    return;
  }

  console.log("Searching for unsummary item in Sanity...");
  const items = await client.fetch<ItemRecord[]>(
    `*[_type == "item" && (slug.current == "unsummary" || name match "unsummary")]{
      _id,
      name,
      slug,
      link,
      description,
      introduction
    }`,
  );

  if (!items || items.length === 0) {
    console.error("Critical: No unsummary item found in Sanity CMS.");
    process.exit(1);
  }

  if (items.length > 1) {
    console.warn(
      `Warning: Found ${items.length} matching unsummary items. Proceeding with caution.`,
    );
  }

  // 1. Save backup before making any mutation
  fs.mkdirSync(path.dirname(BACKUP_FILE), { recursive: true });
  fs.writeFileSync(BACKUP_FILE, JSON.stringify(items, null, 2), "utf-8");
  console.log(`[Backup Saved] Original records archived to ${BACKUP_FILE}`);

  // 2. Perform safe patch
  for (const item of items) {
    console.log(
      `Found item ${item._id} (${item.name}), current link: ${item.link || "(empty)"}`,
    );
    await client.patch(item._id).set(TARGET_NEW_DATA).commit();
    console.log(`Successfully patched item ${item._id}`);
  }

  // 3. Post-patch read verification
  console.log("Performing post-patch read assertion...");
  for (const item of items) {
    const verified = await client.fetch<ItemRecord>(
      `*[_type == "item" && _id == $id][0]{ _id, name, link, description, introduction }`,
      { id: item._id },
    );

    if (!verified) {
      console.error(
        `Assertion failed: Could not re-fetch patched item ${item._id}`,
      );
      process.exit(1);
    }

    if (verified.link !== TARGET_NEW_DATA.link) {
      console.error(
        `Assertion failed on link: expected "${TARGET_NEW_DATA.link}", got "${verified.link}"`,
      );
      process.exit(1);
    }

    if (verified.description !== TARGET_NEW_DATA.description) {
      console.error(`Assertion failed on description for item ${item._id}`);
      process.exit(1);
    }

    console.log(
      `[Verified] Item ${verified._id} link is ${verified.link} and description matches expected value.`,
    );
  }

  console.log(
    "All Sanity unsummary updates applied and verified successfully.",
  );
}

main().catch((err) => {
  console.error("Fatal: Patch operation failed with exception:", err);
  process.exit(1);
});
