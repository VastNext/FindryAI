/**
 * One-off: verify the related-items recommendation set for sample items.
 * Checks (a) each item's categories, (b) what the FIXED related query
 * returns (slugs + categories), to confirm the same-category filter works.
 * Read-only.
 */
import { createClient } from "@sanity/client";
import dotenv from "dotenv";

dotenv.config();

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "",
  apiVersion: "2024-08-01",
  useCdn: true,
  token: process.env.SANITY_API_TOKEN || "",
});

type Item = {
  slug: string;
  categories: { name: string }[];
  related: { slug: string; categories: { name: string }[] }[];
};

async function inspect(slug: string) {
  const doc = await client.fetch<Item | undefined>(
    `*[_type == "item" && slug.current == $slug
      && defined(publishDate) && publishDate <= now() && forceHidden != true][0]{
      "slug": slug.current,
      "categories": categories[]-> { name },
      "related": *[_type == "item" && defined(slug.current)
        && defined(publishDate) && publishDate <= now()
        && forceHidden != true
        && sponsor != true
        && count(categories[@._ref in ^.^.categories[]._ref
          && !(@._ref in *[_type == "category" && slug.current == "ai-tools"][]._id)]) > 0
        && _id != ^._id]
        | order(publishDate desc, _createdAt desc) [0...6] {
          "slug": slug.current,
          "categories": categories[]-> { name },
        }
    }`,
    { slug },
  );
  if (!doc) {
    console.log(`${slug}: NOT FOUND`);
    return;
  }
  console.log(`\n=== ${slug} ===`);
  console.log(`  own categories: [${doc.categories.map((c) => c.name).join(", ")}]`);
  for (const r of doc.related) {
    console.log(`  -> ${r.slug}  [${r.categories.map((c) => c.name).join(", ")}]`);
  }
  const shared = doc.related.filter((r) =>
    r.categories.some((c) => doc.categories.some((o) => o.name === c.name)),
  );
  console.log(`  shared-category check: ${shared.length}/${doc.related.length} share a category`);
}

async function main() {
  // How many items would lose ALL recommendations if "AI Tools" (the
  // catch-all) is excluded from matching?
  const counts = await client.fetch<{ slug: string; specific: number }[]>(
    `*[_type == "item" && defined(slug.current) && defined(publishDate)
       && publishDate <= now() && forceHidden != true]{
      "slug": slug.current,
      "specific": count(categories[!(@._ref in *[_type == "category" && slug.current == "ai-tools"][]._id)])
    }`,
  );
  const zero = counts.filter((c) => c.specific === 0);
  console.log(`items total: ${counts.length}, zero non-catchall categories: ${zero.length}`);
  if (zero.length) console.log("  affected:", zero.map((c) => c.slug).slice(0, 20).join(", "));

  for (const slug of ["chefgpt", "novelai", "gpt-researcher"]) {
    await inspect(slug);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
