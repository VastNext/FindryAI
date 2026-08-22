# 搜索页布局调整实施计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 将 `/search` 的搜索框移到筛选器上方，保留 `Search` 标题并删除副标题，同时延续 `/home2` 搜索框样式。

**Architecture:** 抽取可复用的搜索框组件，让 Home2 与搜索页共享视觉和提交行为。搜索页布局负责标题、搜索框、筛选器和结果区的排列；搜索框通过当前 URL 参数构造下一次搜索地址，保留筛选条件并移除分页参数。

**Tech Stack:** Next.js 14 App Router、React、TypeScript、Tailwind CSS、shadcn/ui、Biome

---

### Task 1: 复用搜索框并调整搜索页布局

**Files:**
- Create: `src/components/search/search-box.tsx`
- Modify: `src/components/home2/home2-search-box.tsx`
- Modify: `src/app/(website)/(public)/search/layout.tsx`

**Step 1: 创建共享搜索框**

实现受现有 `/home2` 样式约束的客户端表单：移动端宽度为 `w-full`，桌面端最大宽度为 `640px`；提交时保留当前查询参数，更新 `q` 并删除 `page`。

**Step 2: 让 Home2 复用共享组件**

保留 Home2 的默认空关键词行为和 `/search` 目标地址，移除重复实现。

**Step 3: 调整搜索页布局**

将 `Search` 渲染为单一 `h1`，删除 `Search anything you want`，随后依次渲染共享搜索框、现有筛选器和结果内容。

**Step 4: 运行静态检查**

Run: `pnpm exec biome check src/components/search/search-box.tsx src/components/home2/home2-search-box.tsx "src/app/(website)/(public)/search/layout.tsx"`

Expected: `Checked 3 files` 且无错误。

**Step 5: 提交实现**

```bash
git add src/components/search/search-box.tsx src/components/home2/home2-search-box.tsx "src/app/(website)/(public)/search/layout.tsx"
git commit -m "feat(search): prioritize the search input"
```

### Task 2: 验证页面行为和视觉布局

**Files:**
- Verify: `src/app/(website)/(public)/search/layout.tsx`
- Verify: `src/components/search/search-box.tsx`

**Step 1: 运行生产构建**

Run: `pnpm build`

Expected: Next.js 构建成功且无 TypeScript 错误。

**Step 2: 启动页面并进行浏览器验证**

检查桌面和移动视口：首页导航下依次出现 `Search`、搜索框、筛选器、结果；搜索框不溢出。

**Step 3: 验证查询参数**

从带 `category`、`tag`、`sort`、`f` 和 `page` 的搜索 URL 提交关键词，确认前四项保留、`q` 更新、`page` 移除。

**Step 4: 如视觉验证引发修正，立即提交**

```bash
git add <本次修正文件>
git commit -m "fix(search): refine the search page layout"
```
