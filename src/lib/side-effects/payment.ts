import { PricePlans } from "@/lib/submission";
import { getItemLinkInWebsite } from "@/lib/utils";
import { revalidatePath, revalidateTag } from "next/cache";
import { CHECKOUT_SESSION_RE, orderIdForSession, webhookLedgerId } from "./ids";
import {
  casPatch,
  createDocument,
  fetchStaleLedgers,
  fetchUserById,
  findLegacyCandidates,
  findOrderBySession,
  readById,
  readItem,
  readOrder,
} from "./ledger";
import {
  sendAdminPaymentTracked,
  sendDiscordTracked,
  sendPaymentSuccessTracked,
} from "./notifications";
import {
  backoffMs,
  evaluateItemAction,
  finalizeNotifications,
  isTerminalState,
} from "./pure";
import type {
  ItemLike,
  NotificationRecord,
  OrderLike,
  SendOutcome,
  WebhookLedger,
} from "./types";

const LEASE_TTL_MS = 120_000;
const MAX_ATTEMPTS = 12;

export type StripeSessionLike = {
  id: string;
  customer?: string | null;
  amount_total?: number | null;
  currency?: string | null;
  payment_status?: string | null;
  created?: number | null;
  metadata?: Record<string, string | undefined> | null;
};

export type StripeEventLike = {
  id: string;
  type: string;
  created?: number;
};

type DriveContext = {
  eventId: string;
  eventType: string;
  eventCreatedAt: string;
  session: StripeSessionLike;
  createdLedger: boolean;
};

const owner = `findryai-${process.pid}-${Math.random().toString(16).slice(2, 10)}`;

export const writesEnabled = () =>
  process.env.PAYMENT_WRITES_ENABLED === "true";

function sessionIso(session: StripeSessionLike) {
  return new Date(
    (session.created ?? Math.floor(Date.now() / 1000)) * 1000,
  ).toISOString();
}

function isPaid(session: StripeSessionLike) {
  return (
    session.payment_status === "paid" ||
    session.payment_status === "no_payment_required"
  );
}

function ledgerBase(
  session: StripeSessionLike,
  event: StripeEventLike,
): WebhookLedger {
  return {
    _id: webhookLedgerId(session.id),
    _type: "webhookSession",
    sessionId: session.id,
    state: "received",
    attempts: 0,
    paymentStatus: session.payment_status ?? "unknown",
    lastEventId: event.id,
    lastEventType: event.type,
    lastEventCreatedAt: new Date(
      (event.created ?? Math.floor(Date.now() / 1000)) * 1000,
    ).toISOString(),
    eventIds: [event.id],
    stripeCustomerId: session.customer ?? undefined,
    sessionCreatedAt: sessionIso(session),
    amountTotal: session.amount_total ?? 0,
    currency: session.currency ?? "usd",
    priceId: session.metadata?.priceId,
    pricePlan: session.metadata?.pricePlan,
    userId: session.metadata?.userId,
    itemId: session.metadata?.itemId,
    fulfillmentCheckpoint: "none",
    notifications: {
      paymentSuccessEmail: { status: "pending", attempts: 0 },
      adminPaymentEmail: { status: "pending", attempts: 0 },
      discord: { status: "pending", attempts: 0 },
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

async function recordEvent(ledger: WebhookLedger, event: StripeEventLike) {
  if (!ledger._rev) return;
  const eventIds = Array.from(
    new Set([...(ledger.eventIds ?? []), event.id]),
  ).slice(-10);
  await casPatch(ledger._id, ledger._rev, {
    eventIds,
    lastEventId: event.id,
    lastEventType: event.type,
    lastEventCreatedAt: new Date(
      (event.created ?? Math.floor(Date.now() / 1000)) * 1000,
    ).toISOString(),
    paymentStatus: ledger.paymentStatus,
    updatedAt: new Date().toISOString(),
  }).catch(() => undefined);
}

function leaseActive(ledger: WebhookLedger) {
  return Boolean(
    ledger.leaseExpiresAt &&
      Date.parse(ledger.leaseExpiresAt) > Date.now() &&
      ledger.leaseOwner !== owner,
  );
}

async function releaseLease(
  ledger: WebhookLedger,
  set: Record<string, unknown> = {},
) {
  if (!ledger._rev) return;
  await casPatch(ledger._id, ledger._rev, {
    ...set,
    leaseOwner: "",
    leaseExpiresAt: "",
    updatedAt: new Date().toISOString(),
  }).catch(() => undefined);
}

async function markNeedsReview(ledger: WebhookLedger, reason: string) {
  await releaseLease(ledger, {
    state: "needs_review",
    needsReviewReason: reason,
    lastErrorCode: reason,
  });
}

async function acquireLease(
  ledger: WebhookLedger,
): Promise<
  | { ok: true; ledger: WebhookLedger }
  | { ok: false; reason: "terminal" | "busy" | "backoff" | "exhausted" }
> {
  let current = ledger;
  for (let i = 0; i < 3; i += 1) {
    if (isTerminalState(current.state))
      return { ok: false, reason: "terminal" };
    if (leaseActive(current)) return { ok: false, reason: "busy" };
    if (
      current.nextAttemptAt &&
      Date.parse(current.nextAttemptAt) > Date.now()
    ) {
      return { ok: false, reason: "backoff" };
    }
    if (current.attempts >= MAX_ATTEMPTS) {
      await markNeedsReview(current, "ATTEMPTS_EXHAUSTED");
      return { ok: false, reason: "exhausted" };
    }
    if (!current._rev) return { ok: false, reason: "busy" };
    const nextState =
      current.state === "received" ? "processing" : current.state;
    const result = await casPatch<WebhookLedger>(current._id, current._rev, {
      state: nextState,
      attempts: current.attempts + 1,
      nextAttemptAt: new Date(
        Date.now() + backoffMs(current.attempts + 1),
      ).toISOString(),
      leaseOwner: owner,
      leaseExpiresAt: new Date(Date.now() + LEASE_TTL_MS).toISOString(),
      leaseAcquiredAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    if (result.ok) return { ok: true, ledger: result.doc };
    const fresh = await readById<WebhookLedger>(current._id);
    if (!fresh) return { ok: false, reason: "busy" };
    current = fresh;
  }
  return { ok: false, reason: "busy" };
}

function planLabel(plan?: string) {
  return plan === PricePlans.SPONSOR ? "Sponsor" : "Pro Featured";
}

async function resolveOrder(
  ledger: WebhookLedger,
): Promise<{ order: OrderLike; source: "new" | "legacy" } | { error: string }> {
  const sessionId = ledger.sessionId;
  const existing = await findOrderBySession(sessionId);
  if (existing) return { order: existing, source: "new" };
  if (!ledger.userId || !ledger.itemId || !ledger.sessionCreatedAt) {
    return { error: "METADATA_INVALID" };
  }
  const legacy = await findLegacyCandidates(
    ledger.userId,
    ledger.itemId,
    ledger.sessionCreatedAt,
  );
  if (legacy.length > 1) return { error: "LEGACY_AMBIGUOUS" };
  if (legacy.length === 1) return { order: legacy[0], source: "legacy" };

  const id = orderIdForSession(sessionId);
  const { created, doc } = await createDocument<
    OrderLike &
      Record<string, unknown> & {
        _type: string;
      }
  >({
    _id: id,
    _type: "order",
    user: { _ref: ledger.userId },
    item: { _ref: ledger.itemId },
    status: "success",
    date: ledger.sessionCreatedAt,
    stripeSessionId: sessionId,
    webhookLedgerId: ledger._id,
    fulfillmentStatus: "pending",
    pricePlan: ledger.pricePlan,
    priceId: ledger.priceId,
    amountTotal: ledger.amountTotal,
    currency: ledger.currency,
  });
  return { order: doc as OrderLike, source: created ? "new" : "new" };
}

async function patchItem(
  ledger: WebhookLedger,
  item: ItemLike,
  order: OrderLike,
  plan: "pro" | "sponsor",
): Promise<"patched" | "consistent" | "superseded" | "conflict"> {
  if (!item._rev) return "conflict";
  const values = {
    paid: true,
    featured: true,
    pricePlan: plan,
    sponsor: plan === "sponsor",
    proPlanStatus: plan === "pro" ? "success" : "submitting",
    sponsorPlanStatus: plan === "sponsor" ? "success" : "submitting",
    order: { _type: "reference", _ref: order._id },
    ...(plan === "sponsor"
      ? { sponsorStartDate: ledger.sessionCreatedAt }
      : {}),
  };
  const result = await casPatch<ItemLike>(item._id, item._rev, values);
  if (result.ok) return "patched";
  const fresh = await readItem(item._id);
  if (!fresh) return "conflict";
  const action = evaluateItemAction({
    item: fresh,
    ledgerOrderId: order._id,
    plan,
    ledgerDate: ledger.sessionCreatedAt,
  });
  if (action === "consistent") return "consistent";
  if (action === "superseded") return "superseded";
  return "conflict";
}

type NotificationChannel =
  | "paymentSuccessEmail"
  | "adminPaymentEmail"
  | "discord";

async function walNotification(
  ledger: WebhookLedger,
  channel: NotificationChannel,
  state: NotificationRecord,
) {
  if (!ledger._rev) return null;
  const result = await casPatch<WebhookLedger>(ledger._id, ledger._rev, {
    [`notifications.${channel}`]: state,
    updatedAt: new Date().toISOString(),
  });
  return result.ok ? result.doc : null;
}

async function runNotifications(
  ledger: WebhookLedger,
  user: { name?: string; email?: string },
  item: ItemLike,
): Promise<WebhookLedger> {
  let current = ledger;
  const itemLink = getItemLinkInWebsite(item.slug?.current ?? "");
  const channelPlan: {
    channel: NotificationChannel;
    send: (record: NotificationRecord) => Promise<SendOutcome>;
  }[] = [
    {
      channel: "paymentSuccessEmail",
      send: async () => {
        if (!user.email)
          return { status: "skipped", reason: "USER_EMAIL_MISSING" };
        return sendPaymentSuccessTracked({
          userName: user.name ?? "there",
          email: user.email,
          itemLink,
          idempotencyKey: current._id,
        });
      },
    },
    {
      channel: "adminPaymentEmail",
      send: async () =>
        sendAdminPaymentTracked({
          itemName: item.name ?? "",
          planLabel: planLabel(current.pricePlan),
          amount: (current.amountTotal ?? 0) / 100,
          payerName: user.name,
          payerEmail: user.email,
          itemLink,
          idempotencyKey: current._id,
        }),
    },
    {
      channel: "discord",
      send: async () =>
        sendDiscordTracked({
          sessionId: current.sessionId,
          customerId: current.stripeCustomerId ?? "",
          userName: user.name ?? "unknown",
          amount: (current.amountTotal ?? 0) / 100,
        }),
    },
  ];

  for (const entry of channelPlan) {
    const existing = current.notifications?.[entry.channel];
    if (existing && ["sent", "skipped", "unknown"].includes(existing.status))
      continue;
    if (existing?.status === "failed" && (existing.attempts ?? 0) >= 3)
      continue;

    const attempts = (existing?.attempts ?? 0) + 1;
    const pendingRecord: NotificationRecord = {
      status: "pending",
      attempts,
      firstAttemptAt: existing?.firstAttemptAt ?? new Date().toISOString(),
      lastAttemptAt: new Date().toISOString(),
    };
    const withWal = await walNotification(
      current,
      entry.channel,
      pendingRecord,
    );
    if (!withWal) return current;
    current = withWal;

    const outcome = await entry.send(pendingRecord);
    const record: NotificationRecord = {
      ...pendingRecord,
      status: outcome.status,
      ...(outcome.status === "skipped" ? { reason: outcome.reason } : {}),
      ...("messageId" in outcome && outcome.messageId
        ? { messageId: outcome.messageId }
        : {}),
      ...("httpStatus" in outcome && outcome.httpStatus
        ? { httpStatus: outcome.httpStatus }
        : {}),
      ...("errorCode" in outcome && outcome.errorCode
        ? { errorCode: outcome.errorCode }
        : {}),
      ...("errorMessage" in outcome && outcome.errorMessage
        ? { errorMessage: outcome.errorMessage }
        : {}),
      ...(outcome.status === "sent" || outcome.status === "skipped"
        ? { resolvedAt: new Date().toISOString() }
        : {}),
    };
    const updated = await walNotification(current, entry.channel, record);
    if (!updated) return current;
    current = updated;
  }

  const finalize = finalizeNotifications(current.notifications ?? {});
  const result = await casPatch<WebhookLedger>(
    current._id,
    current._rev ?? "",
    {
      state: finalize.state,
      ...(finalize.reason ? { needsReviewReason: finalize.reason } : {}),
      leaseOwner: "",
      leaseExpiresAt: "",
      updatedAt: new Date().toISOString(),
    },
  );
  return result.ok ? result.doc : current;
}

async function markFulfilled(
  ledger: WebhookLedger,
  order: OrderLike,
  source: "new" | "legacy",
) {
  if (!ledger._rev) return ledger;
  const result = await casPatch<WebhookLedger>(ledger._id, ledger._rev, {
    state: "fulfilled",
    fulfilledAt: ledger.fulfilledAt ?? new Date().toISOString(),
    orderId: order._id,
    orderSource: source,
    adoptedReason: source === "legacy" ? "legacy_user_item_match" : "",
    fulfillmentCheckpoint: "item_patched",
    lastErrorCode: "",
    lastErrorMessage: "",
    updatedAt: new Date().toISOString(),
  });
  return result.ok ? result.doc : ledger;
}

async function drive(
  input: WebhookLedger,
): Promise<{ status: number; body?: Record<string, unknown> }> {
  let ledger = input;
  if (isTerminalState(ledger.state))
    return { status: 200, body: { state: ledger.state } };

  if (!isPaid({ id: ledger.sessionId, payment_status: ledger.paymentStatus })) {
    if (ledger.lastEventType === "checkout.session.async_payment_failed") {
      await releaseLease(ledger, {
        state: "failed",
        lastErrorCode: "PAYMENT_FAILED",
      });
      return { status: 200, body: { state: "failed" } };
    }
    await releaseLease(ledger, {
      state: "received",
      holdReason: "awaiting_payment",
    });
    return {
      status: 200,
      body: { state: "received", holdReason: "awaiting_payment" },
    };
  }
  if (ledger.holdReason === "awaiting_payment" && ledger._rev) {
    const cleared = await casPatch<WebhookLedger>(ledger._id, ledger._rev, {
      holdReason: "",
      updatedAt: new Date().toISOString(),
    });
    if (cleared.ok) ledger = cleared.doc;
  }

  const acquired = await acquireLease(ledger);
  if ("reason" in acquired) {
    if (acquired.reason === "terminal")
      return { status: 200, body: { state: "terminal" } };
    return { status: 200, body: { [acquired.reason]: true } };
  }
  let current = acquired.ledger;

  if (
    !current.pricePlan ||
    !["pro", "sponsor"].includes(current.pricePlan) ||
    !current.userId ||
    !current.itemId
  ) {
    await markNeedsReview(current, "METADATA_INVALID");
    return { status: 200, body: { needs_review: "METADATA_INVALID" } };
  }
  const user = await fetchUserById(current.userId);
  if (!user) {
    await markNeedsReview(current, "USER_NOT_FOUND");
    return { status: 200, body: { needs_review: "USER_NOT_FOUND" } };
  }
  const item = await readItem(current.itemId);
  if (!item) {
    await markNeedsReview(current, "ITEM_NOT_FOUND");
    return { status: 200, body: { needs_review: "ITEM_NOT_FOUND" } };
  }

  if (
    current.state === "fulfilled" ||
    current.state === "notifications_pending"
  ) {
    const consistent =
      item.paid === true &&
      item.order?._ref === current.orderId &&
      item.pricePlan === current.pricePlan;
    if (!consistent) {
      await markNeedsReview(current, "ITEM_DRIFT_AFTER_FULFILLED");
      return {
        status: 200,
        body: { needs_review: "ITEM_DRIFT_AFTER_FULFILLED" },
      };
    }
    const next = await runNotifications(current, user, item);
    return { status: 200, body: { state: next.state } };
  }

  const resolved = await resolveOrder(current);
  if ("error" in resolved) {
    await markNeedsReview(current, resolved.error);
    return { status: 200, body: { needs_review: resolved.error } };
  }
  let order = resolved.order;
  if (!order._id) {
    await markNeedsReview(current, "ORDER_CREATE_FAILED");
    return { status: 500, body: { error: "ORDER_CREATE_FAILED" } };
  }
  if (
    resolved.source === "new" &&
    current.fulfillmentCheckpoint !== "order_created" &&
    current._rev
  ) {
    const checkpoint = await casPatch<WebhookLedger>(
      current._id,
      current._rev,
      {
        orderId: order._id,
        orderSource: "new",
        fulfillmentCheckpoint: "order_created",
        updatedAt: new Date().toISOString(),
      },
    );
    if (checkpoint.ok) current = checkpoint.doc;
  }

  let existingOrderDate: string | undefined;
  const referenced = item.order?._ref;
  if (referenced && referenced !== order._id) {
    const other = await readOrder(referenced);
    existingOrderDate = other?.date;
  }
  const action = evaluateItemAction({
    item,
    ledgerOrderId: order._id,
    plan: current.pricePlan as "pro" | "sponsor",
    currentOrderDate: existingOrderDate,
    ledgerDate: current.sessionCreatedAt,
  });
  if (action === "superseded") {
    await markNeedsReview(current, "ITEM_SUPERSEDED_BY_NEWER_ORDER");
    return {
      status: 200,
      body: { needs_review: "ITEM_SUPERSEDED_BY_NEWER_ORDER" },
    };
  }
  if (action === "needs_patch") {
    let patched: Awaited<ReturnType<typeof patchItem>> = "conflict";
    for (let attempt = 0; attempt < 2; attempt += 1) {
      patched = await patchItem(
        current,
        item,
        order,
        current.pricePlan as "pro" | "sponsor",
      );
      if (patched !== "conflict") break;
      const fresh = await readItem(current.itemId ?? "");
      if (!fresh) break;
      const refreshed = evaluateItemAction({
        item: fresh,
        ledgerOrderId: order._id,
        plan: current.pricePlan as "pro" | "sponsor",
        ledgerDate: current.sessionCreatedAt,
      });
      if (refreshed === "consistent") {
        patched = "consistent";
        break;
      }
    }
    if (patched === "superseded") {
      await markNeedsReview(current, "ITEM_SUPERSEDED_BY_NEWER_ORDER");
      return {
        status: 200,
        body: { needs_review: "ITEM_SUPERSEDED_BY_NEWER_ORDER" },
      };
    }
    if (patched === "conflict") {
      const errorCode = "ITEM_PATCH_FAILED";
      await releaseLease(current, {
        state: "received",
        lastErrorCode: errorCode,
        lastErrorMessage: "item patch conflict",
        fulfillmentCheckpoint: "order_created",
        nextAttemptAt: new Date(
          Date.now() + backoffMs(current.attempts + 1),
        ).toISOString(),
      });
      return { status: 500, body: { error: errorCode } };
    }
    if (patched === "patched") {
      revalidatePath("/", "layout");
      revalidateTag("sponsor-banner");
    }
  }

  if (resolved.source === "new") {
    const freshOrder = await readOrder(order._id);
    if (freshOrder?._rev) {
      await casPatch(freshOrder._id, freshOrder._rev, {
        fulfillmentStatus: "complete",
      }).catch(() => undefined);
      order = freshOrder;
    }
  }
  current = await markFulfilled(current, order, resolved.source);

  if (resolved.source === "legacy") {
    const skipped = {
      status: "skipped" as const,
      attempts: 0,
      reason: "legacy_adoption_no_resend",
      resolvedAt: new Date().toISOString(),
    };
    if (current._rev) {
      const result = await casPatch<WebhookLedger>(current._id, current._rev, {
        "notifications.paymentSuccessEmail": skipped,
        "notifications.adminPaymentEmail": skipped,
        "notifications.discord": skipped,
        state: "processed",
        leaseOwner: "",
        leaseExpiresAt: "",
        updatedAt: new Date().toISOString(),
      });
      if (result.ok) current = result.doc;
    }
    return { status: 200, body: { state: current.state } };
  }

  const next = await runNotifications(current, user, item);
  return { status: 200, body: { state: next.state } };
}

export async function handleCheckoutSessionEvent(
  event: StripeEventLike,
  session: StripeSessionLike,
): Promise<{ status: number; body?: Record<string, unknown> }> {
  if (!writesEnabled()) {
    return { status: 503, body: { error: "WRITES_DISABLED" } };
  }
  if (!CHECKOUT_SESSION_RE.test(session.id)) {
    return { status: 400, body: { error: "SESSION_ID_INVALID" } };
  }
  const base = ledgerBase(session, event);
  const { created, doc } = await createDocument<WebhookLedger>(base);
  if (!created && doc.sessionId !== session.id) {
    return { status: 500, body: { error: "LEDGER_ID_CONFLICT" } };
  }
  await recordEvent(doc, event);
  const fresh = (await readById<WebhookLedger>(doc._id)) ?? doc;
  return drive(fresh);
}

export async function resumeStaleSideEffects(limit = 20) {
  const stale = await fetchStaleLedgers(limit);
  const results: { id: string; status: number }[] = [];
  for (const ledger of stale) {
    try {
      const result = await drive(ledger);
      results.push({ id: ledger._id, status: result.status });
    } catch (error) {
      results.push({ id: ledger._id, status: 500 });
      console.error("resume-side-effects failed", ledger._id, error);
    }
  }
  return results;
}
