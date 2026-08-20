"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { businessConfig } from "@/lib/config/business";
import { formatCartPrice } from "@/lib/cart/format-price";
import { siteConfig } from "@/lib/config/site";
import { trackEvent } from "@/lib/integrations/analytics-client";

type CartSummaryProps = {
  subtotal: number;
  canCheckout: boolean;
  validating?: boolean;
  variant?: "page" | "drawer";
  onCheckout?: () => void;
};

function buildWhatsAppHref(): string | null {
  if (!siteConfig.whatsappNumber) return null;
  return `https://wa.me/${siteConfig.whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(siteConfig.whatsappMessage)}`;
}

export function CartSummary({
  subtotal,
  canCheckout,
  validating = false,
  variant = "page",
  onCheckout,
}: CartSummaryProps) {
  const router = useRouter();
  const whatsappHref = buildWhatsAppHref();
  const returnsLabel = businessConfig.returns.windowDays
    ? `${businessConfig.returns.windowDays}-Day Returns`
    : "Returns";

  function handleCheckout() {
    if (!canCheckout || validating) return;

    trackEvent("begin_checkout", {
      cart_value: subtotal,
      currency: siteConfig.currency,
    });

    if (onCheckout) {
      onCheckout();
    } else {
      router.push("/checkout");
    }
  }

  return (
    <aside className={variant === "drawer" ? "space-y-6" : "space-y-8"} aria-label="Order summary">
      <div className="space-y-4 border-t border-line pt-6">
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-sm text-muted">Subtotal</span>
          <span className="text-base text-brand">{formatCartPrice(subtotal)}</span>
        </div>
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-sm text-muted">Shipping</span>
          <span className="text-sm text-muted">{businessConfig.shipping.cost}</span>
        </div>
      </div>

      <p className="text-sm text-muted">
        Every Voyage piece is prepared to make the gift feel special.
      </p>

      <div className="space-y-3">
        <button
          type="button"
          onClick={handleCheckout}
          disabled={!canCheckout || validating}
          className="btn-primary w-full"
        >
          Continue to Checkout
        </button>
        <Link
          href="/collections/birthstones"
          className="btn-secondary block w-full text-center"
        >
          Continue Shopping
        </Link>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted">
        <Link href="/shipping" className="text-link">
          Shipping
        </Link>
        <Link href={businessConfig.returns.policyPath} className="text-link">
          {returnsLabel}
        </Link>
        {whatsappHref ? (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-link"
            onClick={() => trackEvent("whatsapp_click", { source: "cart" })}
          >
            Need help with your order? Chat with us
          </a>
        ) : null}
      </div>
    </aside>
  );
}
