"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { CheckoutForm } from "@/components/checkout/checkout-form";
import { CheckoutOrderSummary } from "@/components/checkout/checkout-order-summary";
import { useCart } from "@/components/cart/cart-provider";
import { useCartLineActions } from "@/components/cart/use-cart-line-actions";
import { formatCartPrice } from "@/lib/cart/format-price";
import { siteConfig } from "@/lib/config/site";
import { trackEvent } from "@/lib/integrations/analytics-client";

export function CheckoutPageView() {
  const { items, subtotal, validated, validating, canCheckout, ready } = useCart();
  const { activeItems } = useCartLineActions();
  const checkoutStartedRef = useRef(false);

  useEffect(() => {
    if (!ready || checkoutStartedRef.current) return;
    if (items.length === 0) return;
    checkoutStartedRef.current = true;
    trackEvent("begin_checkout", {
      cart_value: subtotal,
      currency: siteConfig.currency,
      item_count: items.reduce((sum, item) => sum + item.quantity, 0),
    });
  }, [items, ready, subtotal]);

  if (ready && items.length === 0) {
    return (
      <section className="section-padding-lg">
        <div className="container-shell max-w-xl text-center">
          <h1 className="display-font text-4xl text-brand md:text-5xl">Checkout</h1>
          <p className="editorial-lead mx-auto mt-6">
            Your cart is empty. Discover a meaningful piece to begin your journey.
          </p>
          <Link href="/collections/birthstones" className="btn-primary mt-10 inline-flex">
            Explore Birthstones
          </Link>
        </div>
      </section>
    );
  }

  if (ready && !canCheckout && !validating) {
    return (
      <section className="section-padding-lg">
        <div className="container-shell max-w-xl">
          <h1 className="display-font text-4xl text-brand md:text-5xl">Checkout</h1>
          <p className="editorial-lead mt-6">
            One or more pieces in your cart need attention before you can continue.
          </p>
          <Link href="/cart" className="btn-primary mt-8 inline-flex">
            Review Your Cart
          </Link>
        </div>
      </section>
    );
  }

  const summaryItems = validated?.items ?? activeItems;

  return (
    <>
      <section className="section-padding-lg pb-32 lg:pb-20">
        <div className="container-shell">
          <div className="max-w-6xl">
            <h1 className="display-font text-4xl text-brand md:text-5xl">Checkout</h1>
            <p className="editorial-lead mt-4">
              Everything clear, secure, and ready for the next step.
            </p>

            <div className="mt-12 grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
              <CheckoutForm />

              <div className="hidden lg:block">
                <div className="sticky top-24">
                  <CheckoutOrderSummary items={summaryItems} subtotal={subtotal} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-[rgba(247,242,233,0.96)] px-4 py-4 backdrop-blur-sm lg:hidden pb-[max(1rem,env(safe-area-inset-bottom))]">
        <div className="container-shell flex items-center gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-sm text-muted">Subtotal</p>
            <p className="product-price mt-1">{formatCartPrice(subtotal)}</p>
          </div>
          <p className="text-xs text-muted">Continue below</p>
        </div>
      </div>
    </>
  );
}
