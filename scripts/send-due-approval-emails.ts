import { createClient } from "@sanity/client";
import dotenv from "dotenv";

dotenv.config();

// Scheduled-listing follow-up: for items whose publishDate has passed,
// send the approval email (it says "added to directory", so it must go out
// only after the listing is actually visible) and mark it done in item.note.
// Run periodically (workspace automation). Idempotent via the note marker.

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "",
  apiVersion: "2024-08-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN || "",
});

const EMAIL_MARKER = "approval-email-sent";

async function main() {
  const due = await client.fetch(
    `*[_type == "item" && freePlanStatus == "approved" && defined(publishDate) && publishDate <= now() && defined(submitter) && !defined(forceHidden)]|order(publishDate asc){_id, name, "slug": slug.current, "email": submitter->.email, "submitterName": submitter->.name, note}`,
  );
  console.log(`approved+live items with submitter: ${due.length}`);

  for (const item of due) {
    if ((item.note || "").includes(EMAIL_MARKER)) continue;
    console.log(`[email] ${item.slug} -> ${item.email}`);
    const res = await fetch("https://findryai.com/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "https://findryai.com",
        Referer: "https://findryai.com/",
      },
      body: JSON.stringify({ itemId: item._id }),
    });
    console.log(`  send-email HTTP ${res.status}`);
    if (res.ok) {
      const note = `${item.note ? item.note + " | " : ""}${EMAIL_MARKER}: ${new Date().toISOString()}`;
      await client.patch(item._id).set({ note }).commit();
      console.log("  marked sent");
    }
  }
  console.log("done");
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
