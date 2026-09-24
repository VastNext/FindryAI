/**
 * 执行审核裁决（写操作！）
 *
 * 子命令:
 *   approve <itemId> [itemId2 ...]           审核通过并发布（写 publishDate + 发批准邮件 + 刷缓存）
 *   reject  <itemId> [itemId2 ...] --reason "具体原因"   打回下架（置 rejected + 理由 + 发打回邮件 + 刷缓存）
 *
 * 注意:
 * - 本脚本会真实修改 Sanity 生产数据并向提交者发送邮件，仅在已确认裁决（auto 模式或用户明确指示）时运行！
 * - rejectionReason 建议以站内标准原因开头（如 "The information of the item is not clear."），后接具体整改指引。
 *
 * 用法示例:
 *   node execute-decision.mjs approve EBLqAT2o5uHnLEVDFdbJJ6
 *   node execute-decision.mjs reject I1kbmy04ocTaAYJfP7Faf3 --reason "The information of the item is not clear. Please provide key features and use cases."
 */
import {
  config,
  revalidatePath,
  sanityMutate,
  sanityQuery,
  sendReviewEmail,
} from "./_lib.mjs";

const args = process.argv.slice(2);
const command = args[0];
const reasonIdx = args.indexOf("--reason");
const reason = reasonIdx !== -1 ? args[reasonIdx + 1] : undefined;
const itemIds = args.slice(1).filter((a) => a !== "--reason" && a !== reason);

if (
  !["approve", "reject"].includes(command) ||
  itemIds.length === 0 ||
  (command === "reject" && !reason)
) {
  console.error(
    '用法:\n  node execute-decision.mjs approve <itemId>...\n  node execute-decision.mjs reject <itemId>... --reason "具体原因"',
  );
  process.exit(1);
}

async function fetchItem(id) {
  const items = await sanityQuery(
    `*[_type == "item" && _id == "${id}"][0]{ _id, name, "slug": slug.current, freePlanStatus, publishDate }`,
  );
  return items;
}

async function main() {
  console.log(`站点: ${config.siteUrl}`);
  console.log(
    `=== 执行裁决: ${command.toUpperCase()}，共 ${itemIds.length} 条 ===\n`,
  );

  const results = [];

  for (const id of itemIds) {
    try {
      const item = await fetchItem(id);
      if (!item) {
        console.log(`[SKIP] ${id}: 未找到该条目（可能不是已发布文档）`);
        results.push({ id, ok: false, error: "not found" });
        continue;
      }

      // 1. 写库变更
      if (command === "approve") {
        await sanityMutate([
          {
            patch: {
              id,
              set: {
                freePlanStatus: "approved",
                publishDate: new Date().toISOString(),
              },
            },
          },
        ]);
        console.log(
          `✅ [DB] ${item.name} (${id}) -> approved + publishDate=now`,
        );
      } else {
        await sanityMutate([
          {
            patch: {
              id,
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
      }

      // 2. 发送通知邮件（必须在写库之后，路由按 DB 当前状态决定邮件类型）
      const mail = await sendReviewEmail(id);
      console.log(
        `📧 [MAIL] ${item.name}: status=${mail.status} ${mail.data?.message || ""}`,
      );

      // 3. 刷新相关页面缓存
      const paths = ["/"];
      if (item.slug) {
        paths.push(`/item/${item.slug}`);
      }
      for (const p of paths) {
        const r = await revalidatePath(p);
        console.log(`⚡ [REVALIDATE] ${p}: status=${r.status}`);
      }

      results.push({ id, name: item.name, ok: true });
    } catch (err) {
      console.log(`[ERROR] ${id}: ${err?.message || err}`);
      results.push({ id, ok: false, error: String(err?.message || err) });
    }
    console.log("");
  }

  const okCount = results.filter((r) => r.ok).length;
  console.log(`=== 完成: ${okCount}/${results.length} 条成功 ===`);
  if (okCount < results.length) {
    process.exit(2);
  }
}

main();
