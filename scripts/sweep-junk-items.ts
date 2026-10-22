/**
 * One-off: sweep the item library for junk entries that poison category
 * pages — dictionary/wordbook entries, non-target-language descriptions,
 * stub descriptions. Read-only by default; pass slugs as args to set
 * forceHidden=true on them.
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

type Row = {
  _id: string;
  slug: string;
  name: string;
  description: string;
  categories: string[];
};

const HIGH_PATTERNS: [RegExp, string][] = [
  [/cambridge dictionary/i, "cambridge-dictionary"],
  [/merriam-?webster|wiktionary|dictionary\.com|urban dictionary|vocabulary\.com/i, "dictionary-site"],
  [/dictionary (entry|definition|page)/i, "dictionary-entry"],
  [/\bthe past (simple|tense|participle)\b/i, "past-tense"],
  [/\b(past|present|third-person|\-?ing) (participle|form of)\b/i, "verb-form"],
  [/\bcomparative (and superlative|form|forms)\b/i, "comparative"],
  [/\b(is|are) the (past|present|comparative|superlative)\b/i, "word-form"],
  [/\bmeaning(s)? of the (word|term|name)\b/i, "word-meaning"],
];

function nonLatinRatio(s: string): number {
  const chars = s.replace(/\s/g, "");
  if (!chars) return 0;
  const nonLatin = chars.match(/[^\u0000-\u024F\u2000-\u206F]/g)?.length ?? 0;
  return nonLatin / chars.length;
}

async function main() {
  const hideArgs = process.argv.slice(2);

  if (hideArgs.length > 0) {
    const targets = await client.fetch<{ _id: string; slug: string }[]>(
      `*[_type == "item" && slug.current in $slugs]{ _id, "slug": slug.current }`,
      { slugs: hideArgs },
    );
    const found = new Set(targets.map((t) => t.slug));
    for (const slug of hideArgs) {
      if (!found.has(slug)) {
        console.error(`NOT FOUND: ${slug}`);
        continue;
      }
      const doc = targets.find((t) => t.slug === slug)!;
      await client
        .patch(doc._id)
        .set({ forceHidden: true })
        .commit()
        .then(() => console.log(`hidden: ${slug} (${doc._id})`))
        .catch((e) => console.error(`FAILED ${slug}: ${e.message}`));
    }
    return;
  }

  const rows = await client.fetch<Row[]>(
    `*[_type == "item" && defined(slug.current) && defined(publishDate)
       && forceHidden != true]{
      _id,
      "slug": slug.current,
      name,
      description,
      "categories": categories[]-> { name }
    } | order(slug asc)`,
  );

  const high: { row: Row; why: string }[] = [];
  const medium: { row: Row; why: string }[] = [];

  for (const row of rows) {
    const d = (row.description || "").trim();
    const hits = HIGH_PATTERNS.filter(([re]) => re.test(d)).map(([, tag]) => tag);
    if (hits.length > 0) {
      high.push({ row, why: hits.join("+") });
      continue;
    }
    const ratio = nonLatinRatio(d);
    if (d.length > 0 && ratio > 0.4) {
      medium.push({ row, why: `non-latin ${(ratio * 100).toFixed(0)}%` });
    } else if (d.length > 0 && d.length < 40) {
      medium.push({ row, why: `desc ${d.length} chars` });
    }
  }

  console.log(`scanned: ${rows.length}`);
  console.log(`\nHIGH (dictionary/wordbook junk — recommend forceHidden): ${high.length}`);
  for (const { row, why } of high) {
    console.log(`  ${row.slug} | ${why}`);
    console.log(`     "${d(row)}"`);
  }
  console.log(`\nMEDIUM (review manually): ${medium.length}`);
  for (const { row, why } of medium) {
    console.log(`  ${row.slug} | ${why} | "${d(row).slice(0, 80)}"`);
  }

  function d(row: Row) {
    return (row.description || "").trim().slice(0, 110);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
