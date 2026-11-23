import { createHash } from "node:crypto";
import { siteConfig } from "@/config/site";
import { resend } from "@/lib/mail";
import { sanityClient } from "@/sanity/lib/client";
import { digestWindowId, isoMondayWindow, normalizeEmail } from "./ids";
import { casPatch, createDocument, readById } from "./ledger";
import { sendDigestTracked } from "./notifications";
import type { SendOutcome } from "./types";

type ProItem = {
  _id: string;
  name: string;
  description?: string;
  slug: { current?: string };
};

type DigestRecord = {
  _id: string;
  _rev?: string;
  _type: "digestRecipient";
  windowKey: string;
  emailHash: string;
  email: string;
  status: "pending" | "sent" | "failed" | "unknown";
  attempts: number;
  firstAttemptAt?: string;
  lastAttemptAt?: string;
  resendBatchId?: string;
  messageId?: string;
  errorCode?: string;
  errorMessage?: string;
  httpStatus?: number;
  contentHash: string;
  owner?: string;
  updatedAt?: string;
};

const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;
const owner = `findryai-${process.pid}-${Math.random().toString(16).slice(2, 10)}`;

export type DigestAction =
  | "create_and_send"
  | "retry"
  | "skip_sent"
  | "skip_unknown"
  | "skip_live_pending"
  | "skip_failed"
  | "mark_stale_pending";

export async function planProDigest(now = new Date()) {
  const window = isoMondayWindow(now);
  const items = await sanityClient.fetch<ProItem[]>(
    `*[_type == "item" && pricePlan == "pro" && proPlanStatus == "success"
      && defined(publishDate) && defined(slug.current) && defined(description)
      && publishDate >= $start && publishDate < $end && forceHidden != true]
     | order(publishDate desc) {
       _id, name, description, "slug": slug.current
     }`,
    {
      start: window.contentStart.toISOString(),
      end: window.windowStart.toISOString(),
    },
    { useCdn: false, perspective: "raw" },
  );
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || siteConfig.url;
  const digest = items.map((item) => ({
    name: item.name,
    description: item.description ?? "",
    url: `${siteUrl}/item/${item.slug.current}?utm_source=findryai.com&utm_medium=email&utm_campaign=pro-digest`,
  }));
  const contentHash = createHash("sha256")
    .update(
      items
        .map((item) => item._id)
        .sort()
        .join(","),
    )
    .digest("hex")
    .slice(0, 16);

  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!audienceId) {
    return { error: "RESEND_AUDIENCE_ID_MISSING" as const, window };
  }
  const page = await resend.contacts.list({ audienceId });
  if (page.error || !page.data) {
    return { error: "CONTACTS_FAILED" as const, window };
  }
  const recipients = Array.from(
    new Set(
      (page.data.data as { email: string; unsubscribed: boolean }[])
        .filter((contact) => !contact.unsubscribed)
        .map((contact) => normalizeEmail(contact.email))
        .filter(Boolean),
    ),
  );

  const plans: {
    email: string;
    id: string;
    action: DigestAction;
    existing?: DigestRecord;
  }[] = [];
  for (const email of recipients) {
    const id = digestWindowId(window.windowKey, email);
    const existing = await readById<DigestRecord>(id);
    let action: DigestAction;
    if (!existing) action = "create_and_send";
    else if (existing.status === "sent") action = "skip_sent";
    else if (existing.status === "unknown") action = "skip_unknown";
    else if (existing.status === "failed")
      action = (existing.attempts ?? 0) < 3 ? "retry" : "skip_failed";
    else if (existing.status === "pending") {
      const age =
        Date.now() -
        Date.parse(existing.updatedAt ?? existing.lastAttemptAt ?? "");
      action =
        Number.isFinite(age) && age > 30 * 60 * 1000
          ? "mark_stale_pending"
          : "skip_live_pending";
    } else action = "skip_unknown";
    plans.push({ email, id, action, existing: existing ?? undefined });
  }

  const subject = `${digest.length} new Pro ${digest.length === 1 ? "tool" : "tools"} on ${siteConfig.name}`;
  return { window, items: digest, contentHash, plans, subject };
}

export async function runProDigest(options: {
  weeks: number;
  dryRun: boolean;
  now?: Date;
}) {
  const now = options.now ?? new Date();
  if (options.weeks !== 1 && !options.dryRun) {
    return { status: 400, body: { error: "WEEKS_BACKFILL_NOT_ALLOWED" } };
  }
  if (!options.dryRun && process.env.CRON_WRITES_ENABLED !== "true") {
    return { status: 503, body: { error: "WRITES_DISABLED" } };
  }
  const plan = await planProDigest(now);
  if ("error" in plan) return { status: 500, body: { error: plan.error } };
  if (plan.items.length === 0) {
    return {
      status: 200,
      body: {
        message: "no new Pro items in the window; nothing to send",
        windowKey: plan.window.windowKey,
      },
    };
  }
  if (options.dryRun) {
    return {
      status: 200,
      body: {
        dryRun: true,
        windowKey: plan.window.windowKey,
        subject: plan.subject,
        items: plan.items.map((item) => item.name),
        actions: plan.plans.reduce<Record<string, number>>((acc, entry) => {
          acc[entry.action] = (acc[entry.action] ?? 0) + 1;
          return acc;
        }, {}),
      },
    };
  }

  const counts = { sent: 0, failed: 0, unknown: 0, skipped: 0 };
  for (const entry of plan.plans) {
    if (
      entry.action === "skip_sent" ||
      entry.action === "skip_unknown" ||
      entry.action === "skip_failed" ||
      entry.action === "skip_live_pending"
    ) {
      counts.skipped += 1;
      continue;
    }
    if (entry.action === "mark_stale_pending" && entry.existing?._rev) {
      await casPatch<DigestRecord>(entry.id, entry.existing._rev, {
        status: "unknown",
        errorCode: "SEND_OUTCOME_UNKNOWN_STALE_PENDING",
        updatedAt: new Date().toISOString(),
      }).catch(() => undefined);
      counts.unknown += 1;
      continue;
    }
    const pendingDoc: DigestRecord = {
      _id: entry.id,
      _type: "digestRecipient",
      windowKey: plan.window.windowKey,
      emailHash: entry.id.replace("digestRecipient-", ""),
      email: entry.email,
      status: "pending",
      attempts: (entry.existing?.attempts ?? 0) + 1,
      firstAttemptAt:
        entry.existing?.firstAttemptAt ?? new Date().toISOString(),
      lastAttemptAt: new Date().toISOString(),
      contentHash: plan.contentHash,
      owner,
      updatedAt: new Date().toISOString(),
    };
    let record: DigestRecord;
    if (entry.existing?._rev) {
      const cas = await casPatch<DigestRecord>(entry.id, entry.existing._rev, {
        status: "pending",
        attempts: pendingDoc.attempts,
        lastAttemptAt: pendingDoc.lastAttemptAt,
        contentHash: plan.contentHash,
        owner,
        updatedAt: new Date().toISOString(),
      });
      if (!cas.ok) {
        counts.skipped += 1;
        continue;
      }
      record = cas.doc;
    } else {
      const created = await createDocument<DigestRecord>(pendingDoc);
      if (!created.created) {
        counts.skipped += 1;
        continue;
      }
      record = pendingDoc;
    }

    const outcome: SendOutcome = await sendDigestTracked({
      to: entry.email,
      subject: plan.subject,
      items: plan.items,
      idempotencyKey: `${entry.id}:v1`,
    });
    const recordStatus =
      outcome.status === "skipped" ? "unknown" : outcome.status;
    await casPatch<DigestRecord>(record._id, record._rev ?? "", {
      status: recordStatus,
      ...(outcome.status === "sent" &&
      "messageId" in outcome &&
      outcome.messageId
        ? { messageId: outcome.messageId }
        : {}),
      ...("httpStatus" in outcome && outcome.httpStatus
        ? { httpStatus: outcome.httpStatus }
        : {}),
      ...("errorCode" in outcome ? { errorCode: outcome.errorCode } : {}),
      ...("errorMessage" in outcome && outcome.errorMessage
        ? { errorMessage: outcome.errorMessage }
        : {}),
      updatedAt: new Date().toISOString(),
    }).catch(() => undefined);
    if (recordStatus === "sent") counts.sent += 1;
    else if (recordStatus === "failed") counts.failed += 1;
    else counts.unknown += 1;
  }

  return {
    status: 200,
    body: {
      message: "pro digest processed",
      windowKey: plan.window.windowKey,
      items: plan.items.length,
      recipients: plan.plans.length,
      ...counts,
    },
  };
}
