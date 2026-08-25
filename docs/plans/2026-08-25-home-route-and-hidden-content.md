# 首页路由替换与内容入口隐藏实施计划

> **执行要求：** 使用 `superpowers:executing-plans`，按任务逐项实施。

**目标：** 将 Home3 的无限滚动体验设为规范首页，同时保留 Category 页面，并从导航与 sitemap 隐藏 Collection 和 Blog。

**架构：** 将现有 Home3 布局与页面行为迁入根首页路由，并在 Next.js 配置层将 `/home3` 永久重定向到 `/`，让旧链接在页面渲染前返回真实的 HTTP 308。只移除 Collection 与 Blog 的公开发现入口，其路由实现和公开访问能力保持不变。

**技术栈：** Next.js 14 App Router、React Server Components、TypeScript、Sanity、Biome、pnpm。

---

### 任务一：将 Home3 提升为根首页

**文件：**

- 修改：`src/app/(website)/(public)/(home)/layout.tsx`
- 修改：`src/app/(website)/(public)/(home)/page.tsx`
- 修改：`src/components/home/home-hero-sponsor.tsx`
- 修改：`src/components/home/home-infinite-scroll.tsx`
- 修改：`src/middleware.ts`
- 修改：`src/routes.ts`
- 修改：`src/app/api/items/route.ts`
- 修改：`next.config.mjs`
- 删除：`src/app/(website)/(public)/(test)/home3/layout.tsx`
- 删除：`src/app/(website)/(public)/(test)/home3/page.tsx`

**步骤一：替换根首页布局**

在根首页使用现有 Home3 布局组合。保留 `HomeHeroSponsor` 和 Home3 搜索筛选器，将筛选器及 Hero 搜索框的 `urlPrefix` 设为 `/`。

**步骤二：替换根首页页面**

在根首页复用 Home3 的数据加载与 `Home3InfiniteScroll` 渲染。canonical URL 保持 `${siteConfig.url}/`，保留全部搜索与筛选参数。

**步骤三：配置 `/home3` 永久重定向**

在 `next.config.mjs` 的 `redirects()` 中配置：

```js
{
  source: "/home3",
  destination: "/",
  permanent: true,
}
```

删除旧 Home3 页面和布局，避免重复页面实现。Next.js 配置重定向会保留原请求查询参数。

首页不再发布 `/?page=N` 分页 sitemap URL；遗留分页 URL 由中间件永久重定向到保留其他筛选条件的第一页，避免无限滚动从中间页开始后漏掉前序条目。

**步骤四：运行聚焦检查**

```bash
pnpm exec biome check "src/app/(website)/(public)/(home)/layout.tsx" "src/app/(website)/(public)/(home)/page.tsx" "src/components/home/home-hero-sponsor.tsx" "src/components/home/home-infinite-scroll.tsx" "src/app/api/items/route.ts" src/middleware.ts src/routes.ts next.config.mjs
```

预期：所有相关文件通过检查。

### 任务二：隐藏公开导航入口

**文件：**

- 修改：`src/config/marketing.ts`
- 修改：`src/config/footer.ts`

**步骤一：精简主导航**

移除 Home3、Collection 和 Blog 菜单对象。Search、Category、Tag、Pricing、Submit 和 Studio 保持原有顺序。

**步骤二：精简页脚**

从 Product 移除 Collection，从 Resources 移除 Blog；Pages 分组中的三个链接均指向 Home3 或 Collection，因此删除整个 Pages 分组。

**步骤三：运行聚焦检查**

```bash
pnpm exec biome check src/config/marketing.ts src/config/footer.ts
```

预期：两个配置文件均通过检查。

### 任务三：从 sitemap 移除 Collection 和 Blog

**文件：**

- 修改：`src/app/sitemap.ts`

**步骤一：移除隐藏的静态路由**

从 `sitemapRoutes` 删除 `collection` 和 `blog`。

**步骤二：移除隐藏内容查询**

删除 Collection 与 Blog 的 sitemap 结果类型、查询导入、Sanity 请求、结果变量、日志和 URL 生成循环。Item、Category、Tag 与 CMS Page 的 sitemap 生成逻辑保持不变。

**步骤三：运行聚焦检查**

```bash
pnpm exec biome check src/app/sitemap.ts
```

预期：文件通过检查，且不存在 Collection 或 Blog sitemap 查询引用。

### 任务四：验证、审查、提交和推送

**步骤一：运行仓库检查**

```bash
pnpm lint
pnpm build
```

预期：生产构建成功；若全仓 lint 被既有非任务诊断阻塞，记录完整证据，并确保所有本次修改文件的聚焦 Biome 检查通过。

**步骤二：验证路由和发现入口**

启动生产服务器并核验：

- `/` 渲染 Home3 Hero、筛选器和无限滚动列表。
- `/category` 仍渲染 Category 标题、分类筛选器和分页列表。
- `/home3` 返回指向 `/` 的 HTTP 308，并保留原查询参数。
- 桌面/移动导航及页脚不含 Home3、Collection 或 Blog 入口。
- `/sitemap.xml` 不含 `/collection` 或 `/blog` URL。
- 直接访问 `/collection` 与 `/blog` 仍然可用。

**步骤三：审查 diff**

检查 `git status`、`git diff` 和近期提交，确保 `.ebuilder.state.json` 及其他无关改动没有进入暂存区。

**步骤四：提交并推送**

仅暂存实施与计划文件，提交信息为：

```bash
git commit -m "feat(home): promote infinite scroll layout"
```

推送当前分支并确认远端接收成功。
