# Newsletter 隐藏与品牌清理设计

## 目标

线上不再展示 Newsletter 订阅卡片，但保留订阅、欢迎邮件和退订后端能力；同时将当前产品、邮件、配置、示例与 README 中的 Mkdirs 品牌统一为 Findry AI。

## 范围

- 从所有公开布局和测试布局中移除 `NewsletterCard`。
- 保留 `src/components/newsletter/`、订阅与退订 action、欢迎邮件模板。
- 当前品牌统一为 `Findry AI`、`https://findryai.com`、`support@findryai.com`。
- README 改为 Findry AI 项目说明。
- 保留许可证、上游仓库来源与历史 SEO 报告中的真实 Mkdirs 记录。

## 验证

- 全局搜索确认运行代码和当前文档没有非白名单 Mkdirs 残留。
- 对所有修改的 TypeScript/TSX 文件运行聚焦 Biome 检查。
- 运行 `pnpm build`。
- 分组提交后创建新的 `v*` tag，通过 GitHub Actions 部署到 Vercel。
