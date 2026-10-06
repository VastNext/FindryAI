# Findry AI 外链建设战役（Backlink Campaign）

为 findryai.com 获取真实、可发现、可长期存活的目录收录与启动平台曝光。方法与规则改造自两套开源技能：

- [VastFuture/vast-site-studio](https://github.com/VastFuture/vast-site-studio) → 内含 [VastFuture/backlink_skills](https://github.com/VastFuture/backlink_skills)（`submit-product-directories-v2-quality` 提交规范 + 743 站渠道清单）与 [VastFuture/yan-skills](https://github.com/VastFuture/yan-skills) `backlink` 技能（492 条经探针核验的提交入口数据库，MIT）。
- 本目录的渠道短名单主要取自 yan-skills `backlink/data/submission-targets.json`（探针核验日期 **2026-08-19**），以 flaqai 743 站清单为补充来源。

## 目标与红线

**目标**：让 Findry AI 出现在用户真正用来发现 AI 工具的目录与启动平台上，获得引荐流量与品牌曝光。

**红线**（沿用 V2 Quality 的合规边界）：

- 只用品牌名或裸 URL 作锚文本；不要求 dofollow，不追求数量指标。
- 不编造任何事实：创始人、用户数、融资、社交账号等未知字段一律留空。
- CAPTCHA、邮箱验证、账号注册等人工步骤交给用户，不绕过任何安全机制。
- 要求互链（reciprocal）、付费上榜、纯卖链接的站默认排除；如需破例须逐站明确批准。
- 不通过本战役批量发文章、客座帖、社区帖或冷邮件（属于另一条内容路线）。
- **KPI 只看**：收录率、引荐访问、资料准确度、收录存活时长。**不看**：提交数、外链数、dofollow 数、DA/DR。

## 产品事实（提交表单唯一事实来源）

以下事实取自 `src/config/site.ts`，提交表单只准填这些；其余字段留空。

| 字段 | 值 |
|---|---|
| 名称 | Findry AI |
| 网址 | https://findryai.com |
| 一句话 | Discover curated AI tools for every task |
| 描述 | Discover curated AI tools for work, creativity, development, research, and everyday tasks. |
| 分类 | AI tools directory / AI 工具目录 |
| 联系邮箱 | support@findryai.com |
| Logo | https://findryai.com/logo.png（暗色 https://findryai.com/logo-dark.png） |
| 社交 | 未配置 Twitter/GitHub/YouTube —— 相关字段留空 |

提交链接一律用裸 URL，不加 utm 参数（`site.ts` 的 utm 配置只用于本站出站导航）。

## 工作流（两遍式状态机）

每个站点按状态推进，记录在 `targets.md` 的状态列：

```
not attempted → eligibility（入口存活？要反链/付费？）→ quality-gate
  → submitted（留证：提交回执/截图）
  → waiting-verification（邮箱验证 → 用户处理）
  → waiting-review → published / outcome-unknown / failed / excluded
```

- **Pass A（只读核验）**：执行前逐站重新访问入口（数据是 2026-08-19 探针的，会过期）；确认表单字段、是否要反链/付费/注册、Findry AI 是否已被收录（重复提交前先查）。
- **Pass B（授权执行）**：用户批准某一批后才能开填；每完成一站立即写状态，再进入下一站；「提交结果未知」不得盲目重试，先查邮箱与公开页。
- 中断可恢复：状态列即断点，从未完成处继续。

## 批次规划

| 批次 | 内容 | 渠道数 | 状态 |
|---|---|---|---|
| 1 | 开放表单、免费、流量达标的 AI 工具目录 | 24 | 待批准 |
| 2 | 启动发布平台（Product Hunt 系替代品） | 10 | 待批准 |
| 3 | 需注册/CAPTCHA 的 AI 目录与 SaaS 评论站 | 按需 | 未开 |
| 4 | 免注册即时发布渠道（telegra.ph 等） | 27 | 可选，发现价值低 |

渠道明细见 [targets.md](targets.md)。Batch 3 的候选可从上游 `submission-targets.json`（492 条，cohort=account/captcha）按需再筛。

## 后续扩展（不在本战役范围）

上游工作室的「每日 2 小时外链 SOP」还包含两条内容路线，将来可另立战役：抄竞对最佳外链（Semrush/Ahrefs 免费版逐条攻克）、技术社区长文（dev.to / Medium / LinkedIn，用 `backlink_skills/writer` 系技能）。
