import { Resolver } from "node:dns/promises";
import http from "node:http";
import https from "node:https";
import { isIP } from "node:net";
import { DomUtils, parseDocument } from "htmlparser2";
/**
 * 执行审核裁决（写操作！）
 *
 * 子命令:
 *   approve <itemId> [itemId2 ...] [--categories "分类A,分类B"]
 *                               审核通过并发布（写 publishDate + 发批准邮件 + 刷缓存）
 *                               --categories 可选：仅分类门禁不过、其他门禁全过时，一并把 categories
 *                               修正为站内已有分类（按 name 或 slug 匹配，不区分大小写；匹配失败不写库）
 *   reject  <itemId> [itemId2 ...] --reason "具体原因"   打回下架（置 rejected + 理由 + 发打回邮件 + 刷缓存）
 *   hold    <itemId> ... --note "挂起原因"   挂起不打回（保持 pending + note 写入 [HOLD] 标记 + 发管理员
 *                               请示邮件，询问是否新增分类；不发提交者邮件、不改前台状态、不刷缓存。
 *                               note 已含 [HOLD] 标记时跳过，不重复通知）
 *
 * 注意:
 * - 本脚本会真实修改 Sanity 生产数据并向提交者发送邮件，仅在已确认裁决（auto 模式或用户明确指示）时运行！
 * - rejectionReason 建议以站内标准原因开头（如 "The information of the item is not clear."），后接具体整改指引。
 * - 首轮刷缓存后会等待 90 秒再二次刷新：刚写入后立即重渲染会撞上 Sanity CDN 陈旧窗口，
 *   把旧快照重新缓存进 48h fetch cache（实测首页数小时不更新）。
 *
 * 用法示例:
 *   node execute-decision.mjs approve EBLqAT2o5uHnLEVDFdbJJ6
 *   node execute-decision.mjs approve EBLqAT2o5uHnLEVDFdbJJ6 --categories "AI Tools,Writing Tools"
 *   node execute-decision.mjs reject I1kbmy04ocTaAYJfP7Faf3 --reason "The information of the item is not clear. Please provide key features and use cases."
 *   node execute-decision.mjs hold I1kbmy04ocTaAYJfP7Faf3 --note "产品为 XX 类工具，站内无对应分类，请示是否新增"
 */
import {
  config,
  revalidatePath,
  sanityMutate,
  sanityQuery,
  sendAdminEmail,
  sendReviewEmail,
} from "./_lib.mjs";

const args = process.argv.slice(2);
const command = args[0];
const reasonIdx = args.indexOf("--reason");
const reason = reasonIdx !== -1 ? args[reasonIdx + 1] : undefined;
const catIdx = args.indexOf("--categories");
const categoriesArg = catIdx !== -1 ? args[catIdx + 1] : undefined;
const noteIdx = args.indexOf("--note");
const noteArg = noteIdx !== -1 ? args[noteIdx + 1] : undefined;
const withoutBadge = args.includes("--without-badge");
const itemIds = args
  .slice(1)
  .filter(
    (a) =>
      a !== "--reason" &&
      a !== reason &&
      a !== "--categories" &&
      a !== categoriesArg &&
      a !== "--note" &&
      a !== noteArg &&
      a !== "--without-badge",
  );

if (
  !["approve", "reject", "hold"].includes(command) ||
  itemIds.length === 0 ||
  (command === "reject" && !reason) ||
  (command === "reject" && (categoriesArg || noteArg)) ||
  (command !== "hold" && noteArg) ||
  (command === "hold" && (!noteArg || reason || categoriesArg)) ||
  (command === "hold" && noteIdx !== -1 && !noteArg) ||
  (command === "reject" && reason?.toLowerCase().includes("backlink")) ||
  (catIdx !== -1 && !categoriesArg)
) {
  console.error(
    '用法:\n  node execute-decision.mjs approve <itemId>... [--categories "分类A,分类B"] [--without-badge]\n  node execute-decision.mjs reject <itemId>... --reason "具体原因" [--without-badge]\n  node execute-decision.mjs hold <itemId>... --note "挂起原因" [--without-badge]',
  );
  process.exit(1);
}

async function fetchItem(id) {
  if (!/^[a-zA-Z0-9._-]+$/.test(id)) throw new Error("无效条目 ID");
  const items = await sanityQuery(
    `*[_type == "item" && _id == "${id}"][0]{ _id, _rev, name, link, pricePlan, badgeReviewPriority, badgeVerifiedAt, "submitterId": submitter._ref, "slug": slug.current, freePlanStatus, publishDate, note, "categoryNames": categories[]->name, "tagNames": tags[]->name }`,
  );
  return items;
}

/** 批准优先条目前重新探测徽章；网络故障保持在队列，绝不擅自发布。 */
async function hasLiveBadge(link) {
  const url = new URL(link);
  const host = url.hostname.toLowerCase();
  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.port ||
    url.username ||
    url.password ||
    isIP(host) ||
    host === "localhost" ||
    host.endsWith(".local")
  ) {
    throw new Error("站点地址必须是公开 HTTP(S) 域名");
  }
  const resolver = new Resolver();
  const addresses = await Promise.race([
    resolver.resolve4(host),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("DNS 超时")), 8000),
    ),
  ]);
  const privateAddress = (address) => {
    const [a, b, c] = address.split(".").map(Number);
    return (
      a === 0 ||
      a === 10 ||
      a === 127 ||
      a >= 224 ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 192 && b === 0) ||
      (a === 198 && b >= 18 && b <= 19) ||
      (a === 198 && b === 51 && c === 100) ||
      (a === 203 && b === 0 && c === 113)
    );
  };
  if (!addresses.length || addresses.some(privateAddress))
    throw new Error("站点解析到非公网地址");
  const html = await new Promise((resolve, reject) => {
    const request = (url.protocol === "https:" ? https : http).get(
      url,
      {
        lookup: (_host, _options, callback) => callback(null, addresses[0], 4),
        headers: { accept: "text/html", "accept-encoding": "identity" },
      },
      (response) => {
        if (
          response.statusCode !== 200 ||
          !/text\/html/i.test(response.headers["content-type"] || "")
        ) {
          response.resume();
          reject(new Error(`站点响应异常 (${response.statusCode})，保留待审`));
          return;
        }
        const chunks = [];
        let size = 0;
        response.on("data", (chunk) => {
          size += chunk.length;
          if (size > 1024 * 1024) request.destroy(new Error("响应过大"));
          else chunks.push(chunk);
        });
        response.on("end", () =>
          resolve(Buffer.concat(chunks).toString("utf8")),
        );
        response.on("error", reject);
      },
    );
    const timer = setTimeout(
      () => request.destroy(new Error("站点请求超时")),
      8000,
    );
    request.on("close", () => clearTimeout(timer));
    request.on("error", reject);
  });
  if (
    /<title[^>]*>[^<]*(?:captcha|just a moment|checking your browser|access denied)[^<]*<\/title>/i.test(
      html,
    )
  ) {
    throw new Error("站点返回访问验证页面，保留待审");
  }
  const document = parseDocument(html);
  const hidden = (node) => {
    for (let parent = node; parent; parent = parent.parent) {
      const attrs = parent.attribs || {};
      if (
        ["template", "noscript"].includes(parent.name) ||
        "hidden" in attrs ||
        attrs["aria-hidden"] === "true" ||
        /(?:display\s*:\s*none|visibility\s*:\s*hidden)/i.test(
          attrs.style || "",
        )
      )
        return true;
    }
    return false;
  };
  return DomUtils.findAll(
    (node) => node.type === "tag" && node.name === "a",
    document.children,
  ).some((anchor) => {
    try {
      if (hidden(anchor)) return false;
      const href = new URL(anchor.attribs.href, url.href);
      return (
        href.protocol === "https:" &&
        href.hostname === "findryai.com" &&
        (href.pathname === "/" || href.pathname.startsWith("/item/")) &&
        DomUtils.findAll(
          (node) => node.type === "tag" && node.name === "img",
          anchor.children,
        ).some((image) => {
          if (hidden(image)) return false;
          const src = new URL(image.attribs.src, url.href);
          return (
            src.protocol === "https:" &&
            src.hostname === "findryai.com" &&
            [
              "/badge.svg",
              "/badge-dark.svg",
              "/badge-light.svg",
              "/badge-neutral.svg",
            ].includes(src.pathname)
          );
        })
      );
    } catch {
      return false;
    }
  });
}

/** 将 --categories 的分类名解析为站内 category 文档（name 或 slug 匹配，不区分大小写） */
async function resolveCategories(categoriesRaw) {
  const wanted = categoriesRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (wanted.length === 0) {
    throw new Error("--categories 参数为空");
  }
  const cats = await sanityQuery(
    `*[_type == "category"]{ _id, name, "slug": slug.current }`,
  );
  const byKey = new Map();
  for (const c of cats) {
    if (c.name) byKey.set(c.name.toLowerCase(), c);
    if (c.slug) byKey.set(c.slug.toLowerCase(), c);
  }
  const resolved = [];
  const missing = [];
  for (const w of wanted) {
    const hit = byKey.get(w.toLowerCase());
    if (!hit) {
      missing.push(w);
    } else if (!resolved.some((r) => r._id === hit._id)) {
      resolved.push(hit);
    }
  }
  if (missing.length > 0) {
    throw new Error(
      `站内不存在分类: ${missing.join(", ")}（可运行 list-categories.mjs 查看全部分类）`,
    );
  }
  return resolved;
}

/** HTML 转义，防条目名/备注中的特殊字符破坏邮件结构 */
const esc = (s) =>
  String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

/** hold 挂起请示邮件（发管理员，询问是否新增分类） */
function buildHoldEmailHtml(item) {
  const studioUrl = `${config.siteUrl}/studio/intent/edit/id=${item._id};type=item`;
  const itemUrl = `${config.siteUrl}/item/${item.slug}`;
  return `
    <div style="font-family:sans-serif;max-width:560px;line-height:1.6">
      <p>审核挂起通知：以下提交在五道门禁中<strong>仅分类门禁不过</strong>（其他门禁全部达标），
      且站内没有合适分类，已按规则<strong>保持 pending 不打回</strong>，请裁决是否新增分类。</p>
      <ul>
        <li><strong>条目</strong>：${esc(item.name)}</li>
        <li><strong>链接</strong>：<a href="${esc(itemUrl)}">${esc(itemUrl)}</a>（当前未发布）</li>
        <li><strong>当前分类</strong>：${esc(item.categoryNames?.join(", ") || "无")}</li>
        <li><strong>当前标签</strong>：${esc(item.tagNames?.join(", ") || "无")}</li>
        <li><strong>挂起原因</strong>：${esc(noteArg)}</li>
      </ul>
      <p><strong>请处理：</strong></p>
      <ol>
        <li>打开 <a href="${esc(studioUrl)}">Studio 中的该条目</a>，判断是否值得为它新增分类；</li>
        <li>若新增 → 运行 <code>/review-submissions auto</code> 复审，审核会用 <code>--categories</code> 自动归类并批准发布；</li>
        <li>若不值得 → 在 Studio 手动打回，或告知审核流程按不合格打回。</li>
      </ol>
      <p style="color:#666">本邮件由 review-submissions skill 的 hold 命令自动发送；条目 note 字段含 [HOLD] 标记，复审时不会重复通知。</p>
    </div>`;
}

async function main() {
  console.log(`站点: ${config.siteUrl}`);
  console.log(
    `=== 执行裁决: ${command.toUpperCase()}，共 ${itemIds.length} 条 ===\n`,
  );

  // 分类修正：先整体解析，任一分类不存在则不执行任何写操作
  let categoryRefs;
  let categoryNames;
  if (categoriesArg) {
    const resolved = await resolveCategories(categoriesArg);
    categoryRefs = resolved.map((c) => ({
      _type: "reference",
      _ref: c._id,
    }));
    categoryNames = resolved.map((c) => c.name || c.slug).join(", ");
    console.log(`📂 [CATEGORY] 拟修正分类为: ${categoryNames}\n`);
  }

  const results = [];
  const allPaths = new Set();

  for (const id of itemIds) {
    try {
      const item = await fetchItem(id);
      if (!item) {
        console.log(`[SKIP] ${id}: 未找到该条目（可能不是已发布文档）`);
        results.push({ id, ok: false, error: "not found" });
        continue;
      }
      const priority =
        item.badgeReviewPriority === true && Boolean(item.badgeVerifiedAt);
      if (
        !item.submitterId ||
        item.pricePlan !== "free" ||
        item.freePlanStatus !== "pending" ||
        item.publishDate ||
        (withoutBadge ? priority : !priority)
      ) {
        throw new Error("该条目不属于所选待审队列");
      }
      if (command === "approve" && !withoutBadge) {
        const found = await hasLiveBadge(item.link);
        if (!found) {
          await sanityMutate([
            {
              patch: {
                id,
                ifRevisionID: item._rev,
                set: { badgeReviewPriority: false },
                unset: ["badgeVerifiedAt"],
              },
            },
          ]);
          console.log(
            `[QUEUE] ${item.name}: 徽章已移除，转入普通队列，不拒绝、不发布`,
          );
          results.push({ id, ok: true, skipped: true });
          continue;
        }
      }

      // 1. 写库变更
      if (command === "approve") {
        const set = {
          freePlanStatus: "approved",
          publishDate: new Date().toISOString(),
          badgeReviewPriority: !withoutBadge,
        };
        if (categoryRefs) {
          set.categories = categoryRefs;
        }
        await sanityMutate([
          {
            patch: {
              id,
              ifRevisionID: item._rev,
              set,
              ...(withoutBadge ? { unset: ["badgeVerifiedAt"] } : {}),
            },
          },
        ]);
        console.log(
          `✅ [DB] ${item.name} (${id}) -> approved + publishDate=now${categoryRefs ? ` + 分类已修正为「${categoryNames}」` : ""}`,
        );
      } else if (command === "reject") {
        await sanityMutate([
          {
            patch: {
              id,
              ifRevisionID: item._rev,
              set: {
                freePlanStatus: "rejected",
                publishDate: null,
                rejectionReason: reason,
              },
            },
          },
        ]);
        console.log(
          `✅ [DB] ${item.name} (${id}) -> rejected + publishDate=null + reason 已写入`,
        );
      } else {
        // hold：保持 pending，只在 note 追加 [HOLD] 内部标记（不改前台可见状态）
        if (item.note?.includes("[HOLD]")) {
          console.log(
            `⏭️  [HOLD] ${item.name} (${id}): note 已含 [HOLD] 标记，跳过（不重复挂起/通知）`,
          );
          results.push({ id, name: item.name, ok: true, skipped: true });
          continue;
        }
        const stamped = `[HOLD] ${new Date().toISOString()} ${noteArg}`;
        await sanityMutate([
          {
            patch: {
              id,
              set: {
                note: item.note ? `${item.note}\n${stamped}` : stamped,
              },
            },
          },
        ]);
        console.log(
          `📌 [DB] ${item.name} (${id}) -> 保持 pending，note 已追加 [HOLD] 标记`,
        );
      }

      // 2. 发送通知邮件（必须在写库之后，路由按 DB 当前状态决定邮件类型）
      if (command === "hold") {
        const mail = await sendAdminEmail({
          subject: `【Findry审核挂起】${item.name}：请示是否新增分类`,
          html: buildHoldEmailHtml(item),
        });
        console.log(
          `📧 [MAIL-ADMIN] ${item.name}: status=${mail.status} ${mail.data?.message || mail.data?.id || ""}`,
        );
      } else {
        const mail = await sendReviewEmail(id);
        console.log(
          `📧 [MAIL] ${item.name}: status=${mail.status} ${mail.data?.message || ""}`,
        );
      }

      // 3. 刷新相关页面缓存（hold 不改前台可见状态，无需刷新）
      if (command !== "hold") {
        const paths = ["/"];
        if (item.slug) {
          paths.push(`/item/${item.slug}`);
        }
        for (const p of paths) {
          allPaths.add(p);
          const r = await revalidatePath(p);
          console.log(`⚡ [REVALIDATE] ${p}: status=${r.status}`);
        }
      } else {
        console.log("ℹ️ [REVALIDATE] hold 未改前台状态，跳过缓存刷新");
      }

      results.push({ id, name: item.name, ok: true });
    } catch (err) {
      console.log(`[ERROR] ${id}: ${err?.message || err}`);
      results.push({ id, ok: false, error: String(err?.message || err) });
    }
    console.log("");
  }

  // 4. 二次刷新：首轮刷缓存后立即重渲染会撞上 Sanity CDN 对刚写入数据的
  //    陈旧窗口，把旧快照重新缓存进 48h fetch cache（实测首页数小时不更新）。
  //    等待 90 秒（覆盖 CDN ~60s 缓存周期）后再刷一次，确保后续渲染取到新数据。
  if (allPaths.size > 0 && results.some((r) => r.ok)) {
    const delayMs = 90_000;
    console.log(
      `⏳ [WAIT] 等待 ${delayMs / 1000}s 后二次刷新缓存（规避 Sanity CDN 陈旧窗口竞态）...`,
    );
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    for (const p of allPaths) {
      const r = await revalidatePath(p);
      console.log(`⚡ [REVALIDATE-2] ${p}: status=${r.status}`);
    }
    console.log("");
  }

  const okCount = results.filter((r) => r.ok).length;
  console.log(`=== 完成: ${okCount}/${results.length} 条成功 ===`);
  if (okCount < results.length) {
    process.exit(2);
  }
}

main().catch((err) => {
  console.error(`\n[ERROR] 执行中断: ${err?.message || err}`);
  process.exit(2);
});
