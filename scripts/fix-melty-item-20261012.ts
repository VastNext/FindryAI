import { createClient } from "@sanity/client";
import dotenv from "dotenv";

dotenv.config();

// Fix Melty AI item: melty.sh now redirects to Conductor (the founders' next
// product), so the canonical link is the GitHub repo; note the pivot honestly.

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "",
  apiVersion: "2024-08-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN || "",
});

async function main() {
  const item = await client.fetch<
    { _id: string; introduction: string } | undefined
  >(`*[_type == "item" && slug.current == "melty-ai"][0]{_id, introduction}`);
  if (!item) throw new Error("melty-ai item not found");

  let intro = item.introduction;
  const replacements: [string, string][] = [
    [
      "Note: the editor lives at melty.sh — melty.dev is an unrelated agency.",
      "The team's original site (melty.sh) now redirects to Conductor, the founders' next product — the editor's source and builds remain on GitHub. (And melty.dev is an unrelated agency.)",
    ],
    [
      "- **Version 0.2 in the works** — the team ships through a waitlist; check the site for early access.",
      "- **Version 0.2 shipped through a waitlist** — current development status lives on the GitHub repo.",
    ],
    [
      "The project is open source; check the GitHub repo and the official site for current builds and the 0.2 waitlist.",
      "The project is open source — current builds and status live on the GitHub repo. The team's follow-up product is Conductor (melty.sh redirects there).",
    ],
    [
      "No — melty.dev is an unrelated software agency. The AI code editor is at melty.sh, with source on GitHub (meltylabs/melty).",
      "Two lookalikes: melty.dev is an unrelated software agency, and melty.sh now redirects to Conductor (the founders' next product). The Melty editor's source lives on GitHub (meltylabs/melty).",
    ],
  ];
  for (const [needle, replacement] of replacements) {
    if (!intro.includes(needle)) {
      console.log(`[warn] needle not found: ${needle.slice(0, 60)}...`);
      continue;
    }
    intro = intro.replace(needle, replacement);
  }
  await client
    .patch(item._id)
    .set({
      link: "https://github.com/meltylabs/melty",
      introduction: intro,
    })
    .commit();
  console.log("[ok] melty-ai: link -> github repo, introduction updated");
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
