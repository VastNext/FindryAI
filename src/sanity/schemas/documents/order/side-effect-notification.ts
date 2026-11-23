import { defineField, defineType } from "sanity";

export default defineType({
  name: "sideEffectNotification",
  title: "Notification",
  type: "object",
  fields: [
    defineField({ name: "status", type: "string" }),
    defineField({ name: "attempts", type: "number" }),
    defineField({ name: "firstAttemptAt", type: "datetime" }),
    defineField({ name: "lastAttemptAt", type: "datetime" }),
    defineField({ name: "resolvedAt", type: "datetime" }),
    defineField({ name: "messageId", type: "string" }),
    defineField({ name: "httpStatus", type: "number" }),
    defineField({ name: "errorCode", type: "string" }),
    defineField({ name: "errorMessage", type: "string" }),
    defineField({ name: "reason", type: "string" }),
  ],
});
