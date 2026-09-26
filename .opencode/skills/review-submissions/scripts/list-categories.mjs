/**
 * 列出站内已有分类（只读）
 *
 * 用途：分类门禁修正（仅分类不过、其他门禁全过时自行改正分类）前，
 * 先查看站内合法分类清单，确保 execute-decision.mjs --categories 能匹配成功。
 *
 * 用法:
 *   node list-categories.mjs
 */
import { sanityQuery } from "./_lib.mjs";

async function main() {
  const cats = await sanityQuery(
    `*[_type == "category"] | order(name asc){ _id, name, "slug": slug.current, "itemCount": count(*[_type == "item" && references(^._id) && defined(publishDate)]) }`,
  );
  console.log(`=== 站内分类共 ${cats.length} 个（含已发布条目数）===`);
  for (const c of cats) {
    console.log(`- ${c.name}  (slug: ${c.slug})  条目数: ${c.itemCount}`);
  }
}

main();
