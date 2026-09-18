import { createClient } from "@sanity/client";
import dotenv from "dotenv";

dotenv.config();

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !dataset || !token) {
  console.error(
    "错误: 缺少必要的环境变量 (NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, SANITY_API_TOKEN)，请检查 .env 文件。",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-08-01",
  useCdn: false,
  perspective: "published",
  token,
});

async function publishApprovedSubmissions() {
  console.log(
    "正在查询所有由用户提交（具有 submitter）、已 Approved 但未设置 publishDate 的条目...",
  );

  try {
    // 仅匹配用户真实提交（defined(submitter)）、freePlanStatus == "approved" 且 publishDate 为空或未定义的条目
    const items = await client.fetch(
      `*[_type == "item" && defined(submitter) && freePlanStatus == "approved" && !defined(publishDate)] {
        _id,
        name,
        "slug": slug.current,
        "submitterName": submitter->name,
        "submitterEmail": submitter->email,
        pricePlan,
        freePlanStatus,
        _createdAt
      }`,
    );

    if (!items || items.length === 0) {
      console.log(
        "未发现需要发布的用户提交条目（所有 Approved 的用户提交条目均已设置 publishDate 上线）。",
      );
      return;
    }

    console.log(`\n共发现 ${items.length} 个待发布的用户提交条目：`);
    for (const item of items) {
      console.log(
        `- [${item._id}] ${item.name} | 提交者: ${item.submitterName || item.submitterEmail || "未知"}`,
      );
    }

    const now = new Date().toISOString();
    console.log(`\n开始发布，将 publishDate 设置为当前时间: ${now}\n`);

    for (const item of items) {
      await client
        .patch(item._id)
        .set({
          publishDate: now,
        })
        .commit();
      console.log(`✅ 成功发布: ${item.name} (${item._id})`);
    }

    console.log(`\n🎉 全部 ${items.length} 个用户提交条目已成功发布上线！`);

    // 触发网站首页缓存刷新
    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://findryai.com";
    const secret =
      process.env.REVALIDATE_SECRET ||
      process.env.AUTH_SECRET ||
      process.env.SANITY_API_TOKEN;

    if (secret) {
      try {
        console.log(`\n正在请求刷新 ${siteUrl} 首页缓存...`);
        const revalidateUrl = `${siteUrl}/api/revalidate?secret=${encodeURIComponent(secret)}&path=/`;
        const res = await fetch(revalidateUrl, { method: "POST" });
        if (res.ok) {
          console.log("⚡ 首页缓存已成功刷新！前台已即时更新最新排序。");
        } else {
          console.log(`⚠️ 缓存刷新请求返回状态: ${res.status}`);
        }
      } catch (err: unknown) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        console.log(`⚠️ 尝试刷新线上缓存时提示: ${errorMsg}`);
      }
    }
  } catch (error) {
    console.error("执行发布过程中出错:", error);
  }
}

publishApprovedSubmissions();
