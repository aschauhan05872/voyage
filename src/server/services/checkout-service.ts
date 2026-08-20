import { nanoid } from "nanoid";
import type {
  CheckoutCartSnapshotItem,
  CheckoutSessionData,
  PrepareCheckoutResult,
} from "@/lib/checkout/types";
import {
  getCheckoutSessionFromCookie,
  signCheckoutSession,
} from "@/lib/checkout/session-cookie";
import { siteConfig } from "@/lib/config/site";
import { calculateShippingAmount, getShippingMethodById } from "@/lib/shipping/shipping-service";
import { calculateTax } from "@/lib/tax/tax-service";
import type { PrepareCheckoutInput } from "@/lib/validation/checkout";
import { validateCartItems } from "@/server/services/cart-service";

function mapCartSnapshot(
  items: Awaited<ReturnType<typeof validateCartItems>>["items"],
): CheckoutCartSnapshotItem[] {
  return items
    .filter((item) => item.quantity > 0)
    .map((item) => ({
      productSlug: item.productSlug,
      productId: item.productId,
      sku: item.sku,
      name: item.name,
      price: item.price,
      imageUrl: item.imageUrl,
      quantity: item.quantity,
      month: item.month,
      gemstone: item.gemstone,
      material: item.material,
      lineTotal: item.lineTotal,
    }));
}

export async function prepareCheckout(
  input: PrepareCheckoutInput,
  attribution: {
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    utmContent?: string;
    utmTerm?: string;
    referrer?: string;
  } = {},
): Promise<
  | { ok: true; result: PrepareCheckoutResult; session: CheckoutSessionData; token: string }
  | { ok: false; error: string; issues?: string[]; fieldErrors?: Record<string, string> }
> {
  const cartValidation = await validateCartItems(input.items);

  if (!cartValidation.canCheckout) {
    const issues = cartValidation.items
      .filter((item) => item.issue)
      .map((item) => item.issue as string);

    return {
      ok: false,
      error: "One of the pieces in your cart is no longer available.",
      issues: issues.length > 0 ? issues : ["Please review your cart and try again."],
    };
  }

  const shippingMethod = getShippingMethodById(input.shippingMethodId);
  if (!shippingMethod) {
    return {
      ok: false,
      error: "Please select a valid shipping method.",
      fieldErrors: { shippingMethodId: "Please select a shipping method." },
    };
  }

  const cartItems = mapCartSnapshot(cartValidation.items);
  const subtotal = cartValidation.subtotal;
  const priceChanged =
    typeof input.clientSubtotal === "number" &&
    Math.abs(input.clientSubtotal - subtotal) > 0.009;

  const shipping = calculateShippingAmount(input.shippingMethodId);
  const tax = calculateTax();
  const discountAmount = 0;
  const total = subtotal + shipping.amount + tax.amount - discountAmount;

  const billingAddress = input.billingSameAsShipping
    ? input.shippingAddress
    : input.billingAddress!;

  const existingSession = await getCheckoutSessionFromCookie();
  if (
    input.idempotencyKey &&
    existingSession?.idempotencyKey === input.idempotencyKey &&
    existingSession.status === "ready_for_payment"
  ) {
    const token = await signCheckoutSession(existingSession);
    return {
      ok: true,
      result: buildPrepareResult(existingSession, shipping.label, tax.label),
      session: existingSession,
      token,
    };
  }

  const now = Date.now();
  const session: CheckoutSessionData = {
    id: nanoid(),
    idempotencyKey: input.idempotencyKey ?? nanoid(),
    status: "ready_for_payment",
    cartItems,
    subtotal,
    shippingAmount: shipping.amount,
    taxAmount: tax.amount,
    discountAmount,
    total,
    currency: siteConfig.currency,
    shippingMethodId: input.shippingMethodId,
    shippingMethodName: shippingMethod.name,
    email: input.contact.email,
    phone: input.contact.phone,
    shippingAddress: input.shippingAddress,
    billingAddress,
    billingSameAsShipping: input.billingSameAsShipping,
    orderNotes: input.orderNotes,
    marketingConsent: input.marketingConsent,
    termsAccepted: input.termsAccepted,
    priceChanged,
    utmSource: attribution.utmSource,
    utmMedium: attribution.utmMedium,
    utmCampaign: attribution.utmCampaign,
    utmContent: attribution.utmContent,
    utmTerm: attribution.utmTerm,
    referrer: attribution.referrer,
    createdAt: now,
    expiresAt: now + 1000 * 60 * 60 * 2,
  };

  const token = await signCheckoutSession(session);

  return {
    ok: true,
    result: buildPrepareResult(session, shipping.label, tax.label),
    session,
    token,
  };
}

function buildPrepareResult(
  session: CheckoutSessionData,
  shippingLabel: string,
  taxLabel: string,
): PrepareCheckoutResult {
  return {
    checkoutSessionId: session.id,
    summary: {
      items: session.cartItems,
      subtotal: session.subtotal,
      shippingAmount: session.shippingAmount,
      taxAmount: session.taxAmount,
      discountAmount: session.discountAmount,
      total: session.total,
      currency: session.currency,
      shippingLabel,
      taxLabel,
    },
    priceChanged: session.priceChanged,
    canProceed: true,
  };
}
