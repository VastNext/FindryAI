import { createClient } from "@sanity/client";
import dotenv from "dotenv";
dotenv.config();

// 四个数据工具细分标签：slug 与站内 /tag/[slug] 路由对应，卡片内链指向这里
const TAGS = [
  {
    _id: "tag.ai-data-analyst",
    name: "AI Data Analyst",
    slug: { _type: "slug", current: "ai-data-analyst" },
    description:
      "Conversational AI data analysts that clean data, run statistical analysis, and generate predictive models from natural language questions.",
  },
  {
    _id: "tag.spreadsheet-ai",
    name: "Spreadsheet AI",
    slug: { _type: "slug", current: "spreadsheet-ai" },
    description:
      "AI tools for Excel and Google Sheets: formula generation, automated data cleaning, and conversational spreadsheet analysis.",
  },
  {
    _id: "tag.text-to-sql",
    name: "Text to SQL",
    slug: { _type: "slug", current: "text-to-sql" },
    description:
      "Convert natural language into optimized SQL and NoSQL queries, explain complex statements, and query databases without writing code.",
  },
  {
    _id: "tag.bi-dashboard",
    name: "BI & Dashboard",
    slug: { _type: "slug", current: "bi-dashboard" },
    description:
      "AI business intelligence tools that turn raw data into charts, interactive dashboards, and shareable reports instantly.",
  },
];

// 打标规则：对 data-tools 分类条目的描述/介绍做关键词匹配，一条可命中多个标签
const RULES: Array<{ tagId: string; pattern: RegExp }> = [
  {
    tagId: "tag.spreadsheet-ai",
    pattern: /spreadsheet|excel|google sheets|\bsheet\b/i,
  },
  {
    tagId: "tag.text-to-sql",
    pattern: /\bsql\b|natural language quer|text2sql|query generator/i,
  },
  {
    tagId: "tag.bi-dashboard",
    pattern: /dashboard|visualiz|chart|graph|business intelligence|reporting/i,
  },
  {
    tagId: "tag.ai-data-analyst",
    pattern:
      /data analys|analys(?:e|ing) data|data analyst|predictive|forecast|insights? from|data into actionable|machine learning/i,
  },
];

async function main() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "8pdw6hih";
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const token = process.env.SANITY_API_TOKEN;

  if (!token) {
    console.error("❌ SANITY_API_TOKEN is not set.");
    process.exitCode = 1;
    return;
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion: "2024-08-01",
    useCdn: false,
    token,
  });

  // 1. 创建四个标签（已存在则跳过）
  for (const tag of TAGS) {
    await client.createIfNotExists({ ...tag, _type: "tag" });
    console.log(`✅ Tag ready: ${tag.slug}`);
  }

  // 2. 拉取 data-tools 分类下全部已发布条目
  const items: Array<{
    _id: string;
    name: string;
    description?: string;
    introduction?: string;
    tagIds: string[];
  }> = await client.fetch(
    `*[_type == "item" && defined(slug.current) && defined(publishDate) && forceHidden != true && references(*[_type=="category" && slug.current=="data-tools"]._id)]{
      _id, name, description, introduction,
      "tagIds": tags[]._ref
    }`,
  );
  console.log(`📦 Items in data-tools: ${items.length}`);

  // 3. 按规则合并打标（保留已有标签，追加命中标签）
  let tagged = 0;
  for (const item of items) {
    const text = `${item.description || ""} ${item.introduction || ""}`;
    const hits = RULES.filter((r) => r.pattern.test(text)).map((r) => r.tagId);
    if (hits.length === 0) continue;

    const merged = Array.from(new Set([...(item.tagIds || []), ...hits]));
    await client
      .patch(item._id)
      .set({ tags: merged.map((ref) => ({ _type: "reference", _ref: ref })) })
      .commit();
    tagged++;
    console.log(`  🏷️  ${item.name}: +${hits.length} tag(s)`);
  }

  console.log(`🎉 Done. Tagged ${tagged}/${items.length} items.`);
}

main().catch((error: unknown) => {
  const msg = error instanceof Error ? error.message : String(error);
  console.error("❌ Tag seeding failed:", msg);
  process.exitCode = 1;
});
