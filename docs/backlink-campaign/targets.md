# 渠道短名单（Batch 1 执行结果）

数据来源：yan-skills `backlink/data/submission-targets.json`（探针核验 2026-08-19）+ flaqai 743 站清单。
执行日期：**2026-09-28**（Pass A 复检 + Pass B 浏览器提交，截图证据存 `G:\Caches\Temp\bl\shots\`，会话级临时目录）。

## 结果总览

| # | 站点 | 月访问 | 状态 | 证据/备注 |
|---:|---|---:|---|---|
| 1 | dang.ai | 337,046 | excluded | magic-link 已登录（经用户转发链接）；点「Select Free」后现出真身：①提交须勾选「This is an AI tool/product, **not a generic directory**…」——Findry AI 本身就是通用 AI 目录，按其准入规则不符，勾选即虚假声明；②Free 档要求先在己站挂 dofollow 徽章、提供反链页 URL 且永久存活（互链红线）。Basic $49 / Pro $30+$19月 同样要求非目录类产品，不追 |
| 2 | ai-hunter.io | 22,479 | failed | 免费表单已填全（Aggregators/Free），POST admin-ajax 两次 **500**，判定其端点故障，勿盲目重试 |
| 3 | aitoolsarena.com | 20,483 | outcome-unknown | 悬浮联系表单已填提交；admin-ajax 混合 200/500、无回执、表单未清空；需查 support 邮箱确认 |
| 4 | supertools.therundown.ai | 16,500 | waiting-user | 页面写「complete the form below」但表单不渲染（懒加载失败）；官方渠道为邮件推荐 **support@therundown.ai**（文案已备好，见下） |
| 5 | stork.ai | 11,000 | excluded | 站点已转型「quality backlinks on autopilot」卖链接服务，按红线排除 |
| 6 | whattheai.tech | 8,900 | blocked-mail→gmail | 连续 3 次发 support@ 均不投递（发件链路问题）；2026-09-28 深夜改发用户自有 Gmail（fountain.chan19@，系统受理「Resend in 56s」），**待用户复制登录链接回传**后由自动化消费；账号将挂在 Gmail 名下 |
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

## Batch 2 — 启动发布平台（执行结果，2026-09-28 深夜）

原表 10 站 + 同源补充 3 站。结果：**新提交 1 站**（launchingnext）、**已在站 1 站**（saashub，用户此前提交过）、排除 6 站、受阻 3 站、暂缓 2 站。教训：2026-08 探针标记「开放表单」的站，复查时过半已撤表单或转订阅壳——**后续批次务必逐站先复检**。另据用户提示，此前战役还提交过 fazier.com（已在站，勿重复）。

| # | 站点 | 月访问 | 状态 | 证据/备注 |
|---:|---|---:|---|---|
| 1 | saashub.com | 196,000 | already-listed | 条目在 https://www.saashub.com/findry-ai-alternatives ；认领需邮箱验证或 meta 标签，暂不处理 |
| 2 | techpluto.com | 4,500 | excluded | 「Submit a Startup」页表单已移除，只剩 FAQ |
| 3 | thestartupinc.com | 624 | deferred | 复查时站点瞬断（ERR_CONNECTION_CLOSED）；CF7 表单确认存在（startup-name/industry/URL 等，日期/员工数/总部留空不编造），恢复后补交 |
| 4 | taalk.com | 331 | excluded | 提交页只剩搜索框，表单已移除 |
| 5 | feedmystartup.com | 196 | excluded | /submit/ 与 /submit-your-startup/ 均为空壳 |
| 6 | joinly.xyz | — | blocked-facts | 表单完整（名称/URL/邮箱/headline/描述/缩略图必填），但**必选国家下拉**无已核实事实，待用户给值；logo 512×512 可直接传 |
| 7 | startup88.com | — | excluded | 无提交路由（常见路径全 404），纯订阅站 |
| 8 | startupcollections.com | — | failed | 表单填全，POST /ajax 连续 **403**（防自动化），勿再撞 |
| 9 | startupguys.net | — | excluded | 「submit-startup」只有邮箱订阅框 |
| 10 | startups.snapmunk.com | — | blocked | 全站 Cloudflare 挑战页 |
| 补 | launchingnext.com | 2,400 | **submitted ✓** | 全表单+算术题（2+3）；跳转 /thanks/?i=154257，回执「manually review, format, and publish in 1 business day」 |
| 补 | microlaunch.net | 1,600 | blocked | Cloudflare 挑战页 |
| 补 | launched.io | 565 | deferred | 连接瞬断，入口 /newsubmission 确认存在（open cohort），恢复后补交 |

## Batch 3 — 需注册账号的站点（待用户注册）

按价值排序的注册清单（数据源 yan submission-targets.json 的 account/account-captcha 队列 + flaq 备注）：

| 优先 | 站点 | 月访问 | 注册门槛 | 注意 |
|---:|---|---:|---|---|
| 1 | **Product Hunt** producthunt.com | 402,900 | 账号（支持 Google/GitHub OAuth） | 走正式 launch 流程；需要 tagline、图库、maker 身份确认；PH 对目录站接受度尚可 |
| 2 | **10words.io** | — | 仅邮箱验证（最轻） | 描述限 10 词；邮箱验证链接发到注册邮箱 |
| 3 | **Uneed** uneed.best | — | 账号 | flaq 备注「一次只能提交一个产品」、有付费加速 |
| 4 | **BetaList** betalist.com | — | 账号+CAPTCHA | 偏好 pre-launch 产品；资料要求最细 |
| 5 | StartupBase startupbase.io | — | 账号 | flaq 备注「需先发高质量评论、互动投票才能发帖」——养号型，周期长 |
| 6 | alternative.me | — | 账号 | SaaS 替代品目录，可建 Findry AI 条目 |

长尾可选（账号制，价值一般）：fastlaunch.io、early.tools、dofollow.tools、canopydirectory.com、bestofai.com、aitach.com、altern.ai、bai.tools、aisourcehub.com、devhub.best、indiehackerstacks.com、firsto.co、e27.co（email-verify）。带 CAPTCHA 的：aitoolguru、aivalley、peerlist.io、f6s.com——CAPTCHA 环节须用户在场。

## 已提交（5 站）后续动作

> **邮箱补救记录（2026-09-28）**：提交当轮 support@findryai.com 尚未配置完成，dang.ai / whattheai 的首封 magic link 视为丢失；邮箱配好后已**重新触发两站 magic link**（dang.ai 回执「Check your inbox」、whattheai 回执「Resend in 112s」）。5 个已提交站的确认/审核邮件若在该窗口内退信，以 Gmail 收到的退信（Mail Delivery Subsystem）为准，对确认被退的站重新提交一遍即可——其余站提交走的是站内表单，不受影响。

- 留意 **support@findryai.com**：各站审核通过/上架通知会发到该邮箱；ai-hunter 类站点若收到重复提交提示请忽略（其 500 应未落库）。
- 收录核查（1~2 周后逐站搜 site 域名）：
  - listedai.co、lachief.io、insidr.ai、reviewai.net、ai-nav.net
- aitoolsarena.com / iuu.ai 结果未知：查邮箱有无往来即可确认。

## 待用户处理队列

1. ~~magic link 两站~~（大部分了结）：dang.ai 已排除（准入不符+互链红线）；whattheai 已改发用户 Gmail，**待用户复制登录链接回传**（勿点击，token 一次有效）。
1b. **Batch 3 注册**：见上表——用户注册 PH / 10words / Uneed / BetaList 等账号后，把登录会话交给自动化或按站内指引提交。
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
