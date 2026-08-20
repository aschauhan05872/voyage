import { createHash } from "node:crypto";
import type { PrepareCheckoutInput } from "@/lib/validation/checkout";

/** Stable fingerprint for idempotency — excludes clientSubtotal and idempotencyKey. */
export function buildCheckoutRequestFingerprint(input: PrepareCheckoutInput): string {
  const payload = {
    items: [...input.items].sort((a, b) => a.productSlug.localeCompare(b.productSlug)),
    contact: input.contact,
    shippingAddress: input.shippingAddress,
    billingSameAsShipping: input.billingSameAsShipping,
    billingAddress: input.billingSameAsShipping ? undefined : input.billingAddress,
    shippingMethodId: input.shippingMethodId,
    orderNotes: input.orderNotes ?? "",
    marketingConsent: input.marketingConsent,
    termsAccepted: input.termsAccepted,
  };

  return createHash("sha256").update(JSON.stringify(payload)).digest("hex");
}
