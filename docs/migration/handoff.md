# 迁移交接与剩余动作

生产已运行于 VPS：`https://findryai.com`（release `744bd30-45323470762`，generation 7）。OAuth 已恢复；Sanity 集成测试按用户决定暂缓。以下为仍需后续处理的事项。

## 1. Sanity 集成测试（用户已暂缓）

现状：
- 项目 `8pdw6hih` 只有 `production` dataset。
- 项目 token 与 GitHub `SANITY_API_TOKEN` 均返回 `missing_grant sanity.project.datasets/create`。
- 因此 S05 的并发支付、周报去重集成测试无法执行。

用户已确认：生产直接沿用原 `production` dataset 即可，暂不跑隔离集成测试。若以后恢复 S05，执行以下步骤。

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

## 4. OAuth 登录（已完成）

- `.env.local` 中已有的 Google/GitHub 凭证已注入 `/opt/site-infra/secrets/findryai.production.env`；
- 已补充 `AUTH_URL` / `NEXTAUTH_URL=https://findryai.com`；
- `/api/auth/providers` 与授权跳转的 `redirect_uri` 均已验证为 `https://findryai.com/api/auth/callback/<provider>`；
- 仍需确认 Google/GitHub 控制台登记了上述回调地址。

## 5. GHCR 拉取凭据

VPS 的 `/root/.docker/config.json` 当前使用较宽的 PAT。建议替换为只读 package token，并记录轮换日期。

## 6. 观察项

- 24–48h：错误率、内存、webhook 投递、备份恢复点、证书续期。
- 下周一 09:00 UTC：周报首次真实窗口；检查 `digestRecipient-*` 唯一 owner。
- 每日 03:00 UTC：徽章巡检 lock/fence 与结果。
- 每日 02:00 UTC：备份 snapshot 与 `state/backup-state.json` 年龄。
