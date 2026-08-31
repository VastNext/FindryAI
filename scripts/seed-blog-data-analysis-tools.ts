import fs from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";
import dotenv from "dotenv";
dotenv.config();

/**
 * 精简 Markdown → Sanity Portable Text 转换
 * 支持：#/##/### 标题、- 列表、> 引用、普通段落；跳过表格分隔线与 frontmatter
 */
function markdownToPortableText(md: string): Array<Record<string, unknown>> {
  const blocks: Array<Record<string, unknown>> = [];
  // 去掉 YAML frontmatter
  const content = md.replace(/^---[\s\S]*?---\n/, "");
  const lines = content.split("\n");

  let paragraphBuffer: string[] = [];

  const flushParagraph = () => {
    const text = paragraphBuffer.join(" ").trim();
    paragraphBuffer = [];
    if (!text) return;
    blocks.push({
      _type: "block",
      _style: "normal",
      children: [
        { _type: "span", _key: Math.random().toString(36).slice(2, 10), text },
      ],
      markDefs: [],
    });
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    // 跳过表格分隔线与 Markdown 表格行（表格在 CMS 中以列表/段落呈现退化可接受）
    if (/^\|/.test(line.trim())) continue;

    const heading = line.match(/^(#{1,4})\s+(.*)$/);
    if (heading) {
      flushParagraph();
      const level = heading[1].length;
      blocks.push({
        _type: "block",
        _style:
          level === 1 ? "h2" : level === 2 ? "h2" : level === 3 ? "h3" : "h4",
        children: [
          {
            _type: "span",
            _key: Math.random().toString(36).slice(2, 10),
            text: heading[2],
          },
        ],
        markDefs: [],
      });
      continue;
    }

    const listItem = line.match(/^[-*]\s+(.*)$/);
    if (listItem) {
      flushParagraph();
      blocks.push({
        _type: "block",
        _style: "normal",
        listItem: "bullet",
        level: 1,
        children: [
          {
            _type: "span",
            _key: Math.random().toString(36).slice(2, 10),
            text: listItem[1],
          },
        ],
        markDefs: [],
      });
      continue;
    }

    const quote = line.match(/^>\s?(.*)$/);
    if (quote) {
      flushParagraph();
      blocks.push({
        _type: "block",
        _style: "blockquote",
        children: [
          {
            _type: "span",
            _key: Math.random().toString(36).slice(2, 10),
            text: quote[1],
          },
        ],
        markDefs: [],
      });
      continue;
    }

    if (line.trim() === "") {
      flushParagraph();
      continue;
    }

    paragraphBuffer.push(line.trim());
  }
  flushParagraph();
  return blocks;
}

async function main() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "8pdw6hih";
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const token = process.env.SANITY_API_TOKEN;

  if (!token) {
    console.error("❌ SANITY_API_TOKEN is not set.");
    console.log(
      "Run with SANITY_API_TOKEN=<token> npx tsx scripts/seed-blog-data-analysis-tools.ts",
    );
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

  // author 为 blogPost schema 的必填引用：优先取环境变量，其次取数据集中第一个 user
  const authorId =
    process.env.BLOG_AUTHOR_ID ||
    (await client.fetch('*[_type == "user"][0]._id'));

  if (!authorId) {
    console.error(
      "❌ No author found. Create a user document in Sanity Studio or set BLOG_AUTHOR_ID=<documentId>.",
    );
    process.exitCode = 1;
    return;
  }

  const mdPath = path.resolve(
    __dirname,
    "../docs/blog-posts/2026-09-01-best-ai-data-analysis-tools.md",
  );
  const raw = fs.readFileSync(mdPath, "utf-8");

  const doc = {
    _type: "blogPost",
    title: "Top 20+ Best AI Data Analysis Tools in 2026: The Complete Guide",
    slug: {
      _type: "slug",
      current: "best-ai-data-analysis-tools-2026",
    },
    excerpt:
      "Discover the top AI data analysis tools in 2026. Compare natural language data analysts (Julius AI, Akkio), AI spreadsheet agents (Sourcetable, Formula Bot), Text-to-SQL query engines, and predictive analytics platforms.",
    author: { _type: "reference", _ref: authorId },
    publishDate: new Date().toISOString(),
    body: markdownToPortableText(raw),
  };

  console.log("🚀 Creating or updating Pillar blog post in Sanity...");
  const res = await client.createOrReplace({
    _id: "blog-best-ai-data-analysis-tools-2026",
    ...doc,
  });

  console.log("✅ Blog post created/updated successfully:", res._id);
}

main().catch((error: unknown) => {
  const msg = error instanceof Error ? error.message : String(error);
  console.error("❌ Seed failed:", msg);
  process.exitCode = 1;
});
