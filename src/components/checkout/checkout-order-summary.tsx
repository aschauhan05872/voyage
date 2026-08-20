"use client";

import Image from "next/image";
import Link from "next/link";
import { businessConfig } from "@/lib/config/business";
import { formatCartPrice } from "@/lib/cart/format-price";
import type { CheckoutCartSnapshotItem } from "@/lib/checkout/types";
import type { ValidatedCartLine } from "@/lib/cart/types";

type CheckoutOrderSummaryProps = {
  items: ValidatedCartLine[] | CheckoutCartSnapshotItem[];
  subtotal: number;
  shippingLabel?: string;
  taxLabel?: string;
  shippingAmount?: number;
  taxAmount?: number;
  total?: number;
  showTotal?: boolean;
  /** Shown when shipping/tax are not yet finalized (MVP placeholder state). */
  estimatedTotal?: number;
  compact?: boolean;
};

function isValidatedLine(
  item: ValidatedCartLine | CheckoutCartSnapshotItem,
): item is ValidatedCartLine {
  return "availability" in item;
}

export function CheckoutOrderSummary({
  items,
  subtotal,
  shippingLabel = businessConfig.shipping.cost,
  taxLabel = "Calculated at checkout",
  shippingAmount,
  taxAmount,
  showTotal = false,
  estimatedTotal,
  compact = false,
}: CheckoutOrderSummaryProps) {
  const activeItems = items.filter((item) => item.quantity > 0);
  const returnsLabel = businessConfig.returns.windowDays
    ? `${businessConfig.returns.windowDays}-Day Returns`
    : "Returns";

  return (
    <aside className="space-y-6" aria-label="Order summary">
      <div>
        <h2 className="display-font text-2xl text-brand md:text-3xl">Order Summary</h2>
        <p className="mt-2 text-sm text-muted">
          A meaningful gift, prepared for the journey ahead.
        </p>
      </div>

      <ul className={`space-y-5 ${compact ? "" : "border-t border-line pt-6"}`}>
        {activeItems.map((item) => (
          <li
            key={item.productSlug}
            className="grid grid-cols-[72px_1fr_auto] items-start gap-4"
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-[rgba(16,42,36,0.04)]">
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl}
                  alt=""
                  fill
                  sizes="72px"
                  className="object-cover"
                />
              ) : null}
            </div>
            <div className="min-w-0">
              <p className="display-font text-base text-brand">{item.name}</p>
              <p className="mt-1 text-sm text-muted">
                {item.gemstone}
                {isValidatedLine(item) && item.material ? ` · ${item.material}` : null}
              </p>
              <p className="mt-1 text-sm text-muted">Qty {item.quantity}</p>
            </div>
            <p className="text-sm text-brand">
              {formatCartPrice(
                isValidatedLine(item) ? item.lineTotal : item.price * item.quantity,
              )}
            </p>
          </li>
        ))}
      </ul>

      <div className="space-y-3 border-t border-line pt-6 text-sm">
        <div className="flex justify-between gap-4">
          <span className="text-muted">Subtotal</span>
          <span className="text-brand">{formatCartPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-muted">Shipping</span>
          <span className="text-muted">
            {typeof shippingAmount === "number" && shippingAmount > 0
              ? formatCartPrice(shippingAmount)
              : shippingLabel}
          </span>
        </div>
        <div className="flex justify-between gap-4">
          <span className="text-muted">Tax</span>
          <span className="text-muted">
            {typeof taxAmount === "number" && taxAmount > 0
              ? formatCartPrice(taxAmount)
              : taxLabel}
          </span>
        </div>
        {showTotal ? (
          <div className="flex justify-between gap-4 border-t border-line pt-4 text-base">
            <span className="text-brand">Total</span>
            <span className="product-price text-2xl">
              {formatCartPrice(subtotal + (shippingAmount ?? 0) + (taxAmount ?? 0))}
            </span>
          </div>
        ) : estimatedTotal !== undefined ? (
          <div className="flex justify-between gap-4 border-t border-line pt-4 text-base">
            <span className="text-muted">Estimated total</span>
            <span className="text-brand">{formatCartPrice(estimatedTotal)}</span>
          </div>
        ) : (
          <p className="pt-2 text-xs text-muted">
            Final shipping and tax are confirmed before payment.
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted">
        <Link href="/shipping" className="text-link">
          Shipping
        </Link>
        <Link href={businessConfig.returns.policyPath} className="text-link">
          {returnsLabel}
        </Link>
        <Link href="/contact" className="text-link">
          Contact
        </Link>
      </div>
    </aside>
  );
}
