import { NextResponse } from "next/server";

function isSameOriginRequest(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const host = request.headers.get("host");
  if (!host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

/** @deprecated Checkout submits via /api/checkout/complete-request. */
export async function POST(request: Request) {
  if (!isSameOriginRequest(request)) {
    return NextResponse.json({ ok: false, error: "Invalid request origin." }, { status: 403 });
  }

  return NextResponse.json(
    {
      ok: false,
      error: "Please refresh this page and try again.",
    },
    { status: 409 },
  );
}
