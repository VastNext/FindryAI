# 渠道短名单（Batch 1 执行结果）

数据来源：yan-skills `backlink/data/submission-targets.json`（探针核验 2026-08-19）+ flaqai 743 站清单。
执行日期：**2026-09-28**（Pass A 复检 + Pass B 浏览器提交，截图证据存 `G:\Caches\Temp\bl\shots\`，会话级临时目录）。

## 结果总览

| # | 站点 | 月访问 | 状态 | 证据/备注 |
|---:|---|---:|---|---|
| 1 | dang.ai | 337,046 | waiting-verification | 「Submit a tool」需 magic-link 登录；已向 support@findryai.com 触发登录邮件（页面回执「Check your inbox」） |
| 2 | ai-hunter.io | 22,479 | failed | 免费表单已填全（Aggregators/Free），POST admin-ajax 两次 **500**，判定其端点故障，勿盲目重试 |
| 3 | aitoolsarena.com | 20,483 | outcome-unknown | 悬浮联系表单已填提交；admin-ajax 混合 200/500、无回执、表单未清空；需查 support 邮箱确认 |
| 4 | supertools.therundown.ai | 16,500 | waiting-user | 页面写「complete the form below」但表单不渲染（懒加载失败）；官方渠道为邮件推荐 **support@therundown.ai**（文案已备好，见下） |
| 5 | stork.ai | 11,000 | excluded | 站点已转型「quality backlinks on autopilot」卖链接服务，按红线排除 |
| 6 | whattheai.tech | 8,900 | waiting-verification | 提交需 magic-link 登录；已触发登录邮件（按钮回执「Resend in 29s」） |
| 7 | thataicollection.com | 7,400 | waiting-user-decision | 四步向导已走通、资料完整入草稿，但发布按钮为 **Publish now — $19 一次性付费**；是否付费由用户定 |
| 8 | ai-nav.net | 4,932 | submitted ✓ | 中文投稿表单（分类：AI学习网站）；提交后表单清空 + admin-ajax 200，进入人工审核 |
| 9 | aidirectory.org | 4,782 | blocked | /user-submit/ 必填公司地址、电话——无此已核实事实，按红线不编造 |
| 10 | listedai.co | 4,600 | submitted ✓ | 全字段表单，POST /submit 200 |
| 11 | lachief.io | 3,000 | submitted ✓ | Tally 表单：分类 Aggregators、Topic「Startup Tools」、定价 Free、logo 已传；「Form submitted!」回执 |
| 12 | aitools.rdlab.tw | 2,977 | blocked-manual | 「推薦工具」联系表单已填，但点击「提交申請」无任何请求发出（疑似客户端门禁）；需人工在浏览器提交 |
| 13 | appsandwebsites.com | 1,854 | blocked | 外部提交表单必填 **Phone**——无已核实电话号码 |
| 14 | aitoolsia.com | 838 | excluded | 提交入口 404 |
| 15 | iuu.ai | 553 | outcome-unknown | GET 表单提交被静默吞掉（回到原页、无回执、字段保留） |
| 16 | insidr.ai | 511 | submitted ✓ | Elementor 表单，回执「Your submission was successful.」 |
| 17 | stackviv.ai | 311 | failed | /submit 页 500 Internal Server Error |
| 18 | reviewai.net | 245 | submitted ✓ | 回执「Thanks! We'll review your tool and publish it soon.」+ POST /api/submit.php 200 |
| 19 | thenextaitool.com | 221 | excluded | 全站无提交入口（/submit 404，首页无链接） |
| 20 | theaipedia.io | 170 | excluded | contact-us 页无表单，仅邮件路线 |
| 21 | navs.site | — | blocked-manual | 7 步向导卡死在第 1 步（URL 校验假阳性，Continue 不前进）；基础字段均已填，需人工过一遍 |
| 22 | noxilo.com | — | excluded | 「submit-tool」实为订阅表单，无收录表单 |
| 23 | toolerific.ai | — | failed | /submit-a-tool 持续 502（首页正常） |
| 24 | toolsfine.com | 10 | waiting-user-decision | 表单可填但提交按钮为「Continue to Stripe - **$16**」；是否付费由用户定 |

## 已提交（5 站）后续动作

- 留意 **support@findryai.com**：各站审核通过/上架通知会发到该邮箱；ai-hunter 类站点若收到重复提交提示请忽略（其 500 应未落库）。
- 收录核查（1~2 周后逐站搜 site 域名）：
  - listedai.co、lachief.io、insidr.ai、reviewai.net、ai-nav.net
- aitoolsarena.com / iuu.ai 结果未知：查邮箱有无往来即可确认。

## 待用户处理队列

1. **点击两封 magic link**（发件后 15–60 分钟内有效）：dang.ai、whattheai.tech → 登录后按「产品事实」提交。
2. **邮件推荐**（therundown.ai，表单损坏）：发 support@therundown.ai，主题 `Tool recommendation: Findry AI`，正文：
   > Tool name: Findry AI — https://findryai.com
   > Tagline: Discover curated AI tools for every task
   > Description: Findry AI is a curated AI tools directory for discovering, comparing and submitting AI tools for work, creativity, development, research and everyday tasks.
   > Category: AI tools directory / Aggregator · Pricing: Free · Contact: support@findryai.com
3. **付费决策**（不催）：thataicollection.com $19 / toolsfine.com $16——若同意付费，说一声即可由我继续走完支付前的最后一步。
4. **人工补交**（自动化被卡）：navs.site（7 步向导第 1 步）、aitools.rdlab.tw（推薦工具表单）。
5. **缺事实项**：appsandwebsites.com 与 aidirectory.org 必填电话/地址——提供已核实的公司电话后可补交。

## 数据源

- yan-skills backlink data（MIT）：https://github.com/VastFuture/yan-skills/tree/main/backlink/data
- flaqai 743 站清单：https://github.com/VastFuture/vast-site-studio/blob/main/.agents/skills/backlink_skills/Free-backlink-list.md
