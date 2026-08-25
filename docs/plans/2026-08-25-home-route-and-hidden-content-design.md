# 首页路由替换与内容入口隐藏设计

## 目标

- 让当前 `/home3` 的无限滚动体验成为网站首页 `/`。
- 保留 `/category` 当前的分类标题、分类筛选与分页网格。
- 隐藏 Home3、Collection、Blog 的公开导航入口。
- 从 sitemap 移除 Collection 与 Blog 的列表页和详情页，但继续允许旧 URL 直接访问。

## 路由设计

- 将 Home3 页面和布局迁移到根路由组，使 `/` 直接渲染 Home3 的 Hero、筛选器和无限滚动列表。
- 首页筛选器的 URL 前缀由 `/home3` 改为 `/`，首页 canonical URL 保持为 `/`。
- 删除独立的 Home3 页面实现，并通过永久重定向将 `/home3` 指向 `/`，避免旧链接产生重复内容或失效。
- `/category` 路由及其页面实现不变。

## 入口与索引设计

- 顶部导航移除 Home3、Collection、Blog；不新增冗余的 Home 菜单，Logo 继续承担返回首页的入口。
- 页脚移除 Collection、Blog、Home 3 及两个 Collection 示例链接；保留其余栏目与链接。
- sitemap 不再列出 `/collection`、`/blog`、Collection 详情、Blog 文章和 Blog 分类，也不再为这些内容请求 Sanity sitemap 数据。
- `publicRoutes` 继续保留 Collection 与 Blog，保证旧 URL 可以直接访问。

## 验证

- 运行只读的 `pnpm lint`。
- 运行 `pnpm build`，验证 Next.js 路由、类型和生产构建。
- 启动网站后核验 `/` 为无限滚动首页、`/category` 保持原样、`/home3` 重定向到 `/`。
- 检查桌面/移动导航、页脚和 sitemap 均不再暴露 Collection 与 Blog。
