# Visual Plan

## Context
- report: report.md
- purpose: 说明 Vercel Fast Origin Transfer 产生链路、多项目回源漏斗以及 Cloudflare 拦截机制
- status: planned

## Plan

| slot | purpose | type | content_source | must_have | output |
|---|---|---|---|---|---|
| 第二章开头 | 流量计量模型对比（Fast Data Transfer vs Fast Origin Transfer） | Mermaid `flowchart` | 官方计费定义 | 必须 | report.md 内 Mermaid |
| 第三章末尾 | 4 大高风险泄漏点与优化前后对比 | Markdown 表格 | 代码审计与架构分析 | 必须 | report.md 内表格 |
| 第四章末尾 | Cloudflare + Vercel 双层缓存拦截架构 | Mermaid `flowchart` | 推荐架构图 | 必须 | report.md 内 Mermaid |
