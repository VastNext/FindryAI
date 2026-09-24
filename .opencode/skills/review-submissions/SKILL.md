---
name: review-submissions
description: Review user-submitted websites for the Findry AI directory with five quality gates, then approve+publish or reject them. Use when the user says 检查新提交、审核提交的网站、审查提交、review submissions、approve and publish、打回、reject，或运行 /review-submissions。默认仅输出裁决报告（report-only），需显式 auto 模式才真正执行写操作。
---

# Findry AI 提交审核与发布

自动化处理用户提交到 Findry AI 目录的网站：检查新提交 → 按五道门禁审核 → 出具裁决报告 → （仅 auto 模式）执行批准发布或打回下架。

## 背景机制（执行前必读）

1. **数据流**：用户前台提交 Free Plan 后，条目入 Sanity，`freePlanStatus = "pending"`，无 `publishDate`，带 `submitter` 关联。
2. **上线条件**：前台展示硬性条件是 `defined(publishDate) && forceHidden != true`。首页按 `publishDate desc` 排序，最新发布排最前。
3. **缓存**：生产环境有 48h ISR + CDN 缓存。任何状态变更后必须调用 `/api/revalidate` 刷新，否则前台看不到变化。
4. **打回闭环**：`rejected` 状态 + `rejectionReason` 字段 + 通知邮件；用户在 `/dashboard` 看到红色 Rejected 标签和原因，修改后点 "Submit to Review" 重新入队。

## Step 0: 判定执行模式（必须最先做）

模式优先级：**命令行参数 > 环境变量 > 默认报告模式**

1. 若用户指令或 `/review-submissions` 的 `$ARGUMENTS` 中包含 `auto`（如 "auto"、"全自动"、"执行"）→ **auto 模式**：裁决后自动执行全部写操作。
2. 否则检查项目根 `.env` 中 `REVIEW_AUTO_EXECUTE`（可运行 `grep REVIEW_AUTO_EXECUTE .env`）：
   - 值为 `true` → **auto 模式**
   - 值为 `false` 或未配置 → **报告模式（report-only）**
3. **报告模式铁律**：只运行 `list-pending.mjs` 和 `check-site.mjs`（均为只读），输出裁决报告后**立即停止**。禁止运行 `execute-decision.mjs`，禁止修改 Sanity、发邮件、刷缓存。

## Step 1: 拉取待审清单

```bash
node .opencode/skills/review-submissions/scripts/list-pending.mjs
```

输出每条提交的：ID、名称、链接、提交者、分类标签、icon/截图尺寸、description 及长度、introduction 及长度、introduction 是否与 description 雷同。

无待审提交时告知用户并结束。

## Step 2: 逐条探测目标网站

对每条提交的 `link` 运行（可批量传多个 URL）：

```bash
node .opencode/skills/review-submissions/scripts/check-site.mjs <url1> <url2> ...
```

获取 HTTP 状态码、真实 title、meta description、正文摘要。

## Step 3: 按五道门禁逐条裁决

| # | 门禁 | 标准 | 不达标示例 |
|---|------|------|-----------|
| 1 | **联通性** | HTTP 200，非空壳/停放页/博彩灰产/模板垃圾站 | 打不开、跳转赌博站 |
| 2 | **相关性** | 真实的 AI 工具、AI 应用或高质量效率产品 | 与 AI/工具无关的纯个人主页 |
| 3 | **内容深度** | description 是有意义的产品说明（非纯标题复制）；introduction 有结构化内容（功能/场景），**不得与 description 一字不差**；参考线：description ≥80 字符、introduction ≥400 字符（低于即为薄弱信号，需结合质量判断） | "XX official website, share ideas" 一句话应付 |
| 4 | **视觉质量** | icon 与截图齐全且清晰（参考线：icon ≥128px、截图宽 ≥1200px） | 16px 模糊小图标、无截图 |
| 5 | **分类准确** | categories/tags 与站内已有体系匹配、与产品功能对应 | 把视频工具挂到 Audio Tools |

**裁决规则**：
- 五项全部达标 → **approve**（批准并发布）
- 任一项不达标 → **reject**（打回），`rejectionReason` 以站内标准原因开头 + 具体整改指引：
  - 内容问题 → `The information of the item is not clear. ` + 具体要求（如 "Please provide a detailed overview, key features, and use cases."）
  - 图片问题 → `The image of the item is not in good quality.` / `The icon of the item is not in good quality.`
  - 无关/不可用 → `The item is not good fit for our directory.`
  - 无反链 → `The backlink to our site is not provided.`
- **禁止平台代为润色提交内容**——不合格一律打回，由提交者自己完善（防止低质提交泛滥）。

## Step 4: 输出裁决报告（两种模式都必做）

以表格输出：条目名 / 链接 / 联通性 / 内容深度评估 / 视觉资产 / 分类 / **建议裁决（approve 或 reject + 理由）**。

- 报告模式：到此结束，明确告知用户"本次为报告模式，未做任何变更；确认后可运行 `/review-submissions auto` 执行"。
- auto 模式：继续 Step 5。

## Step 5: 执行裁决（仅 auto 模式）

```bash
# 批准并发布（写 publishDate + 发批准邮件 + 刷缓存）
node .opencode/skills/review-submissions/scripts/execute-decision.mjs approve <id1> <id2>

# 打回下架（置 rejected + 理由 + 发打回邮件 + 刷缓存）
node .opencode/skills/review-submissions/scripts/execute-decision.mjs reject <id1> --reason "The information of the item is not clear. Please provide..."
```

脚本内部顺序固定：写库 → 发邮件（必须先写库，邮件路由按 DB 状态决定信件类型）→ 刷 `/` 与 `/item/<slug>` 缓存。

## Step 6: 线上验收（仅 auto 模式，执行后必做）

```bash
curl -s "https://findryai.com/" | grep -o 'href="/item/[^"]*"' | head -n 10
```

- approve 的条目应出现在首页前列；reject 的条目应从首页消失。
- 单条页面探测：`curl -I -s "https://findryai.com/item/<slug>" | head -n 5` 返回 200 即上线成功（reject 后应为 404 或不可见）。

最后向用户汇报执行结果汇总表。

## 技术避坑（已踩坑验证，勿绕开）

1. **代理强制**：本机 Node 直连 `*.api.sanity.io` 报 `ERR_TLS_CERT_ALTNAME_INVALID`。所有脚本已内置代理 `http://127.0.0.1:7890`（`_lib.mjs`）。不要用 `@sanity/client` 写新的独立脚本——其自定义 fetch 代理配置在 tsx 脚本中不生效。
2. **邮件 Origin 校验**：`/api/send-email` 校验 Origin/Referer，脚本已带 `Origin: https://findryai.com` 头；手动 curl 调用必须带同样头，否则 403。
3. **Sanity Studio 的 Schedule 功能**是付费企业插件，不用它。发布完全由 `publishDate` 字段 + 本 skill 控制，零费用即时生效。
4. **Studio 底部 Publish 按钮置灰**是正常的（无未保存草稿时），与前台是否上线无关。
5. **批量发布已 Approved 但未发布的条目**可用现成命令：`pnpm item:publish-approved`（等价于对 `defined(submitter) && freePlanStatus=="approved" && !defined(publishDate)` 批量 approve）。
6. 凭据从项目根 `.env` 读取；revalidate secret 回退链：`REVALIDATE_SECRET → AUTH_SECRET → SANITY_API_TOKEN`。
