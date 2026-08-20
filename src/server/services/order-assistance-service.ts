import { prisma } from "@/lib/db/prisma";
import type { CheckoutSessionData } from "@/lib/checkout/types";

export const ORDER_ASSISTANCE_STATUS = {
  PAYMENT_ASSISTANCE_REQUIRED: "PAYMENT_ASSISTANCE_REQUIRED",
} as const;

function generateRequestNumber(): string {
  const year = new Date().getFullYear();
  const suffix = Math.floor(10000 + Math.random() * 90000);
  return `VOY-${year}-${suffix}`;
}

export async function findAssistanceRequestByIdempotencyKey(idempotencyKey: string) {
  try {
    return await prisma.orderAssistanceRequest.findUnique({
      where: { idempotencyKey },
    });
  } catch {
    return null;
  }
}

export async function createOrderAssistanceRequest(
  session: CheckoutSessionData,
  idempotencyKey: string,
): Promise<
  | { ok: true; requestNumber: string; persisted: true }
  | { ok: false; persisted: false; error: string }
> {
  const existing = await findAssistanceRequestByIdempotencyKey(idempotencyKey);
  if (existing) {
    return { ok: true, requestNumber: existing.requestNumber, persisted: true };
  }

  let requestNumber = generateRequestNumber();
  let attempts = 0;

  while (attempts < 5) {
    try {
      const created = await prisma.orderAssistanceRequest.create({
        data: {
          requestNumber,
          email: session.email,
          primaryPhone: session.phone ?? "",
          secondaryPhone: session.secondaryPhone ?? null,
          shippingAddress: session.shippingAddress,
          billingAddress: session.billingAddress,
          items: session.cartItems,
          subtotal: session.subtotal,
          currency: session.currency,
          notes: session.orderNotes ?? null,
          status: ORDER_ASSISTANCE_STATUS.PAYMENT_ASSISTANCE_REQUIRED,
          checkoutSessionId: session.id,
          idempotencyKey,
          utmSource: session.utmSource ?? null,
          utmMedium: session.utmMedium ?? null,
          utmCampaign: session.utmCampaign ?? null,
          utmContent: session.utmContent ?? null,
          utmTerm: session.utmTerm ?? null,
          referrer: session.referrer ?? null,
        },
      });
      return { ok: true, requestNumber: created.requestNumber, persisted: true };
    } catch (error) {
      const prismaError = error as { code?: string };
      if (prismaError.code === "P2002") {
        const duplicate = await findAssistanceRequestByIdempotencyKey(idempotencyKey);
        if (duplicate) {
          return { ok: true, requestNumber: duplicate.requestNumber, persisted: true };
        }
        requestNumber = generateRequestNumber();
        attempts += 1;
        continue;
      }
      break;
    }
  }

  return {
    ok: false,
    persisted: false,
    error:
      process.env.NODE_ENV === "production"
        ? "We couldn't save your request right now. Please try again."
        : "Request storage is unavailable. Production deployment requires persistent request storage.",
  };
}
