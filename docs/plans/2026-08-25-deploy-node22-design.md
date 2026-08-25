# 部署工作流 Node.js 22 设计

## 目标

将 GitHub Actions 生产部署任务使用的 Node.js 版本从 20 调整为 22。

## 设计

仅修改 `.github/workflows/deploy.yml` 中 `actions/setup-node` 的
`node-version`。保留标签触发、pnpm 版本、Vercel CLI 安装和生产部署命令不变。

该设置控制后续命令使用的 Node.js 版本；GitHub Actions 自身执行 JavaScript
Action 的内部运行时仍由 GitHub 平台管理。

## 验证

- Workflow 中只出现 `node-version: 22`。
- YAML 文件通过 Biome 检查。
- 差异仅包含设计文档和一行 Workflow 版本变更。
