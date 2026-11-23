import assert from "node:assert/strict";
import { test } from "node:test";
import {
  digestWindowId,
  isoMondayWindow,
  normalizeEmail,
  orderIdForSession,
  webhookLedgerId,
} from "@/lib/side-effects/ids";
import {
  backoffMs,
  classifySendResult,
  evaluateItemAction,
  finalizeNotifications,
  isTerminalState,
} from "@/lib/side-effects/pure";

test("deterministic ids use session and email+window", () => {
  assert.equal(webhookLedgerId("cs_live_abc"), "webhookSession-cs_live_abc");
  assert.equal(orderIdForSession("cs_live_abc"), "order-cs_live_abc");
  assert.equal(
    digestWindowId("2026-11-23", "User@Example.com"),
    digestWindowId("2026-11-23", normalizeEmail(" User@Example.COM ")),
  );
  assert.notEqual(
    digestWindowId("2026-11-23", "a@example.com"),
    digestWindowId("2026-11-30", "a@example.com"),
  );
});

test("ISO Monday window is stable at Sunday midnight", () => {
  const sunday = new Date("2026-11-29T23:59:59Z");
  const window = isoMondayWindow(sunday);
  assert.equal(window.windowKey, "2026-11-23");
  assert.equal(window.windowStart.toISOString(), "2026-11-23T00:00:00.000Z");
  assert.equal(window.contentStart.toISOString(), "2026-11-16T00:00:00.000Z");
  const monday = isoMondayWindow(new Date("2026-11-23T00:00:00Z"));
  assert.equal(monday.windowKey, "2026-11-23");
});

test("notification tri-state classification", () => {
  assert.equal(
    classifySendResult({ ok: true, messageId: "re_1" }).status,
    "sent",
  );
  assert.equal(
    classifySendResult({ ok: false, httpStatus: 422 }).status,
    "failed",
  );
  assert.equal(
    classifySendResult({ ok: false, httpStatus: 429 }).status,
    "failed",
  );
  assert.equal(
    classifySendResult({ ok: false, httpStatus: 500 }).status,
    "unknown",
  );
  assert.equal(classifySendResult({ ok: false }).status, "unknown");
});

test("finalize never treats unknown as success and never auto-resends it", () => {
  const unknown = finalizeNotifications({
    paymentSuccessEmail: { status: "sent", attempts: 1 },
    adminPaymentEmail: { status: "unknown", attempts: 1 },
    discord: { status: "sent", attempts: 1 },
  });
  assert.equal(unknown.state, "needs_review");
  assert.match(unknown.reason ?? "", /NOTIFY_UNKNOWN/);

  const retriable = finalizeNotifications({
    paymentSuccessEmail: { status: "sent", attempts: 1 },
    adminPaymentEmail: { status: "failed", attempts: 1 },
    discord: { status: "skipped", attempts: 0 },
  });
  assert.equal(retriable.state, "notifications_pending");

  const exhausted = finalizeNotifications({
    paymentSuccessEmail: { status: "sent", attempts: 1 },
    adminPaymentEmail: { status: "failed", attempts: 3 },
    discord: { status: "skipped", attempts: 0 },
  });
  assert.equal(exhausted.state, "needs_review");

  const done = finalizeNotifications({
    paymentSuccessEmail: { status: "sent", attempts: 1 },
    adminPaymentEmail: { status: "skipped", attempts: 0 },
    discord: { status: "skipped", attempts: 0 },
  });
  assert.equal(done.state, "processed");
});

test("item consistency uses actual fields, not ledger checkpoint", () => {
  const base = { _id: "item-1", _rev: "r1" };
  assert.equal(
    evaluateItemAction({
      item: {
        ...base,
        paid: true,
        pricePlan: "pro",
        proPlanStatus: "success",
        order: { _ref: "order-1" },
      },
      ledgerOrderId: "order-1",
      plan: "pro",
    }),
    "consistent",
  );
  assert.equal(
    evaluateItemAction({
      item: {
        ...base,
        paid: false,
        pricePlan: "free",
        order: { _ref: "order-1" },
      },
      ledgerOrderId: "order-1",
      plan: "pro",
    }),
    "needs_patch",
  );
  assert.equal(
    evaluateItemAction({
      item: {
        ...base,
        paid: true,
        pricePlan: "pro",
        proPlanStatus: "success",
        order: { _ref: "older" },
      },
      ledgerOrderId: "order-2",
      plan: "pro",
      currentOrderDate: "2026-11-01T00:00:00Z",
      ledgerDate: "2026-11-02T00:00:00Z",
    }),
    "needs_patch",
  );
  assert.equal(
    evaluateItemAction({
      item: {
        ...base,
        paid: true,
        pricePlan: "sponsor",
        sponsorPlanStatus: "success",
        order: { _ref: "newer" },
      },
      ledgerOrderId: "order-2",
      plan: "pro",
      currentOrderDate: "2026-11-03T00:00:00Z",
      ledgerDate: "2026-11-02T00:00:00Z",
    }),
    "superseded",
  );
});

test("terminal states and backoff are bounded", () => {
  assert.equal(isTerminalState("processed"), true);
  assert.equal(isTerminalState("needs_review"), true);
  assert.equal(isTerminalState("notifications_pending"), false);
  assert.equal(backoffMs(1), 60_000);
  assert.equal(backoffMs(100), 3_600_000);
});
