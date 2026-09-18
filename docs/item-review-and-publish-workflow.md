# 网站审核与自动化发布指南 (AI & CLI 操作流程)

本文档专为 AI 编码助手（如 OpenCode、Claude Code、Cursor 等）及开发者制定，详细规范从**用户提交审查**到**正式发布上线及缓存刷新**的全自动化操作指令。

---

## 核心机制概览

1. **用户提交数据**：用户在前台提交 Free Plan 后，条目数据存入 Sanity，状态为 `freePlanStatus = "pending"`（且无 `publishDate`，带有 `submitter` 关联）。
2. **发布生效标识**：网站前台（首页、分类、搜索）展示的硬性条件是 **`defined(publishDate)` 且 `forceHidden != true`**。
3. **排序逻辑**：首页默认按照 `publishDate desc` 排序，最新发布的条目自动排在第一位。
4. **缓存刷新机制**：发布成功后，通过调用线上安全接口 `/api/revalidate?secret=...&path=/` 秒级清除静态 ISR 与边缘 CDN 缓存。

---

## AI 一键执行工作流

当用户要求 **“帮我审核/发布提交的网站”**、**“把审核通过的网站发布上线”** 时，AI 无需用户手动去 Studio 复杂点选，直接按下列流程执行：

### 场景 1：一键发布所有已审核通过（Approved）的提交

直接在终端执行：
```bash
pnpm item:publish-approved
```

**脚本内部会自动执行以下闭环操作**：
1. 查询 Sanity 中所有符合条件的用户提交：`_type == "item" && defined(submitter) && freePlanStatus == "approved" && !defined(publishDate)`；
2. 为这批条目批量填入当前时间 `publishDate = new Date().toISOString()`；
3. 自动向 `findryai.com/api/revalidate` 发起鉴权请求，刷新首页及 CDN 缓存；
4. 终端返回发布成功的清单与缓存刷新状态。

---

### 场景 2：AI 自动化审核待定提交（Pending -> Approved & Publish）

如果需要 AI 批量查看待审核列表并直接通过发布：

#### 1. 查看当前待审核列表
```bash
npx tsx -e "
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
dotenv.config();

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-08-01',
  useCdn: false,
  perspective: 'published',
  token: process.env.SANITY_API_TOKEN,
});

async function listPending() {
  const items = await client.fetch(
    '*[_type == \"item\" && freePlanStatus == \"pending\"] { _id, name, link, \"submitter\": submitter->name, _createdAt }'
  );
  console.log('待审核条目数:', items.length);
  console.log(JSON.stringify(items, null, 2));
}
listPending();
"
```

#### 2. 通过指定条目并直接上线
（例如审核通过条目 ID 为 `EBLqAT2o5uHnLEVDFdbJJ6`）
```bash
npx tsx -e "
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
dotenv.config();

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-08-01',
  useCdn: false,
  perspective: 'published',
  token: process.env.SANITY_API_TOKEN,
});

async function approveAndPublish(id) {
  const now = new Date().toISOString();
  await client.patch(id).set({ freePlanStatus: 'approved', publishDate: now }).commit();
  console.log('条目已审核并发布:', id);

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://findryai.com';
  const secret = process.env.REVALIDATE_SECRET || process.env.AUTH_SECRET || process.env.SANITY_API_TOKEN;
  await fetch(\`\${siteUrl}/api/revalidate?secret=\${encodeURIComponent(secret)}&path=/\`, { method: 'POST' });
  console.log('首页缓存已刷新！');
}

approveAndPublish('EBLqAT2o5uHnLEVDFdbJJ6');
"
```

---

## 验证与验收指令（AI 必查项）

发布完成后，AI 应通过以下指令验证线上是否已经排在首页最顶部：

1. **直接探测线上主页最新渲染结果**：
   ```bash
   curl -s "https://findryai.com/" | grep -o 'href="/item/[^"]*"' | head -n 10
   ```
2. **穿透缓存探测（验证源站数据）**：
   ```bash
   curl -s "https://findryai.com/?fresh=1" | grep -o 'href="/item/[^"]*"' | head -n 10
   ```
3. **针对单条网页可访问性探测**：
   ```bash
   curl -I -s "https://findryai.com/item/<slug>" | head -n 5
   ```
   *返回 HTTP 200 即代表该条目已成功上线并可公开访问。*

---

## 常见问题与排查

* **Q：为什么在 Studio 里手动修改状态后前台没更新？**
  * **原因**：Studio 中单纯勾选 `Approved` 不会自动写入发布时间 `publishDate`，且线上存在 ISR 静态缓存。
  * **解法**：直接运行 `pnpm item:publish-approved`，脚本会自动补全发布时间并发送缓存刷新指令。
* **Q：Studio 里的 Schedule 按钮提示升级？**
  * **原因**：Schedule 是 Sanity 商业插件，不需要使用。我们的发布流程完全由 `publishDate` 字段和 `pnpm item:publish-approved` 脚本控制，零费用且即时生效。
