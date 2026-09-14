import { createClient } from "@sanity/client";
import dotenv from "dotenv";

dotenv.config();

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "",
  apiVersion: "2024-08-01",
  useCdn: false,
  perspective: "published",
  token: process.env.SANITY_API_TOKEN,
});

async function main() {
  if (!process.env.SANITY_API_TOKEN) {
    console.log("SANITY_API_TOKEN is not configured; skipping remote update.");
    return;
  }

  console.log("Searching for unsummary item in Sanity...");
  const items = await client.fetch<
    Array<{ _id: string; name: string; link?: string }>
  >(
    `*[_type == "item" && (slug.current == "unsummary" || name match "unsummary")]`,
  );

  if (!items || items.length === 0) {
    console.log("No unsummary item found in Sanity CMS.");
    return;
  }

  for (const item of items) {
    console.log(
      `Found item ${item._id} (${item.name}), current link: ${item.link}`,
    );
    await client
      .patch(item._id)
      .set({
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
      })
      .commit();
    console.log(
      `Successfully updated ${item._id} to point to https://unsummary.com`,
    );
  }
}

main().catch((err) => {
  console.error("Failed to patch unsummary:", err);
});
