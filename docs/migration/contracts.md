# 环境与接口契约 v1

本文件给开发者固定接口；`UNSET` 表示执行阻塞，不能猜测。生产真实值存于私有环境清单，文档只记录引用。接口变更先由协调者修改版本并通知消费者。

## 决定表（D00 唯一维护）

| 键 | 已知值或状态 | 阻塞范围 |
| --- | --- | --- |
| platform_repo | VastNext 私有仓库；名称 UNSET，建议 site-infra | 远程创建/推送，不阻塞本地编写 |
| proxy | Caddy | 已确定 |
| production_host | 用户给定 VPS；地址放私有 inventory | 生产授权之前不可写 |
| architecture | linux/amd64 | ARM 不在此次范围 |
| image_visibility / registry_ref | UNSET，建议私有 GHCR | 推送与拉取演练 |
| preview_domain / dns_zone_id / record_ids | UNSET | TLS、外部回调、切流 |
| cloudflare_mode / certificate_method | UNSET，须核实真实现状 | TLS、切流 |
| staging_sanity / oauth_test / stripe_test / mail_sink | UNSET | 外部集成写测试 |
| backup_provider / budget / credential_custodian | UNSET | 异机备份与生产放行 |
| alert_destination | UNSET | 生产监控放行 |
| recovery_host / accepted_single_host_outage | UNSET | 整机恢复与首次切流 |
| maintenance_window / approver | UNSET | 生产修改 |
| load_profile / thresholds | 由 D07 提交测量建议、用户批准 | 容量放行 |

开发合成夹具可用 `.test` 域名、假 token、临时目录；生产或隔离集成环境清单禁止包含 UNSET。D00 逐项记录确认者、时间和证据，不将推荐当决定。

## 环境分类

| 环境 | 数据与凭证 | 允许测试 |
| --- | --- | --- |
| unit | 本地模拟服务、无真实密钥 | 故障、并发、状态机、模拟发送 |
| staging | 专用 Sanity 测试数据集、测试 OAuth 客户端、Stripe 测试模式、收件箱白名单 | 读写和回调；真实服务调用须获授权 |
| production-candidate | 正式构建公开变量、正式运行配置；受保护入口，调度关闭 | 只读；任何写入另行授权 |
| production | 正式域名、正式配置、唯一调度 | 获批业务与最小生产验收 |

staging 与 production-candidate 不是同一个环境。`NEXT_PUBLIC_*` 不同就分别构建镜像；从同一源码提交构建不代表 digest 相同。staging 通过后仍须对**生产 digest**做启动、静态资源及只读业务验证，禁止用测试 digest 替代。

环境预检输出只含变量名、是否存在、环境身份，不输出值。Sanity token 的读写范围由控制面权限及负向测试证明，不能凭变量名推断。测试收件人固定白名单，OAuth 测试不得回跳生产后继续操作。

## 环境变量核对清单

D01 从源码读取全部 `process.env` 引用与构建结果，生成版本化 `config/env-manifest.json`；下表是必查项而非完整枚举。每个条目含 phase（build/runtime/both）、required_when、secret_ref、environment、验证方式。空字符串按缺失处理。

| 变量组 | 约束 |
| --- | --- |
| NEXT_PUBLIC_APP_URL / NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET / NEXT_PUBLIC_STRIPE_* | 非秘密；识别构建固化；不能在切环境时仅更换运行值 |
| SANITY_API_TOKEN | 服务端秘密；当前模块加载需要它；构建是否需要由干净构建验证；测试 token 无生产写权限 |
| AUTH_SECRET / AUTH_* OAuth 凭证 | 按提供商配置；正式迁移保持原会话秘密；环境分离 |
| AUTH_TRUST_HOST | 只在可信代理和 Host 白名单验证后启用 |
| STRIPE_API_KEY / STRIPE_WEBHOOK_SECRET | 同一环境、同一 endpoint 的签名密钥，禁止测试/正式混用 |
| RESEND_* / CRON_SECRET / REVALIDATE_SECRET | 按实际功能核对；刷新 URL 查询参数中的秘密必须从访问日志、错误报告和交接中删除 |
| DEFAULT_AI_PROVIDER / 各 AI key / AGNES_API_KEY | 仅启用实际配置服务，测试调用设置额度上限 |

运行秘密文件归 root 管理、权限 0600，按站点/环境分开；受控启动器读取并注入。应用容器不挂载全站 secrets 目录；部署账号不能读取任意文件或运行任意 Docker 命令。root 仍可查看容器环境，因此 root 权限不发给并发开发者。

## 平台布局与命名（相对于可配置 PLATFORM_ROOT）

- `config/sites/<site>.json`：root 持有，描述域名、容器端口、健康路径、资源限额、允许镜像仓库、秘密引用。
- `releases/<site>/<release-id>/`：非秘密发布描述、镜像 digest 与配置哈希。
- `state/<site>.json`：当前/上一版本、阶段、代际 generation、证据引用。
- `locks/`：主机维护锁、站点锁、入口锁；所有写操作使用同一套锁。
- `edge/`：Caddy 配置；`data/`：证书及按需持久数据；`secrets/`：不入 Git。

site 只允许小写字母、数字、连字符，FindryAI 为 `findryai`。release-id 使用源码短 SHA 加唯一流水线运行 ID；长度和字符白名单必须验证。Compose project 为 `<site>-<release-id>`；应用服务名 `app`；上游网络别名含 release-id，禁止多个版本共用同名上游造成随机接流。Caddy 分别加入站点入口网络；数据库在独立后端网络。

## 待实现 CLI 接口

以下命令均在**基础设施仓库根目录**调用。生产由受限 root 启动器调用固定路径脚本，开发者只在 unit/staging 执行。输入采用 JSON 文件，避免把秘密放命令参数。所有变更接口需要 `--approval`，unit 模式用明确的假授权夹具。

| 接口 | 输入 / 输出与约束 |
| --- | --- |
| `bin/preflight --inventory FILE --site SITE --environment ENV` | 核对环境、版本、权限、资源；不修改系统 |
| `bin/release prepare --request FILE --approval FILE` | 拉取固定 digest、创建候选、预检与健康验证；不切入口 |
| `bin/release promote --request FILE --approval FILE` | 核对候选证据、预期 generation、缓存交接；切入口后验证 |
| `bin/release status --site SITE` | 只读返回当前代际、digest、未完成操作，不输出秘密 |
| `bin/release rollback --request FILE --approval FILE` | 显式目标 release-id、当前 generation、最低安全版本和兼容证据；不自动选择历史版本 |
| `bin/release reconcile --site SITE --approval FILE` | 断连后比较真实容器、入口、状态文件；不确定则 BLOCKED，不盲目重放 |
| `bin/verify --suite SUITE --inventory FILE --evidence DIR` | 执行 tests.md 规定的套件；缺输入为 BLOCKED |
| `bin/backup create/check/restore --request FILE --approval FILE` | restore 仅允许清单标识的隔离目标；生产恢复另获专门授权 |

发布 request 必填：schema_version=1、operation_id、site、environment、release_id、image_digest、config_hash、expected_generation、evidence_run_id。回滚另含 target_release_id。授权必填：approval_id、批准人、UTC 有效起止、允许操作、主机/站点/资源 ID、允许 digest/配置哈希、expected_generation、允许恢复动作。字段缺失即 BLOCKED。

stdout 仅一个 JSON：schema_version、operation_id、status、phase、generation、evidence_paths、error_code；stderr 只脱敏诊断。退出码：0=PASS；10=FAIL（断言失败）；20=BLOCKED（输入/授权/前置证据缺失）；30=CONFLICT（状态/锁冲突）；40=NEEDS_RECONCILE（结果不确定）。N/A 只由验收记录表达，不作为工具成功退出。其他异常均非成功。

## 发布事务与故障规则

正常阶段：NEW → PREPARED → VERIFIED → SWITCHING → ACTIVE → DRAINED。失败分为 FAILED（尚未切流）、ROLLED_BACK（已证实恢复）、NEEDS_RECONCILE（不能确定）。阶段转换必须持久记录，文件先写临时文件再原子替换；真实状态优先于过时本地记录。

锁顺序固定：主机维护锁（发布共享、主机维护独占）→ 站点独占锁 → 公共入口独占锁。入口锁仅覆盖读取最新配置、合并本站映射、校验、替换、重载、状态提交，禁止长时间持锁拉镜像。使用内核文件锁，进程退出释放；超时停止，不删除别人的锁文件绕过。人工、CI 和恢复脚本都使用同一入口。

每次 promote/rollback 都检查 expected_generation，只有当前代际仍属本操作才允许恢复映射；其他发布已经成功时拒绝旧回滚。重载成功但状态写失败进入 NEEDS_RECONCILE。Caddy 接受配置只证明配置加载，不证明后端健康，必须另做外部验证。

首次版本采用冷缓存验收；后续切换/回滚要求目标版本的失效交接证据。回滚目标至少包含已经启用的支付/cron安全修复；不得回退到不兼容防重记录的版本。旧资源、Server Actions 与流式连接策略必须通过 S06 后才允许生产蓝绿，失败由协调者设计处理，不由执行者猜。

DNS 只有生产执行者修改：按 zone+站点记录组独占，写前重读 ID/类型/值/代理状态/TTL 与批准旧值比对；任一不同即 CONFLICT。逐条记录写后状态；部分成功停止并根据获批的补偿动作处理，不能恢复其他操作者后写入的值。
