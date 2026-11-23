# 业务副作用幂等与恢复契约（D05a）

状态：**契约 v1，待独立审查**。本文件是 D05b 的唯一实现依据；D05a 不改业务代码、不部署、不接触生产。

前置阅读：`docs/migration/contracts.md`（决定表、发布事务、最低安全版本）、`docs/migration/tests.md` S05、`src/app/api/webhook/route.ts`、`src/app/api/cron/*`、`src/data/order.ts`、`src/sanity/schemas/documents/order/order.ts`、`src/lib/mail.ts`、`src/app/api/revalidate/route.ts`。

放行门禁：**S05 全部子项未 PASS 之前，生产 Stripe webhook 不得指向新平台，新镜像不得作为生产支付接流目标。** 当前 `staging_sanity` 在决定表中仍为 `UNSET`，因此 S05 集成部分默认 `BLOCKED`。

---

## 0. 术语与现有缺陷摘要

| 术语 | 含义 |
| --- | --- |
| 业务事实 | 一次 Checkout Session 代表的购买义务，键为 `session.id` |
| 投递 | Stripe 向 webhook 发一次 HTTP 请求，携带一个 `event.id` |
| 履约 | 订单文档与条目付费字段达到一致，可对用户生效 |
| 通知 | 邮件、Discord 等站外发送，**不属于履约判定** |
| 账本 | 本契约新增的幂等文档（webhookSession / digestRecipient / cronLock） |

现网缺陷（必须由 D05b 修复，不是可选优化）：

1. `webhook/route.ts:61` 用 `getOrderByUserIdAndItemId` 作了**前置闸门**：查到任意订单即 200 返回，跳过条目 patch。已有订单但条目未升级的条目会永久停留（S05.6 的“历史订单兼容”正是此缺陷）。
2. 该查询以字符串拼接 GROQ（`src/data/order.ts:11`），未使用参数；且不区分 `status: failed`、不区分是哪一次购买。
3. `src/lib/mail.ts` 全部 `await resend.emails.send(...)` 丢弃返回值。Resend SDK 的确定失败在 `{ error }` 中返回而非抛异常，因此现有 try/catch 会把“确定失败”记成“已发送”。
4. `src/lib/discord.ts` 对非 2xx 只打日志，随后无条件打印 “Successfully sent”，并吞掉异常，调用方无法区分 sent/failed/unknown。
5. 周报 `pro-digest` 使用滚动 `cutoff`，无收件人账本；批内部分成功后重跑会对已发送者重复发送。
6. `check-badges` 无跨实例互斥，两个调度源同时触发会重复扫描与重复通知（仅靠 `ifRevisionId` 部分缓解）。

---

## 1. 支付 webhook 的业务唯一键

### 1.1 决定

- **业务主键 = Stripe Checkout Session ID（`session.id`，形如 `cs_test_...` / `cs_live_...`）。**
- `event.id` **不是**主键，仅作为投递证据记录。
- 新订单文档 `_id` = `order-<sessionId>`；账本文档 `_id` = `webhookSession-<sessionId>`。

### 1.2 理由

1. 一个 Session 就是一次购买意图；`session.id` 由 Stripe 生成、唯一、不可变，且已出现在现有 `metadata` 与通知参数中。
2. 同一业务事实会产生**多个不同 `event.id`**：`checkout.session.completed` 与 `checkout.session.async_payment_succeeded` 可能先后到达同一 Session。以 `event.id` 为键会各建一条账本，导致二次履约。
3. Stripe 重投同一个事件时 `event.id` 保持不变，但同一 Session 的事件可能乱序、可能重复投递、也可能在多个 endpoint 上各投一次。只有 `session.id` 能合并这些投递。
4. 以 `user+item` 为键同样不成立：同一用户可以为同一条目再次购买（续费/升级 Sponsor），`user+item` 无法区分两次合法购买；旧实现正是因此把第二次购买吞掉。
5. `session.id` 长度（约 60–70 字符）加 `webhookSession-` 前缀（15 字符）仍远低于 Sanity `_id` 的实际上限；字符集允许 `[a-zA-Z0-9._-]`，Stripe 的 `cs_test_*` / `cs_live_*` 均在其中。写入前用 `^cs_(test|live)_[A-Za-z0-9]+$` 校验，不匹配即 400，不落任何文档。

### 1.3 `event.id` 的记录方式

账本字段（只增不改，数组有界，避免文档无限增长）：

```json
{
  "lastEventId": "evt_...",
  "lastEventType": "checkout.session.completed",
  "lastEventCreatedAt": "2026-11-24T03:12:45.000Z",
  "eventIds": ["evt_...", "evt_..."]
}
```

- 每次投递：`eventIds = [...new Set([...old, eventId])].slice(-10)`。
- 只用于审计、排障和“这条投递是否处理过”的证据，**任何幂等判断都不得依赖它**。
- 不因 `eventIds` 已包含当前 id 而提前返回；是否继续由状态机与条目一致性决定（见 §3、§4）。

### 1.4 为什么 `create` 冲突是原子闸门

- `sanityClient.create({ _id: "webhookSession-<sid>", ... })` 在服务端执行**创建时唯一性检查**：两个并发 create 只有一个成功，另一个收到 409 / `documentAlreadyExists`。不存在“先查再写”的时间窗（TOCTOU），这是本系统唯一可靠的“对不存在做 CAS”的原语。
- 因此它提供的是：**至多一个 worker 被认定为该 Session 的履约持有者**。它不证明“履约已完成”，也不证明“订单已创建”，所以必须配合 §2 的租约与状态机，不能把 create 成功当成 200 的依据。
- 失败模式对照：若沿用“先查订单、再创建”，并发投递会双建订单、双 patch 条目、双发邮件（现网行为）；且第二次合法购买会被误判为重复。

伪代码（接入阶段）：

```text
POST /api/webhook
  raw = await req.text()
  event = stripe.webhooks.constructEvent(raw, sig, STRIPE_WEBHOOK_SECRET)   // 失败 → 400，零写入
  if event.type not in {checkout.session.completed,
                        checkout.session.async_payment_succeeded,
                        checkout.session.async_payment_failed}:
      return 200 {ignored: "event_type"}                                    // 不建账本
  session = event.data.object
  if !/^cs_(test|live)_[A-Za-z0-9]+$/.test(session.id): return 400
  ledgerId = "webhookSession-" + session.id
  try:
      create({_id: ledgerId, _type: "webhookSession",
              sessionId: session.id, state: "received", attempts: 0,
              paymentStatus: session.payment_status,
              sessionCreatedAt: session.created ISO,
              lastEventId: event.id, lastEventType: event.type, ...})
      created = true
  catch 409:
      created = false
      ledger = read(ledgerId, {useCdn:false})
      if ledger.sessionId != session.id: return 500 {code: LEDGER_ID_CONFLICT}  // 理论不可能，告警
  recordEvent(ledgerId, event)            // CAS patch，见 §1.3
  return driveAndMapHttp(ledgerId)        // 见 §2.5 与 §1.5 的返回码映射
```

### 1.5 HTTP 返回语义（Stripe 视角）

| 场景 | 返回 | 理由 |
| --- | --- | --- |
| 签名错误 / body 非 JSON | 400 | 重投也不会成功；零写入 |
| 非目标事件类型 | 200 `{ignored}` | 避免 Stripe 无意义重试 |
| metadata 缺失/非法 | 200，账本 `needs_review` | 400 会引发数天无效重试；人工可修 |
| 条目/用户不存在 | 200，账本 `needs_review` | 同上 |
| 另一 worker 持有有效租约 | 200 `{busy}` | 不是错误，对方在推进 |
| 已 `processed` / `needs_review` | 200 | 终态不再重试 |
| 可重试的持久化失败（账本或订单/条目写失败） | 500 | 借 Stripe 重试作为额外驱动；恢复器是兜底 |
| `PAYMENT_WRITES_ENABLED != "true"`（候选/恢复环境） | 503，零写入 | 误配要显性失败，不做静默 200 |

Stripe 的响应超时窗口有限（约 20 秒）。因此请求内只做“账本 + 订单 + 条目”三段快写，通知阶段受 §5 预算保护；超预算时保留 `notifications_pending` 并 200，由恢复器继续。

---

## 2. 可恢复履约状态机（原子性边界）

### 2.1 原子性事实

- Sanity 的**单文档**写入是原子的；一次 mutation 请求内的多个 mutation 也可以全有或全无。
- 但“先读多个文档、再据其状态决定写”**无法原子化**：`ifRevisionId` 只能约束单个文档，没有跨文档的条件提交（无法“当 item 仍是 revX 且 order 尚不存在时同时写两者”）。
- 结论：**不假设跨文档事务**。用“可恢复状态机 + 幂等重放 + 以条目实际字段为最终一致性判据”代替“假原子”。任何一次 commit 成功都不等于履约完成。

### 2.2 状态定义

`webhookSession.state` 仅允许下列值：

| 状态 | 语义 | 终态 |
| --- | --- | --- |
| `received` | 账本已建，尚未取得租约 | 否 |
| `processing` | 持有租约，订单/条目步骤进行中 | 否 |
| `fulfilled` | 订单与条目已一致（业务生效） | 否（通知未完成） |
| `notifications_pending` | 履约已成立，仍有 pending / 待重试通知 | 否 |
| `processed` | 履约成立且所有通知均为确定结果 | 是 |
| `needs_review` | 存在未知结果或不可自动判定 | 是（人工关闭） |
| `failed` | 确定失败且不再自动重试（如支付失败） | 是 |

允许的转移：

```text
received            -> processing | needs_review | failed
processing          -> received | processing | fulfilled | needs_review | failed
fulfilled           -> notifications_pending | needs_review
notifications_pending -> notifications_pending | processed | needs_review
needs_review        -> processed            （仅人工，写 resolvedBy/resolvedAt）
任何非终态          -> needs_review          （异常兜底）
```

`processing -> received` 只用于“释放租约、等待退避后再试”；它不带 `fulfilledAt`，因此不构成履约回退。

`fulfilled` 一旦成立**不得**被自动改回 `received`/`processing`；只有发现条目被外部改坏时，才由恢复器加 `needs_review` 并保留 `fulfilled` 历史字段（`fulfilledAt` 不清空）。

### 2.3 账本文档结构

```json
{
  "_id": "webhookSession-cs_test_a1b2c3",
  "_type": "webhookSession",
  "sessionId": "cs_test_a1b2c3",
  "state": "processing",
  "attempts": 2,
  "nextAttemptAt": "2026-11-24T03:17:00.000Z",
  "leaseOwner": "findryai-7f9c-pid3812-4a1f",
  "leaseExpiresAt": "2026-11-24T03:17:10.000Z",
  "leaseAcquiredAt": "2026-11-24T03:15:10.000Z",
  "lastLeaseTakeoverAt": "",
  "lastErrorCode": "ITEM_PATCH_FAILED",
  "lastErrorMessage": "truncated, no PII",
  "paymentStatus": "paid",
  "lastEventType": "checkout.session.completed",
  "eventIds": ["evt_..."],
  "lastEventId": "evt_...",
  "lastEventCreatedAt": "2026-11-24T03:12:45.000Z",
  "stripeCustomerId": "cus_...",
  "sessionCreatedAt": "2026-11-24T03:10:00.000Z",
  "amountTotal": 4900,
  "currency": "usd",
  "priceId": "price_...",
  "pricePlan": "pro",
  "userId": "user_...",
  "itemId": "item_...",
  "orderId": "order-cs_test_a1b2c3",
  "orderSource": "new",
  "adoptedReason": "",
  "fulfillmentCheckpoint": "order_created",
  "fulfilledAt": "",
  "notifications": {
    "paymentSuccessEmail": { "status": "pending", "attempts": 0 },
    "adminPaymentEmail": { "status": "pending", "attempts": 0 },
    "discord": { "status": "pending", "attempts": 0 }
  },
  "needsReviewReason": "",
  "holdReason": "",
  "createdAt": "2026-11-24T03:12:46.000Z",
  "updatedAt": "2026-11-24T03:15:12.000Z"
}
```

- `fulfillmentCheckpoint ∈ {none, order_created, item_patched}`；它是加速恢复的提示，**不是判据**；判据永远是“重读条目/订单后的实际字段”。
- `attempts` 上限 12，退避 1m/2m/4m/8m/16m/32m/60m 封顶（累计约 6 小时），通过 `nextAttemptAt` 生效。超过上限 → `needs_review` + `ATTEMPTS_EXHAUSTED`（不是 `failed`：钱已收，人工可重置 `attempts` 后重放）。
- `amountTotal` 以**最小货币单位**（分）存储，与 Stripe `amount_total` 一致；展示时再除 100，避免重放时二次换算。
- 租约 TTL 120 秒；`leaseOwner = <hostname>-<pid>-<random>`。接手规则见伪代码。

### 2.4 租约获取（CAS）与推进

```text
acquire(ledgerId, me, ttl=120s):
  for i in 1..3:
    l = read(ledgerId, {useCdn:false})
    if l.state in {processed, needs_review, failed}: return {ok:false, terminal:true}
    if l.nextAttemptAt > now: return {ok:false, backoff:true}       # 退避未到，不抢租约
    if l.leaseExpiresAt > now && l.leaseOwner != me: return {ok:false, busy:true}
    if l.attempts >= 12: -> needs_review("ATTEMPTS_EXHAUSTED"); return {ok:false, terminal:true}
    try:
      patch(ledgerId).ifRevisionId(l._rev).set({
        state: (l.state == "received" ? "processing" : l.state),    # 不得把 fulfilled 降为 processing
        attempts: l.attempts + 1,
        nextAttemptAt: now + backoff(l.attempts + 1),
        leaseOwner: me,
        leaseExpiresAt: now + ttl,
        leaseAcquiredAt: now,
        lastLeaseTakeoverAt: (l.leaseOwner != me ? now : l.lastLeaseTakeoverAt)
      }).commit()
      return {ok:true, ledger: read(ledgerId, {useCdn:false})}
    catch 409: continue            // 别人先改，重读
  return {ok:false, busy:true}
```

`attempts` 在每次取到租约时 +1，无论是否接管；这样退避与上限对“同一次投递被反复重试”也生效。

推进过程中每一步写前重读、写后用 `ifRevisionId`；任何 409 视为“租约可能已被抢”，立即停止本 worker 的后续外部发送并返回 200 `{busy:true}`。**禁止**用“时间戳没过期”推断自己仍持有租约。

### 2.5 状态推进

```text
drive(ledgerId):
  l0 = read(ledgerId, {useCdn:false}); priorState = l0.state
  sid = l0.sessionId

  # 0) 支付闸门（在取租约之前，避免“等待异步支付”被计入 attempts）
  if l0.paymentStatus != "paid":
      if l0.lastEventType == "checkout.session.async_payment_failed":
          casSet(l0._rev, {state:"failed", lastErrorCode:"PAYMENT_FAILED"}); return 200
      else:
          casSet(l0._rev, {state:"received", holdReason:"awaiting_payment"}); return 200
  if l0.holdReason == "awaiting_payment":
      casSet(l0._rev, {holdReason:""})          # 已转 paid，清标记后再继续

  {ok} = acquire(ledgerId, me); if !ok: return 200 {busy|backoff|terminal}

  # 0.5) 已履约恢复：只做一致性复核，不重复订单/条目流程
  if priorState in {"fulfilled", "notifications_pending"}:
      if !itemConsistent(read(l0.itemId, {useCdn:false}), l0.orderId, l0.pricePlan):
          -> needs_review("ITEM_DRIFT_AFTER_FULFILLED"); releaseLease(); return 200
      goto notifications

  # 0.6) 输入合法性（不产生订单/条目的任何写入）
  if !l0.userId || !l0.itemId || !l0.priceId || l0.pricePlan not in {"pro","sponsor"}:
      -> needs_review("METADATA_INVALID"); releaseLease(); return 200
  if !exists(l0.userId) -> needs_review("USER_NOT_FOUND"); releaseLease(); return 200
  if !exists(l0.itemId) -> needs_review("ITEM_NOT_FOUND"); releaseLease(); return 200

  # 1) 解析订单（幂等）
  order = findOrderBySession(sid)                     # order-<sid>
  if !order:
      legacy = findLegacyCandidate(l0.userId, l0.itemId, l0.sessionCreatedAt)   # §3
      if legacy: order = legacy; orderSource = "legacy"
      else:
          try create({_id:"order-"+sid, _type:"order", user:l0.userId, item:l0.itemId,
                      status:"success", date: l0.sessionCreatedAt,
                      stripeSessionId: sid, webhookLedgerId: ledgerId,
                      fulfillmentStatus: "pending", pricePlan: l0.pricePlan, priceId: l0.priceId,
                      amountTotal: l0.amountTotal, currency: l0.currency})
          catch 409: order = read("order-"+sid)
      checkpoint("order_created", orderId: order._id, orderSource)

  # 2) 条目一致性（即使订单早已存在也必须执行，§3/§4）
  item = read(l0.itemId, {useCdn:false})
  plan = evaluateItem(item, order, l0)                # consistent | needs_patch | superseded
  if plan == superseded: -> needs_review("ITEM_SUPERSEDED_BY_NEWER_ORDER"); releaseLease(); return 200
  if plan == needs_patch:
      patch(l0.itemId).ifRevisionId(item._rev).set({
        paid: true, featured: true, pricePlan: l0.pricePlan,
        sponsor: l0.pricePlan == "sponsor",
        proPlanStatus: l0.pricePlan == "pro" ? "success" : "submitting",
        sponsorPlanStatus: l0.pricePlan == "sponsor" ? "success" : "submitting",
        (l0.pricePlan == "sponsor" ? sponsorStartDate: l0.sessionCreatedAt : omit),
        order: {_type:"reference", _ref: order._id}
      }).commit()
      revalidatePaidItem(order._id)                   # 失败只记 REVALIDATE_FAILED
  checkpoint("item_patched")
  if orderSource == "new":
      patch(order._id).ifRevisionId(order._rev).set({fulfillmentStatus:"complete"}).commit()
  setState("fulfilled", fulfilledAt: now)

  # 3) 通知（§5），预算内尽力完成
notifications:
  setState("notifications_pending")
  runNotifications(ledgerId, budgetMs: 12_000)
  finalize(ledgerId)
```

`finalize` 规则：

```text
- 任一通道 status == "unknown"                    -> needs_review("NOTIFY_UNKNOWN:<channel>")
- 存在 pending，或 failed 且 attempts < 3          -> notifications_pending + nextAttemptAt=now+退避
- 全部通道 ∈ {sent, failed(终态), skipped}         -> processed
- 以上任何分支结束都必须清空 leaseOwner / leaseExpiresAt
```

`evaluateItem` 的判定表：

| 条目当前状态 | 动作 |
| --- | --- |
| `paid==true` 且 `order._ref==order._id` 且计划字段与账本一致 | `consistent`，不改写 |
| `order._ref` 为空 | `needs_patch` |
| `order._ref==order._id` 但 `paid`/计划字段不符 | `needs_patch`（补写缺失字段） |
| `order._ref` 指向**更新**的另一订单 | `superseded`（不降级，转人工） |
| `order._ref` 指向**更旧**的另一订单 | `needs_patch`（升级到本订单） |

“更新/更旧”以 `order.date` 比较（新订单的 `date` 取 `session.created`），相同则用 `sessionId` 字符串序作确定性 tie-break，避免两侧判定相反。

### 2.6 恢复器（必需，不能省）

新增只读驱动端点 `GET /api/cron/resume-side-effects`（`Authorization: Bearer CRON_SECRET`），由平台调度每 10 分钟调用（调度文件归 D06；应用侧只提供端点）：

```text
ledgers = *[_type=="webhookSession"
            && state in ["received","processing","fulfilled","notifications_pending"]
            && holdReason != "awaiting_payment"
            && leaseExpiresAt < nowIso && nextAttemptAt < nowIso] | order(updatedAt asc)[0..19]
for l in ledgers: drive(l._id)          # 每个账本各自 acquire，失败不影响其他
digests = *[_type=="digestRecipient" && status=="pending" && updatedAt < nowIso-30m][0..50]
for d in digests: markUnknown(d._id, "SEND_OUTCOME_UNKNOWN_STALE_PENDING")   # 不重发
```

- 恢复器不做任何外部重发（见 §11）。
- 单次处理上限 20 条，避免长请求；未处理完留给下次。
- 无全局锁也可安全并发：每个账本/收件人各自的 CAS 就是互斥。

---

## 3. 历史订单兼容（核心修复）

### 3.1 旧数据事实

- 旧订单 `_id` 为随机值，**没有** `sessionId` 字段。
- 旧代码在“查到订单”时提前返回，导致“订单存在、条目未升级”的历史残留。
- 因此：**账本/订单是否存在，永远不能作为跳过条目 patch 的理由。**

### 3.2 查询顺序（固定）

```text
findOrderBySession(sid):
  *[_type=="order" && stripeSessionId==$sid][0]                    # 1. 新键精确匹配

findLegacyCandidate(userId, itemId, sessionCreatedAt):
  *[_type=="order" && user._ref==$userId && item._ref==$itemId
    && !defined(stripeSessionId)] | order(date desc)[0..5]
  # 2. 仅用于“可能已完成”判定，且必须同时满足：
  #    a) status == "success"
  #    b) |order.date - sessionCreatedAt| <= 24h
  #    c) 取时间最接近者；若并列，转 needs_review("LEGACY_AMBIGUOUS")
```

GROQ 一律使用参数（`$userId`/`$itemId`/`$sid`），不得沿用字符串拼接。

### 3.3 采纳规则（不修改旧订单文档）

- 命中 legacy candidate：**不创建新订单**，账本记 `orderId=<legacy._id>`、`orderSource="legacy"`、`adoptedReason="legacy_user_item_match"`。
- **不写旧订单文档**（“不改历史订单”见 §11）。`order.fulfillmentStatus` 只对新订单有意义；legacy 订单的可信状态以账本 + 条目实际字段为准。
- 仍旧执行 §2.5 第 2 步：条目缺 `order` 引用或 `paid` 就补写，直到与 legacy 订单一致。这正是修复“因旧订单存在而跳过升级”。
- legacy 采纳后的通知：`notifications.*.status = "skipped"`，`reason="legacy_adoption_no_resend"`。理由：无法判定历史上是否已发过，自动补发会造成重复打扰；本条不阻塞履约，只记审计。

### 3.4 会话时间与旧订单时间的偏差

旧订单 `date` 是 `new Date()`（webhook 处理时刻），Stripe `session.created` 可能早几秒到几分钟；24 小时窗口足以覆盖，同时排除“几个月前的同 item 订单”被误采纳。

### 3.5 重复购买

若确认是新的合法购买（无 legacy candidate，或 candidate 超出窗口），创建 `order-<sid>` 并把条目 `order` 指向新订单。条目以最新订单为准，旧订单文档保留为历史（不删除）。

---

## 4. 部分失败：订单成功、条目失败

### 4.1 检查点与字段

| 位置 | 字段 | 取值 |
| --- | --- | --- |
| 账本 | `fulfillmentCheckpoint` | `none` / `order_created` / `item_patched` |
| 账本 | `lastErrorCode` / `lastErrorMessage` | 见附录 A |
| 订单（仅新订单） | `fulfillmentStatus` | `pending` / `item_patched` / `complete` / `needs_review` |
| 订单 | `stripeSessionId` / `webhookLedgerId` | 反查用 |

写入时刻：订单创建即 `pending`；条目 patch 成功后账本 `item_patched`，随即订单 `complete`。若“条目已成功、订单未标 complete”之间崩溃，恢复器以条目实际字段为准重放订单 patch（幂等）。

### 4.2 重试必须继续履约

- 订单已存在（或 create 收到 409）**不是**提前 200 的理由；必须继续 §2.5 第 2 步。
- 条目 patch 失败：置 `state="received"`、`checkpoint="order_created"`、`lastErrorCode="ITEM_PATCH_FAILED"`、`nextAttemptAt=now+backoff`，清空 `leaseOwner`/`leaseExpiresAt`，返回 **500**（让 Stripe 重试），同时恢复器兜底。
- 只有在“条目实际字段已与订单一致”或进入终态后才允许 200。
- 失败模式对照：现网“订单存在即 200”会让 Stripe 停止重试，条目永远不升级，用户付钱但无权益——本契约将其定义为不可接受状态。

### 4.3 幂等性要求

- 条目 patch 的值必须**仅由账本数据决定**（价格计划、金额、session 时间），不得使用 `new Date()` 作为写入值；否则重放会产生不同内容，破坏“重放无副作用”。
- 重放次数不写进条目；审计在账本。
- `revalidatePath("/", "layout")` 与 `revalidateTag("sponsor-banner")` 只在**本次调用实际改变条目**后执行；重放未改字段则跳过。revalidate 失败不影响状态与返回值（记 `lastErrorCode="REVALIDATE_FAILED"` 但不阻塞）。

---

## 5. 外部通知结果未知

### 5.1 三态定义（必须严格区分）

| 记录值 | 触发条件 |
| --- | --- |
| `sent` | 上游返回成功且拿到 message/id；或 Discord 返回 2xx |
| `failed` | 上游明确拒绝：Resend `{ error }` 且 HTTP 4xx（含 429）、Discord 4xx；**确定未送达** |
| `unknown` | 超时、连接中断、DNS 失败、5xx、408、响应无法解析、进程在发送中途崩溃 |

`pending` 仅表示“尚未尝试”或“已写 WAL 但结果未回填”。

### 5.2 处理规则

1. **不自动重发 `unknown`**。账本置 `needs_review`，`needsReviewReason="NOTIFY_UNKNOWN:<channel>"`，并保留 `firstAttemptAt`。
2. `failed` 可最多自动重试 3 次（指数退避 30s/2m/10m），仍失败则 `failed` 终态 + `needs_review`（邮件没送达，运营应知道）。存在“还有重试额度”的 `failed` 通道时，账本保持 `notifications_pending` 并设 `nextAttemptAt`；额度用尽才转 `needs_review`，否则恢复器不会再驱动它。
3. `needs_review` 人工只能二选一：确认外部已发 → 置 `sent` 并写 `resolvedBy`；确认未发且允许补发 → 置 `pending` 让下一轮（人工触发的恢复）发送。**系统不得自行二选一。**
4. 通知任何状态都**不改变**履约结论：`fulfilled` 必须在通知之前成立；通知失败不得把履约回退为失败，也不得返回 5xx。
5. 每次发送前先 CAS 写 `status="pending", attempts+1, lastAttemptAt`（WAL）。写完再调用外部；调用后 CAS 回填结果。若在两者之间崩溃，恢复器按 `unknown` 处理（不重发）。
6. Resend 可传 `{ idempotencyKey: "<ledgerId>:<channel>" }` 作为纵深的第二道防线（24h 窗口），但**不得**作为唯一保证；Discord 无幂等，只能靠 WAL。
7. Resend 调用必须检查 `{ error }`；仅 `try/catch` 会把确定失败误记为成功（现状缺陷）。

### 5.3 各通知类型的账本字段

| 通知 | 存储位置 | 字段 |
| --- | --- | --- |
| 付款成功邮件（用户） | `webhookSession.notifications.paymentSuccessEmail` | `status`、`attempts`、`firstAttemptAt`、`lastAttemptAt`、`resolvedAt`、`messageId`、`errorCode`、`errorMessage` |
| 付款通知邮件（管理员） | `...notifications.adminPaymentEmail` | 同上 |
| Discord 购买播报 | `...notifications.discord` | `status`、`attempts`、`firstAttemptAt`、`lastAttemptAt`、`resolvedAt`、`httpStatus`、`errorCode` |
| 周报单收件人 | `digestRecipient` 文档（§6） | `status`、`attempts`、`resendBatchId`、`messageId`、`errorCode`、`errorMessage` |
| 徽章 30 天不可用通知（管理员） | `item` 文档 | 新增 `badgeUnavailableNotifyState ∈ {none, pending, sent, failed, unknown}`、`badgeUnavailableNotifyAttempts`、`badgeUnavailableNotifyLastAt`、`badgeUnavailableNotifyUnknownAt`；保留既有 `badgeUnavailableNotifiedAt` 兼容旧数据 |

徽章通知现状是“先写 `badgeUnavailableNotifiedAt`，失败即回滚”。新规则下：确定失败才回滚标记；`unknown` **保留**标记并置 `badgeUnavailableNotifyState="unknown"`，人工核对，避免重复发送。

---

## 6. 周报窗口与收件人账本

### 6.1 窗口键

```text
windowKey = ISO 周起点（周一 00:00:00 UTC）的 "YYYY-MM-DD"
windowStart = 该周一 00:00 UTC
windowEnd   = windowStart + 7d
内容窗口    = [windowStart - 7d, windowStart)      # 周报发送的是“刚过去的这一周”
```

- 调度为周一 09:00 UTC，因此 `now ∈ [windowStart, windowStart+7d)`；否则视为补跑/异常。
- `weeks` 参数：**只有 `weeks=1` 允许真正发送**；`weeks != 1` 仅允许 `dryRun=1`，否则 400 `WEEKS_BACKFILL_NOT_ALLOWED`。理由：内容集合变化会让同一 `windowKey` 产生不同邮件，破坏“同窗口重跑只补发”的前提。
- 过去窗口（`windowEnd <= now`）：仅允许 `failed` 补发，禁止任何 `pending`/`unknown`/`sent` 变更。

### 6.2 收件人文档

```json
{
  "_id": "digestRecipient-5f3a9c1e7b2d4a6c8e0f1b3d5a7c9e1f",
  "_type": "digestRecipient",
  "windowKey": "2026-11-23",
  "emailHash": "5f3a9c1e7b2d4a6c8e0f1b3d5a7c9e1f",
  "email": "user@example.com",
  "status": "sent",
  "attempts": 1,
  "firstAttemptAt": "2026-11-23T09:00:04.000Z",
  "lastAttemptAt": "2026-11-23T09:00:04.000Z",
  "resendBatchId": "batch_...",
  "messageId": "re_...",
  "errorCode": "",
  "errorMessage": "",
  "contentHash": "sha256(sortedItemIds.join(','))[0:16]",
  "owner": "findryai-...",
  "createdAt": "...",
  "updatedAt": "..."
}
```

- `email` 归一化 = `trim().toLowerCase()`（同一邮箱的大小写变体合并为一个收件人）。
- `emailHash = sha256(normalizedEmail + "|" + windowKey).hex.slice(0,32)`；`_id = "digestRecipient-" + emailHash`。分隔符 `|` 是契约 v1 的一部分，避免 `"a@b"+"c"` 与 `"a@"+"bc"` 撞车。
- `_id` 已含 hash，128 位截断，实际碰撞概率可忽略；万一 `create` 409 但 `emailHash` 不符 → `needs_review("DIGEST_ID_COLLISION")`。
- `contentHash` 用于识别“同一窗口内容漂移”：重跑时若与已 `sent` 记录不同，不自动重发，只告警。

### 6.3 发送流程（WAL + 逐收件人）

```text
GET /api/cron/pro-digest?weeks=1[&dryRun=1]
  auth Bearer CRON_SECRET                       # 失败 401，零写入
  windowKey = isoMondayUtc(now)
  recipients = contacts.list().filter(!unsubscribed).map(normalizeEmail)
  plans = for each email:
      docId = "digestRecipient-" + sha256(email+"|"+windowKey)[0:32]
      existing = read(docId)
      action =
        no existing                         -> "create_and_send"
        existing.status == "sent"           -> "skip"
        existing.status == "unknown"        -> "skip_needs_review"
        existing.status == "failed"         -> "retry" (attempts < 3 ? send : skip)
        existing.status == "pending"        -> "skip_if_live_lease" else mark_unknown
  if dryRun: return {windowKey, count, actions}      # 零写入、零发送
  for chunk of 100 recipients with action create_and_send|retry:
      # 先写账本（status=pending, owner, updatedAt）
      createOrCasPending(docId)
      result = resend.batch.send([...])
      if result.ok:
          for each email in chunk order: mark sent(messageId)
      else if error is definitive per-recipient validation (4xx with per-item results):
          mark failed only for the items explicitly rejected; others unknown
      else:
          # 无法判断部分送达
          for each email in chunk: mark unknown + needs_review
  return {windowKey, sent, failed, unknown, skipped}
```

关键规则：

- **批内部分失败**：能拿到逐条结果才逐条定状态；拿不到就整块 `unknown`。不得把“整批 error”当作“整批未发”而重发。
- `dryRun=1` 不建账本、不发信、不改 `updatedAt`。
- 重跑同窗口：只处理 `failed` 且 `attempts<3`；`sent`/`unknown`/有效租约的 `pending` 一律跳过。
- 崩溃在“写 pending 后、拿到结果前”的 `pending`，超过 30 分钟由恢复器改为 `unknown`（§2.6），不重发。
- 并发：两个实例对同一 `docId` 同时 `create` → 只有一个成功；成功者发送，另一个按 `pending` 处理。已有文档用 `ifRevisionId` CAS 更新 `owner`/`status`。

---

## 7. 徽章 cron 单飞

### 7.1 锁文档

```json
{
  "_id": "cronLock-checkBadges-2026-11-24",
  "_type": "cronLock",
  "lockKey": "checkBadges",
  "runDate": "2026-11-24",
  "owner": "findryai-...-pid3812-4a1f",
  "runId": "uuid",
  "state": "held",
  "fence": 3,
  "acquiredAt": "2026-11-24T03:00:01.000Z",
  "heartbeatAt": "2026-11-24T03:12:00.000Z",
  "leaseExpiresAt": "2026-11-24T03:42:00.000Z",
  "releasedAt": "",
  "lastResult": { "verified": 0, "missing": 0, "unavailable": 0, "failed": 0 }
}
```

- `_id = "cronLock-checkBadges-" + YYYY-MM-DD`（UTC 日期）。
- 前置：先鉴权（Bearer），未通过 401、零读写；然后才取锁。

### 7.2 获取与接管

```text
acquireLock(lockId, me, ttl=45m):
  try:
    create({_id: lockId, _type:"cronLock", lockKey:"checkBadges", owner: me,
            state:"held", fence:1, leaseExpiresAt: now+ttl, ...})
    return {ok:true, fence:1}
  catch 409:
    l = read(lockId)
  for i in 1..3:
    if l.leaseExpiresAt > now && l.owner != me: return {ok:false, busy:true}
    try:
      patch(lockId).ifRevisionId(l._rev).set({
        owner: me, state:"held", fence: l.fence+1,
        acquiredAt: now, heartbeatAt: now, leaseExpiresAt: now+ttl, releasedAt:""
      }).commit()
      return {ok:true, fence: l.fence+1}
    catch 409:
      l = read(lockId)                     # 别人刚抢到，重判
  return {ok:false, busy:true}
```

- **只有 CAS 成功且重读 `owner==me` 的实例才能执行**；`fence` 单调递增，用于审计“第几次接管”。
- 同一日期已完成一次（`state=="released"`）仍允许再取锁并重跑：徽章检查对每个条目幂等（`ifRevisionId` + 状态字段），手动复跑是合法运维动作。

### 7.3 心跳、fencing 与释放

- 每处理 20 个条目或每 60 秒：`patch(lockId).ifRevisionId(rev).set({heartbeatAt:now, leaseExpiresAt:now+ttl})`；409 → 判定租约丢失，**立即停止**，返回 409 `{aborted:"lease_lost"}`，不再写条目、不再发信。
- 每个条目写前重读锁，确认 `owner==me && leaseExpiresAt>now`（残余 TOCTOU 窗口极小）；条目写入本身用 `ifRevisionId(item._rev)`，重复执行不会制造错误状态；通知标记用 `ifRevisionId` CAS，保证两个实例最多一个发信。
- 结束时 `patch(lockId).ifRevisionId(rev).set({state:"released", releasedAt:now, leaseExpiresAt:now, lastResult})`。
- **禁止删除锁文档**。删除会丢失 `fence` 与审计链，并让“已完成的当天”重新变成“从未运行”。清理只属于未来的保留期策略（§12 未决）。
- 失败模式：进程被 kill → 租约 45 分钟后自然过期，下次运行接管；旧进程若复活，其下一次写锁心跳会 409，从而自停。

### 7.4 与调度器的关系

- 端点自身不假设“只有一个调度器”；互斥由锁文档保证。
- 候选/恢复环境必须让调度器不启动（D06 负责），并且端点额外检查 `CRON_WRITES_ENABLED`（默认 false）→ 直接 503 且零写入，作为纵深防御。

---

## 8. 旧任务排空证据

“402/付费失败”**不能**作为旧平台 cron 已停的证据：计费暂停期间调度可能重试、可能只部分失败，也不能证明没有在途请求。必须以下列可核实证据组合判定：

| 证据类型 | 具体要求 | 存放 |
| --- | --- | --- |
| 控制面状态 | 旧平台 cron 配置的实际状态（存在/删除/禁用）、所属部署及其提交；`vercel.json` 在**已部署提交**中的内容 | 导出 JSON/截图（脱敏）+ 提交 SHA |
| 最后运行时间 | 旧平台按路径过滤的调用日志，给出 `/api/cron/check-badges`、`/api/cron/pro-digest` 的**最后成功/最后尝试** UTC 时间 | 日志导出 + 时间范围 |
| 切流后无调用 | 切流时刻之后 ≥ 2 个调度周期内，旧平台与边缘/主机访问日志均无对应路径请求（含来源 IP 归属旧平台出口网段） | 访问日志时间线 |
| 在途请求 | 排空窗口 ≥ 单次任务最长耗时（徽章任务含 65s 二次失效等待 + N 条目；周报为批量发送），确认无长耗时调用仍在运行 | 运行记录 + 时长 |
| 平台侧拆除 | 旧项目 cron 配置删除或项目暂停；DNS/入口不再指向旧平台；Stripe endpoint 列表中旧地址已禁用 | 控制面截图 + endpoint 列表 |
| 结果侧佐证 | 切流后新窗口的 `digestRecipient-*` 只有唯一 `owner`/`resendBatchId`；`cronLock` 每日唯一 owner 且 `fence` 连续 | Sanity 查询导出 |
| 时间基线 | 记录切流 UTC 时刻、旧平台最后部署、最后 cron 运行、证据采集窗口 `[切流-24h, 切流+2h]` | 证据包 `evidence/<run-id>/` |

判定规则：

- 仅当“控制面已移除/禁用” **且** “最后运行时间早于切流” **且** “切流后无任何调用” 三条同时成立，才可声明排空完成。
- 任一条缺失 → `BLOCKED`，不得以“应该不会跑了”通过。
- Stripe webhook endpoint 的旧地址必须在切流窗口内显式禁用，并记录其最后一次投递尝试，防止双份履约。

---

## 9. 最低安全回滚版本

### 9.1 规则

- 任何**早于 D05b** 的镜像（不含账本、`order.fulfillmentStatus`、周报/徽章去重）**不得**作为回滚目标。回退到该版本会立刻重新引入重复订单、重复邮件、条目永不升级。
- 回滚目标集合 = {当前 release} ∪ {由包含 D05b 的提交构建、且 `side_effects_contract_version >= 1` 的历史 release}。
- 首次上线 D05b 后，历史集合为空，因此**唯一安全回滚是同一 digest 的上一容器实例**（重启/回切容器），不是更旧的业务版本。若确需回退业务功能，必须先移植 D05b 修复并重新构建、重跑 S05，再作为新 release 提供。

### 9.2 可机器校验的标记

- 构建期常量 `SIDE_EFFECTS_CONTRACT_VERSION = 1`，同时写入：
  - 镜像标签 `org.opencontainers.image.side-effects-contract=1`；
  - 现有 `GET /api/health` 响应新增字段 `sideEffectsContractVersion`（当前响应已含 `status/release/sha/environment/uptimeSeconds/checks`，此处只增字段，不输出任何配置值）。字段优先取构建期注入的 `APP_SIDE_EFFECTS_CONTRACT_VERSION`，缺省视为不兼容（`null`）。
- `bin/release rollback` 必须先读目标 release 的标签与健康端点；缺失或 `<1` → `BLOCKED`（与 `contracts.md` “回滚目标至少包含已启用的支付/cron 安全修复”一致）。
- 发布记录 `releases/<site>/<release-id>/` 中必须存该字段，供事后审计。
- D05b 合并时同步更新本版本号与 `contracts.md` 的回滚要求；D05a 本身不写代码。

---

## 10. 测试映射（S05.1–S05.6）

### 10.1 夹具

| 夹具 ID | 内容 | 当前状态 |
| --- | --- | --- |
| `fx:sanity-isolated` | 专用 Sanity **测试数据集**（独立 dataset 或独立 project），token 仅该数据集写权限 | **缺失**：`staging_sanity = UNSET` |
| `fx:stripe-test` | Stripe 测试模式 endpoint + 测试 `STRIPE_WEBHOOK_SECRET`，用测试卡/测试时钟造 `cs_test_*`，可离线生成签名事件 | 缺失（未授权） |
| `fx:mail-sink` | 可编程邮件出口：可返回成功、4xx、超时/中断；记录实际发送次数 | 缺失（`mail_sink = UNSET`） |
| `fx:discord-sink` | 本地 mock，可返回 2xx/4xx/超时 | 可在 unit 自建 |
| `fx:clock` | 注入时钟（控制 `now`、租约过期、ISO 周起点） | 可在 unit 自建 |
| `fx:badge-check` | `checkBadge` 的 mock（verified/missing/unavailable） | 可在 unit 自建 |
| `fx:legacy-order` | 固定夹具：条目 + 随机 `_id` 旧订单（无 `stripeSessionId`），条目缺 `paid`/`order` | 可脚本生成 |

unit 层可在本地模拟 Sanity 写接口（保留 `create` 409、`ifRevisionId` 409 语义）完成并发与故障测试；**跨文档真实行为、真实上游错误码必须用 `fx:sanity-isolated` + `fx:mail-sink`**，不得用模拟器替代后宣称集成通过。

### 10.2 逐条映射

| 子项 | 夹具 | 断言（必须可自动判定） |
| --- | --- | --- |
| **S05.1** 同一 session 顺序 3 次 / 并发 2 次 | `fx:stripe-test` + `fx:sanity-isolated` + `fx:mail-sink` | `order-<sid>` 恰好 1 个；条目 `paid=true` 且 `order._ref` 指向该订单；`webhookSession-<sid>.state="processed"`；每个通知通道实际发送次数 = 1；3 次顺序重放后无新增订单、无新增发送，且进入终态后 `attempts` 不再增长；并发 2 次中恰好 1 个返回非 busy、另一个 200 busy。metadata 缺失 → 0 订单、0 patch、账本 `needs_review`；签名错误 → 400 且数据集零变化；条目不存在 → 0 订单、0 patch、`needs_review` |
| **S05.2** 履约中断后恢复 | `fx:sanity-isolated` + 故障注入（item patch 抛错） | 故障后：订单存在且 `fulfillmentStatus="pending"`、条目 `paid!=true`、账本 `ITEM_PATCH_FAILED` + `state="received"`、`nextAttemptAt` 已设置、响应 500；恢复重试后条目与订单一致、`state="processed"`；断言全过程不存在“订单存在 + 条目未付费 + 返回 200”的组合（逐次记录响应码）；`fulfillmentCheckpoint` 单调前进 |
| **S05.3** 通知三态 | `fx:mail-sink` 三种模式 + `fx:discord-sink` | 成功 → `sent` 且 `messageId` 非空；4xx → `failed`（≤3 次后终态）；超时 → `unknown` 且账本 `needs_review`、`fulfilledAt` 已存在；再次投递同一 session 时 `unknown` 通道的发送次数**不增加**；履约状态不因通知失败而回退 |
| **S05.4** 周报两收件人 | `fx:sanity-isolated` + `fx:mail-sink`（一号成功、二号 4xx）+ `fx:clock` | 两个 `digestRecipient-*` 文档，`status` 分别 `sent`/`failed`；同窗口重跑：成功者不再发送（发送计数 1）、失败者重试 1 次；`dryRun=1` 前后文档数、`updatedAt`、发送计数均不变；`weeks=2` 非 dryRun 返回 400；未知结果 → `unknown` + `needs_review`，重跑不发送 |
| **S05.5** cron 鉴权与单飞 | unit（模拟 Sanity CAS）+ `fx:sanity-isolated` | 两 cron 无 Bearer / 错 Bearer → 401 且零读写；候选镜像（`CRON_WRITES_ENABLED!=true`）→ 503 且零写入；同一天两个并发徽章运行：恰一个执行（返回计数），另一个 `busy`，条目 patch 次数不翻倍；`cronLock` 文档 `fence=1` 且未被删除；租约过期后接管 `fence=2`，旧 worker 心跳 409 并自停 |
| **S05.6** 最低安全版本 + 历史订单 | 上述全部 + `fx:legacy-order` + 回滚目标镜像 | 用回滚目标 digest 重放 S05.1–S05.4，断言完全一致；`sideEffectsContractVersion>=1` 可读；旧版本 digest 被 `bin/release rollback` 拒绝（BLOCKED）。legacy 场景：旧订单存在但条目未升级 → 重放后条目 `paid=true`、`order._ref=legacy._id`、**不新建订单**、旧订单文档 `_rev` 不变、账本 `orderSource="legacy"`、通知为 `skipped`；旧订单 + 条目已一致 → 零写入（除账本与 `eventIds`） |

### 10.3 未执行即生产关闭

- `staging_sanity`、`stripe_test`、`mail_sink` 均为 `UNSET`（见 `contracts.md` 决定表），因此 **S05.1–S05.4、S05.6 的集成断言当前不可执行**，状态 `BLOCKED`；只有可离线完成的 unit 子项（状态机、并发 CAS 语义、401/503、dryRun 计算）可以先跑。
- 在 S05 全部 PASS 之前：新平台**不得**注册 Stripe webhook endpoint；已存在的旧 endpoint 保持不变；`PAYMENT_WRITES_ENABLED` 必须为 false；新调度器不得启动两条 cron。
- 证据记录：`evidence/<run-id>/` 中给出套件、源提交、镜像 digest、数据集 ID、夹具版本、每条断言结果；任何“工具返回成功但断言不满足”仍为 FAIL。

---

## 11. 明确的“不做”边界

1. **不重放已 `unknown` 的外部发送**：不自动、也不在恢复器里补发；只允许人工核对后显式改状态。
2. **不删除历史订单**（含 legacy 随机 `_id` 订单），不做去重清理、不回填 `stripeSessionId`。
3. **不修改旧数据**：除条目履约所必需的字段（`paid`/`featured`/`pricePlan`/`sponsor*`/`order`）外，不改写历史订单、历史条目正文或其他业务文档。
4. **不做数据库事务假设**：不依赖跨文档原子提交，不依赖“一次 commit 成功 = 履约完成”；所有正确性来自可重放的一致性检查。
5. **不把外部 exactly-once 当既有保证**：Resend/Discord 均可能“已提交但响应丢失”；只做 WAL + 人工核对。
6. **不以 402/计费状态推断旧调度已停**（§8）。
7. **不在 webhook 内做无界重试或长轮询**：超预算即交还状态，由恢复器推进。
8. **不删除 cron 锁文档**、不用“先删再建”绕过互斥。
9. **不在候选/恢复环境产生任何真实写入或真实发信**。
10. **不自动关闭 `needs_review`**：人工结论必须落 `resolvedBy`/`resolvedAt`，系统不得猜测。

---

## 12. 仍需用户/协调者决定的事项

| # | 事项 | 影响 | 建议负责人 |
| --- | --- | --- | --- |
| 1 | **staging Sanity 数据集由谁提供**：独立 dataset 还是独立 project；token 的读写范围与保管人 | S05 集成全部 BLOCKED；决定表 `staging_sanity` 仍 UNSET | 用户 + D00 协调者 |
| 2 | Stripe 测试 endpoint、测试 `STRIPE_WEBHOOK_SECRET` 的创建与保管人；是否允许测试时钟/异步支付方式 | S05.1–S05.3 需要 | 用户 + D00 |
| 3 | 邮件测试出口方案：Resend 专用测试 key + 白名单收件箱，或在代码中加可切换的 `MAIL_TRANSPORT`（会触及业务代码，需要批准） | S05.3–S05.4 | 用户 + D05b 负责人 |
| 4 | 租约 TTL（120s）、徽章锁 TTL（45m）、`attempts` 上限（账本 12 / 通知 3）是否批准 | 直接影响恢复时延与重试次数 | 协调者 |
| 5 | 账本是否允许存明文 `email`（周报重试需要）；若不允许，需改为只存 Resend contact id | 隐私与可运维性权衡 | 用户 |
| 6 | `webhookSession`/`digestRecipient`/`cronLock` 的保留期与清理负责人（本契约不删除） | 数据集长期增长 | 协调者 + D00 |
| 7 | `needs_review` 的告警去向与值守人（决定表 `alert_destination` 仍 UNSET） | 人工核对能否闭环 | D00 |
| 8 | Discord 通知是否保留（无幂等、错误被吞）；建议改为可返回状态的实现或降级为 `unknown` 高频项 | S05.3 断言范围 | 协调者 |
| 9 | `weeks != 1` 的回填策略（本契约只允许 dryRun） | 运营需求 | 用户 |
| 10 | 旧平台 cron 排空证据的采集人与时间窗（切流窗口、日志保留期） | §8 证据链 | D06 + 生产执行者 |
| 11 | 确认线上支付方式是否仅卡支付（决定 `async_payment_*` 是否可达，仍按契约实现防御） | 状态机分支覆盖 | 用户 |
| 12 | D05b 负责人与独立审查者（D05a 审查通过后才派发） | 排期 | 协调者 |

补充：本契约引入两个非秘密开关 `PAYMENT_WRITES_ENABLED`、`CRON_WRITES_ENABLED`（默认 `false`）与一个构建期标记 `APP_SIDE_EFFECTS_CONTRACT_VERSION`，需由 D01 登记到 `config/env-manifest.json`（phase=runtime；标记为 both），并由 D06 在候选/恢复环境显式保持开关关闭；它们不得与任何秘密合并存放。

---

## 附录 A：错误码

| 码 | 场景 | 自动动作 |
| --- | --- | --- |
| `SIGNATURE_INVALID` | 签名/body 校验失败 | 400，零写入 |
| `EVENT_TYPE_IGNORED` | 非目标事件 | 200，不建账本 |
| `METADATA_INVALID` | `userId`/`itemId`/`pricePlan` 缺失或非法 | `needs_review` |
| `ITEM_NOT_FOUND` | 条目已删除或 id 不存在 | `needs_review` |
| `USER_NOT_FOUND` | 用户不存在 | `needs_review` |
| `PAYMENT_NOT_PAID` | `payment_status != paid` | `received` + `awaiting_payment` |
| `PAYMENT_FAILED` | `async_payment_failed` | `failed` |
| `LEDGER_ID_CONFLICT` | 同 `_id` 的 `sessionId` 不一致 | 500 + 告警 |
| `ORDER_CREATE_FAILED` | 订单写入 5xx | 可重试 |
| `ITEM_PATCH_FAILED` | 条目 patch 5xx/超时 | 可重试，保留 500 |
| `ITEM_SUPERSEDED_BY_NEWER_ORDER` | 条目已属更新订单 | `needs_review`，不降级 |
| `LEGACY_AMBIGUOUS` | 多个 24h 内候选旧订单 | `needs_review` |
| `LEASE_LOST` | 心跳/写 CAS 409 | 停止本 worker |
| `ATTEMPTS_EXHAUSTED` | `attempts >= 12` | `needs_review` |
| `NOTIFY_TIMEOUT` / `NOTIFY_UNKNOWN_RESPONSE` | 超时/5xx/408/无法解析 | `unknown` + `needs_review` |
| `NOTIFY_REJECTED` | 上游明确 4xx | `failed`，最多重试 3 次 |
| `NOTIFY_RATE_LIMITED` | 429 | `failed`，退避重试 |
| `DIGEST_ID_COLLISION` | hash 相同但邮箱不同 | `needs_review` |
| `SEND_OUTCOME_UNKNOWN_STALE_PENDING` | 收件人 `pending` 超 30 分钟 | 改 `unknown`，不重发 |
| `WEEKS_BACKFILL_NOT_ALLOWED` | `weeks != 1` 且非 dryRun | 400 |
| `WRITES_DISABLED` | 候选/恢复环境 | 503，零写入 |
| `REVALIDATE_FAILED` | ISR 失效异常 | 记录，不阻塞 |

## 附录 B：文档 `_id` 与查询索引规则

| 文档 | `_id` 规则 | 备注 |
| --- | --- | --- |
| `webhookSession` | `webhookSession-<sessionId>` | 业务唯一键；`create` 冲突即互斥闸门 |
| `order`（新） | `order-<sessionId>` | 订单层第二道唯一性闸门；旧订单保持随机 `_id` 不动 |
| `digestRecipient` | `digestRecipient-<hex32>` | 一窗口一收件人；`hex32 = sha256(normalizedEmail + "\|" + windowKey)[0:32]` |
| `cronLock` | `cronLock-checkBadges-<YYYY-MM-DD>` | UTC 日期；永不删除 |
| `cronLock`（恢复器，可选） | 不需要全局锁 | 逐账本 CAS 已足够 |

GROQ 一律参数化；`useCdn: false` 用于所有幂等判定读（避免 CDN 旧快照导致误判）。字段与文档类型加入 `src/sanity/schemas/` 后必须运行 `pnpm typegen`，不得手改 `sanity.types.ts`。

## 附录 C：Schema 变更清单（D05b 执行）

新增文档类型（各自一个文件，注册到 `src/sanity/schemas/index.ts`）：

| `_type` | 建议路径 | 用途 |
| --- | --- | --- |
| `webhookSession` | `src/sanity/schemas/documents/order/webhook-session.ts` | 支付账本与状态机 |
| `digestRecipient` | `src/sanity/schemas/documents/order/digest-recipient.ts` | 周报收件人账本 |
| `cronLock` | `src/sanity/schemas/documents/order/cron-lock.ts` | cron 单飞锁 |

`order` 新增字段（全部 `readOnly: true`）：`stripeSessionId`（string）、`webhookLedgerId`（string）、`fulfillmentStatus`（string，列表 `pending|item_patched|complete|needs_review`，`initialValue: "pending"`）、`pricePlan`（string）、`priceId`（string）、`amountTotal`（number）、`currency`（string）。

`item` 新增字段（全部 `readOnly: true`）：`badgeUnavailableNotifyState`（string，`none|pending|sent|failed|unknown`）、`badgeUnavailableNotifyAttempts`（number）、`badgeUnavailableNotifyLastAt`（datetime）、`badgeUnavailableNotifyUnknownAt`（datetime）。

约束：

- `webhookSession` / `digestRecipient` / `cronLock` 是内部运维文档，Studio 中设为只读并尽量从导航隐藏（或加说明），不得作为人工编辑入口。
- 字段名严格使用本文件的 camelCase；`_type` 字符串必须一致，否则 GROQ 与账本对不上。
- 改完 schema 必须运行 `pnpm typegen`，禁止手改 `sanity.types.ts`。
- Schema 变更为加法式，不删除/重命名既有字段；旧镜像读不到新字段也不会崩，但**仍不得作为回滚目标**（§9）。

## 附录 D：判据优先级（实现者务必遵守）

```text
1. 条目实际字段（paid / order._ref / pricePlan / proPlanStatus / sponsorPlanStatus）
2. 订单文档（order-<sid> 的 stripeSessionId 与 fulfillmentStatus）
3. 账本（state / fulfillmentCheckpoint / notifications）
```

账本是审计与驱动记录，**不是**履约完成的唯一证据；订单是账本的派生物，**不是**条目一致性的替代物。任何“因为账本/订单说完成了所以跳过条目检查”的实现都视为违反本契约。
