# 渠道短名单（已筛）

数据来源：yan-skills `backlink/data/submission-targets.json`（探针核验 2026-08-19：HTTP 可达性、表单/门禁形态、Similarweb 月访问量）。**执行前必须逐站重新核验入口仍然存活、免费且不要求互链**；流量为该时点估算值。

状态取值：`not attempted / eligibility / quality-gate / submitted / waiting-verification / waiting-review / published / outcome-unknown / failed / excluded`。

## Batch 1 — AI 工具目录（开放表单 · 免费 · 按月访问量降序，24 站）

| # | 站点 | 提交入口 | cohort | 月访问 | 状态 | 备注 |
|---:|---|---|---|---:|---|---|
| 1 | dang.ai | https://dang.ai/ | open | 337,046 | not attempted | 入口在站内，需现场定位表单 |
| 2 | ai-hunter.io | https://ai-hunter.io/ | open | 22,479 | not attempted | |
| 3 | aitoolsarena.com | https://aitoolsarena.com/ | open | 20,483 | not attempted | |
| 4 | supertools.therundown.ai | https://www.therundown.ai/submit | open | 16,500 | not attempted | 入口挂在主域 therundown.ai |
| 5 | stork.ai | https://www.stork.ai/submit-ai-tool | open | 11,000 | not attempted | |
| 6 | whattheai.tech | https://whattheai.tech/ | open | 8,900 | not attempted | |
| 7 | thataicollection.com | https://thataicollection.com/submit/details/ | open | 7,400 | not attempted | |
| 8 | ai-nav.net | https://ai-nav.net/ | open | 4,932 | not attempted | |
| 9 | aidirectory.org | https://www.aidirectory.org/ | open | 4,782 | not attempted | |
| 10 | listedai.co | https://www.listedai.co/submit | open | 4,600 | not attempted | |
| 11 | lachief.io | https://www.lachief.io/ | open | 3,000 | not attempted | |
| 12 | aitools.rdlab.tw | https://aitools.rdlab.tw/contact-us | open | 2,977 | not attempted | 走联系表单，属个人联系路线，核验后可能降级 |
| 13 | appsandwebsites.com | https://appsandwebsites.com/ | open | 1,854 | not attempted | |
| 14 | aitoolsia.com | https://aitoolsia.com/contact-us/ | open | 838 | not attempted | 同上，联系表单路线 |
| 15 | iuu.ai | https://iuu.ai/ | open | 553 | not attempted | |
| 16 | insidr.ai | https://www.insidr.ai/submit-tools/ | open | 511 | not attempted | flaq 清单备注「网页卡顿无法提交表单」 |
| 17 | stackviv.ai | https://stackviv.ai/ | open | 311 | not attempted | |
| 18 | reviewai.net | https://reviewai.net/ | open | 245 | not attempted | |
| 19 | thenextaitool.com | https://nextaitool.com/ | open | 221 | not attempted | |
| 20 | theaipedia.io | https://theaipedia.io/ | open | 170 | not attempted | |
| 21 | navs.site | https://navs.site/ | open | — | not attempted | 探针时流量数据缺失 |
| 22 | noxilo.com | https://noxilo.com/ | open | — | not attempted | 同上 |
| 23 | toolerific.ai | https://toolerific.ai/ | open | — | not attempted | 同上 |
| 24 | toolsfine.com | https://toolsfine.com/ | open | — | not attempted | flaq 清单有收录记录（他人产品），流量估算仅 10 |

## Batch 2 — 启动发布平台（开放表单 · 免费，10 站）

| # | 站点 | 提交入口 | cohort | 月访问 | 状态 | 备注 |
|---:|---|---|---|---:|---|---|
| 1 | saashub.com | https://www.saashub.com/ | open | 196,000 | not attempted | SaaS 替代品平台；flaq 清单备注「一个网站一次、阻止提交」，需现场核验 |
| 2 | techpluto.com | https://www.techpluto.com/submit-a-startup/ | open | 4,500 | not attempted | |
| 3 | thestartupinc.com | https://thestartupinc.com/ | open | 624 | not attempted | |
| 4 | taalk.com | https://taalk.com/submit-startup/ | open | 331 | not attempted | |
| 5 | feedmystartup.com | https://feedmystartup.com/ | open | 196 | not attempted | |
| 6 | joinly.xyz | https://www.joinly.xyz/ | open | — | not attempted | |
| 7 | startup88.com | https://startup88.com/ | open | — | not attempted | |
| 8 | startupcollections.com | https://startupcollections.com/submit-product/ | open | — | not attempted | flaq 清单备注「有收费引导」 |
| 9 | startupguys.net | https://www.startupguys.net/ | open | — | not attempted | |
| 10 | startups.snapmunk.com | https://startups.snapmunk.com/ | open | — | not attempted | |

## 已知的高价值后续队列（Batch 3 候选，需注册/过验证）

上游库中 AI 目录类共 71 条、整体可用 47 条；除上表外，其余集中在 `account` / `captcha` cohort（如 Product Hunt、Uneed、microlaunch、uneed.best 等，flaq 清单 107 条 AI 目录行亦可补充）。此批启动前需用户先建好账号并完成邮箱验证。

## 数据源

- yan-skills backlink data（MIT）：https://github.com/VastFuture/yan-skills/tree/main/backlink/data
- flaqai 743 站清单（107 条 AI 目录行，含停服/收费/反链备注）：https://github.com/VastFuture/vast-site-studio/blob/main/.agents/skills/backlink_skills/Free-backlink-list.md
