# AI Daily Feeds Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 在 FindryAI 交付英文 AI 推文精选页面，使用 MOGE Tweet ID 每日缓存、浏览器 react-tweet 渲染和 Google Translate 翻译。

**Architecture:** 服务端模块自动发现 MOGE Server Action 并通过 `unstable_cache` 缓存三组 ID 24 小时，失败时回退到仓库快照。客户端使用 react-tweet 与 InfiniteGrid 渲染和分页，不代理正文与媒体。

**Tech Stack:** Next.js 14 App Router、React 18、TypeScript、Tailwind CSS、react-tweet、@egjs/react-infinitegrid、Google Translate Website Element。

---

### Task 1: 上游解析与快照

**Files:**
- Create: `src/lib/tweet-feed.ts`
- Create: `src/data/tweet-feed-fallback.ts`
- Create: `scripts/sync-tweet-feed.ts`
- Modify: `package.json`

1. 自动发现 `getDirectoryTweets` Server Action ID。
2. 请求 all/openclaw/hermes ID。
3. 校验、去重和限制数组大小。
4. 使用 `unstable_cache` 缓存 86400 秒。
5. 实现失败回退。
6. 生成首版快照。

### Task 2: 推文卡片与瀑布流

**Files:**
- Create: `src/components/tweet-feed/tweet-card.tsx`
- Create: `src/components/tweet-feed/tweet-grid.tsx`
- Create: `src/components/tweet-feed/tweet-feed-view.tsx`
- Create: `src/components/tweet-feed/back-to-top.tsx`

1. 使用 react-tweet `useTweet` 和 `EmbeddedTweet`。
2. 实现 Skeleton 和英文失败降级卡。
3. 使用 InfiniteGrid 首批/追加 20 条。
4. 实现标签切换和 URL 查询参数。
5. 实现返回顶部。

### Task 3: Google Translate

**Files:**
- Create: `src/components/tweet-feed/tweet-translator.tsx`

1. 动态加载 Website Element。
2. 只翻译 `#translate-target`。
3. 提供 Original / English 选择。
4. 持久化选择并处理动态追加内容。
5. 失败时保留原文。

### Task 4: 页面与全站接入

**Files:**
- Create: `src/app/(website)/(public)/ai-daily-feeds/page.tsx`
- Create: `src/app/(website)/(public)/ai-daily-feeds/loading.tsx`
- Modify: `src/routes.ts`
- Modify: `src/config/marketing.ts`
- Modify: `src/config/footer.ts`
- Modify: `src/app/sitemap.ts`
- Modify: `src/components/icons/icons.tsx`

1. 添加英文 Metadata、Hero、分类说明和内部链接。
2. 接入公开路由、Header、Footer 与 Sitemap。
3. 添加 loading 状态。

### Task 5: 验证与 Preview

1. 运行 ID 同步脚本并校验快照。
2. 运行 `pnpm build`。
3. 用代理浏览器先过 Google 门禁。
4. 桌面/移动验证真实推文、筛选、追加和翻译失败降级。
5. Reviewer 审查 diff 与证据。
6. 精确提交、推送功能分支。
7. 部署 Vercel Preview 并 inspect Ready。
