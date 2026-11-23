import { defineField, defineType } from "sanity";
import sideEffectNotification from "./side-effect-notification";

export default defineType({
  name: "webhookSession",
  title: "Webhook Session Ledger",
  type: "document",
  fields: [
    defineField({
      name: "sessionId",
      type: "string",
      readOnly: true,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "state",
      type: "string",
      readOnly: true,
      options: {
        list: [
          "received",
          "processing",
          "fulfilled",
          "notifications_pending",
          "processed",
          "needs_review",
          "failed",
        ],
      },
    }),
    defineField({ name: "attempts", type: "number", readOnly: true }),
    defineField({ name: "nextAttemptAt", type: "datetime", readOnly: true }),
    defineField({ name: "leaseOwner", type: "string", readOnly: true }),
    defineField({ name: "leaseExpiresAt", type: "datetime", readOnly: true }),
    defineField({ name: "holdReason", type: "string", readOnly: true }),
    defineField({ name: "paymentStatus", type: "string", readOnly: true }),
    defineField({ name: "lastEventId", type: "string", readOnly: true }),
    defineField({ name: "lastEventType", type: "string", readOnly: true }),
    defineField({
      name: "lastEventCreatedAt",
      type: "datetime",
      readOnly: true,
    }),
    defineField({
      name: "eventIds",
      type: "array",
      of: [{ type: "string" }],
      readOnly: true,
    }),
    defineField({ name: "stripeCustomerId", type: "string", readOnly: true }),
    defineField({ name: "sessionCreatedAt", type: "datetime", readOnly: true }),
    defineField({ name: "amountTotal", type: "number", readOnly: true }),
    defineField({ name: "currency", type: "string", readOnly: true }),
    defineField({ name: "priceId", type: "string", readOnly: true }),
    defineField({ name: "pricePlan", type: "string", readOnly: true }),
    defineField({ name: "userId", type: "string", readOnly: true }),
    defineField({ name: "itemId", type: "string", readOnly: true }),
    defineField({ name: "orderId", type: "string", readOnly: true }),
    defineField({ name: "orderSource", type: "string", readOnly: true }),
    defineField({ name: "adoptedReason", type: "string", readOnly: true }),
    defineField({
      name: "fulfillmentCheckpoint",
      type: "string",
      readOnly: true,
    }),
    defineField({ name: "fulfilledAt", type: "datetime", readOnly: true }),
    defineField({
      name: "notifications",
      type: "object",
      readOnly: true,
      fields: [
        defineField({
          name: "paymentSuccessEmail",
          type: "sideEffectNotification",
        }),
        defineField({
          name: "adminPaymentEmail",
          type: "sideEffectNotification",
        }),
        defineField({ name: "discord", type: "sideEffectNotification" }),
      ],
    }),
    defineField({ name: "needsReviewReason", type: "string", readOnly: true }),
    defineField({ name: "lastErrorCode", type: "string", readOnly: true }),
    defineField({ name: "lastErrorMessage", type: "text", readOnly: true }),
    defineField({ name: "resolvedBy", type: "string", readOnly: true }),
    defineField({ name: "resolvedAt", type: "datetime", readOnly: true }),
    defineField({ name: "createdAt", type: "datetime", readOnly: true }),
    defineField({ name: "updatedAt", type: "datetime", readOnly: true }),
  ],
  preview: {
    select: { title: "sessionId", state: "state", plan: "pricePlan" },
    prepare({ title, state, plan }) {
      return {
        title: title ?? "webhook",
        subtitle: `${state ?? "?"} · ${plan ?? ""}`,
      };
    },
  },
});
