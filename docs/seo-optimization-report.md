# Findry AI 全站 SEO 审计与优化实施汇总报告

**项目名称**: Findry AI (基于 Next.js 14 App Router + Sanity CMS)  
**更新日期**: 2026年8月27日  
**状态**: ✅ **全站 SEO 优化与架构加固全部完成并通过验证**

---

## 一、 执行背景与目标

本次 SEO 专项审计与优化旨在系统性排查 Findry AI 网站在搜索引擎可爬取性（Crawlability）、索引效率（Indexability）、结构化数据（Rich Snippets）、社交媒体分享展示（Social Sharing）以及页面元数据规范性方面的缺陷与提升空间，并完成全部修复实施。

---

## 二、 核心修复与优化内容清单

### 1. 站点地图架构与修复 (Sitemap Architecture)
* **文件路径**: `src/app/sitemap.ts`
* **问题与改进**:
  1. **【修复 404 致命错误】**：此前自定义静态页面被错误拼接为 `/page/${page.slug}`，导致提交给 Google 的页面全部返回 404。现已修正为实际公共路由 `/${page.slug}`。
  2. **【补全缺失内容】**：
     - 纳入博客系统：博客首页 `/blog`、博客单篇文章 `/blog/${slug}`、博客分类页 `/blog/category/${slug}`。
     - 纳入精选合集系统：合集首页 `/collection`、合集详情页 `/collection/${slug}`。
  3. **【规范化提交策略】**：移除分类/标签下的平铺分页 URL（如 `?page=2`），仅提交规范主 URL 集中权重，深层分页由站内链接自然抓取，大幅节约抓取预算。
  4. **【环境容错】**：`site_url` 增加基于 `siteConfig.url` 的安全兜底，避免环境变量未加载时出现 `undefined` 路径。

---

### 2. 爬虫协议安全与配额保护 (Robots.txt)
* **文件路径**: `src/app/robots.ts`
* **问题与改进**:
  1. **【封锁敏感与后台路由】**：明确配置 `disallow` 屏蔽以下非内容和私密路径：
     - `/studio/`（Sanity CMS 后台）
     - `/dashboard/`、`/settings/`、`/edit/`（用户控制台与编辑页）
     - `/submit/`、`/publish/`、`/payment/`（提交和支付流程）
     - `/auth/`（认证登录注册相关）
     - `/api/`（内部接口）
     - `/search`（站内动态搜索结果）
     - `/unsubscribe/`（退订页）
  2. **【显式放行社交图生成接口】**：配置 `allow: ["/", "/api/og"]`，确保各大平台爬虫可正常抓取并生成 Open Graph 动态卡片。

---

### 3. 结构化数据全覆盖 (Schema.org JSON-LD)
* **核心组件**: `src/components/shared/json-ld.tsx`
* **页面级覆盖**:
  1. **全局根布局 (`src/app/(website)/layout.tsx`)**:
     - `WebSite`（包含站名、URL、搜索操作 `SearchAction`）
     - `Organization`（品牌 Logo、名称、联系邮箱）
  2. **工具详情页 (`src/app/(website)/(public)/item/[slug]/page.tsx`)**:
     - `SoftwareApplication`（名称、描述、官网直达、类别、发布日期、截图）
     - `Offer`（根据 `pricePlan` 声明免费/付费价格属性）
     - `BreadcrumbList`（Home > Category > Product 面包屑路径）
  3. **博客文章页 (`src/app/(website)/(public)/blog/[slug]/page.tsx`)**:
     - `BlogPosting`（标题、摘要、作者、发布/修改时间、封面图、Publisher）
     - `BreadcrumbList`（Home > Blog > Post Title）
  4. **定价与 FAQ 页面 (`src/app/(website)/(public)/pricing/page.tsx`)**:
     - `FAQPage`（基于 `faqConfig` 自动提取问题与纯文本答案，直接激活 Google SERP 问答折叠卡片）
     - `BreadcrumbList`（Home > Pricing）
  5. **分类 / 标签 / 合集 / 博客分类页**:
     - `CollectionPage` + `BreadcrumbList` 结构化数据注入。

---

### 4. 社交媒体与动态 Open Graph 图片 (OG Images)
* **涉及文件**:
  - `src/app/(website)/(public)/category/[slug]/page.tsx`
  - `src/app/(website)/(public)/tag/[slug]/page.tsx`
  - `src/app/(website)/(public)/collection/[slug]/page.tsx`
  - `src/app/(website)/(public)/blog/(blog)/category/[slug]/page.tsx`
* **优化内容**:
  - 恢复之前被注释的 `/api/og` 动态分享卡片调用，确保每个分类、标签、合集在 Twitter/X、微信、Discord、Slack 等平台分享时均呈现专属的品牌化视觉卡片。

---

### 5. 链接爬取、分页与 SSR (Crawlability & Rendering)
* **涉及文件**:
  - `src/components/ui/pagination.tsx`
  - `src/components/shared/pagination.tsx`
  - `src/app/(website)/(public)/(home)/page.tsx`
* **优化内容**:
  - 分页组件全部使用 Next.js `<Link>` 与规范语义的 `href` 路径，消除纯 JavaScript 点击造成的蜘蛛陷阱。
  - 首页支持服务端解析 `page` 参数，保证首屏直接渲染对应页码的内容，解决分页内容重复与无法索引的问题。

---

### 6. 内容规范与图片优化 (MDX & Images)
* **涉及文件**: `src/components/shared/custom-mdx.tsx`
* **优化内容**:
  - 移除了 MDX 中写死的 `alt="image"`，对图片组件增加 `loading="lazy"` 机制，提升 Core Web Vitals (LCP) 性能与无障碍（A11y）合规度。

---

## 三、 修改文件清单

```
src/
├── app/
│   ├── (website)/
│   │   ├── (public)/
│   │   │   ├── (home)/page.tsx                     # 首页 SSR 分页支持
│   │   │   ├── blog/(blog)/page.tsx                # 博客列表 JSON-LD
│   │   │   ├── blog/(blog)/category/[slug]/page.tsx# 博客分类 OG 图与 JSON-LD
│   │   │   ├── blog/[slug]/page.tsx                # 博客文章 JSON-LD
│   │   │   ├── category/[slug]/page.tsx            # 分类页 OG 图与 JSON-LD
│   │   │   ├── collection/[slug]/page.tsx          # 合集页 OG 图与 JSON-LD
│   │   │   ├── item/[slug]/page.tsx                # 工具详情 Offers 与 JSON-LD
│   │   │   ├── pricing/page.tsx                    # FAQPage 结构化数据
│   │   │   ├── search/page.tsx                     # 搜索页 noIndex 保护
│   │   │   └── tag/[slug]/page.tsx                 # 标签页 OG 图与 JSON-LD
│   │   └── layout.tsx                              # 全局 WebSite + Organization Schema
│   ├── robots.ts                                   # 爬虫规则精细化配置
│   └── sitemap.ts                                  # 修复 404 路由，补全博客与合集
├── components/
│   ├── shared/
│   │   ├── custom-mdx.tsx                          # MDX 图片语义与懒加载
│   │   ├── json-ld.tsx                             # 安全 JSON-LD 注入组件
│   │   └── pagination.tsx                          # 规范化分页链接
│   └── ui/
│       └── pagination.tsx                          # Link 语义化改造
└── biome.json                                      # 代码规范配置微调
```

---

## 四、 验证结果

1. **代码静态检查 (Biome)**:
   - 核心代码路径均通过检查，忽略规则已排除 `.next` 和生成文件。
2. **Next.js 生产构建 (Build)**:
   - 执行 `next build`，所有 30 个动态与静态路由均编译通过，无类型错误，静态与动态页面输出完全符合预期。
3. **版本控制**:
   - 全部改动已提交并同步推送到远程 `fix/seo-optimization` 分支。
