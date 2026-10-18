/**
 * One-off: quantify the thin-item stock that feeds GSC's
 * "Crawled - currently not indexed" bucket. Read-only.
 */
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

type Row = { slug: string; intro: string; updated: string };

async function main() {
  const rows = await client.fetch<Row[]>(
    `*[_type == "item" && defined(slug.current) && defined(publishDate) && forceHidden != true]{
      "slug": slug.current,
      "intro": coalesce(introduction, ""),
      "updated": _updatedAt
    } | order(_updatedAt desc)`,
  );
  const total = rows.length;
  const empty = rows.filter((r) => r.intro.trim().length === 0);
  const thin = rows.filter((r) => r.intro.trim().length > 0 && r.intro.trim().length < 200);
  const medium = rows.filter((r) => r.intro.trim().length >= 200 && r.intro.trim().length < 600);
  const rich = rows.filter((r) => r.intro.trim().length >= 600);
  console.log(`total published items: ${total}`);
  console.log(`empty introduction:    ${empty.length}`);
  console.log(`thin (<200 chars):     ${thin.length}`);
  console.log(`medium (200-599):      ${medium.length}`);
  console.log(`rich (>=600):          ${rich.length}`);
  console.log(`--- thin+empty = ${empty.length + thin.length} of ${total} (${Math.round(((empty.length + thin.length) / total) * 100)}%)`);
  console.log('\nsample thin slugs (first 15):');
  for (const r of [...empty, ...thin].slice(0, 15)) {
    console.log(`  ${r.slug} (${r.intro.trim().length} chars)`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
