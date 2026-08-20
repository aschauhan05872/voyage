import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { CheckoutSessionData } from "@/lib/checkout/types";

export const CHECKOUT_SESSION_COOKIE = "voyage_checkout_session";
export const CHECKOUT_SESSION_TTL_SECONDS = 60 * 60 * 2;

function getSessionSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("AUTH_SECRET must be configured for checkout sessions.");
    }
    return new TextEncoder().encode("voyage-dev-checkout-secret");
  }
  return new TextEncoder().encode(secret);
}

export async function signCheckoutSession(session: CheckoutSessionData): Promise<string> {
  return new SignJWT({ session })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${CHECKOUT_SESSION_TTL_SECONDS}s`)
    .setJti(session.id)
    .sign(getSessionSecret());
}

export async function verifyCheckoutSessionToken(
  token: string,
): Promise<CheckoutSessionData | null> {
  try {
    const { payload } = await jwtVerify(token, getSessionSecret());
    const session = payload.session as CheckoutSessionData | undefined;
    if (!session?.id) return null;
    if (session.expiresAt < Date.now()) return null;
    return session;
  } catch {
    return null;
  }
}

export async function getCheckoutSessionFromCookie(): Promise<CheckoutSessionData | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(CHECKOUT_SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifyCheckoutSessionToken(token);
}

export function buildCheckoutSessionCookie(token: string): {
  name: string;
  value: string;
  httpOnly: true;
  secure: boolean;
  sameSite: "lax";
  maxAge: number;
  path: string;
} {
  return {
    name: CHECKOUT_SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: CHECKOUT_SESSION_TTL_SECONDS,
    path: "/",
  };
}
