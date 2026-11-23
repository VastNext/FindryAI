import { createHash } from "node:crypto";

/** Stripe Checkout Session ID 是业务唯一键；event.id 只做审计。 */
export const CHECKOUT_SESSION_RE = /^cs_(test|live)_[A-Za-z0-9]+$/;

export const webhookLedgerId = (sessionId: string) =>
  `webhookSession-${sessionId}`;

export const orderIdForSession = (sessionId: string) => `order-${sessionId}`;

export const digestWindowId = (windowKey: string, email: string) =>
  `digestRecipient-${createHash("sha256")
    .update(`${email.trim().toLowerCase()}|${windowKey}`)
    .digest("hex")
    .slice(0, 32)}`;

export const badgeLockId = (utcDate: string) =>
  `cronLock-checkBadges-${utcDate}`;

/** ISO 周一 00:00:00 UTC，返回 YYYY-MM-DD 与该日起点。 */
export function isoMondayWindow(now: Date) {
  const date = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
  const day = date.getUTCDay();
  const diff = day === 0 ? 6 : day - 1;
  const start = new Date(date.getTime() - diff * 24 * 60 * 60 * 1000);
  const key = start.toISOString().slice(0, 10);
  return {
    windowKey: key,
    windowStart: start,
    windowEnd: new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000),
    contentStart: new Date(start.getTime() - 7 * 24 * 60 * 60 * 1000),
  };
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export function utcDateKey(now: Date) {
  return now.toISOString().slice(0, 10);
}
