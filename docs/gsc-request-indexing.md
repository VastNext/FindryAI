# GSC 请求索引自动化（gsc-request-indexing.sh）

用 opencli 驱动浏览器，把 URL 提交到 Google Search Console 的「请求编入索引」（URL Inspection → Request Indexing），替代手动逐条操作。

## 用法

```bash
# 单个 URL
bash scripts/gsc-request-indexing.sh https://findryai.com/blog/vidu-q4-preview

# 批量（按顺序逐个提交）
bash scripts/gsc-request-indexing.sh <url1> <url2> <url3>

# npm 快捷命令（等价）
pnpm gsc:index <url1> <url2>

# 只验证环境（会话登录态 + 配置），不提交、不消耗每日配额
bash scripts/gsc-request-indexing.sh --check
```

- URL 必须以 `https://` 开头；退出码 0 = 全部成功，1 = 有失败（看日志定位）。
- 单个 URL 约 1.5~4.5 分钟（GSC 实时测试占大头），批量 7 个实测约 17 分钟。

## 配置

| 变量 | 必填 | 说明 |
| --- | --- | --- |
| `GSC_RESOURCE_ID` | 是 | GSC 属性。域属性写 `sc-domain:findryai.com`，URL 前缀属性写 `https://findryai.com/`。本地已写入 `.env`（仓库样例见 `.env.example`），环境变量优先于 `.env` |
| `OPENCLI_SESSION` | 否 | opencli 浏览器会话名，默认 `gsc` |
| `GSC_TEXT_REQUEST` | 否 | 检查结果按钮文案，默认 `REQUEST INDEXING` |
| `GSC_TEXT_SUCCESS` | 否 | 成功横幅文案，默认 `priority crawl queue` |

## 前置条件

1. `opencli` CLI：`npm i -g @jackwener/opencli`
2. `node`（脚本用做 JSON 解析）
3. **opencli 会话已登录 Google**，且该账号对目标属性有 GSC 权限。脚本启动时会自动打开 GSC 属性页检查；未登录/无权限会截图到 `tmp-shots/gsc-setup-fail.png` 并退出，此时手动在浏览器里完成一次 Google 登录即可。

## 脚本内部流程

对每个 URL 依次执行（2026-10-10 实测 7/7 成功的配方）：

1. 把 URL 输入 GSC 顶栏检查框（`input[role='combobox'][aria-label*='Inspect any URL']`）
2. **点击输入框旁的 Search 按钮触发检查**（见下方坑位说明）
3. 等待检查面板切换到该 URL（`wait text "<slug>"`）
4. 等待 `REQUEST INDEXING` 按钮出现，点击
5. GSC 弹出「Testing if live URL can be indexed」实时测试（1~2 分钟）
6. 轮询成功横幅 `priority crawl queue`（每 40s 一次；部分 URL 需要补一次确认点击，脚本自动处理）
7. 见到绿色「Indexing requested — URL was added to a priority crawl queue」即成功

## 已知坑位（改脚本前必读）

- **顶栏检查框吃合成输入但不触发检查**：opencli 的 `type`/`keys Enter`/`ArrowDown`/React 合成事件都无法触发，必须输入后**点击 `button[aria-label='Search']`**。
- **深链不可用**：`search.google.com/search-console/inspect?...` 返回 Google 404，不要走 URL 直达路线。
- **UI 语言**：脚本匹配英文文案。若 GSC 界面为其他语言，用 `GSC_TEXT_REQUEST` / `GSC_TEXT_SUCCESS` 覆盖对应文字。
- **每日配额**：GSC 限制约 10 条/天/属性（Google 不公布精确值），超出会在 UI 层被拒。脚本不计数，批量控制在 10 条以内。
- 请求索引只保证进入优先抓取队列，**不保证收录**。

## 失败排查

- 每步结果带时间戳输出；URL 提交后等不到成功横幅时，自动截图到 `tmp-shots/gsc-fail-<slug>.png`，最后汇总 `N/M submitted`。
- 常见失败：会话登录过期（重新在浏览器登录一次）、GSC 界面语言非英文（见上文覆盖变量）、当日配额用尽（次日再跑）。

## 关联：内容发布后的完整链路

新增/修改站点内容（Sanity 直写）后，推荐顺序：

| 步骤 | 命令 | 说明 |
| --- | --- | --- |
| 1. 刷 Next ISR | `GET /api/revalidate?secret=<AUTH_SECRET>&path=<路径>` | 逐路径刷：`/`、`/blog`、`/item/<slug>`、`/blog/<slug>` |
| 2. 刷 Cloudflare 边缘 | CF API `purge_cache`（`CF_TOKEN_ZONE`，须走代理 `https_proxy=http://127.0.0.1:7890`） | revalidate 只清 Next 层，CF 边缘 HTML 缓存 4h~48h，须定向 purge 受影响 URL |
| 3. sitemap | 无需操作 | 动态路由（sanityFetch revalidate 300），几分钟自动收录新 URL |
| 4. 请求索引 | `pnpm gsc:index <url>...` | 本文档脚本 |
