/**
 * 拉取 Findry AI 待审核的用户提交清单（只读操作）
 *
 * 输出包含五道门禁审查所需的关键字段：
 * 内容深度（description/introduction 长度与是否雷同）、视觉资产尺寸、分类标签、提交者信息。
 *
 * 用法: node .opencode/skills/review-submissions/scripts/list-pending.mjs
 */
import { assertConfig, config, sanityQuery } from "./_lib.mjs";

assertConfig();

const query = `*[_type == "item" && defined(submitter) && (freePlanStatus == "pending" || freePlanStatus == "submitting")] {
  _id,
  name,
  "slug": slug.current,
  link,
  description,
  introduction,
  freePlanStatus,
  pricePlan,
  "hasIcon": defined(icon.asset),
  "hasImage": defined(image.asset),
  "iconWidth": icon.asset->metadata.dimensions.width,
  "iconHeight": icon.asset->metadata.dimensions.height,
  "imageWidth": image.asset->metadata.dimensions.width,
  "imageHeight": image.asset->metadata.dimensions.height,
  categories[]->{ name, "slug": slug.current },
  tags[]->{ name, "slug": slug.current },
  "submitterName": submitter->name,
  "submitterEmail": submitter->email,
  note,
  _createdAt
} | order(_createdAt desc)`;

const items = await sanityQuery(query);

console.log(`站点: ${config.siteUrl}`);
console.log(
  `=== 待审核提交清单（pending / submitting），共 ${items.length} 条 ===\n`,
);

if (items.length === 0) {
  console.log("当前没有待审核的用户提交。");
  process.exit(0);
}

for (const item of items) {
  const descLen = item.description?.trim().length ?? 0;
  const introLen = item.introduction?.trim().length ?? 0;
  const introSameAsDesc =
    descLen > 0 &&
    introLen > 0 &&
    item.description.trim() === item.introduction.trim();

  console.log("----------------------------------------");
  console.log(`ID: ${item._id}`);
  console.log(`Name: ${item.name}`);
  console.log(`Slug: ${item.slug}`);
  console.log(`Link: ${item.link}`);
  console.log(
    `Status: ${item.freePlanStatus} | Plan: ${item.pricePlan} | Created: ${item._createdAt}`,
  );
  console.log(
    `Submitter: ${item.submitterName || "未知"} (${item.submitterEmail || "无邮箱"})`,
  );
  console.log(
    `Categories: ${item.categories?.map((c) => c.name).join(", ") || "无"}`,
  );
  console.log(`Tags: ${item.tags?.map((t) => t.name).join(", ") || "无"}`);
  if (item.note) {
    console.log(
      `Note (内部备注):${item.note.includes("[HOLD]") ? " ⚠️ 含 [HOLD] 挂起标记" : ""} ${item.note}`,
    );
  }
  console.log(
    `Icon: ${item.hasIcon ? `有 (${item.iconWidth ?? "?"}x${item.iconHeight ?? "?"})` : "缺失"}`,
  );
  console.log(
    `Screenshot: ${item.hasImage ? `有 (${item.imageWidth ?? "?"}x${item.imageHeight ?? "?"})` : "缺失"}`,
  );
  console.log(
    `Description (${descLen} 字符): ${item.description?.trim() || "(空)"}`,
  );
  console.log(
    `Introduction (${introLen} 字符, ${introSameAsDesc ? "⚠️ 与 Description 完全相同" : "内容独立"}):`,
  );
  console.log(
    `  ${item.introduction?.trim().slice(0, 300) || "(空)"}${introLen > 300 ? "..." : ""}`,
  );
  console.log("");
}

console.log("提示: 请对每一条运行 check-site.mjs 探测目标网站后再做裁决。");
