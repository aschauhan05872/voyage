import { NextResponse } from "next/server";
import {
  buildCheckoutSessionCookie,
} from "@/lib/checkout/session-cookie";
import { ATTRIBUTION_COOKIE } from "@/lib/attribution/utm";
import {
  formatZodErrors,
  prepareCheckoutSchema,
} from "@/lib/validation/checkout";
import { checkoutConfig } from "@/lib/config/checkout";
import { prepareCheckout } from "@/server/services/checkout-service";

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

function readAttributionFromCookie(cookieHeader: string | null) {
  if (!cookieHeader) return {};

  const match = cookieHeader
    .split("; ")
    .find((row) => row.startsWith(`${ATTRIBUTION_COOKIE}=`));

  if (!match) return {};

  try {
    const value = decodeURIComponent(match.split("=")[1] ?? "");
    const parsed = JSON.parse(value) as Record<string, string>;
    return {
      utmSource: parsed.utm_source,
      utmMedium: parsed.utm_medium,
      utmCampaign: parsed.utm_campaign,
      utmContent: parsed.utm_content,
      utmTerm: parsed.utm_term,
      referrer: parsed.referrer,
    };
  } catch {
    return {};
  }
}

export async function POST(request: Request) {
  try {
    if (!isSameOriginRequest(request)) {
      return NextResponse.json({ ok: false, error: "Invalid request origin." }, { status: 403 });
    }

    const body = await request.json();
    const parsed = prepareCheckoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          ok: false,
          error: "Please review your information and try again.",
          fieldErrors: formatZodErrors(parsed.error),
        },
        { status: 400 },
      );
    }

    if (checkoutConfig.phoneRequired && !parsed.data.contact.phone) {
      return NextResponse.json(
        {
          ok: false,
          error: "Phone number is required.",
          fieldErrors: { "contact.phone": "Phone number is required." },
        },
        { status: 400 },
      );
    }

    const attribution = readAttributionFromCookie(request.headers.get("cookie"));
    const prepared = await prepareCheckout(parsed.data, attribution);

    if (!prepared.ok) {
      return NextResponse.json(prepared, { status: prepared.priceChanged ? 409 : 400 });
    }

    const response = NextResponse.json({
      ok: true,
      ...prepared.result,
    });

    response.cookies.set(buildCheckoutSessionCookie(prepared.token));
    return response;
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error: "We couldn't prepare your checkout right now. Please try again.",
      },
      { status: 500 },
    );
  }
}
