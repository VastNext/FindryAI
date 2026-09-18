import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

/**
 * On-demand revalidation API
 * 用法:
 * GET/POST /api/revalidate?secret=YOUR_AUTH_SECRET&path=/
 * GET/POST /api/revalidate?secret=YOUR_AUTH_SECRET&path=/item/slug
 */
export async function GET(request: NextRequest) {
  return handleRevalidate(request);
}

export async function POST(request: NextRequest) {
  return handleRevalidate(request);
}

async function handleRevalidate(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");
  const path = searchParams.get("path") || "/";

  const expectedSecret =
    process.env.REVALIDATE_SECRET ||
    process.env.AUTH_SECRET ||
    process.env.SANITY_API_TOKEN;

  if (!expectedSecret || secret !== expectedSecret) {
    return NextResponse.json(
      { message: "Invalid secret", revalidated: false },
      { status: 401 },
    );
  }

  try {
    revalidatePath(path);
    console.log(`Revalidated path: ${path} at ${new Date().toISOString()}`);
    return NextResponse.json({
      revalidated: true,
      path,
      now: Date.now(),
      message: `Successfully revalidated ${path}`,
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return NextResponse.json(
      {
        message: "Error revalidating",
        error: errorMsg,
        revalidated: false,
      },
      { status: 500 },
    );
  }
}
