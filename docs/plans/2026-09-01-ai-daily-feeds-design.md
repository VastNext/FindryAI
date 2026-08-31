# AI Daily Feeds 设计

## 目标

在 FindryAI 新增英文 `/ai-daily-feeds` 页面，原样复刻 MOGE 的推文精选体验：服务端每日获取并缓存 MOGE 的 Tweet ID，访客浏览器通过 react-tweet 直接渲染推文，非英文内容由 Google Translate Website Element 翻译为英文。

## 产品范围

首版包含：

- 英文 Hero、Metadata 和页面说明；
- All、OpenClaw、Hermes Agent 三个筛选；
- 每类数据从 MOGE 英文页面获取；
- Tweet ID 缓存 24 小时；
- MOGE 失败时使用仓库内置 Tweet ID 快照；
- 首批 20 条，滚动追加 20 条；
- 三列瀑布流与移动单列；
- react-tweet 客户端卡片；
- Google Translate Website Element，只翻译推文区域；
- 返回顶部、加载状态和失败降级；
- Header、Footer、公开路由和 Sitemap 接入。

首版不包含：

- Sanity 或其他数据库写入；
- 推文正文、图片、视频和互动数缓存；
- Vercel Cron；
- 人工审核；
- 自建 X 抓取源；
- 以推文正文为目标的长尾 SEO。

## 数据架构

服务端每日执行一次真实上游刷新：

```text
获取 MOGE 英文 /ai-daily-feeds HTML
  ↓
解析页面 JavaScript 分包
  ↓
自动发现 getDirectoryTweets Server Action ID
  ↓
请求 all / openclaw / hermes 三组 Tweet ID
  ↓
校验数字 ID、数量上限、全局去重
  ↓
通过 unstable_cache 缓存 86400 秒
```

若任一步骤失败：

```text
不返回空数组
  ↓
读取仓库内置 Tweet ID 快照
  ↓
页面继续可用
```

缓存只包含字符串 ID，不包含推文内容或媒体。后续若决定脱离 MOGE，可直接维护和生成同一份快照结构，前端无需改造。

## 前端架构

客户端根据选中标签读取对应 ID：

```text
首批 20 个 ID
  ↓
react-tweet useTweet 请求公开 Tweet API
  ↓
EmbeddedTweet 渲染正文、作者、图片、视频和引用内容
  ↓
InfiniteGrid 测量卡片高度并排成瀑布流
  ↓
距离底部 600px 时追加 20 条
```

单条推文失败时显示英文降级卡片和 `View on X`，不静默消失。

## 英文与翻译

- 页面 UI、Metadata、分类和说明均为原生英文；
- 英文推文保持原文；
- 非英文推文由 Google Translate Website Element 翻译到英文；
- 只允许 Google 修改 `#translate-target`；
- Header、Footer、Hero、筛选和按钮全部 `notranslate`；
- 语言选择保留 Original / English；
- Google 脚本失败时显示原文，页面不可空白。

## SEO

不把异步推文正文作为核心 SEO 内容。页面服务端输出：

- 英文 Title、Description、Canonical 和 Open Graph；
- H1、英文介绍和分类说明；
- `/agent-skills`、`/category`、`/search` 内链；
- CollectionPage 和 BreadcrumbList JSON-LD（不伪造异步推文 ItemList）。

Feed 的核心目标是新鲜度、回访和工具发现，而不是复制 X 内容做长尾排名。

## 免费额度策略

- 每日上游刷新最多一次，不使用 Cron；
- 页面请求命中 Next.js 数据缓存，不重复抓取 MOGE；
- 推文详情、头像、图片和视频由访客浏览器直连第三方；
- 不使用 `next/image` 代理推文媒体；
- 不消耗 Google Cloud Translation API；
- 不产生数据库写入和定时任务调用。

## 验收标准

- 页面显示英文 UI；
- All / OpenClaw / Hermes 切换正确；
- 首批 20 条、滚动后 40 条；
- 桌面三列、移动单列，无横向溢出；
- Tweet ID 缓存失败时仍能使用快照；
- Google Translate 脚本失败时仍显示原文；
- 构建通过；
- Preview 为 `target=preview`、`status=Ready`。
