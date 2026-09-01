# MOGE「Agent Skills」页面实现与 FindryAI 落地可行性报告

> 研究对象：<https://moge.ai/zh/agent-skills>
>
> 研究日期：2026-08-31
>
> 目标：完整拆解页面实现，评估能否在 FindryAI 中落地，并给出低风险实施路线

## 1. 结论先行

**可以做到 FindryAI 里，而且现有代码可复用约 70%～85%。**

FindryAI 已有 Sanity 内容管理、条目、分类、标签、合集、公开目录页、搜索、分页、卡片、导航、SEO 和批量导入脚本。MOGE Agent Skills 页本质上又是一个结构较简单的策展目录：17 个主题、278 个外链卡片、桌面粘性分类导航、移动端双列网格，没有详情接口、无限滚动、复杂筛选或登录门槛。

推荐路线不是立即复制一套新平台，而是分两步：

1. **第一阶段：复用 `item + category + collection`，新增 `/agent-skills` 专用聚合页和轻量卡片。**
2. **第二阶段：当需要安装命令、兼容 Agent、GitHub stars、版本同步和独立详情 SEO 时，再迁移到独立 `agentSkill` 实体。**

第一阶段不需要改变 Sanity schema，能最快验证用户是否需要这个栏目；同时不要给技能发布 `/item/[slug]` 详情页，避免以后迁移产生 URL 和 SEO 包袱。

## 2. 研究方法与网络门禁

本次继续执行严格的代理浏览器门禁：

1. 使用 `http://127.0.0.1:7890` 启动独立浏览器会话；
2. 在同一会话先打开 Google；
3. 确认 Google 标题、搜索框及资源正常；
4. 再打开 MOGE Agent Skills 页面；
5. 获取完整页面文本、交互树、桌面和移动端全页截图；
6. 点击分类并检查滚动状态；
7. 下载 HTML 和页面专属 JavaScript 分包；
8. 解析 React Flight 中的完整分组数据；
9. 对照 FindryAI 现有路由、Sanity schema、查询、组件、导航和 SEO 实现。

验证结果：

| 检查项 | 结果 |
|---|---|
| Google 门禁 | 通过 |
| Agent Skills 页面 | 200，完整显示 |
| 卡片总数 | 278 |
| 分类总数 | 17 |
| 外链数量 | 278 |
| 桌面分类导航 | 正常，点击平滑滚动 |
| 滚动联动高亮 | 正常 |
| 桌面布局 | 分类侧栏 + 最高 7 列卡片 |
| 移动布局 | 隐藏侧栏 + 2 列卡片 |
| 详情页 | 没有，卡片直接外链 |
| 动态数据请求 | 没有，目录数据随 RSC HTML 下发 |

## 3. MOGE 页面是什么

该页面不是一个 Skill 安装市场，也不是带站内详情的数据库应用。它更接近：

> 一个由编辑维护、按主题分段、直接跳转 GitHub 或产品官网的静态策展资源页。

核心功能只有：

- 展示 17 个主题；
- 每个主题展示若干轻量卡片；
- 桌面左侧主题导航；
- 点击主题平滑滚动；
- 用户滚动时自动更新当前主题；
- 卡片打开外部仓库或官网；
- 深浅主题和全站导航；
- 响应式布局。

页面没有：

- 站内 Skill 详情页；
- 页面内关键词搜索；
- 标签筛选；
- 排序；
- 分页或加载更多；
- 点赞、收藏、评论；
- 安装命令；
- GitHub stars；
- 版本、许可证或维护状态；
- Skill 投稿入口；
- 页面专属 API 请求。

## 4. 页面技术架构

与 MOGE 推文页共享基础技术：

| 层级 | 技术 |
|---|---|
| 框架 | Next.js App Router |
| 渲染 | React Server Components + Client Component |
| 构建 | Turbopack 分包 |
| 部署 | OpenNext + Cloudflare |
| 样式 | Tailwind CSS |
| 图标 | Remix Icon |
| 主题 | HTML `dark/light` 类与主题状态 |
| 分析 | Google Analytics |

与推文页不同的是，Agent Skills 页面没有客户端数据接口。全部 17 组、278 条数据已经嵌入 React Flight：

```ts
type CuratedGroup = {
  mainCategory: string;
  remixIcon: string;
  slug: string;
  items: CuratedItem[];
};

type CuratedItem = {
  name: string;
  link: string;
  iconUrl: string;
  shortDescriptions: string[];
};
```

页面只需 hydration 后启用分类滚动联动，卡片内容本身可直接服务端渲染。

## 5. 数据规模与分组

页面共有 17 组、278 张卡片：

| 分类 | 数量 |
|---|---:|
| Agent Harness | 38 |
| Vibe Coding | 18 |
| Agent 辅助 | 10 |
| 技能工坊 | 13 |
| PPT与演示 | 9 |
| 设计与界面 | 35 |
| 视频与动画 | 21 |
| 写作与文案 | 10 |
| 文档与表格 | 10 |
| 图表与图解 | 13 |
| 营销与增长 | 10 |
| 产品与商业 | 10 |
| 研究与学习 | 19 |
| 网页与自动化 | 25 |
| 代码审查与安全 | 12 |
| 记忆与知识库 | 14 |
| 常见官方技能 | 11 |

数据源域名分布：

- GitHub：269 条；
- Claude、Kimi、Manus、Perplexity、CodeBuddy、Genspark、Browse 等官网：9 条。

页面会按链接去重，同一个分组内重复 URL 只渲染一次。

## 6. 卡片实现

每张卡片只展示：

- 20×20 图标；
- 单行名称；
- 两行短描述；
- 整卡外链。

结构近似：

```tsx
<div className="group rounded-lg border transition-colors">
  <a
    href={item.link}
    target="_blank"
    rel="noopener nofollow"
    className="flex flex-col gap-4 p-4"
  >
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-1">
        <img src={item.iconUrl} width={20} height={20} loading="lazy" />
        <h3 className="truncate text-lg font-semibold">{item.name}</h3>
      </div>
      <p className="line-clamp-2 min-h-[3rem] text-sm leading-relaxed">
        {item.shortDescriptions[0]}
      </p>
    </div>
  </a>
</div>
```

视觉行为：

- 浅色背景 `#FCFEFE`；
- Hover 背景 `#F5FEFE`；
- 深色背景使用页面背景；
- 深色 Hover 使用低透明白色；
- 300ms 颜色过渡；
- Hover 时标题变为主色；
- 卡片没有截图、标签、按钮或统计数字。

所有 278 个外链都使用：

```html
target="_blank"
rel="noopener nofollow"
```

MOGE 为 GitHub 条目统一使用 GitHub 图标，没有为每个仓库抓独立头像。278 张卡片只使用 8 个图标资源。这显著降低了内容维护和图片请求成本。

## 7. 分类导航实现

### 7.1 桌面布局

页面主体是：

```text
176px 左侧分类导航 + 自适应内容列
```

侧栏：

- 桌面显示，移动端隐藏；
- 宽度约 176px；
- `position: sticky`；
- 最大高度 `calc(100vh - 80px)`；
- 自身可滚动；
- 隐藏滚动条；
- 每个分类有 Remix Icon 和标题。

### 7.2 点击分类

分类按钮不是改变 URL，也不是筛选数据，而是：

```js
section.scrollIntoView({
  behavior: "smooth",
  block: "start",
});
```

每个内容分组使用对应 slug 作为 `id`，并设置：

```css
scroll-margin-top: 80px;
```

因此固定 Header 不会遮住分组标题。

### 7.3 滚动联动

页面没有使用 IntersectionObserver，而是在被动 scroll 监听器中通过 `requestAnimationFrame` 节流。

算法大致为：

```ts
let activeSlug = groups[0].slug;

for (const group of groups) {
  const element = sectionRefs[group.slug];
  if (element?.getBoundingClientRect().top <= 100) {
    activeSlug = group.slug;
  } else {
    break;
  }
}

setActiveSlug(activeSlug);
```

当高亮分类超出侧栏可见范围时，分类按钮自身也会执行：

```js
button.scrollIntoView({
  behavior: "smooth",
  block: "nearest",
});
```

点击滚动期间用 ref 锁定选中项，并监听 `scrollend`、`wheel`、`touchstart` 或 3 秒超时，避免滚动监听抢先切换高亮。

## 8. 响应式网格

网格类为：

```text
grid-cols-2
sm:gap-3
md:grid-cols-3
lg:grid-cols-4
xl:grid-cols-6
2xl:grid-cols-7
```

即：

| 视口 | 列数 |
|---|---:|
| 手机 | 2 |
| md | 3 |
| lg | 4 |
| xl | 6 |
| 2xl | 7 |

移动端：

- 隐藏左侧分类导航；
- 保留所有分类标题；
- 采用双列紧凑卡片；
- 页面很长，但无需客户端分页；
- 底部仍有 MOGE 移动导航。

## 9. SEO 与性能

Metadata：

```text
Title: Agent Skills - MOGE
Description: 一页尽览精选的 Agent Skills，探索 OpenClaw、Claude Code、Hermes Agent 等产品带来的全新工作范式。
Canonical: https://moge.ai/zh/agent-skills
```

页面有多语言 hreflang、Open Graph 和 Twitter Card，但没有独立 JSON-LD。

性能特点：

- 数据服务端下发，没有列表 API 往返；
- 图片 `loading="lazy"`；
- 只有 8 个唯一图标 URL，浏览器缓存命中率高；
- 卡片固定结构，不需要瀑布流测量；
- 278 张卡片一次性在 DOM 中，内容简单，当前规模可以接受；
- 分类 scroll 监听经过 `requestAnimationFrame` 节流。

潜在问题：

- 278 个外链同时存在，HTML 较大；
- 全部外链 `nofollow`，页面对外部项目的推荐信号较弱；
- 无页面内搜索，手机用户找特定 Skill 成本高；
- 无站内详情，FindryAI 无法承接长尾 SEO；
- 数据若写死在代码或配置中，维护成本会随规模增长。

## 10. FindryAI 现有基础

FindryAI 已有完整目录架构：

- Sanity `item`、`category`、`tag`、`collection`、`group`；
- `/category`、`/tag`、`/collection`、`/item/[slug]`；
- `getItems()` 支持 collection、category、tag、关键词、排序和分页；
- `ItemCard`、`ItemGrid`、搜索框、空状态、分页和 JSON-LD；
- 导航、Footer、Sitemap、robots 和 Metadata；
- 批量导入脚本。

现有 `item` 字段已经覆盖第一阶段需要的全部内容：

| Skill 概念 | FindryAI 字段 |
|---|---|
| 名称 | `item.name` |
| Slug | `item.slug` |
| 外部链接 | `item.link` |
| 短描述 | `item.description` |
| 图标 | `item.icon` |
| 主题 | `item.categories` |
| Agent Skills 隔离 | `item.collections` |
| 补充标签 | `item.tags` |
| 详细说明 | `item.introduction` |
| 是否精选 | `item.featured` |
| 是否公开 | `publishDate` + `forceHidden` |

## 11. 为什么不能直接复用普通 Item 页面

数据结构可复用，但 UI 和领域语义不能原样复用。

当前 `ItemCard`：

- 上方显示 16:9 截图；
- 底部显示分类 chip；
- 点击进入 `/item/[slug]`；
- 卡片比 MOGE Skill 卡片大很多。

当前详情页还固定表达：

- `Visit Website`；
- `Website`；
- `Alternatives`；
- `More Products`；
- `SoftwareApplication` JSON-LD；
- `operatingSystem: Web`；
- 赞助和投稿计划。

这些语义对单个 `SKILL.md`、技能包或 Agent 工作流并不准确。

所以第一阶段应复用 `item` 数据，但新增专用 `AgentSkillCard`，卡片直接外链，不进入普通详情页。

## 12. 第一阶段推荐方案

### 12.1 内容模型

在 Sanity 创建：

```text
Collection name: Agent Skills
Collection slug: agent-skills
```

每条 Skill 仍是 `item`：

- `collections` 引用 Agent Skills；
- `categories` 对应 17 个主题；
- `link` 指向 GitHub 仓库、具体目录或官网；
- `description` 放一行中文价值描述；
- `icon` 使用 GitHub 或产品类型图标；
- `publishDate` 控制发布；
- `forceHidden` 控制临时下架。

### 12.2 页面功能

新增 `/agent-skills`：

- 页面标题和简介；
- 桌面左侧粘性分类导航；
- 点击平滑滚动；
- 滚动自动高亮当前分类；
- 2/3/4/6/7 列响应式网格；
- 轻量外链卡片；
- 只查询 `agent-skills` collection；
- 只显示该 collection 实际引用的分类；
- 不混入赞助卡；
- 首版不提供 Skill 详情页；
- 建议额外增加页面内关键词过滤，改善 278 条内容的查找体验。

### 12.3 推荐文件

新增：

```text
src/app/(website)/(public)/agent-skills/page.tsx
src/app/(website)/(public)/agent-skills/layout.tsx
src/components/agent-skill/agent-skill-card.tsx
src/components/agent-skill/agent-skill-category-nav.tsx
src/components/agent-skill/agent-skill-section.tsx
src/components/agent-skill/agent-skill-directory.tsx
src/data/agent-skill.ts
scripts/batch-agent-skill.ts
```

修改：

```text
src/routes.ts
src/config/marketing.ts
src/config/footer.ts
src/app/sitemap.ts
src/sanity/lib/queries.ts
```

`src/data/agent-skill.ts` 应封装固定 collection 条件，避免页面自行拼 GROQ。

### 12.4 查询建议

不要让页面获取全部 category 再过滤。应由 GROQ 一次返回分组结构：

```groq
*[_type == "category" && count(
  *[_type == "item"
    && defined(publishDate)
    && forceHidden != true
    && references(^._id)
    && references(*[_type == "collection" && slug.current == "agent-skills"]._id)
  ]
) > 0] | order(priority desc, name asc) {
  _id,
  name,
  slug,
  "items": *[_type == "item"
    && defined(publishDate)
    && forceHidden != true
    && references(^._id)
    && references(*[_type == "collection" && slug.current == "agent-skills"]._id)
  ] | order(featured desc, name asc) {
    _id,
    name,
    slug,
    description,
    link,
    icon
  }
}
```

正式实现应使用 GROQ 参数或固定服务器常量，不要接受客户端传入任意 filter 字符串。

## 13. 第一阶段必须解决的问题

### 13.1 分类污染

普通 AI 工具和 Skill 共用 category，若直接使用全局分类查询：

- Skill 专属分类会出现在普通目录；
- 普通工具分类会出现在 Skills 页；
- `/category/[slug]` 可能混合两种内容。

第一阶段最小解决方式：

- Skills 页面只查询 Agent Skills collection 实际引用的分类；
- 为 Skill 使用尽量通用的分类名称；
- 普通目录是否排除 Agent Skills collection，需要产品决策。

更稳的微调是给 `item` 增加 `itemType: tool | agentSkill`，但这会触发 schema 和类型生成。

### 13.2 普通目录是否显示 Skill

当前 `getItems()` 会查询所有发布 item。只加 collection 后，Skill 仍可能出现在首页、搜索和普通分类页。

有三种选择：

1. **允许混合**：把 Skill 当作一种 AI 资源；最省代码。
2. **默认排除**：普通目录查询增加 `itemType != "agentSkill"`；语义最清晰。
3. **只靠专属分类隔离**：不可靠，容易误混。

推荐第二种，但它需要 `itemType` 字段。若坚持首期零 schema 变更，可临时通过 collection 引用排除：

```groq
&& !references(*[_type == "collection" && slug.current == "agent-skills"]._id)
```

### 13.3 投稿流程不适用

现有普通投稿流程：

- 强制图标和 16:9 图片；
- 包含免费、Pro、Sponsor 状态；
- 没有 collection 选择；
- 面向产品官网，不是 GitHub Skill。

第一阶段应只允许管理员或专用批量脚本录入，不要把普通 Submit 表单直接用于 Skill。

### 13.4 数据导入

MOGE 当前 278 条数据中 269 条来自 GitHub，适合批量导入。

专用脚本应负责：

- URL 标准化和去除 `utm_source`；
- GitHub owner/repo/path 解析；
- 链接去重；
- 名称、描述、分类映射；
- GitHub 通用图标或组织图标；
- collection 引用；
- 发布状态；
- dry-run；
- 单条验证后再批量写入。

不建议不断向 `batch-item.ts` 添加 Skill 专属分支，应新增 `scripts/batch-agent-skill.ts`。

## 14. 第二阶段独立实体

当出现以下需求时，应升级为独立 `agentSkill`：

- 一键复制安装命令；
- 按 Claude Code、Codex、OpenCode、Cursor 等兼容性筛选；
- 区分单技能、技能包、Harness、插件或 MCP；
- GitHub stars、forks、版本、许可证、最后提交时间；
- 官方、验证、实验、弃用状态；
- Skill 排行榜；
- 独立详情页和长尾 SEO；
- 用户投稿 Skill；
- 多语言介绍；
- 自动同步 README 或 SKILL.md。

建议字段：

```text
name
slug
description
sourceUrl
repositoryUrl
repositoryPath
homepageUrl
documentationUrl
categories
supportedAgents
skillKind
official
verified
license
installCommand
usageCommand
maintainer
version
stars
lastCommitAt
lastSyncedAt
status
introduction
icon
publishDate
forceHidden
featured
```

独立路由：

```text
/agent-skills
/agent-skills/[slug]
```

独立详情页可使用 `SoftwareSourceCode`、`CreativeWork` 或通用 `Thing` JSON-LD，而不是强行使用 `SoftwareApplication`。

## 15. 两种方案对比

| 维度 | 复用 item + collection | 独立 agentSkill |
|---|---|---|
| 首期开发量 | 低 | 中高 |
| 上线速度 | 快 | 较慢 |
| 现有查询复用 | 很高 | 中等 |
| 数据语义 | 一般 | 清晰 |
| 分类隔离 | 需要约束 | 可彻底隔离 |
| 安装能力 | 不自然 | 自然 |
| GitHub 同步 | 字段不足 | 容易扩展 |
| 投稿复用 | 可复用但语义错误 | 需独立实现 |
| SEO | 只有聚合页较合适 | 可做完整详情 SEO |
| 后期迁移 | 有一定成本 | 无二次迁移 |
| 适用场景 | 快速策展验证 | 长期 Skill 平台 |

## 16. 推荐产品范围

### 首期必须有

- `/agent-skills` 独立公开路由；
- 17 类或重新策划后的主题；
- 轻量外链卡片；
- 桌面粘性分类导航；
- 点击平滑滚动；
- 滚动自动高亮；
- 移动双列布局；
- 页面内关键词过滤；
- Sanity 管理；
- Metadata、Canonical 和 Sitemap；
- 外链安全属性；
- 管理员批量导入。

### 首期不做

- 安装器；
- 用户投稿；
- stars 排行榜；
- Skill 站内详情；
- GitHub 自动同步；
- 收藏、点赞；
- 兼容性复杂筛选；
- 多语言正文。

### 成功标准

- 页面可在服务器端输出全部名称与描述；
- 首屏无客户端数据请求依赖；
- 所有分类导航都能准确滚动和高亮；
- 手机端无横向溢出；
- 278 条规模下交互流畅；
- 外链无重复、无失效链接；
- 普通工具目录不会意外混入 Skill；
- 新页面进入 Sitemap 且 Canonical 正确；
- 内容编辑无需修改代码。

## 17. 实施顺序

### 阶段 1：数据与页面骨架

1. 创建 `agent-skills` collection；
2. 创建或映射主题 category；
3. 实现专用 GROQ 和数据函数；
4. 实现 `/agent-skills` 服务端页面；
5. 实现轻量卡片和分组网格。

### 阶段 2：交互与响应式

1. 实现桌面粘性分类导航；
2. 实现 scroll + requestAnimationFrame 联动；
3. 实现平滑滚动和滚动锁；
4. 实现移动双列布局；
5. 增加页面内关键词过滤。

### 阶段 3：接入全站

1. 添加公开路由；
2. 添加 Navbar 和 Footer；
3. 添加 Metadata、Canonical、Open Graph；
4. 添加 Sitemap；
5. 决定普通目录是否排除 Agent Skills collection。

### 阶段 4：内容导入与校验

1. 创建专用批量脚本；
2. 单条 dry-run；
3. 校验分类和重复 URL；
4. 小批量导入；
5. 浏览器逐类验收；
6. 检查坏链和移动端。

## 18. 风险清单

### 高风险

- 普通 item 与 Agent Skill 领域语义混淆；
- Skill 意外出现在普通首页或分类页；
- 复用普通详情页造成错误 SEO 语义；
- 直接导入 MOGE 文案或完整条目可能涉及内容来源和版权边界。

### 中风险

- 分类空间污染；
- 固定 collection slug 被编辑者改名；
- GitHub 外链失效或仓库归档；
- 278 条内容需要持续维护；
- 一次渲染规模继续增长后 HTML 过大；
- 全部外链 `nofollow` 是否符合 FindryAI 的 SEO 策略需单独决定。

### 低风险

- 页面视觉实现简单；
- 不需要第三方运行时 API；
- 不需要数据库迁移；
- 不需要认证、支付或用户状态；
- 桌面与移动布局都可由 Tailwind 完成。

## 19. 最终建议

**建议做，而且先做成 FindryAI 的独立策展栏目，不要一开始做成 Skill Marketplace。**

最佳第一版：

```text
Sanity item
  + Agent Skills collection
  + 专用分类查询
  + /agent-skills 聚合页
  + 专用轻量外链卡片
  + 桌面分类滚动导航
  + 页面内搜索
```

这条路线最符合当前代码基础，也最接近 MOGE 页面的实际产品形态。它能快速验证：

- FindryAI 用户是否会浏览 Agent Skills；
- 哪些主题点击最多；
- 用户更需要外链策展、安装说明还是兼容性筛选；
- 是否值得升级为独立 `agentSkill` 平台。

需要明确避免两件事：

1. 不要全局修改现有 `ItemCard`，以免破坏普通 AI 工具目录。
2. 不要首期给 Skill 复用 `/item/[slug]` 详情页，以免继承错误产品语义并增加后续迁移成本。

从技术可行性、当前代码复用率和首期风险看，该功能适合进入 FindryAI，建议采用两阶段路线推进。
