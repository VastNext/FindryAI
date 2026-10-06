# findryai.com 定价策略研究（2026-09-28）

> 支付功能上线前的竞品定价调研与建议。数据来源与可信度见文末。

## 一、findryai 现状（`src/config/price.ts`）

| 档位 | 显示价格 | 实际计费 | 权益 |
|---|---|---|---|
| Free | $0 | — | 限量免费投稿，编辑审核 24-72h，永久收录，3 条高权重 dofollow 外链，标准队列 |
| Pro | $19.9 USD | 一次性（`mode: "payment"`） | 12h 优先审核、首页+分类置顶 featured、获奖徽章、newsletter + 每日推文推广、dofollow 加成（标 POPULAR，文案写 Coming Soon） |
| Sponsor | $99 / month | **一次性**（同为 `mode: "payment"`） | 全站 sticky banner、10 万+ 月展示（自述）、分类独占、UTM 报告、VIP 对接（描述写 Inquire） |

**上线前必须修的不一致：**
1. **Sponsor 显示「/ month」但结账是一次性支付**——`create-checkout-session.ts` 对两档都用 `mode: "payment"`。要么建 Stripe recurring price 走 `mode: "subscription"`，要么改文案为按周/一次性。
2. Pro 档文案仍带 "(Coming Soon)"，上线时需删除。
3. Free 档承诺 24-72h 审核 + 3 条 dofollow，比很多竞品的**付费档**还慷慨，直接顶掉了 Pro 的付费理由（见下文）。

## 二、竞品定价地图

### 头部站（SEMRush 权重 43-51，月访数十万至千万级）

| 站点 | 收录/推广价 | 模式 | 说明 |
|---|---|---|---|
| **There's An AI For That**（官方页核实） | $49 基础 / $437 Max Exposure / 定制 Launch Plan | 全部一次性 | $49：永久收录、首周约 50-100 点击；$437（最热门）：约 10x 点击 + 其 250 万订阅 newsletter 位置（自估价值 $1000）+ 优先审核；免费仅每月 X 帖抽 1 个；审核 1-2 天；未发布全额退款 |
| Futurepedia | $247 起 | 一次性 | 第三方转述，未在官方页核实 |
| Easy With AI | $79.99 起 | 一次性 | 第三方转述 |
| Toolify | $99 起 | 一次性 | 第三方转述；免费投稿社区口径仍开放 |
| Aixploria | $79 起 | 一次性 | 第三方转述；官方 featured 页为 JS 渲染未能核实 |

### 中部站（一次性 $25-$99，新目录的主战场）

TopAI.tools $45 ｜ PopularAITools.ai $39 ｜ Powerusers AI $49 ｜ Nextool 快审 $49 ｜ funfun.tools Fast Track $99 ｜ GPTE $99（featured $167）｜ aitools.fyi 插队 $30（自述 10 万+ 月访、24h 审核）｜ Uneed 快审 $30 ｜ AI Tool Hunt $25 ｜ AI Journey $29 ｜ AI Parabellum $29 ｜ Bot.to $29 ｜ DoMore.ai $30 ｜ AI Tools One $24.99 ｜ AllTopStartups $29 ｜ SaaS AI Tools featured $67

### 低价带（一次性 <$20，纯插队/收录）

Toolio $9.99 / $59.99 / $269.99 三档 ｜ BAI.tools $9.9 ｜ TopTool 优先审 $9.99 ｜ Search Engine of AI $19.99 ｜ AI top reviews $30（更新 $15）

### 广告位 / 订阅型（banner、长期 featured、newsletter）

chatgptdemo 广告 $250+ ｜ AI Tools Club（newsletter）广告 $250+ ｜ ToolPilot AI premium $199+ ｜ AI Bucket premium $299+ ｜ AI Tools Directory featured $299+ ｜ SaaSworthy $499/年 ｜ tooldirectory.ai featured $9.99/月 ｜ PeerPush $15/月（founding 价）

## 三、格局解读

1. **主流模式是一次性付费**：快审/插队/featured 几乎都是 one-time；订阅只用于 banner 和长期 featured 位。findryai「Pro 一次性 + Sponsor 订阅」的骨架符合行业惯例，方向没错。
2. **价格阶梯清晰**：免费排队 → $10-20 快审 → $29-49 快审+featured → $79-99 featured+推广 → $249+ 头部曝光 → $437 全案。
3. **中部站实际成交价集中在 $29-$49**（快审 + featured + newsletter 的组合），这正是 findryai Pro 卖的权益。
4. **dofollow 外链是全场最大卖点**，但几乎没人免费送——findryai 免费档给 3 条 dofollow + 24-72h 审核，慷慨程度超过多数竞品的 $39-$49 付费档，**自己免费档打自己付费档**。
5. 头部站敢收 $249-$437 靠的是百万级月访和 250 万订阅 newsletter；findryai 流量规模未经验证，定价必须落在「新站带」，不能对标头部。

## 四、定价建议

**推荐模型：分层（Freemium + 一次性 Featured + 订阅 Sponsor）。价值度量：按「一次收录」收费。**

| 档位 | 建议价格 | 定位 | 内容调整 |
|---|---|---|---|
| Free | $0，**永久保留** | 获客漏斗，供目录自身 SEO 供血 | 收录 + 1 条 dofollow；审核改为**标准队列 3-7 天**；去掉 "Limited-Time" 表述 |
| Featured（现 Pro） | **标准价 $29 一次性**；上线期 $19.9 限量早鸟（如前 100 单或两周） | 主推档，POPULAR | 12h 优先审、分类置顶 30 天（写明时限）、徽章、newsletter 推广、3 条 dofollow |
| Sponsor | **$99/月，改为真 Stripe 订阅**（`mode: "subscription"`） | 高客单，初期以 Inquire/议价为主 | 维持全站 banner + 独占；补「周报 UTM 数据」承诺；可加首月半价促转化 |

**关键决策的理由：**

1. **Pro 从 $19.9 提到 $29 标准价**：$19.9 落在行业杂货带（$9.99-$19.99，纯插队无 featured），但 Pro 权益对标的是 $39-$49 档。$29 卡在中部带下沿——新站敢标、买家不犹豫，还留出早鸟锚定空间。上线动作最小：现有 $19.9 直接当早鸟价跑，只需加划线原价与限量说明。
2. **免费档「降权」而不是砍掉**：免费永久保留（行业惯例，也是投稿量和目录内容量的来源）；把 24-72h 放慢为 3-7 天标准队列、backlink 从 3 条减到 1 条，让 Pro 的「12h + 3 条」成为真实差价。保守替代方案：只动审核时长、保留 3 条 dofollow（牺牲部分 Pro 转化率换投稿量）。
3. **Sponsor 修计费而非改价格**：$99/月在广告位市场属于低位（头部 $250+），对未验证流量是新站合理价；问题是显示与计费错配。上线前必须二选一：真订阅，或改成「$99/周」一次性投放。
4. **可选增值 SKU**：Newsletter 单发或首页 7 天 Spotlight，$49-$79 一次性——承接 TAAFT $437 与中部 $99 之间的需求。

## 五、决策记录（2026-09-28，用户已确认）

1. **100K+ 月展示表述必须移除**：新站做不到这个量级，Sponsor 文案不得出现任何流量数字承诺（改为不含数字的权益描述）。
2. 三档方案获原则性批准并开始实施：
   - Free $0 永久保留，审核口径改为标准队列 3-7 天，dofollow 减为 1 条；
   - Featured（Pro）$19.9 限量早鸟 + 原价 $29 划线锚定（上线期代码维持 $19.9 收款，早鸟结束改回 `price: 29` 即可）；
   - Sponsor $99/月改为真 Stripe 订阅（`mode: "subscription"`）。
3. 遗留事项：
   - **Stripe 后台需新建 $99/月 recurring price**，并更新 Vercel 生产环境变量 `NEXT_PUBLIC_STRIPE_SPONSOR_PRICE_ID`（旧值是一次性 price，订阅模式会报错）；
   - 订阅续费/取消的后续处理（如订阅取消后自动撤下 banner）暂未实现，`checkout.session.completed` 已通过 `subscription_data.metadata` 预留 itemId，后续可在 webhook 中处理 `customer.subscription.deleted`；
   - 早鸟结束后把 `src/config/price.ts` 中 Pro 的 `price` 改回 29、删掉 `originalPrice`。

## 六、假设与验证（上线前后可做）

- **假设：开发者愿为「快审 + featured」付 $29** → 早鸟期 A/B：$19.9 与 $29 各跑两周，比较转化率 × 客单价。
- **假设：dofollow 是付费主因** → 投稿表单加一题「升级 Pro 的原因」。
- **风险：免费档太慷慨 → Pro 零转化** → 用队列时长差制造急迫感（3-7 天 vs 12h）。
- **风险：Sponsor 计费错配上线** → 已知代码点：`src/actions/create-checkout-session.ts` 的 `mode: "payment"`。

## 七、数据可信度说明

- TAAFT 定价来自官方提交页核实（2026-09-28 抓取）。
- 93 站价格清单来自 enumhq.com/directory-list（第三方维护，2026 年仍更新）。
- Futurepedia / Toolify / Aixploria / Easy With AI 为第三方转述，官方页未核实（JS 渲染或 404）。
- 各站价格变动频繁，引用前建议复核。
