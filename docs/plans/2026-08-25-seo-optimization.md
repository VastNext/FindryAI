# SEO 问题修复实施计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 修复 SEO 报告中的全部可执行问题，使分页内容可抓取、分页服务端渲染正确，并补齐可靠的元数据、结构化数据和图片属性。

**Architecture:** 保留现有 App Router 与 `constructMetadata` 入口，只修正其标题和 robots 语义；新增一个只负责安全序列化的 `JsonLd` 组件，Schema 数据由使用页面就地构造。分页继续使用现有客户端组件，但所有导航目标都输出为真实链接。

**Tech Stack:** Next.js 14 App Router、React 18、TypeScript、Sanity、Biome

---

### Task 1: 恢复可抓取分页并修复首页分页 SSR

**Files:**
- Modify: `src/components/ui/pagination.tsx`
- Modify: `src/components/shared/pagination.tsx`
- Modify: `src/app/(website)/(public)/(home)/page.tsx`

**Step 1: 建立真实分页 URL**

在共享分页组件中新增 URL 构造函数：复制当前 `searchParams`，更新 `page`，返回 `${routePrefix}?${params}`。为上一页、页码和下一页都传入 `href`，移除仅依赖 `onClick` 与 `router.push` 的跳转。

**Step 2: 恢复锚点语义**

让 UI 层的 `PaginationLink` 使用 Next.js `Link`，保留现有按钮样式，并恢复 `aria-current={isActive ? "page" : undefined}`。禁用边界按钮使用 `aria-disabled` 与现有不可点击样式，但仍输出合法边界 URL。

**Step 3: 解析首页页码**

从首页 `searchParams.page` 读取首个字符串值；仅接受大于等于 1 的整数，否则回退到 1。将结果传给 `getItems` 和 `HomeInfiniteScroll.initialPage`。

**Step 4: 定向检查**

Run: `pnpm exec biome check src/components/ui/pagination.tsx src/components/shared/pagination.tsx "src/app/(website)/(public)/(home)/page.tsx"`

Expected: 命令退出码为 0，且分页实现不存在无 `href` 的 `PaginationLink` 调用。

**Step 5: Commit**

```bash
git add src/components/ui/pagination.tsx src/components/shared/pagination.tsx "src/app/(website)/(public)/(home)/page.tsx"
git commit -m "fix(seo): make paginated content crawlable"
```

### Task 2: 修正标题继承、搜索索引与 Sitemap

**Files:**
- Modify: `src/lib/metadata.ts`
- Modify: `src/app/(website)/layout.tsx`
- Modify: `src/app/(website)/(public)/(home)/page.tsx`
- Modify: `src/app/(website)/(public)/search/page.tsx`
- Modify: `src/app/sitemap.ts`

**Step 1: 改为 Next.js 标题模板**

删除 `constructMetadata` 中的站名字符串拼接。普通标题直接返回调用方提供的值；根布局在 helper 返回结果上覆盖：

```ts
title: {
  default: siteConfig.name,
  template: `%s | ${siteConfig.name}`,
}
```

首页传入 `title: { absolute: siteConfig.name }`，因此不套用模板。相应地将 helper 的 `title` 参数类型扩展为 `Metadata["title"]`，OpenGraph/Twitter 使用可序列化字符串标题。

**Step 2: 修正 robots 语义**

`noIndex` 为真时输出 `robots: { index: false, follow: true }`。搜索页传入 `noIndex: true`。

**Step 3: 清理 Sitemap**

从静态路由数组移除 `/search`、`/auth/login` 和 `/auth/register`，保留内容型页面。

**Step 4: 定向检查**

Run: `pnpm exec biome check src/lib/metadata.ts "src/app/(website)/layout.tsx" "src/app/(website)/(public)/(home)/page.tsx" "src/app/(website)/(public)/search/page.tsx" src/app/sitemap.ts`

Expected: 命令退出码为 0；源码中不再存在 `${title} - ${siteConfig.name}`，Sitemap 静态路由不包含 search/auth。

**Step 5: Commit**

```bash
git add src/lib/metadata.ts "src/app/(website)/layout.tsx" "src/app/(website)/(public)/(home)/page.tsx" "src/app/(website)/(public)/search/page.tsx" src/app/sitemap.ts
git commit -m "fix(seo): normalize metadata and sitemap"
```

### Task 3: 增加结构化数据

**Files:**
- Create: `src/components/shared/json-ld.tsx`
- Modify: `src/app/(website)/layout.tsx`
- Modify: `src/app/(website)/(public)/item/[slug]/page.tsx`
- Modify: `src/app/(website)/(public)/blog/[slug]/page.tsx`

**Step 1: 创建安全 JSON-LD 输出组件**

组件接受 `Record<string, unknown> | Record<string, unknown>[]`，用 `JSON.stringify(data).replace(/</g, "\\u003c")` 序列化，并输出 `type="application/ld+json"` 的脚本。

**Step 2: 输出全局 WebSite Schema**

根布局输出 `WebSite`，包含站名、URL、描述和指向 `${siteConfig.url}/search?q={search_term_string}` 的 `SearchAction`。

**Step 3: 输出工具详情 Schema**

工具页输出一个数组：

- `SoftwareApplication`：名称、描述、详情 URL、外部应用 URL、图片、`applicationCategory`、`operatingSystem: "Web"`、发布日期和基于 `pricePlan` 的 Offer 描述。
- `BreadcrumbList`：Home、首个类别（若存在）、当前工具。

不输出评分或虚构价格数值。

**Step 4: 输出博客详情 Schema**

博客页输出一个数组：

- `BlogPosting`：标题、摘要、详情 URL、图片、发布日期、修改日期、作者和发布者。
- `BreadcrumbList`：Home、Blog、当前文章。

**Step 5: 定向检查**

Run: `pnpm exec biome check src/components/shared/json-ld.tsx "src/app/(website)/layout.tsx" "src/app/(website)/(public)/item/[slug]/page.tsx" "src/app/(website)/(public)/blog/[slug]/page.tsx"`

Expected: 命令退出码为 0；三个页面层级均包含 `application/ld+json` 输出，且 Schema 不包含评分字段。

**Step 6: Commit**

```bash
git add src/components/shared/json-ld.tsx "src/app/(website)/layout.tsx" "src/app/(website)/(public)/item/[slug]/page.tsx" "src/app/(website)/(public)/blog/[slug]/page.tsx"
git commit -m "feat(seo): add structured data"
```

### Task 4: 修正 MDX 图片属性

**Files:**
- Modify: `src/components/shared/custom-mdx.tsx`

**Step 1: 修正原生图片映射**

为原生 `img` 映射增加 `loading="lazy"`，直接传递内容中的 `alt`，不再回退为 `Image`。

**Step 2: 修正自定义 Image 映射**

显式解构并传递 `alt`，增加 `loading="lazy"`，移除 `alt="image"` 和对应 Biome 忽略注释。缺失 alt 时保持为空字符串，以满足 HTML 可访问性要求但不伪造内容。

**Step 3: 定向检查**

Run: `pnpm exec biome check src/components/shared/custom-mdx.tsx`

Expected: 命令退出码为 0；文件不再包含 `alt="image"`、`alt || "Image"`，两种图片映射都启用 lazy loading。

**Step 4: Commit**

```bash
git add src/components/shared/custom-mdx.tsx
git commit -m "fix(seo): improve MDX image semantics"
```

### Task 5: 完整验证与交付

**Files:**
- Review: 本计划涉及的全部源码文件

**Step 1: 逐项核对 SEO 报告**

确认：分页链接、首页 SSR、JSON-LD、标题模板、Sitemap/搜索 robots、MDX 图片六组问题均有对应改动；不修改报告标记为正确的 H 标签映射。

**Step 2: 运行完整 lint**

Run: `pnpm lint`

Expected: 退出码为 0。

**Step 3: 运行生产构建**

Run: `pnpm build`

Expected: Next.js 构建完成且退出码为 0。

**Step 4: 审查提交范围**

Run: `git status --short && git diff main...HEAD --check && git diff --stat main...HEAD`

Expected: SEO 源码和计划文档均已提交；`docs/seo-optimization-report.md` 与 `tmp-shots` 并行改动未被暂存或提交。

**Step 5: 推送分支**

Run: `git push -u origin fix/seo-optimization`

Expected: 远端分支创建成功并设置 upstream。
