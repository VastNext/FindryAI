/**
 * review-submissions skill 公共库
 * 提供代理 fetch、Sanity HTTP API、通知邮件与缓存刷新助手
 *
 * 重要：本机 Node 直连 *.api.sanity.io 会报 ERR_TLS_CERT_ALTNAME_INVALID，
 * 所有外网请求必须走本地代理（http://127.0.0.1:7890）。
 */
import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { HttpsProxyAgent } from "https-proxy-agent";
import fetch from "node-fetch";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// .opencode/skills/review-submissions/scripts/ 向上三级 = 项目根
dotenv.config({ path: path.resolve(__dirname, "../../../../.env") });

export const agent = new HttpsProxyAgent("http://127.0.0.1:7890");

export const config = {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN,
  siteUrl: process.env.NEXT_PUBLIC_APP_URL || "https://findryai.com",
  apiVersion: "2024-08-01",
};

export function assertConfig() {
  const missing = Object.entries({
    NEXT_PUBLIC_SANITY_PROJECT_ID: config.projectId,
    NEXT_PUBLIC_SANITY_DATASET: config.dataset,
    SANITY_API_TOKEN: config.token,
  })
    .filter(([, v]) => !v)
    .map(([k]) => k);
  if (missing.length > 0) {
    console.error(
      `错误: 缺少环境变量 ${missing.join(", ")}，请检查项目根目录 .env 文件。`,
    );
    process.exit(1);
  }
}

/** 带代理的 fetch 快捷方式 */
export async function proxyFetch(url, options = {}) {
  return fetch(url, { agent, ...options });
}

/** Sanity GROQ 查询（published 视角） */
export async function sanityQuery(query) {
  assertConfig();
  const url = `https://${config.projectId}.api.sanity.io/v${config.apiVersion}/data/query/${config.dataset}?perspective=published&query=${encodeURIComponent(query)}`;
  const res = await proxyFetch(url, {
    headers: { Authorization: `Bearer ${config.token}` },
  });
  if (!res.ok) {
    throw new Error(`Sanity query failed (${res.status}): ${await res.text()}`);
  }
  const data = await res.json();
  return data.result;
}

/**
 * Sanity 原子变更（visibility=sync 立即生效）
 * @param {Array<object>} mutations 例如 [{ patch: { id, set } }]
 */
export async function sanityMutate(mutations) {
  assertConfig();
  const url = `https://${config.projectId}.api.sanity.io/v${config.apiVersion}/data/mutate/${config.dataset}?returnIds=true&returnDocuments=true&visibility=sync`;
  const res = await proxyFetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.token}`,
    },
    body: JSON.stringify({ mutations }),
  });
  if (!res.ok) {
    throw new Error(
      `Sanity mutate failed (${res.status}): ${await res.text()}`,
    );
  }
  return res.json();
}

/**
 * 发送审核结果通知邮件。
 * 注意：/api/send-email 有 Origin 校验，必须携带 Origin/Referer 头；
 * 且必须先写库变更状态，再调用本函数（路由按 DB 当前状态决定发批准信还是打回信）。
 */
export async function sendReviewEmail(itemId) {
  const res = await proxyFetch(`${config.siteUrl}/api/send-email`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Origin: config.siteUrl,
      Referer: `${config.siteUrl}/studio`,
    },
    body: JSON.stringify({ itemId }),
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}

/** 缓存刷新 secret 回退链 */
export function revalidateSecret() {
  return (
    process.env.REVALIDATE_SECRET ||
    process.env.AUTH_SECRET ||
    process.env.SANITY_API_TOKEN
  );
}

/** 刷新线上指定路径的 ISR/边缘缓存 */
export async function revalidatePath(path = "/") {
  const secret = revalidateSecret();
  if (!secret) {
    return { status: 0, data: { message: "no secret configured" } };
  }
  const url = `${config.siteUrl}/api/revalidate?secret=${encodeURIComponent(secret)}&path=${encodeURIComponent(path)}`;
  const res = await proxyFetch(url, { method: "POST" });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data };
}
