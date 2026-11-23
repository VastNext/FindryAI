import type {
  ItemAction,
  ItemLike,
  LedgerState,
  NotificationRecord,
  OrderLike,
  SendOutcome,
} from "./types";

const TERMINAL: LedgerState[] = ["processed", "needs_review", "failed"];

export const isTerminalState = (state: LedgerState) => TERMINAL.includes(state);

export const backoffMs = (attempt: number) => {
  const table = [
    60_000, 120_000, 240_000, 480_000, 960_000, 1_920_000, 3_600_000,
  ];
  return table[Math.min(Math.max(attempt - 1, 0), table.length - 1)];
};

/**
 * 条目一致性判定：以条目实际字段为最终判据。
 * - 已指向同一订单且字段齐全 → consistent
 * - 无订单引用 / 指向更旧订单 → needs_patch
 * - 指向更新订单 → superseded（不降级，转人工）
 */
export function evaluateItemAction(args: {
  item: ItemLike;
  ledgerOrderId: string;
  plan: "pro" | "sponsor";
  currentOrderDate?: string;
  ledgerDate?: string;
}): ItemAction {
  const { item, ledgerOrderId, plan } = args;
  const ref = item.order?._ref ?? null;
  const planFieldsConsistent =
    item.pricePlan === plan &&
    (plan === "pro"
      ? item.proPlanStatus === "success"
      : item.sponsorPlanStatus === "success");
  if (ref === ledgerOrderId) {
    return item.paid === true && planFieldsConsistent
      ? "consistent"
      : "needs_patch";
  }
  if (!ref) return "needs_patch";
  if (args.currentOrderDate && args.ledgerDate) {
    const current = Date.parse(args.currentOrderDate);
    const target = Date.parse(args.ledgerDate);
    if (Number.isFinite(current) && Number.isFinite(target)) {
      if (current > target) return "superseded";
      return "needs_patch";
    }
  }
  return "superseded";
}

export function classifySendResult(result: {
  ok: boolean;
  httpStatus?: number;
  errorCode?: string;
  errorMessage?: string;
  messageId?: string;
}): SendOutcome {
  if (result.ok) {
    return {
      status: "sent",
      messageId: result.messageId,
      httpStatus: result.httpStatus,
    };
  }
  const code = result.errorCode ?? "NOTIFY_UNKNOWN";
  if (
    result.httpStatus &&
    result.httpStatus >= 400 &&
    result.httpStatus < 500
  ) {
    return {
      status: "failed",
      httpStatus: result.httpStatus,
      errorCode:
        result.httpStatus === 429 ? "NOTIFY_RATE_LIMITED" : "NOTIFY_REJECTED",
      errorMessage: result.errorMessage,
    };
  }
  return {
    status: "unknown",
    httpStatus: result.httpStatus,
    errorCode: result.httpStatus === 408 ? "NOTIFY_TIMEOUT" : code,
    errorMessage: result.errorMessage,
  };
}

export type FinalizeResult = {
  state: Extract<
    LedgerState,
    "notifications_pending" | "processed" | "needs_review"
  >;
  reason?: string;
  terminalUnknown: string[];
};

export function finalizeNotifications(
  notifications: Record<string, NotificationRecord | undefined>,
): FinalizeResult {
  const unknownChannels = Object.entries(notifications)
    .filter(([, record]) => record?.status === "unknown")
    .map(([name]) => name);
  if (unknownChannels.length > 0) {
    return {
      state: "needs_review",
      reason: `NOTIFY_UNKNOWN:${unknownChannels.join(",")}`,
      terminalUnknown: unknownChannels,
    };
  }
  const stillRetriable = Object.entries(notifications).some(
    ([, record]) =>
      record?.status === "pending" ||
      (record?.status === "failed" && (record.attempts ?? 0) < 3),
  );
  if (stillRetriable) {
    return { state: "notifications_pending", terminalUnknown: [] };
  }
  const exhausted = Object.entries(notifications)
    .filter(([, record]) => record?.status === "failed")
    .map(([name]) => name);
  if (exhausted.length > 0) {
    return {
      state: "needs_review",
      reason: `NOTIFY_FAILED:${exhausted.join(",")}`,
      terminalUnknown: [],
    };
  }
  return { state: "processed", terminalUnknown: [] };
}

export function isRetryableOrder(order: OrderLike | null | undefined) {
  return Boolean(order && order.status === "success");
}

export function sameFulfillment(
  ledger: { orderId?: string; pricePlan?: string },
  item: ItemLike,
) {
  return (
    item.paid === true &&
    item.order?._ref === ledger.orderId &&
    item.pricePlan === ledger.pricePlan
  );
}
