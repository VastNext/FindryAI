import { NextResponse } from "next/server";

import {
  TranslationRequestAbortedError,
  translateRequest,
} from "@/lib/translation/translate";
import {
  RequestValidationError,
  validateTranslateRequest,
} from "@/lib/translation/validation";

export const runtime = "nodejs";
export const maxDuration = 40;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = validateTranslateRequest(body);
    return NextResponse.json({
      results: await translateRequest(input, request.signal),
    });
  } catch (error) {
    if (
      request.signal.aborted ||
      error instanceof TranslationRequestAbortedError
    ) {
      return NextResponse.json(
        {
          error: {
            code: "REQUEST_ABORTED",
            message: "The client canceled the request.",
          },
        },
        { status: 499 },
      );
    }
    if (error instanceof RequestValidationError) {
      return NextResponse.json(
        { error: { code: "INVALID_REQUEST", message: error.message } },
        { status: error.status },
      );
    }
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        {
          error: {
            code: "INVALID_JSON",
            message: "The request body contains invalid JSON.",
          },
        },
        { status: 400 },
      );
    }
    return NextResponse.json(
      {
        error: {
          code: "INTERNAL_ERROR",
          message: "The server cannot process the request right now.",
        },
      },
      { status: 500 },
    );
  }
}
