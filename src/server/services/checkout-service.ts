import { nanoid } from "nanoid";
import type {
  AuthoritativeCheckoutTotals,
  CheckoutCartSnapshotItem,
  CheckoutSessionData,
  PrepareCheckoutResult,
} from "@/lib/checkout/types";
import { buildCheckoutRequestFingerprint } from "@/lib/checkout/fingerprint";
import { multiplyMoney, roundMoney, sumMoney } from "@/lib/checkout/money";
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
      price: roundMoney(item.price),
      imageUrl: item.imageUrl,
      quantity: item.quantity,
      month: item.month,
      gemstone: item.gemstone,
      material: item.material,
      lineTotal: roundMoney(item.lineTotal),
    }));
}

function buildAuthoritativeTotals(
  subtotal: number,
  shippingAmount: number,
  taxAmount: number,
  discountAmount: number,
  totalsFinalized: boolean,
): AuthoritativeCheckoutTotals {
  return {
    subtotal: roundMoney(subtotal),
    shipping: roundMoney(shippingAmount),
    tax: roundMoney(taxAmount),
    discount: roundMoney(discountAmount),
    total: sumMoney(subtotal, shippingAmount, taxAmount, -discountAmount),
    currency: siteConfig.currency,
    totalsFinalized,
  };
}

export type RevalidatedCheckoutSession =
  | { ok: true; session: CheckoutSessionData; totals: AuthoritativeCheckoutTotals }
  | { ok: false; reason: "expired" | "invalid_cart" | "price_changed" | "inventory" };

/**
 * Reconstruct authoritative checkout state from trusted product data.
 * Payment initialization (Phase 7) and order creation MUST call this — never trust session totals alone.
 *
 * Inventory is point-in-time only. Final atomic inventory check belongs at order creation (Phase 7/8).
 */
export async function revalidateCheckoutSession(
  session: CheckoutSessionData,
): Promise<RevalidatedCheckoutSession> {
  if (session.expiresAt < Date.now()) {
    return { ok: false, reason: "expired" };
  }

  const cartValidation = await validateCartItems(
    session.cartItems.map((item) => ({
      productSlug: item.productSlug,
      quantity: item.quantity,
    })),
  );

  if (!cartValidation.canCheckout) {
    return { ok: false, reason: "inventory" };
  }

  const cartItems = mapCartSnapshot(cartValidation.items);
  const subtotal = roundMoney(cartValidation.subtotal);

  if (Math.abs(subtotal - session.subtotal) > 0.009) {
    return { ok: false, reason: "price_changed" };
  }

  for (const validated of cartItems) {
    const snapshot = session.cartItems.find((item) => item.productSlug === validated.productSlug);
    if (!snapshot || snapshot.quantity !== validated.quantity) {
      return { ok: false, reason: "inventory" };
    }
    if (Math.abs(snapshot.price - validated.price) > 0.009) {
      return { ok: false, reason: "price_changed" };
    }
  }

  const shipping = session.shippingMethodId
    ? calculateShippingAmount(session.shippingMethodId)
    : { amount: 0, label: "Calculated at checkout" };
  const tax = calculateTax();
  const totalsFinalized = shipping.amount > 0 && tax.amount > 0;

  const totals = buildAuthoritativeTotals(
    subtotal,
    shipping.amount,
    tax.amount,
    session.discountAmount,
    totalsFinalized,
  );

  return {
    ok: true,
    session: {
      ...session,
      cartItems,
      subtotal: totals.subtotal,
      shippingAmount: totals.shipping,
      taxAmount: totals.tax,
      total: totals.total,
      totalsFinalized,
      currency: siteConfig.currency,
    },
    totals,
  };
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
  | {
      ok: false;
      error: string;
      priceChanged?: boolean;
      issues?: string[];
      fieldErrors?: Record<string, string>;
    }
> {
  const requestFingerprint = buildCheckoutRequestFingerprint(input);
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
  const subtotal = roundMoney(cartValidation.subtotal);
  const priceChanged =
    typeof input.clientSubtotal === "number" &&
    Math.abs(input.clientSubtotal - subtotal) > 0.009;

  if (priceChanged) {
    return {
      ok: false,
      error: "One or more items in your cart have changed in price. Please review your order.",
      priceChanged: true,
    };
  }

  const shipping = calculateShippingAmount(input.shippingMethodId);
  const tax = calculateTax();
  const discountAmount = 0;
  const totalsFinalized = shipping.amount > 0 && tax.amount > 0;
  const totals = buildAuthoritativeTotals(
    subtotal,
    shipping.amount,
    tax.amount,
    discountAmount,
    totalsFinalized,
  );

  const billingAddress = input.billingSameAsShipping
    ? input.shippingAddress
    : input.billingAddress!;

  const existingSession = await getCheckoutSessionFromCookie();
  if (
    input.idempotencyKey &&
    existingSession?.idempotencyKey === input.idempotencyKey &&
    existingSession.requestFingerprint === requestFingerprint &&
    existingSession.status === "ready_for_payment" &&
    existingSession.expiresAt >= Date.now()
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
    requestFingerprint,
    status: "ready_for_payment",
    cartItems,
    subtotal: totals.subtotal,
    shippingAmount: totals.shipping,
    taxAmount: totals.tax,
    discountAmount: totals.discount,
    total: totals.total,
    currency: siteConfig.currency,
    totalsFinalized,
    shippingMethodId: input.shippingMethodId,
    shippingMethodName: shippingMethod.name,
    email: input.contact.email,
    phone: input.contact.phone,
    secondaryPhone: input.contact.secondaryPhone,
    shippingAddress: input.shippingAddress,
    billingAddress,
    billingSameAsShipping: input.billingSameAsShipping,
    orderNotes: input.orderNotes,
    marketingConsent: input.marketingConsent,
    termsAccepted: input.termsAccepted,
    priceChanged: false,
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
      totalsFinalized: session.totalsFinalized,
    },
    priceChanged: false,
    canProceed: true,
  };
}

export { multiplyMoney, roundMoney, sumMoney };
