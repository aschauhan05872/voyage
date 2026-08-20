import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  ATTRIBUTION_COOKIE,
  ATTRIBUTION_MAX_AGE,
  parseUtmFromSearch,
  UTM_KEYS,
  hasUtm,
} from "@/lib/attribution/utm";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const existing = request.cookies.get(ATTRIBUTION_COOKIE)?.value;

  if (existing) {
    return response;
  }

  const utm = parseUtmFromSearch(request.nextUrl.search);
  if (!hasUtm(utm)) {
    return response;
  }

  const payload: Record<string, string> = {};
  for (const key of UTM_KEYS) {
    const value = utm[key];
    if (value) payload[key] = value;
  }

  const referrer = request.headers.get("referer");
  if (referrer) payload.referrer = referrer;
  payload.landing_path = request.nextUrl.pathname;

  response.cookies.set(ATTRIBUTION_COOKIE, JSON.stringify(payload), {
    maxAge: ATTRIBUTION_MAX_AGE,
    httpOnly: false,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|placeholders).*)"],
};
