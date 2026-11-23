# 迁移交接与剩余动作

生产已运行于 VPS：`https://findryai.com`（release `52577d1-45255914517`，generation 5）。以下动作需要用户输入或后续观察。

## 1. Sanity staging 数据集（阻塞 S05）

现状：
- 项目 `8pdw6hih` 只有 `production` dataset。
- 项目 token 与 GitHub `SANITY_API_TOKEN` 均返回 `missing_grant sanity.project.datasets/create`。
- 因此 S05 的并发支付、周报去重集成测试无法执行。

用户动作（二选一）：
1. 在 Sanity 控制台为本项目创建 dataset `staging`，并确保 token 可读写该 dataset；或
2. 运行 `pnpm exec sanity login` 后告知，由执行者在本地/服务器创建。

完成后：
```bash
# 更新 /opt/site-infra/secrets/findryai.staging.env
# NEXT_PUBLIC_SANITY_DATASET=staging
# SANITY_API_TOKEN=<可读写 staging 的 token>
# PAYMENT_WRITES_ENABLED=false / CRON_WRITES_ENABLED=false（测试时按需）
```
然后执行 S05（见 `docs/migration/tests.md`）。S05 PASS 前不要扩大支付流量或宣称支付幂等已验证。

## 2. 单机故障风险确认

当前只有一台 VPS；Caddy/主机故障时无自动切换。需要用户明确接受停服等待修复，或提供第二台恢复主机。

## 3. 整机恢复演练

R2 仓库 `site-infra-backup` 已有快照；尚未在全新主机执行：
`clone site-infra → restore secrets → 安装 Caddy/Compose → restic restore → prepare/promote → 验证`
建议在维护窗口执行并记录 RTO。

## 4. OAuth 登录

Vercel 生产环境存在 `AUTH_GOOGLE_*`、`AUTH_GITHUB_*`，但 API 不回显敏感值。若需要 OAuth：
- 在 Google/GitHub 控制台确认回调为 `https://findryai.com/api/auth/callback/<provider>`；
- 将新凭证写入 `/opt/site-infra/secrets/findryai.production.env`；
- 重新发布一个 release 使容器读取新变量。

## 5. GHCR 拉取凭据

VPS 的 `/root/.docker/config.json` 当前使用较宽的 PAT。建议替换为只读 package token，并记录轮换日期。

## 6. 观察项

- 24–48h：错误率、内存、webhook 投递、备份恢复点、证书续期。
- 下周一 09:00 UTC：周报首次真实窗口；检查 `digestRecipient-*` 唯一 owner。
- 每日 03:00 UTC：徽章巡检 lock/fence 与结果。
- 每日 02:00 UTC：备份 snapshot 与 `state/backup-state.json` 年龄。
