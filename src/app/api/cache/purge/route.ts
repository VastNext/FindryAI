import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * 发布切换/回滚前的目标版本缓存失效入口。
 * 仅接受 Bearer 密钥，由发布工具从容器内部调用；不得公开暴露给浏览器。
 */
export async function POST(request: Request) {
  const expected =
    process.env.REVALIDATE_SECRET ||
    process.env.AUTH_SECRET ||
    process.env.SANITY_API_TOKEN;
  const authorization = request.headers.get("authorization");
  if (!expected || authorization !== `Bearer ${expected}`) {
    return NextResponse.json(
      { purged: false, message: "unauthorized" },
      {
        status: 401,
      },
    );
  }

  const paths = [
    "/",
    "/search",
    "/sitemap.xml",
    "/sitemap/items.xml",
    "/sitemap/alternatives.xml",
  ];
  try {
    revalidatePath("/", "layout");
    for (const path of paths) {
      revalidatePath(path);
    }
    revalidateTag("sponsor-banner");
  } catch (error) {
    return NextResponse.json(
      {
        purged: false,
        message: error instanceof Error ? error.message : "revalidate failed",
      },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { purged: true, paths, release: process.env.APP_RELEASE_ID ?? null },
    { headers: { "Cache-Control": "no-store, max-age=0" } },
  );
}
