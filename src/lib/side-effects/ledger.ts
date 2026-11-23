import { sanityClient } from "@/sanity/lib/client";
import type { ItemLike, OrderLike, WebhookLedger } from "./types";

export type CasResult<T> = { ok: true; doc: T } | { ok: false; conflict: true };

function isConflict(error: unknown) {
  const status = (error as { statusCode?: number })?.statusCode;
  return status === 409;
}

export async function readById<T>(id: string): Promise<T | null> {
  // 幂等判定必须绕过 CDN 旧快照。
  const doc = await sanityClient.fetch<T | null>(
    "*[_id == $id][0]",
    { id },
    { useCdn: false, perspective: "raw" },
  );
  return doc ?? null;
}

export async function createDocument<T extends { _id: string; _type: string }>(
  doc: T,
): Promise<{ created: boolean; doc: T }> {
  try {
    await sanityClient.create(doc);
    return { created: true, doc };
  } catch (error) {
    if (!isConflict(error)) throw error;
    const existing = await readById<T>(doc._id);
    return { created: false, doc: existing ?? doc };
  }
}

export async function casPatch<T>(
  id: string,
  revision: string,
  set: Record<string, unknown>,
  unset: string[] = [],
): Promise<CasResult<T>> {
  try {
    let patch = sanityClient.patch(id).ifRevisionId(revision).set(set);
    if (unset.length > 0) patch = patch.unset(unset);
    const doc = await patch.commit<T>();
    return { ok: true, doc };
  } catch (error) {
    if (isConflict(error)) return { ok: false, conflict: true };
    throw error;
  }
}

export async function readLedger(
  sessionId: string,
): Promise<WebhookLedger | null> {
  return readById<WebhookLedger>(`webhookSession-${sessionId}`);
}

export async function findOrderBySession(
  sessionId: string,
): Promise<OrderLike | null> {
  const orders = await sanityClient.fetch<OrderLike[]>(
    `*[_type == "order" && stripeSessionId == $sid] | order(date desc)[0...2]`,
    { sid: sessionId },
    { useCdn: false, perspective: "raw" },
  );
  return orders[0] ?? null;
}

export async function findLegacyCandidates(
  userId: string,
  itemId: string,
  sessionCreatedAt: string,
): Promise<OrderLike[]> {
  const target = Date.parse(sessionCreatedAt);
  const windowMs = 24 * 60 * 60 * 1000;
  const orders = await sanityClient.fetch<OrderLike[]>(
    `*[_type == "order" && user._ref == $userId && item._ref == $itemId && !defined(stripeSessionId) && status == "success"] | order(date desc)[0...5]{_id, _rev, status, date, stripeSessionId, user, item}`,
    { userId, itemId },
    { useCdn: false, perspective: "raw" },
  );
  return orders.filter((order) => {
    if (!order.date) return false;
    const time = Date.parse(order.date);
    return Number.isFinite(time) && Math.abs(time - target) <= windowMs;
  });
}

export async function readItem(itemId: string): Promise<ItemLike | null> {
  return readById<ItemLike>(itemId);
}

export async function readOrder(orderId: string): Promise<OrderLike | null> {
  return readById<OrderLike>(orderId);
}

export async function fetchUserById(
  userId: string,
): Promise<{ _id: string; name?: string; email?: string } | null> {
  return sanityClient.fetch(
    `*[_type == "user" && _id == $id][0]{_id, name, email}`,
    { id: userId },
    { useCdn: false, perspective: "raw" },
  );
}

export async function fetchStaleLedgers(limit = 20): Promise<WebhookLedger[]> {
  const now = new Date().toISOString();
  return sanityClient.fetch<WebhookLedger[]>(
    `*[_type == "webhookSession"
        && state in ["received","processing","fulfilled","notifications_pending"]
        && holdReason != "awaiting_payment"
        && (!defined(leaseExpiresAt) || leaseExpiresAt < $now)
        && (!defined(nextAttemptAt) || nextAttemptAt < $now)
      ] | order(updatedAt asc)[0...$limit]`,
    { now, limit },
    { useCdn: false, perspective: "raw" },
  );
}

export async function fetchStaleDigests(
  limit = 50,
): Promise<{ _id: string; _rev: string }[]> {
  const cutoff = new Date(Date.now() - 30 * 60 * 1000).toISOString();
  return sanityClient.fetch(
    `*[_type == "digestRecipient" && status == "pending" && updatedAt < $cutoff][0...$limit]{_id, _rev}`,
    { cutoff, limit },
    { useCdn: false, perspective: "raw" },
  );
}
