import { casPatch, fetchStaleDigests } from "@/lib/side-effects/ledger";
import { resumeStaleSideEffects } from "@/lib/side-effects/payment";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * 副作用恢复器：推进到期租约的支付账本，并把超时 pending 的周报收件人标记为 unknown。
 * 不重发任何 unknown 外部发送。
 */
export async function GET(request: Request) {
  if (
    !process.env.CRON_SECRET ||
    request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ message: "未授权" }, { status: 401 });
  }
  if (process.env.CRON_WRITES_ENABLED !== "true") {
    return NextResponse.json({ error: "WRITES_DISABLED" }, { status: 503 });
  }

  try {
    const ledgers = await resumeStaleSideEffects(20);
    const staleDigests = await fetchStaleDigests(50);
    let markedUnknown = 0;
    for (const digest of staleDigests) {
      const result = await casPatch(digest._id, digest._rev, {
        status: "unknown",
        errorCode: "SEND_OUTCOME_UNKNOWN_STALE_PENDING",
        updatedAt: new Date().toISOString(),
      });
      if (result.ok) markedUnknown += 1;
    }
    return NextResponse.json({
      resumed: ledgers.length,
      ledgers,
      staleDigests: markedUnknown,
    });
  } catch (error) {
    console.error("resume-side-effects failed", error);
    return NextResponse.json({ message: "resume failed" }, { status: 500 });
  }
}
