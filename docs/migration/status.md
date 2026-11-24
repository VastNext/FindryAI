# 迁移执行状态（2026-11-24）

本文件记录实际执行结果，不替代契约。生产已于 2026-11-24 切流至 VPS；Sanity staging 数据集、单机灾备和容量测试仍未完成。

## 任务状态

| 任务 | 状态 | 证据 / 说明 |
| --- | --- | --- |
| D00 决定表 | PARTIAL | platform_repo、proxy、host、架构、registry、staging 域名已定；DNS record、备份供应商、告警、恢复主机、Sanity staging 仍 UNSET |
| D01 应用镜像 | PASS（unit/构建） | `Dockerfile`、`.dockerignore`、`config/env-manifest.json`、`scripts/deploy/app-smoke.mjs`、`scripts/deploy/image-check.mjs`；CI 构建与镜像审计见 Actions |
| D02 平台入口 | PASS | `/opt/site-infra`；Caddy 2.10.2 + Cloudflare DNS 模块；80/443；UFW 仅 22/80/443；nginx 已停用 |
| D03 发布工具 | PASS | staging 与 production prepare/promote 均通过；`tests/release/core.test.mjs` 6/6；HMAC 审批、generation、锁、Caddy 切换已验证 |
| D04 备份 | PARTIAL | Cloudflare R2 `site-infra-backup` create/check PASS；本机隔离 restore PASS；全新主机整机恢复未演练 |
| D05a 副作用契约 | PASS | `docs/deployment/side-effects-contract.md` |
| D05b 支付/调度实现 | CODE READY, S05 DEFERRED | 生产 webhook 自签事件 + 重放验证通过；按用户决定暂缓独立 dataset 集成测试 |
| D06 CI 交接 | PASS | staging/production workflow 均实际运行；旧 Vercel Preview 冻结；旧 Vercel 项目已 paused，crons 不再执行 |
| D07 验收 | PARTIAL | staging/production 冒烟全 PASS；真实 TLS/DNS 已验；S09 容量与独立接手演练未完成 |
| D08 生产准备 | PASS | DNS 记录快照、生产候选、备份、旧调度冻结、切流授权均已记录 |
| D09 切流与观察 | IN_PROGRESS | 生产已切流；完整 GitHub Actions 生产 workflow（构建→prepare→promote→冒烟）success；24–48h 观察与周报窗口待验 |

## 主机事实

- Ubuntu 24.04，4 vCPU，5.8 GiB RAM，74 GB 可用；2 GiB swap。
- Docker 29.1.3 + Compose 2.40.3；Node 22.18.0 安装于 `/usr/local`。
- Caddy 容器 `edge-caddy`，证书状态持久化于 `/opt/site-infra/data/caddy`。
- 平台仓库 `/opt/site-infra`，root 所有；部署身份 `deploy` 仅能 sudo 调用固定启动器。
- 密钥：`/opt/site-infra/secrets/*.env`（0600 root）；审批签名密钥 `/etc/site-infra/approval_hmac`。

## 已发现与修复

- `next.config.docker.mjs` 丢失 `/sitemap.xml` rewrite 与重定向 → 改为复用主配置并仅追加 standalone。
- Docker 构建缺少 `NEXT_OUTPUT_MODE=standalone` → 已补；构建期占位 SDK 变量避免页面数据收集失败。
- 旧 webhook 在“订单已存在”时提前返回，导致条目永久未升级；新账本以条目实际字段为判据。
- 旧周报无收件人账本；新实现按 ISO 周一窗口 + 确定性收件人文档去重。
- 旧徽章 cron 无跨实例互斥；新实现使用 `cronLock` 租约 + fence。

## 生产事实

- 生产 release：`9e156ff-45451724219`，generation=9，环境 production；AI Daily Feeds 推文由本站 `/api/tweet/[id]` 代理加载，CF 浏览器缓存已设 0 并在发布时自动 purge。
- `https://findryai.com` 与 `www.findryai.com` 均指向 `192.238.239.41`，Cloudflare 橙云、SSL strict。
- `/item/*`、`/category/*` 的 Cloudflare HTML Page Rule 已停用；`cf-cache-status: DYNAMIC`，由 Next ISR 返回 HIT。
- 旧 Vercel 项目 `paused=true`，`*.vercel.app` 返回 402，crons 无执行条件。
- 支付 webhook 自签事件验证：有效签名 200、账本 `needs_review`、无订单/条目写入；重放 `attempts` 不增长。
- 调度：badges 03:00 UTC、digest 周一 09:00 UTC、resume 每 10 分钟、backup 02:00 UTC。
- 轻量容量基线：5 并发 60s，995 请求 0 错误，p95 724ms，容器 CPU 0.73%、内存 150 MiB。
- 告警：Resend 测试发送返回 200。
- Cloudflare `/item/*` 与 `/category/*` HTML Page Rule 已停用，避免 3 天边缘缓存阻塞内容更新。

## 阻塞项（需要用户）

1. **Sanity 集成测试（已由用户暂缓）**：生产沿用原 `production` dataset，无需创建新 dataset；并发/周报集成测试留待后续。
2. **DNS / Cloudflare**：已使用系统 `CF_API_TOKEN` 完成 DNS 切换与 DNS-01 证书。
3. **整机恢复演练**：R2 异机仓库已建立，但未在全新主机执行从零恢复。
4. **告警验证**：已接入 Resend 管理员邮箱，但未做真实失败注入。
5. **单机故障风险**：无备用主机；生产已切流，用户尚未书面接受该风险。
6. **OAuth**：已从 `.env.local` 注入并完成验证；补充 `AUTH_URL=https://findryai.com` 修正反向代理下的回调域名。

## 下一次执行入口

- Staging：GitHub Actions `Deploy to VPS (staging candidate)`。
- 状态：`ssh vps 'sudo -n /usr/local/sbin/site-infra-release status --site findryai'`。
- 回滚：需要签名 approval，目标必须是 `safety_reviewed=true` 的 release。
