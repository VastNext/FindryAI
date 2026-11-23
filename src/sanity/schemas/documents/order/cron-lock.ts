import { defineField, defineType } from "sanity";

export default defineType({
  name: "cronLock",
  title: "Cron Lock",
  type: "document",
  fields: [
    defineField({ name: "lockKey", type: "string", readOnly: true }),
    defineField({ name: "runId", type: "string", readOnly: true }),
    defineField({ name: "owner", type: "string", readOnly: true }),
    defineField({
      name: "state",
      type: "string",
      readOnly: true,
      options: { list: ["held", "released"] },
    }),
    defineField({ name: "fence", type: "number", readOnly: true }),
    defineField({ name: "acquiredAt", type: "datetime", readOnly: true }),
    defineField({ name: "heartbeatAt", type: "datetime", readOnly: true }),
    defineField({ name: "leaseExpiresAt", type: "datetime", readOnly: true }),
    defineField({ name: "releasedAt", type: "datetime", readOnly: true }),
    defineField({
      name: "lastResult",
      type: "object",
      readOnly: true,
      fields: [
        defineField({ name: "verified", type: "number" }),
        defineField({ name: "missing", type: "number" }),
        defineField({ name: "unavailable", type: "number" }),
        defineField({ name: "failed", type: "number" }),
      ],
    }),
  ],
  preview: {
    select: { title: "lockKey", subtitle: "state", fence: "fence" },
    prepare({ title, subtitle, fence }) {
      return {
        title: title ?? "lock",
        subtitle: `${subtitle ?? ""} · fence ${fence ?? "?"}`,
      };
    },
  },
});
