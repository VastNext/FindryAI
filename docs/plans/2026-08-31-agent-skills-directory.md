# Agent Skills Directory Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 在 FindryAI 中交付使用公开静态数据的 `/agent-skills` 策展目录，并生成可验收的 Vercel Preview。

**Architecture:** 服务端页面读取仓库内类型安全的静态分组数据，客户端目录组件只负责搜索和滚动联动。页面复用 FindryAI 现有设计与全站布局，不引入数据库、API 或第三方运行时依赖。

**Tech Stack:** Next.js 14 App Router、React 18、TypeScript、Tailwind CSS、Lucide React。

---

### Task 1: 静态数据与类型

**Files:**
- Create: `src/data/agent-skills.ts`

1. 从已抓取的公开 MOGE HTML 生成 17 个分组的静态数据。
2. 去除 `utm_source=moge.ai`。
3. 定义 `AgentSkill` 与 `AgentSkillGroup` 类型。
4. 验证分组数、条目数和 URL 去重。

### Task 2: 页面组件

**Files:**
- Create: `src/components/agent-skill/agent-skill-card.tsx`
- Create: `src/components/agent-skill/agent-skill-directory.tsx`

1. 实现轻量外链卡片。
2. 实现搜索过滤和空状态。
3. 实现桌面粘性分类导航。
4. 实现分类平滑滚动和滚动联动高亮。
5. 实现 2/3/4/5 列响应式网格。

### Task 3: 路由与全站接入

**Files:**
- Create: `src/app/(website)/(public)/agent-skills/page.tsx`
- Create: `src/app/(website)/(public)/agent-skills/loading.tsx`
- Modify: `src/routes.ts`
- Modify: `src/config/marketing.ts`
- Modify: `src/config/footer.ts`
- Modify: `src/app/sitemap.ts`

1. 添加页面 Metadata 和页面结构。
2. 加入公开路由。
3. 加入 Header 与 Footer 入口。
4. 加入 Sitemap。

### Task 4: 验证与交付

1. 运行 `pnpm build`。
2. 启动本地生产服务。
3. 用浏览器检查桌面和移动布局、搜索、分类导航和外链。
4. 独立 Reviewer 审查 diff 与验证证据。
5. 精确暂存本次文件并提交。
6. 推送功能分支。
7. 运行普通 `vercel deploy` 创建 Preview。
8. 使用 `vercel inspect` 确认 `target=preview`、`status=Ready`。
