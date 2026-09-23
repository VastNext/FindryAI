# Jev 词族建设与全站 SEO 缺陷修复实施计划

> **文档状态：待实施计划**
> **基线来源：** `docs/research-info-from-other-site.md`，以及当前仓库代码审查结果。
> **重要边界：** 本计划可以验收代码、页面、内容事实和搜索数据采集是否完成，但不能承诺 Google 必然提升排名、点击率或展示富结果。

## 1. 目标与非目标

### 1.1 目标

1. 修复 `/item/unsummary` 的错误官网链接、错误产品描述和缓存传播问题。
2. 优化 `/agent-skills` 的标题、描述和社交分享元数据；将 CTR 优化作为可观测实验，而不是已证明的因果结论。
3. 全量核对 `/typesafe-jev` 的重复事实、官方指标、绝对化表述、命名来源说明和页面元数据。
4. 建立 Jev 词族的第一个独立 Spoke：`/how-to-use-jev`，明确区分“获取访问权限”与“生态集成方式”。
5. 建立 Hub（`/typesafe-jev`）与 Spoke（`/how-to-use-jev`）的搜索意图边界、双向内链和可抓取站内入口。
6. 用可重复的检查项验证：生产 HTML、Sanity 数据、Sitemap、Metadata、JSON-LD、响应式交互、代码示例和构建结果。

### 1.2 非目标

- 不保证修改 TDK 后一定提升 CTR 或排名；低曝光数据只能标记为“数据不足”。
- 不保证 JSON-LD 合法后 Google 必然展示 FAQ、Article 或其他富结果。
- 不把 LiteLLM、Pydantic AI、LangChain 等封装/编排方式描述成可以直接获得 Jev 权限的渠道。
- 在 SDK 包名、API 字段、价格和免费窗口尚未附来源并完成核验前，不发布“可直接运行”或“当前价格”的确定性表述。
- 不新增与本计划无关的通用 Jev 教程、重复 FAQ 或第二个近似的 API 接入页。

## 2. 内容与搜索意图边界

### 2.1 Hub：`/typesafe-jev`

负责：

- TypeSafe、System One、RLCD 的全景解释；
- Noul、Choice、Score 的原理、适用范围和限制；
- 官方事实、性能指标和生态证据的来源说明；
- 面向 `typesafe jev`、`jev model`、`system one model` 等总览意图。

不负责：

- 逐一比较所有访问渠道；
- 复写完整的十分钟接入教程；
- 复写 Spoke 的四个完整业务代码示例。

### 2.2 Spoke：`/how-to-use-jev`

负责：

- “我现在如何获得访问权限、应该选哪条路”；
- 官方 API、网关和第三方代理的边界、条件、价格核验日期；
- 已经过真实 SDK 或 mock 验证的最小接入示例；
- 业务配方和安全阈值设计。

不负责：

- 完整复写 Hub 的 System One / RLCD 原理；
- 把未核实的 TypeScript SDK 包名写成确定事实；
- 将所有生态集成方式都称为“获取 API Key 的渠道”。

### 2.3 事实证据登记

新增页面的每一项时效事实都必须在数据对象中携带或能够追溯到以下信息：

- 来源 URL；
- 核验日期和时区；
- 事实类型：官方、官方合作方、第三方集成或社区项目；
- 是否需要 TypeSafe 官方 Key；
- 价格/免费窗口的适用条件和失效日期。

OpenRouter 价格、TypeScript SDK 包名与安装命令、官方创始人/融资事实、版本号等在来源文档中标记为待核验，核验前不得写入确定性文案。

## 3. 实施顺序与任务

### Task 0：建立执行前基线与变更边界

**涉及文件：**

- `docs/research-info-from-other-site.md`
- 本计划文件

**步骤：**

1. 记录当前生产页面的 URL、HTTP 状态、最终 URL、标题、Description、Canonical、`og:url` 和页面正文摘要。
2. 记录 `/agent-skills` 当前 GSC 基线：观察期、曝光、点击、CTR、平均排名；注明当前数据不足以证明 0 点击原因。
3. 记录 Jev Hub 当前 GSC 基线：60 次曝光、0 点击、平均排名 6.3 只是来源文档中的历史快照，实施时重新确认。
4. 检查工作区已有改动，严禁将 `tmp-shots/`、`.env`、Sanity token 或其他无关文件混入提交。

**完成检查：**

- [ ] 基线记录包含数据日期，不把历史快照当成实时数据。
- [ ] 已执行 `git status --short`，并明确本任务允许修改的文件范围。
- [ ] 已确认 `gpt-6-astra` 域名镜像修复不在本计划中重复修改。

---

### Task 1：安全修复 `/item/unsummary` 的 Sanity 数据

**涉及文件：**

- Modify: `scripts/patch-unsummary-sanity.ts`
- Optional Create: `scripts/audit-item-links.ts`
- Remote: Sanity published dataset

**实施步骤：**

1. 在执行脚本中明确读取并打印目标 `projectId`、`dataset` 和目标 slug；禁止缺少 `SANITY_API_TOKEN` 时以成功状态退出。
2. 执行前读取并保存目标条目的 `_id`、`link`、`description`、`introduction`，形成可回滚记录；不得把 token 写入日志。
3. 查询结果为 0 条、超过 1 条或目标 `_id` 不符合预期时，以非零退出码终止，禁止静默更新错误条目。
4. 更新字段：
   - `link`: `https://unsummary.com`；
   - `description`: 准确描述书籍、播客、电影或长文章的 AI 总结能力；
   - `introduction`: 只写已核验的核心能力、使用方式、价格/额度和官网链接。
5. `.commit()` 失败时设置非零退出码，并输出具体 `_id`；多条更新时记录每条成功/失败状态。
6. 提交后重新读取 published 数据并断言三个字段与预期一致。
7. 通过明确的批次条件（来源字段、创建时间窗口或人工确认的 slug 清单）进行全量官网域名扫描；20 条抽检只能作为补充，不能替代全量扫描。

**缓存传播：**

- 通过项目现有 `/api/revalidate` 机制调用 `/item/unsummary` 的路径刷新；计划中必须记录实际请求方式、认证参数来源和预期响应。
- 若 Sanity CDN 或 Next Data Cache 仍返回旧内容，使用项目既有的禁用缓存/等待 CDN 失效方案，不得以 HTTP 200 代替内容已更新的证明。

**完成检查：**

- [ ] 缺少 token、查询为空、匹配多条、提交失败、回读不一致均会失败退出。
- [ ] 已保存可回滚的旧值，且回滚方式已记录。
- [ ] Sanity published 数据中的 `link`、`description`、`introduction` 均已回读确认。
- [ ] 生产页面最终 HTML 不含 `easywithai.com` 或旧 UTM 链接。
- [ ] 页面正文、官网按钮、OpenGraph 描述和结构化数据没有残留旧文案。
- [ ] `/api/revalidate` 返回成功，刷新后页面 HTML 与 Sanity published 数据一致。
- [ ] 已完成全量外链域名扫描，并对 20 条同批条目进行人工抽检；允许域名和禁止域名规则有记录。

---

### Task 2：优化 `/agent-skills` 元数据并建立 CTR 观察实验

**涉及文件：**

- Modify: `src/app/(website)/(public)/agent-skills/page.tsx`

**建议文案：**

- Title：`280+ Best AI Agent Skills & MCP Servers: Ready-to-Use GitHub Tools (2026)`
- Description：`Discover 280+ battle-tested open-source AI agent skills, MCP servers, and harnesses with direct GitHub repos, quickstart configs, and execution benchmarks.`

**实施步骤：**

1. 使用项目现有 `constructMetadata`，保持 `title`、`description`、Canonical 和站点标题模板的正常继承。
2. 显式确认 `openGraph.title/description/url` 和 `twitter.card/title/description` 的最终值，不只修改 OpenGraph。
3. 记录文案精确字符数，并确认没有超过项目允许的元数据长度范围。
4. 发布后在同一观察窗口重新记录曝光、点击、CTR、平均排名，并按查询、国家、设备拆分。
5. 设置最低曝光阈值和观察周期（建议至少 14 天）；平均排名变化较大时，不将 CTR 变化单独归因于 TDK。

**完成检查：**

- [ ] 最终 HTML 的 `<title>`、`description`、Canonical、`og:*`、`twitter:*` 均符合预期。
- [ ] 主元数据、OpenGraph 和 Twitter 文案没有互相矛盾。
- [ ] 已保存修改前基线和修改后观察计划；未把“TDK 已改”写成“CTR 已提升”。
- [ ] 页面正文仍然与新标题承诺的“skills / MCP / GitHub tools”一致。

---

### Task 3：全量修正 `/typesafe-jev` 事实、元数据和更新时间

**涉及文件：**

- Modify: `src/data/typesafe-jev.ts`
- Modify: `src/app/(website)/(public)/typesafe-jev/page.tsx`
- Modify: `src/components/typesafe-jev/typesafe-jev-landing.tsx`

**实施步骤：**

1. 对 `typesafe-jev.ts` 做全量搜索，核对 `description`、`heroStats`、`comparisonTable`、`faqs`、`designPatterns`、正文段落、来源列表和页面 metadata 中的重复指标。
2. 只有在官方页面或有明确来源的情况下，使用 `193.6x Faster, 444.6x Cheaper`；同时标记这是官方自测，不改写成 Findry 独立实测。
3. 将 0.114s / `$0.000081` 与 8.566s / `$0.013880` 的比较明确标注来源、测试口径和日期，避免与 `$0.042/1M input tokens` 混成同一指标。
4. 将 `Jev` 源于 Jevons Paradox 的陈述改成“官方未确认、社区推测”，并同步修改 FAQ 与正文所有重复位置。
5. 审查“zero hallucinations”“compile-time type safety”等绝对化表述：保留时必须注明是产品主张/适用边界；否则改成限定性描述。
6. 将 `description` 控制在 150–160 个字符以内，关键指标前置；先通过脚本计算实际字符数，不以估算值作为验收。
7. 增加统一的 `lastUpdated`、`dateModified` 和 changelog 数据源，并在 landing 组件显著展示；只有发生实质核验或内容修改时才更新日期。

**完成检查：**

- [ ] 已全量搜索并处理所有重复指标和命名来源表述。
- [ ] 每个官方指标均有来源 URL、核验日期和“官方自测/独立实测”标签。
- [ ] 页面正文、FAQ、OG、Description 和 JSON-LD 中的数值一致。
- [ ] `lastUpdated`、页面可见日期、JSON-LD `dateModified` 和 Sitemap `lastModified` 来自同一真实日期。
- [ ] 生产 HTML 的 Description 长度在 150–160 字符内，Title 未被项目模板意外重复拼接。
- [ ] 更新日期没有因为重新部署或 Sitemap 生成而无依据地变化。

---

### Task 4：建立 `/how-to-use-jev` 的事实数据模型

**涉及文件：**

- Create: `src/data/how-to-use-jev.ts`

**数据边界：**

将内容分成两组，避免误导：

1. **访问权限渠道**：TypeSafe Direct、Vercel AI Gateway、OpenRouter、Requesty，以及经核验确实可以提供访问的其他网关。
2. **集成/编排方式**：LiteLLM、Pydantic AI、LangChain 等。每项必须标明“仍需要哪一种 Jev Key”，不能与访问权限渠道混列。

每一项数据必须包含：名称、类型、获取方式、价格/条款、是否需要官方 Key、适用场景、官方链接、来源 URL、核验日期和失效/复核日期。

**发布前必须核验：**

- OpenRouter 当前模型名称与价格；
- TypeScript SDK 的真实包名、安装命令、版本和响应字段；
- 官方 API endpoint、认证方式和限流说明；
- Vercel/Lovable 免费窗口是否仍然有效；
- TypeSafe 官方价格、赠送额度和 waitlist 条件；
- Noul、Choice、Score 的真实字段和边界。

**配方要求：**

- 只有满足“独立文件、依赖完整、环境变量说明完整、锁定 SDK 版本、可在 mock 或测试凭证下运行、关键返回值有断言”的示例，才可标为“可运行配方”。
- 如果无法完成真实运行验证，标题必须写为“代码片段/示意”，不得写“可直接复制运行”。
- 每个配方应有明确的输入、输出、错误处理、阈值含义和不适用场景。

配方方向保留四类：客服工单分流、RAG 分块过滤、多维严重度评分、Agent 外部动作门禁；但不得使用未定义的 `response`、`client`、业务函数或隐含变量。

**完成检查：**

- [ ] 访问渠道与集成方式已分栏，所有价格/免费窗口有来源与核验日期。
- [ ] TypeScript 示例未核验前不会被当作已支持的官方 SDK。
- [ ] 四个配方逐个标明“可运行”或“示意”，状态与实际验证结果一致。
- [ ] FAQ 不重复 Hub 的完整原理说明，且每个答案都能在页面正文找到依据。

---

### Task 5：实现 `/how-to-use-jev` 页面与可访问交互

**涉及文件：**

- Create: `src/components/how-to-use-jev/how-to-use-jev-landing.tsx`
- Create: `src/app/(website)/(public)/how-to-use-jev/page.tsx`

**页面结构：**

- 首屏 TL;DR：是什么、最快访问路径、最小调用、成本、关键限制；
- 访问权限渠道对比；
- 经过验证的 Python/TypeScript Quickstart；
- 四个配方；
- 限制与失败模式；
- 成本计算器（如实现，必须有输入校验）；
- FAQ；
- 明确回链 Hub 的原理深读入口。

**交互与服务端边界：**

- SEO 正文、表格、代码和 FAQ 默认由 Server Component 输出；
- 复制按钮、Tabs、成本计算器等才使用 Client Component；
- Clipboard API 不可用时仍能阅读和手动复制代码；
- JavaScript 失败时，核心正文、链接和 FAQ 仍可见；
- 成本计算器拒绝空值、负数、非数字、Infinity 和 NaN，并显示中文错误提示。

**完成检查：**

- [ ] 375px、414px、平板和桌面视口均无横向溢出。
- [ ] 深色/浅色主题下正文、表格、代码、焦点态和错误态均可读。
- [ ] 键盘可操作 Tabs、FAQ、复制按钮和外链；焦点指示清晰。
- [ ] 复制成功、失败和 Clipboard API 不存在三种状态均有可验证结果。
- [ ] 页面核心内容在禁用 JavaScript 后仍存在于服务端 HTML。

---

### Task 6：配置 Metadata、JSON-LD、公开路由和 Sitemap

**涉及文件：**

- `src/app/(website)/(public)/how-to-use-jev/page.tsx`
- `src/routes.ts`
- `src/app/sitemap.ts`
- 必要时：`src/lib/metadata.ts`

**Metadata 实施约定：**

必须使用项目的 `constructMetadata`，不能把 `canonicalUrl` 当作 Next Metadata 顶层字段。应沿用现有页面模式：

```ts
const canonicalUrl = `${siteConfig.url}/how-to-use-jev`;
const baseMetadata = constructMetadata({
  title: "How to Use Jev AI: Access, Setup & Production Recipes",
  description: "...",
  canonicalUrl,
});

export const metadata = {
  ...baseMetadata,
  openGraph: { ...baseMetadata.openGraph, url: canonicalUrl },
  twitter: { ...baseMetadata.twitter },
};
```

**路由与缓存：**

- `publicRoutes` 增加 `"/how-to-use-jev(/.*)?"` 只用于保持公开路由清单一致；不要为该公开页面扩大 `middleware.matcher`。
- 页面设置 `revalidate` 时，缓存验证应检查实际响应和最终 HTML，不能把 `publicRoutes` 当成 Edge CDN 开关。

**JSON-LD：**

- `TechArticle`、`FAQPage`、`BreadcrumbList` 只描述页面可见且已核验的内容；
- `dateModified` 与统一 `lastUpdated` 相同；
- FAQ 每个问题和答案都必须在页面可见；
- Breadcrumb 的 URL、名称和层级与实际导航一致；
- 不在 JSON-LD 中额外声明正文没有支持的价格、性能或绝对保证。

**Sitemap：**

- 在 `staticRoutes` 中加入 `/how-to-use-jev`；
- 使用统一真实修改日期，不能无条件使用 `new Date()` 制造伪更新时间；
- 验证 `/sitemap.xml` 索引和 `/sitemap/pages.xml` 分片；
- 验证 URL 使用生产主域、无重复、页面返回 200。

---

### Task 7：建立 Hub-Spoke 内链和站内可抓取入口

**涉及文件需先固定落点：**

- Modify: `src/components/typesafe-jev/typesafe-jev-landing.tsx`
- Modify: `src/components/how-to-use-jev/how-to-use-jev-landing.tsx`
- 首页实际服务端内容组件：以 `src/components/home/home-content.tsx` 或实际确认的组件为准，不使用“或对应组件”作为最终计划路径。
- AI Daily 实际页面/视图：先确认 `src/app/(website)/(public)/ai-daily-feeds/page.tsx` 与 `TweetFeedView` 的职责，再选择服务端可抓取插入点。

**实施步骤：**

1. Hub 至少一处高可见度、自然锚文本链接到 Spoke；如增加两处，必须处于不同用户意图上下文，不机械重复。
2. Spoke 在 TL;DR 和原理边界处回链 Hub；不要为了满足数量堆砌三处重复链接。
3. 首页或 AI Daily 至少一个服务端输出的专题入口链接到 Hub 或 Spoke；不能只放在客户端异步数据中。
4. 内链文案应区分“深度原理”和“访问/接入指南”，并在发布前做标题、H1、Description、首屏段落、FAQ 和代码主题重叠检查。

**完成检查：**

- [ ] Hub 和 Spoke 的主要查询意图、首屏承诺、FAQ 和代码边界有记录。
- [ ] 两页没有大段重复内容或相同 FAQ 的机械复制。
- [ ] Hub → Spoke 和 Spoke → Hub 链接均存在且为真实 `<a href>`/Next `Link`。
- [ ] 首页或 AI Daily 的入口在服务端 HTML 中可见，即使客户端数据加载失败也不消失。
- [ ] 发布后 GSC 观察的是 URL 与查询的分工，不把“有内链”直接等同于“排名提升”。

## 4. 完成后的总检查清单

### 4.1 数据、缓存和回滚

- [ ] Sanity 目标 project/dataset 正确，未误写其他环境。
- [ ] Sanity 补丁具备非零失败退出、更新后回读、旧值备份和回滚方式。
- [ ] Unsummary 的 published 数据、生产 HTML、最终 href 和缓存刷新结果一致。
- [ ] 全量 item 官网域名扫描完成，异常条目有清单和处理结论。
- [ ] 没有把 Sanity token、`.env`、临时抓取文件或截图提交进 Git。

### 4.2 页面内容与事实

- [ ] Unsummary 不再出现 `easywithai.com`、错误扩写描述或旧 UTM 链接。
- [ ] Jev 全文重复指标、来源、版本、创始人/融资、价格和绝对化主张均已逐项核验。
- [ ] 官方自测、第三方报道、社区推测和 Findry 独立观察有明确标签。
- [ ] 所有时效内容均有来源 URL、核验日期、复核日期和失效条件。
- [ ] Hub 与 Spoke 的内容边界和目标搜索意图没有冲突。

### 4.3 Metadata、Canonical、社交卡片

- [ ] `/typesafe-jev`、`/agent-skills`、`/how-to-use-jev` 最终 HTML 中 `<title>` 正确，站点模板只拼接一次。
- [ ] Description 字符数通过脚本测量，并处于计划规定范围。
- [ ] 每页只有一个预期 Canonical，`alternates.canonical`、`og:url` 与主域一致。
- [ ] `og:title`、`og:description`、`og:url`、`twitter:card`、`twitter:title`、`twitter:description` 均正确。
- [ ] 子域访问不会产生新的 Jev 内容副本或错误 Canonical；新页面只发布在主域。

### 4.4 JSON-LD 与 Sitemap

- [ ] JSON-LD 是合法 JSON，页面可解析且无重复/冲突的 Schema。
- [ ] `TechArticle` 的标题、作者、发布日期、修改日期和正文一致。
- [ ] FAQPage 的每一问答在页面可见，且没有夸大正文未支持的事实。
- [ ] Breadcrumb 的名称和 URL 与实际页面层级一致。
- [ ] Rich Results Test 通过语法/资格检查；记录“通过不代表 Google 必然展示富结果”。
- [ ] `/sitemap.xml` 索引和 `/sitemap/pages.xml` 均包含主域 URL；无重复、错误 host、错误 lastModified。

### 4.5 代码示例与交互

- [ ] 每个“可运行配方”在干净环境中安装锁定版本依赖后实际运行。
- [ ] 每个配方都有完整入口、输入、环境变量、异常处理和关键返回值断言。
- [ ] 无未定义的 `client`、`response`、`user_question`、业务函数或隐含外部状态。
- [ ] 无法真实运行的示例已明确标成“示意代码”，没有使用“可直接运行”措辞。
- [ ] Python/TypeScript 示例的包名、安装命令、endpoint、字段和响应结构均有来源。
- [ ] 复制按钮、Tabs、FAQ、成本计算器在成功、失败、空值和无 JS 情况下行为可接受。
- [ ] 页面在 375px、414px、平板、桌面、浅色和深色主题下无溢出且可键盘操作。

### 4.6 构建、运行和路由回归

- [ ] `pnpm exec biome check .` 通过；不使用会改写文件的 lint 命令作为只读验证。
- [ ] `pnpm build` 通过，无 TypeScript、路由冲突、未定义变量或 hydration 错误。
- [ ] 本地开发服务就绪后，匿名访问 `/how-to-use-jev` 返回 200 且不会跳登录。
- [ ] `/how-to-use-jev` 没有被动态 `[slug]` 路由错误捕获，页面内容归属正确。
- [ ] 生产页面、Sitemap、Canonical、OG URL 和内链均使用 `findryai.com` 主域。
- [ ] `git diff --check` 通过，变更范围只包含本计划涉及文件和必要的验证产物。
- [ ] 提交前已检查 `git status --short`、`git diff` 和近期提交记录；未提交无关现有改动。

### 4.7 发布后观察（不是代码完成的硬门槛）

- [ ] 记录部署时间、索引请求时间和 GSC 数据可用时间。
- [ ] 14–28 天后重新记录 `/agent-skills` 的 CTR、排名、曝光和查询分布；曝光不足时标记“无法判断”。
- [ ] 记录 `/typesafe-jev` 与 `/how-to-use-jev` 是否获得不同查询簇，是否发生 URL 蚕食。
- [ ] 记录外部渠道价格、免费窗口、SDK 和 endpoint 是否发生变化，并按实质更新维护 `lastUpdated`。
- [ ] 在 GSC 增强结果报告或实际 SERP 中观察结构化数据表现，但不把未展示富结果判为代码失败。

## 5. 提交门禁

验证通过后，按仓库规则执行：

1. 只暂存本计划涉及的源文件、脚本和文档；
2. 检查 `git status --short`、`git diff`、`git diff --check` 和近期提交记录；
3. 使用符合仓库惯例的 Conventional Commit；
4. 提交后立即推送当前分支；
5. 若涉及可访问页面，验证通过并推送后再按仓库规则创建 Preview，不得直接生产部署。
