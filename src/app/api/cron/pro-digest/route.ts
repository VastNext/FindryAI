import { runProDigest } from "@/lib/side-effects/digest";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * 周报：按 ISO 周一窗口 + 逐收件人账本发送，重跑只补发失败项。
 * GET /api/cron/pro-digest?weeks=1[&dryRun=1]
 */
export async function GET(request: Request) {
  if (
    !process.env.CRON_SECRET ||
    request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ message: "未授权" }, { status: 401 });
  }

  const url = new URL(request.url);
  const weeks = Math.min(
    Math.max(Number(url.searchParams.get("weeks") ?? 1), 1),
    12,
  );
  const dryRun = url.searchParams.get("dryRun") === "1";
  try {
    const result = await runProDigest({ weeks, dryRun });
    return NextResponse.json(result.body, { status: result.status });
  } catch (error) {
    console.error("pro-digest failed", error);
    return NextResponse.json({ message: "pro digest failed" }, { status: 500 });
  }
}
