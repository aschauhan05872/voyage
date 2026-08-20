import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { CheckoutCartSnapshotItem } from "@/lib/checkout/types";

export const ASSISTANCE_CONFIRMATION_COOKIE = "voyage_assistance_confirmation";
export const ASSISTANCE_CONFIRMATION_TTL_SECONDS = 60 * 60 * 24;

export type AssistanceConfirmationData = {
  requestNumber: string;
  email: string;
  primaryPhoneMasked: string;
  secondaryPhoneProvided: boolean;
  subtotal: number;
  currency: string;
  items: CheckoutCartSnapshotItem[];
  persisted: boolean;
  createdAt: number;
  expiresAt: number;
};

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("AUTH_SECRET must be configured for assistance confirmation.");
    }
    return new TextEncoder().encode("voyage-dev-assistance-secret");
  }
  return new TextEncoder().encode(secret);
}

export async function signAssistanceConfirmation(
  data: AssistanceConfirmationData,
): Promise<string> {
  return new SignJWT({ confirmation: data })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${ASSISTANCE_CONFIRMATION_TTL_SECONDS}s`)
    .setJti(data.requestNumber)
    .sign(getSecret());
}

export async function verifyAssistanceConfirmationToken(
  token: string,
): Promise<AssistanceConfirmationData | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    const confirmation = payload.confirmation as AssistanceConfirmationData | undefined;
    if (!confirmation?.requestNumber) return null;
    if (confirmation.expiresAt < Date.now()) return null;
    return confirmation;
  } catch {
    return null;
  }
}

export async function getAssistanceConfirmationFromCookie(): Promise<AssistanceConfirmationData | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ASSISTANCE_CONFIRMATION_COOKIE)?.value;
  if (!token) return null;
  return verifyAssistanceConfirmationToken(token);
}

export function buildAssistanceConfirmationCookie(token: string): {
  name: string;
  value: string;
  httpOnly: true;
  secure: boolean;
  sameSite: "lax";
  maxAge: number;
  path: string;
} {
  return {
    name: ASSISTANCE_CONFIRMATION_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: ASSISTANCE_CONFIRMATION_TTL_SECONDS,
    path: "/",
  };
}

export function clearCheckoutSessionCookie(): {
  name: string;
  value: string;
  httpOnly: true;
  secure: boolean;
  sameSite: "lax";
  maxAge: number;
  path: string;
} {
  return {
    name: "voyage_checkout_session",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  };
}
