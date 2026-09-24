# 网站审核与自动化发布指南 (AI & CLI 操作流程)

> **AI 执行主体**：本流程已封装为 OpenCode skill，位于 `.opencode/skills/review-submissions/`。
> AI 优先按 skill 执行（可用斜杠命令 `/review-submissions` 触发）；本文档是人类可读的参考手册，两者标准保持一致。

本文档面向 AI 编码助手（OpenCode、Claude Code、Cursor 等）及开发者，规范从**用户提交审查**到**正式发布上线及缓存刷新**的全自动化操作流程。

---

## 核心机制概览

1. **用户提交数据**：用户在前台提交 Free Plan 后，条目数据存入 Sanity，状态为 `freePlanStatus = "pending"`（且无 `publishDate`，带有 `submitter` 关联）。
2. **发布生效标识**：网站前台（首页、分类、搜索）展示的硬性条件是 **`defined(publishDate)` 且 `forceHidden != true`**。
3. **排序逻辑**：首页默认按照 `publishDate desc` 排序，最新发布的条目自动排在第一位。
4. **打回闭环**：`rejected` 状态 + `rejectionReason` 字段 + 通知邮件；用户在 `/dashboard` 看到红色 Rejected 标签和原因，修改后点 "Submit to Review" 重新入队。
5. **缓存刷新机制**：任何状态变更后，通过调用线上安全接口 `/api/revalidate?secret=...&path=...` 秒级清除静态 ISR 与边缘 CDN 缓存。

---

## 执行模式开关（重要）

| 模式 | 触发方式 | 行为 |
| :--- | :--- | :--- |
| **报告模式（默认）** | `/review-submissions` 不带参数，且 `.env` 中 `REVIEW_AUTO_EXECUTE` 非 `true` | 只运行只读脚本，输出裁决报告表后**停止**，不做任何写操作 |
| **全自动模式** | `/review-submissions auto`，或 `.env` 中 `REVIEW_AUTO_EXECUTE=true` | 裁决后自动执行 approve/reject、发送邮件、刷新缓存并做线上验收 |

优先级：**命令行参数 `auto` > 环境变量 > 默认报告模式**。切换默认行为只需修改 `.env` 中的 `REVIEW_AUTO_EXECUTE`。

---

## 五道门禁审核标准

AI 对每条提交逐项检查，**全部达标才批准，任一不达标即打回**：

| # | 门禁 | 标准 | 不达标示例 |
|---|------|------|-----------|
| 1 | **联通性** | HTTP 200，非空壳/停放页/博彩灰产/模板垃圾站 | 打不开、跳转赌博站 |
| 2 | **相关性** | 真实的 AI 工具、AI 应用或高质量效率产品 | 与 AI/工具无关的纯个人主页 |
| 3 | **内容深度** | description 是有意义的产品说明（非纯标题复制）；introduction 有结构化内容（功能/场景），**不得与 description 一字不差**；参考线：description ≥80 字符、introduction ≥400 字符 | 一句话应付提交 |
| 4 | **视觉质量** | icon 与截图齐全且清晰（参考线：icon ≥128px、截图宽 ≥1200px） | 16px 模糊小图标、无截图 |
| 5 | **分类准确** | categories/tags 与站内已有体系匹配 | 视频工具挂到 Audio Tools |

**裁决原则**：禁止平台代为润色提交内容——不合格一律打回（reject）并给出具体整改指引，由提交者自己完善后重新提交。

---

## AI 一键执行工作流

### Skill 脚本（推荐）

skill 位于 `.opencode/skills/review-submissions/scripts/`，从项目根目录运行：

```bash
# 1. 拉取待审清单（只读）
node .opencode/skills/review-submissions/scripts/list-pending.mjs

# 2. 探测目标网站（只读，可批量）
node .opencode/skills/review-submissions/scripts/check-site.mjs <url1> <url2>

# 3a. 批准并发布（写操作：approve + publishDate + 批准邮件 + 刷缓存）
node .opencode/skills/review-submissions/scripts/execute-decision.mjs approve <itemId>

# 3b. 打回下架（写操作：rejected + 理由 + 打回邮件 + 刷缓存）
node .opencode/skills/review-submissions/scripts/execute-decision.mjs reject <itemId> --reason "The information of the item is not clear. Please provide key features and use cases."
```

### 一键发布所有已 Approved 但未发布的条目

```bash
pnpm item:publish-approved
```

查询 `defined(submitter) && freePlanStatus == "approved" && !defined(publishDate)` 的条目，批量填入 `publishDate=now` 并自动刷新首页缓存。

---

## 验证与验收指令（AI 必查项）

发布/打回执行完成后，AI 应通过以下指令验证线上状态：

1. **直接探测线上主页最新渲染结果**：
   ```bash
   curl -s "https://findryai.com/" | grep -o 'href="/item/[^"]*"' | head -n 10
   ```
   - approve 的条目应出现在前列；reject 的条目应消失。
2. **穿透缓存探测（验证源站数据）**：
   ```bash
   curl -s "https://findryai.com/?fresh=1" | grep -o 'href="/item/[^"]*"' | head -n 10
   ```
3. **单条页面探测**：
   ```bash
   curl -I -s "https://findryai.com/item/<slug>" | head -n 5
   ```
   返回 HTTP 200 即上线成功。

---

## 技术避坑（已踩坑验证）

1. **代理强制**：本机 Node 直连 `*.api.sanity.io` 会报 `ERR_TLS_CERT_ALTNAME_INVALID`。所有独立脚本必须使用 `node-fetch` + `HttpsProxyAgent("http://127.0.0.1:7890")` 直连 Sanity HTTP API；`@sanity/client` 的自定义 fetch 代理配置在 tsx 脚本中不生效。
2. **邮件 Origin 校验**：`/api/send-email` 校验 Origin/Referer，脚本请求须带 `Origin: https://findryai.com` 头，否则 403。发送邮件前必须先写库变更状态（路由按 DB 当前状态决定发批准信还是打回信）。
3. **Sanity Studio 的 Schedule 功能**是付费企业插件，不使用。发布完全由 `publishDate` 字段控制，零费用即时生效。
4. **Studio 底部 Publish 按钮置灰**是正常现象（无未保存草稿时），与前台是否上线无关。
5. 凭据从项目根 `.env` 读取；revalidate secret 回退链：`REVALIDATE_SECRET → AUTH_SECRET → SANITY_API_TOKEN`。

---

## 常见问题与排查

* **Q：为什么在 Studio 里手动修改状态后前台没更新？**
  * **原因**：Studio 中单纯勾选 `Approved` 不会自动写入发布时间 `publishDate`，且线上存在 ISR 静态缓存。
  * **解法**：运行 `pnpm item:publish-approved`，或使用 skill 的 `execute-decision.mjs approve`，脚本会自动补全发布时间并发送缓存刷新指令。
* **Q：Studio 里的 Schedule 按钮提示升级？**
  * **原因**：Schedule 是 Sanity 商业插件，不需要使用。
