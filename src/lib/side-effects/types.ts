export type LedgerState =
  | "received"
  | "processing"
  | "fulfilled"
  | "notifications_pending"
  | "processed"
  | "needs_review"
  | "failed";

export type NotificationStatus =
  | "pending"
  | "sent"
  | "failed"
  | "unknown"
  | "skipped";

export type NotificationRecord = {
  status: NotificationStatus;
  attempts: number;
  firstAttemptAt?: string;
  lastAttemptAt?: string;
  resolvedAt?: string;
  messageId?: string;
  httpStatus?: number;
  errorCode?: string;
  errorMessage?: string;
  reason?: string;
};

export type WebhookLedger = {
  _id: string;
  _rev?: string;
  _type: "webhookSession";
  sessionId: string;
  state: LedgerState;
  attempts: number;
  nextAttemptAt?: string;
  leaseOwner?: string;
  leaseExpiresAt?: string;
  leaseAcquiredAt?: string;
  holdReason?: string;
  paymentStatus?: string;
  lastEventId?: string;
  lastEventType?: string;
  lastEventCreatedAt?: string;
  eventIds?: string[];
  stripeCustomerId?: string;
  sessionCreatedAt?: string;
  amountTotal?: number;
  currency?: string;
  priceId?: string;
  pricePlan?: string;
  userId?: string;
  itemId?: string;
  orderId?: string;
  orderSource?: "new" | "legacy";
  adoptedReason?: string;
  fulfillmentCheckpoint?: "none" | "order_created" | "item_patched";
  fulfilledAt?: string;
  notifications?: {
    paymentSuccessEmail?: NotificationRecord;
    adminPaymentEmail?: NotificationRecord;
    discord?: NotificationRecord;
  };
  needsReviewReason?: string;
  lastErrorCode?: string;
  lastErrorMessage?: string;
  resolvedBy?: string;
  resolvedAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ItemLike = {
  _id: string;
  _rev?: string;
  name?: string;
  slug?: { current?: string };
  paid?: boolean | null;
  featured?: boolean | null;
  pricePlan?: string | null;
  sponsor?: boolean | null;
  proPlanStatus?: string | null;
  sponsorPlanStatus?: string | null;
  sponsorStartDate?: string | null;
  order?: { _ref?: string } | null;
};

export type OrderLike = {
  _id: string;
  _rev?: string;
  status?: string;
  date?: string;
  stripeSessionId?: string;
  fulfillmentStatus?: string;
  user?: { _ref?: string };
  item?: { _ref?: string };
};

export type ItemAction = "consistent" | "needs_patch" | "superseded";

export type SendOutcome =
  | { status: "skipped"; reason?: string }
  | { status: "sent"; messageId?: string; httpStatus?: number }
  | {
      status: "failed";
      httpStatus?: number;
      errorCode: string;
      errorMessage?: string;
    }
  | {
      status: "unknown";
      httpStatus?: number;
      errorCode: string;
      errorMessage?: string;
    };
