import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const startedAt = Date.now();

type Health = {
  status: "ok" | "degraded";
  release: string | null;
  sha: string | null;
  environment: string | null;
  uptimeSeconds: number;
  checks?: Record<string, "ok" | "failed">;
};

export async function GET(request: Request) {
  const deep = new URL(request.url).searchParams.get("deep") === "1";
  const body: Health = {
    status: "ok",
    release: process.env.APP_RELEASE_ID ?? null,
    sha: process.env.APP_GIT_SHA ?? null,
    environment: process.env.APP_ENV ?? process.env.NODE_ENV ?? null,
    uptimeSeconds: Math.round((Date.now() - startedAt) / 1000),
  };

  if (deep) {
    // 就绪探测才访问外部依赖；普通存活探测保持零外部调用。
    const checks: Record<string, "ok" | "failed"> = {};
    try {
      const { sanityClient } = await import("@/sanity/lib/client");
      const result = await Promise.race([
        sanityClient.fetch<number>("count(*[_type == 'item'])"),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("sanity timeout")), 5000),
        ),
      ]);
      checks.sanity = typeof result === "number" ? "ok" : "failed";
    } catch {
      checks.sanity = "failed";
    }
    body.checks = checks;
    if (Object.values(checks).some((value) => value !== "ok")) {
      body.status = "degraded";
    }
  }

  return NextResponse.json(body, {
    status: body.status === "ok" ? 200 : 503,
    headers: {
      "Cache-Control": "no-store, max-age=0",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
