import { createClient } from "@sanity/client";
import dotenv from "dotenv";

dotenv.config();

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "";
const token = process.env.SANITY_API_TOKEN || "";

if (!projectId || !dataset) {
  console.error("Error: Missing Sanity Project ID or Dataset.");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-08-01",
  useCdn: true,
  perspective: "published",
  token: token || undefined,
});

const SUSPICIOUS_DOMAINS = [
  "easywithai.com",
  "futurepedia.io",
  "therundown.ai",
  "aitoolhunt.com",
  "topai.tools",
  "allthingsai.com",
  "toolify.ai",
  "insidr.ai",
  "dang.ai",
];

interface AuditItem {
  _id: string;
  name: string;
  slug?: { current?: string };
  link?: string;
  _createdAt: string;
}

async function main() {
  console.log(
    `[Link Audit] Scanning published items in ${projectId} (${dataset})...`,
  );

  const items = await client.fetch<AuditItem[]>(
    `*[_type == "item"]{ _id, name, slug, link, _createdAt }`,
  );

  console.log(`[Total Items] ${items.length} items found.`);

  const suspiciousItems: Array<{ item: AuditItem; reason: string }> = [];

  for (const item of items) {
    if (!item.link) {
      continue;
    }

    const lowerLink = item.link.toLowerCase();

    for (const domain of SUSPICIOUS_DOMAINS) {
      if (lowerLink.includes(domain)) {
        suspiciousItems.push({
          item,
          reason: `Matches competitor/directory domain: ${domain}`,
        });
        break;
      }
    }

    if (
      lowerLink.includes("utm_source=") &&
      !suspiciousItems.some((s) => s.item._id === item._id)
    ) {
      suspiciousItems.push({
        item,
        reason: "Contains unexpected UTM parameters",
      });
    }
  }

  console.log("\n--- [Audit Results] ---");
  if (suspiciousItems.length === 0) {
    console.log("No competitor/directory external link pollution found.");
  } else {
    console.warn(`Found ${suspiciousItems.length} suspicious item(s):`);
    for (const s of suspiciousItems) {
      console.warn(
        `- [${s.item.name}] (slug: ${s.item.slug?.current || "none"}) Link: ${s.item.link} | Reason: ${s.reason}`,
      );
    }
  }

  // Sample 20 random items for baseline inspection
  console.log("\n--- [Sample 20 Random Items For Integrity Check] ---");
  const sampleItems = items.slice(0, 20);
  for (const s of sampleItems) {
    console.log(`- ${s.name}: ${s.link || "(no link)"}`);
  }

  console.log("\n[Link Audit Completed]");
}

main().catch((err) => {
  console.error("Audit error:", err);
  process.exit(1);
});
