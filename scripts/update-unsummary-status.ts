import { createClient } from "@sanity/client";
import dotenv from "dotenv";

dotenv.config();

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "";
const token = process.env.SANITY_API_TOKEN || "";

if (!projectId || !dataset || !token) {
  console.error("Missing credentials");
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

const UPDATED_INTRODUCTION = `Unsummary (unsummary.com) was an AI summarization tool designed to condense long-form content — books, movies, TV shows, podcasts, and public figures — into short, readable briefs. You name something you do not have time to read or watch; it returns key takeaways in seconds. It was built for writers and content marketers who need the gist of a source before deciding whether to dig into it.

> **Service Status Notice (2026)**: As of September 2026, the origin servers for unsummary.com are no longer responding (HTTP 522/connection refused), indicating the service may be discontinued or undergoing maintenance. We strongly recommend comparing active alternative summarizers below.

### Key Capabilities & Historical Catalogue
- **Books (40M+ Titles)**: Distilled core arguments into 3-5 minute summaries.
- **Movies & Shows (600K+ Movies, 230K Series)**: Concise plot beats, themes, and characters without spoilers.
- **Podcasts (4M+ Episodes)**: Converted multi-hour conversational episodes into structured reading briefs.
- **Public Figures (1.2M Profiles)**: Background summaries for research and profiles.
- **Paste-Your-Own-Text**: Quick summarization for custom long-form documents and transcripts.

### Historical Pricing & Credits
- **Free Allowance**: 25 complimentary credits on sign-up (1 credit per summary).
- **Billing Model**: Pay-as-you-go credit deductions.

### Looking for Active Alternatives?
If you need working AI book and media summarizers today, check out **[Unsummary Alternatives](/item/unsummary/alternatives)** to compare Blinkist, StoryShots, and NoteGPT.`;

async function main() {
  console.log("Updating unsummary in Sanity...");
  const item = await client.fetch<{ _id: string }>(
    `*[_type == "item" && slug.current == "unsummary"][0]`,
  );
  if (!item) {
    console.error("Unsummary not found in Sanity");
    process.exit(1);
  }

  await client
    .patch(item._id)
    .set({
      description:
        "Unsummary summarizes 40M+ books, 600K+ movies and 4M podcasts with AI. Check service status, historical features, and compare top active alternatives.",
      introduction: UPDATED_INTRODUCTION,
    })
    .unset(["image"]) // Remove the image that has the competitor 'easy with ai' screenshot
    .commit();

  console.log("Sanity updated successfully. Unset image and updated introduction/description.");
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
