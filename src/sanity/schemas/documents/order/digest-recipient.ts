import { defineField, defineType } from "sanity";

export default defineType({
  name: "digestRecipient",
  title: "Digest Recipient Ledger",
  type: "document",
  fields: [
    defineField({ name: "windowKey", type: "string", readOnly: true }),
    defineField({ name: "emailHash", type: "string", readOnly: true }),
    defineField({ name: "email", type: "string", readOnly: true }),
    defineField({
      name: "status",
      type: "string",
      readOnly: true,
      options: { list: ["pending", "sent", "failed", "unknown"] },
    }),
    defineField({ name: "attempts", type: "number", readOnly: true }),
    defineField({ name: "firstAttemptAt", type: "datetime", readOnly: true }),
    defineField({ name: "lastAttemptAt", type: "datetime", readOnly: true }),
    defineField({ name: "resendBatchId", type: "string", readOnly: true }),
    defineField({ name: "messageId", type: "string", readOnly: true }),
    defineField({ name: "httpStatus", type: "number", readOnly: true }),
    defineField({ name: "errorCode", type: "string", readOnly: true }),
    defineField({ name: "errorMessage", type: "text", readOnly: true }),
    defineField({ name: "contentHash", type: "string", readOnly: true }),
    defineField({ name: "owner", type: "string", readOnly: true }),
    defineField({ name: "createdAt", type: "datetime", readOnly: true }),
    defineField({ name: "updatedAt", type: "datetime", readOnly: true }),
  ],
  preview: {
    select: { title: "email", status: "status", window: "windowKey" },
    prepare({ title, status, window }) {
      return {
        title: title ?? "recipient",
        subtitle: `${window ?? ""} · ${status ?? ""}`,
      };
    },
  },
});
