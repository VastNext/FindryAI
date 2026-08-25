# SEO 问题修复设计

## 目标

修复 `docs/seo-optimization-report.md` 中列出的全部可执行问题，确保分页内容可被爬虫发现、分页 URL 能返回对应服务端内容，并补齐准确的元数据、结构化数据与 MDX 图片属性。

## 修复范围

1. 将分页控件恢复为带真实 `href` 的链接，同时保留 Next.js 客户端导航能力。
2. 从首页 `searchParams` 解析并校验 `page`，服务端按页获取条目。
3. 使用 Next.js `title.default` 与 `title.template` 处理标题，避免重复站名。
4. 输出以下 JSON-LD：
   - 全局 `WebSite` 与 `SearchAction`
   - 工具详情页 `SoftwareApplication` 与 `BreadcrumbList`
   - 博客详情页 `BlogPosting` 与 `BreadcrumbList`
5. 从 Sitemap 移除搜索和认证页面，并将搜索页设置为 `noindex, follow`。
6. 为 MDX 图片启用懒加载，移除伪造的默认 `alt` 文本。

## 设计

新增一个小型共享 `JsonLd` 组件，只负责安全序列化 Schema 数据并输出 `application/ld+json` 脚本。具体 Schema 在使用数据的页面中就地构造，避免建立不必要的 SEO 抽象层。序列化时转义 `<`，防止内容意外结束脚本标签。

分页 URL 由当前查询参数生成，只更新 `page`。`PaginationLink` 使用 Next.js `Link`，因此服务端输出标准锚点，客户端仍可无刷新导航。禁用的上一页和下一页仍保留不可交互状态，但指向边界页 URL。

`constructMetadata` 不再拼接站名。根布局通过 `title.default` 和 `title.template` 定义继承规则，普通页面返回原始标题，首页使用绝对标题确保只显示站名。`noIndex` 继续控制 robots，但 `follow` 保持为 `true`。

结构化数据只使用 Sanity 已有字段。工具 Schema 不虚构评分；价格模式映射为可用的 Offer 描述。面包屑由详情页的真实层级生成，而不是在根布局静态输出错误路径。

## 边界

- 不修改 Sanity Schema 或生成类型。
- 不新增评分、评论或不存在的价格数值。
- 不调整报告未提及的页面内容与视觉样式。
- 未跟踪的 `docs/seo-optimization-report.md` 保持原状，不纳入提交。

## 验证

- 逐项检查报告中的六组问题均有对应源码修复。
- 运行 `pnpm lint`。
- 运行 `pnpm build`，验证 Next.js 元数据、类型与生产渲染。
