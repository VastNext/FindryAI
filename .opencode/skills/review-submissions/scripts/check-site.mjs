/**
 * 探测目标网站（只读操作）
 * 检查联通性并抓取 title / meta description / 正文摘要，供内容相关性审核参考。
 *
 * 用法: node .opencode/skills/review-submissions/scripts/check-site.mjs <url> [url2 ...]
 */
import { proxyFetch } from "./_lib.mjs";

const urls = process.argv.slice(2);
if (urls.length === 0) {
  console.error("用法: node check-site.mjs <url> [url2 ...]");
  process.exit(1);
}

const TIMEOUT_MS = 15000;
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36";

function extract(html, url) {
  const title = html.match(/<title[^>]*>([^<]*)<\/title>/i)?.[1]?.trim();
  const description =
    html
      .match(
        /<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i,
      )?.[1]
      ?.trim() ??
    html
      .match(
        /<meta[^>]*content=["']([^"']*)["'][^>]*name=["']description["']/i,
      )?.[1]
      ?.trim() ??
    html
      .match(
        /<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']*)["']/i,
      )?.[1]
      ?.trim();
  const bodyText = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  return {
    url,
    title: title || "(无 title)",
    description: description || "(无 meta description)",
    bodySnippet: bodyText.slice(0, 400),
    bodyLength: bodyText.length,
  };
}

for (const url of urls) {
  try {
    const res = await proxyFetch(url, {
      headers: { "User-Agent": UA },
      timeout: TIMEOUT_MS,
      redirect: "follow",
    });
    const html = await res.text();
    const info = extract(html, res.url || url);
    console.log(`[${res.status}] ${url}`);
    console.log(`  Title: ${info.title}`);
    console.log(`  Description: ${info.description}`);
    console.log(`  正文可见字符数: ${info.bodyLength}`);
    console.log(`  正文摘要: ${info.bodySnippet}`);
  } catch (err) {
    console.log(`[FAIL] ${url}`);
    console.log(`  错误: ${err?.message || err}`);
  }
  console.log("");
}
