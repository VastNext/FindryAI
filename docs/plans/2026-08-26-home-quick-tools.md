# 首页快捷工具实施计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 在首页 Hero 右侧加入符合 Findry AI 视觉系统的三个快捷入口，并保留现有赞助条目。

**Architecture:** 新建静态 `HomeQuickTools` 组件集中定义入口数据并负责单行图标按钮展示；`HomeHeroSponsor` 只负责 Hero 布局和 CMS 赞助数据，将快捷按钮与可选赞助卡片组合为右栏。项目没有测试框架，因此使用 Biome 与 Next.js 构建作为验证门禁。

**Tech Stack:** Next.js 14 App Router、React 18、TypeScript、Tailwind CSS、Lucide React。

---

### Task 1: 创建快捷入口组件

**Files:**
- Create: `src/components/home/home-quick-tools.tsx`

**Step 1: 定义入口数据**

在组件内建立三项只读数组，分别链接 `/search`、`/translator` 和 `/password-generator`，为每项选择语义匹配的 Lucide 图标。

**Step 2: 实现语义化组件**

输出带无障碍名称的 `nav`，用单行弹性布局渲染三个方形 `Link`。每个链接包含图标，并提供明确的 `aria-label`、`title` 与键盘焦点样式。

**Step 3: 检查组件文件**

Run: `pnpm biome check src/components/home/home-quick-tools.tsx`

Expected: 命令退出码为 0，无格式或 lint 错误。

### Task 2: 集成 Hero 右栏

**Files:**
- Modify: `src/components/home/home-hero-sponsor.tsx`

**Step 1: 导入快捷入口组件**

将 `HomeQuickTools` 加入 Hero，并把右侧改成 `w-full lg:w-[400px]` 的纵向容器。

**Step 2: 保留赞助条目**

快捷入口始终渲染；`sponsorItem` 存在时在其下方继续渲染 `SponsorItemCard`。不得修改 CMS 查询或赞助卡片行为。

**Step 3: 检查相关文件**

Run: `pnpm biome check src/components/home/home-quick-tools.tsx src/components/home/home-hero-sponsor.tsx`

Expected: 命令退出码为 0。

### Task 3: 全量验证

**Files:**
- Verify: `src/components/home/home-quick-tools.tsx`
- Verify: `src/components/home/home-hero-sponsor.tsx`

**Step 1: 执行全量 lint**

Run: `pnpm lint`

Expected: Biome 检查通过。

**Step 2: 执行生产构建**

Run: `pnpm build`

Expected: Next.js 构建成功且 TypeScript 无错误。

**Step 3: 提交改动**

只暂存本计划涉及的文档和组件，使用符合仓库惯例的提交信息并推送当前分支。
