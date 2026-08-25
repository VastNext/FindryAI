# 密码生成器集成实施计划

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 在 FindryAI 中新增与全站设计一致的 `/password-generator` 原生公开页面，并完整保留现有密码生成器的核心能力。

**Architecture:** 使用 Next.js 服务端页面输出 metadata 与结构化数据，使用单个客户端功能域组件承载三种密码生成模式和本地化交互。密码生成算法与词表放在无 React 依赖的 `src/lib` 中；页面复用现有公共布局、主题令牌和 UI 组件，不引入 Vite 子项目或 submodule。

**Tech Stack:** Next.js 14 App Router、React 18、TypeScript、Tailwind CSS 3、shadcn/ui、Lucide、Web Crypto API。

---

### Task 1: 移植密码生成核心

**Files:**
- Create: `src/lib/password-generator.ts`
- Create: `src/lib/password-word-list.ts`

**Step 1: 创建词表模块**

从只读来源 `D:\WorkDev\MyShare\password-generator\src\lib\wordList.ts` 复制现有精选英文词表，保持 `readonly string[]` 导出，并使用本站文件命名约定。

**Step 2: 创建生成算法模块**

移植字符集、选项类型、分隔符、拒绝采样随机整数、Fisher-Yates 洗牌、三种生成器和三种熵值估算器。将错误信息改为中文：

```ts
if (maxExclusive <= 0) {
  throw new Error("随机数上限必须为正数");
}
```

强度结果只返回语义值，不返回来源项目专属 CSS 变量：

```ts
export interface StrengthResult {
  entropyBits: number;
  level: StrengthLevel;
  percent: number;
}
```

**Step 3: 运行静态检查**

Run: `pnpm lint`
Expected: 新增模块无 Biome 错误。

### Task 2: 构建原生生成器界面

**Files:**
- Create: `src/components/password-generator/password-generator.tsx`

**Step 1: 定义本地化数据与默认状态**

在客户端组件中提供 `en`、`zh-CN`、`ja`、`es`、`fr`、`de` 六种界面文案，默认按浏览器语言选择，只把 locale 写入 `findry-password-generator-locale`。

默认值：随机密码长度 20 且四类字符全开；易记口令四词、连字符、首字母大写、尾部数字；PIN 六位。

**Step 2: 实现主交互**

使用现有 `Button`、`Card`、`Switch`、`Slider`、`Select`、`Tabs`、`Dialog` 等 UI 原语实现：

- 三种模式切换。
- 密码显示、一键复制、重新生成。
- 实时强度条和熵值。
- 随机、易记、PIN 的选项面板。
- 语言切换与隐私说明弹窗。

字符类型至少保留一个；取消最后一个字符类型时保持该项开启并显示提示。

**Step 3: 样式适配**

只使用 `background`、`card`、`muted`、`border`、`primary`、`destructive` 等全站令牌。页面在 360px 宽度下不横向溢出，桌面内容最大宽度约 960px，密码区域使用等宽字体并允许横向滚动。

**Step 4: 运行静态检查**

Run: `pnpm lint`
Expected: 客户端组件通过 Biome 检查。

### Task 3: 添加公开路由与 SEO

**Files:**
- Create: `src/app/(website)/(public)/password-generator/page.tsx`
- Modify: `src/app/sitemap.ts`
- Modify: `src/routes.ts`

**Step 1: 添加页面 metadata**

通过 `constructMetadata` 设置标题、描述与 canonical URL：

```ts
export const metadata = constructMetadata({
  title: "Password Generator",
  description: "Generate strong random passwords, memorable passphrases, and PIN codes privately in your browser.",
  canonicalUrl: `${siteConfig.url}/password-generator`,
});
```

**Step 2: 添加页面外壳与结构化数据**

渲染标题、说明、客户端生成器和 `WebApplication` JSON-LD，强调 `browser`、`free`、`privacy` 与三种模式。

**Step 3: 加入 sitemap**

在静态公开 URL 列表中添加 `/password-generator`，保持现有 lastModified/changeFrequency/priority 结构。

**Step 4: 加入公开路由白名单**

在 `publicRoutes` 中添加 `/password-generator(/.*)?`，确保未登录访客不会被中间件重定向到登录页。

**Step 5: 构建验证**

Run: `pnpm build`
Expected: 构建成功，路由清单包含 `/password-generator`。

### Task 4: 添加全站入口

**Files:**
- Modify: `src/config/marketing.ts`
- Modify: `src/components/icons/icons.tsx`

**Step 1: 添加图标映射**

导入 Lucide `KeyRoundIcon` 并添加：

```ts
passwordGenerator: KeyRoundIcon,
```

**Step 2: 添加导航项**

在 `Pricing` 之前加入：

```ts
{
  title: "Password Generator",
  href: "/password-generator",
  icon: "passwordGenerator",
},
```

**Step 3: 运行静态检查**

Run: `pnpm lint`
Expected: 图标键符合 `MarketingConfig` 类型，检查通过。

### Task 5: 浏览器与安全验证

**Files:**
- Modify only if verification finds defects in files from Tasks 1-4.

**Step 1: 启动开发服务**

Run: `pnpm dev`
Expected: Next.js 开发服务器可访问。

**Step 2: 桌面端验证**

在 1440×1000 视口访问 `/password-generator`，检查 Navbar/Footer、三种模式、强度变化、复制、语言切换、关于弹窗和明暗主题。

**Step 3: 移动端验证**

在 390×844 视口检查导航入口、单列布局、滑块/开关/按钮触控和无横向溢出。

**Step 4: 安全行为验证**

清空网络记录后多次生成三种密码，确认没有由生成动作发起的 fetch/XHR；检查 URL、localStorage 和 Cookie 均不包含生成的密码。

**Step 5: 回归检查来源仓库**

Run in `D:\WorkDev\MyShare\password-generator`: `git status --short --branch`
Expected: `## main...origin/main`，无文件改动。

### Task 6: 最终验证与提交

**Files:**
- All task-owned files above.

**Step 1: 运行完整验证**

Run: `pnpm lint && pnpm build`
Expected: 两条命令均以退出码 0 完成。

**Step 2: 检查改动范围**

Run: `git status --short && git diff --stat && git diff`
Expected: 只有计划中的文件和本实施计划；`.ebuilder.state.json` 保持未跟踪且不暂存。

**Step 3: 提交实现**

```bash
git add docs/plans/2026-08-26-password-generator-integration.md \
  src/app/'(website)'/'(public)'/password-generator/page.tsx \
  src/app/sitemap.ts \
  src/routes.ts \
  src/components/password-generator/password-generator.tsx \
  src/components/icons/icons.tsx \
  src/config/marketing.ts \
  src/lib/password-generator.ts \
  src/lib/password-word-list.ts
git commit -m "feat: add native password generator"
git push
```

Expected: 提交成功并推送到当前 `soft-chipmunk` 分支。
