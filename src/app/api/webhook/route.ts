import { handleCheckoutSessionEvent } from "@/lib/side-effects/payment";
import { stripe } from "@/lib/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type Stripe from "stripe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HANDLED_EVENTS = new Set([
  "checkout.session.completed",
  "checkout.session.async_payment_succeeded",
  "checkout.session.async_payment_failed",
]);

/**
 * Stripe webhook：签名校验后交给幂等账本状态机。
 * - 唯一业务键是 Checkout Session ID，event.id 只做审计。
 * - 订单/条目以可恢复状态机推进，重复与并发投递不会二次履约。
 * - 通知结果未知时进入人工核对，不自动重发。
 */
export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") ?? "";
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "WEBHOOK_SECRET_MISSING" },
      { status: 500 },
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, secret);
  } catch (error) {
    console.error(
      "Stripe webhook signature error:",
      error instanceof Error ? error.message : error,
    );
    return NextResponse.json({ error: "SIGNATURE_INVALID" }, { status: 400 });
  }

  if (!HANDLED_EVENTS.has(event.type)) {
    return NextResponse.json({ ignored: event.type }, { status: 200 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  try {
    const result = await handleCheckoutSessionEvent(event, {
      id: session.id,
      customer: session.customer as string | null,
      amount_total: session.amount_total,
      currency: session.currency,
      payment_status: session.payment_status,
      created: session.created,
      metadata: session.metadata ?? undefined,
    });
    return NextResponse.json(result.body ?? {}, { status: result.status });
  } catch (error) {
    console.error("Stripe webhook processing failed:", error);
    return NextResponse.json({ error: "PROCESSING_FAILED" }, { status: 500 });
  }
}
