import { createClient } from "@sanity/client";
import dotenv from "dotenv";

dotenv.config();

// Backlog decisions for the 12 pending submissions (2026-10-12):
// - 3 rejects (not AI / poor fit) -> status=rejected + reason, then POST
//   /api/send-email (Origin: findryai.com) so the rejection email goes out.
// - 9 approvals -> status=approved, publishDate staggered 2-3 months out
//   (site query filter publishDate <= now() makes them appear on their date).
//   Approval emails are sent AFTER they go live (approval email says "added
//   to directory"); handled by the send-due-approval-emails automation.

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "",
  apiVersion: "2024-08-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN || "",
});

const REJECTS: Record<string, string> = {
  "vedic-astrology-chart": "The item is not good fit for our directory",
  hairforge: "The item is not good fit for our directory",
  supportifier: "The item is not good fit for our directory",
};

// 9 approvals, staggered between +2 months and +3 months (every ~4 days)
const APPROVE_SCHEDULE: Record<string, string> = {
  "blur-background": "2026-12-12T09:00:00.000Z",
  "image-describer": "2026-12-16T09:00:00.000Z",
  sharpniq: "2026-12-20T09:00:00.000Z",
  "video-upscaler": "2026-12-24T09:00:00.000Z",
  visemix: "2026-12-28T09:00:00.000Z",
  "everygen-ai": "2027-01-01T09:00:00.000Z",
  "instinct-ai": "2027-01-05T09:00:00.000Z",
  "kenerate-ai": "2027-01-09T09:00:00.000Z",
  "burning-bridges-ai": "2027-01-12T09:00:00.000Z",
};

async function sendEmailFor(itemId: string) {
  const res = await fetch("https://findryai.com/api/send-email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: "https://findryai.com",
      Referer: "https://findryai.com/",
    },
    body: JSON.stringify({ itemId }),
  });
  return res.status;
}

async function main() {
  const dryRun = !process.argv.includes("--execute");
  console.log(dryRun ? "=== DRY RUN (pass --execute to apply) ===" : "=== EXECUTING ===");

  for (const [slug, reason] of Object.entries(REJECTS)) {
    const doc = await client.fetch<{ _id: string; name: string; freePlanStatus: string } | undefined>(
      `*[_type == "item" && slug.current == $slug && freePlanStatus == "pending"][0]{_id, name, freePlanStatus}`,
      { slug },
    );
    if (!doc) {
      console.log(`[skip] reject ${slug}: no pending item`);
      continue;
    }
    console.log(`[reject] ${slug} (${doc._id}) reason: ${reason}`);
    if (!dryRun) {
      await client.patch(doc._id).set({ freePlanStatus: "rejected", rejectionReason: reason }).commit();
      const status = await sendEmailFor(doc._id);
      console.log(`  status=rejected, rejection email HTTP ${status}`);
    }
  }

  for (const [slug, publishDate] of Object.entries(APPROVE_SCHEDULE)) {
    const doc = await client.fetch<{ _id: string; name: string; freePlanStatus: string } | undefined>(
      `*[_type == "item" && slug.current == $slug && freePlanStatus == "pending"][0]{_id, name, freePlanStatus}`,
      { slug },
    );
    if (!doc) {
      console.log(`[skip] approve ${slug}: no pending item`);
      continue;
    }
    console.log(`[approve] ${slug} (${doc._id}) scheduled publish: ${publishDate}`);
    if (!dryRun) {
      await client
        .patch(doc._id)
        .set({
          freePlanStatus: "approved",
          publishDate,
          note: `Scheduled listing ${publishDate.slice(0, 10)}; send approval email AFTER this date via /api/send-email (approval email says "added to directory").`,
        })
        .commit();
      console.log("  status=approved, publishDate scheduled, approval email deferred");
    }
  }
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
