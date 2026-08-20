"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { CartEmptyState } from "@/components/cart/cart-empty-state";
import { CartLineItemView } from "@/components/cart/cart-line-item";
import { CartSummary } from "@/components/cart/cart-summary";
import { useCart } from "@/components/cart/cart-provider";
import { useCartLineActions } from "@/components/cart/use-cart-line-actions";
import { formatCartPrice } from "@/lib/cart/format-price";
import { siteConfig } from "@/lib/config/site";
import { trackEvent } from "@/lib/integrations/analytics-client";

export function CartPageView() {
  const router = useRouter();
  const { items, subtotal, canCheckout, validating, ready } = useCart();
  const { activeItems, issueItems, handleRemove, handleDecrease, handleIncrease } =
    useCartLineActions();

  const viewedRef = useRef(false);

  useEffect(() => {
    if (!ready || viewedRef.current) return;
    viewedRef.current = true;
    trackEvent("view_cart", {
      cart_value: subtotal,
      currency: siteConfig.currency,
    });
  }, [ready, subtotal]);

  const isEmpty = items.length === 0 && activeItems.length === 0 && issueItems.length === 0;

  if (isEmpty) {
    return (
      <section className="section-padding-lg">
        <div className="container-shell">
          <CartEmptyState />
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="section-padding-lg pb-32 lg:pb-20">
        <div className="container-shell">
          <div className="max-w-5xl">
            <h1 className="display-font text-4xl text-brand md:text-5xl">Your Cart</h1>
            <p className="editorial-lead mt-4">Made for meaningful moments.</p>

            <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_320px] lg:gap-16 xl:grid-cols-[1fr_360px]">
              <div className="space-y-10">
                {activeItems.length > 0 ? (
                  <ul className="divide-y divide-line">
                    {activeItems.map((item) => (
                      <li key={item.productSlug} className="py-8 first:pt-0">
                        <CartLineItemView
                          item={item}
                          disabled={validating}
                          onRemove={() => handleRemove(item)}
                          onDecrease={() => handleDecrease(item)}
                          onIncrease={() => handleIncrease(item)}
                        />
                      </li>
                    ))}
                  </ul>
                ) : null}

                {issueItems.length > 0 ? (
                  <div className="space-y-6 border-t border-line pt-8">
                    <h2 className="text-sm text-muted">Unavailable items</h2>
                    <ul className="space-y-8">
                      {issueItems.map((item) => (
                        <li key={item.productSlug}>
                          <CartLineItemView
                            item={item}
                            disabled={validating}
                            onRemove={() => handleRemove(item)}
                            onDecrease={() => handleDecrease(item)}
                            onIncrease={() => handleIncrease(item)}
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>

              <div className="hidden lg:block">
                <div className="sticky top-24">
                  <CartSummary
                    subtotal={subtotal}
                    canCheckout={canCheckout}
                    validating={validating}
                  />
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
          <button
            type="button"
            disabled={!canCheckout || validating}
            onClick={() => {
              trackEvent("begin_checkout", {
                cart_value: subtotal,
                currency: siteConfig.currency,
              });
              router.push("/checkout");
            }}
            className="btn-primary shrink-0 px-6"
          >
            Continue to Checkout
          </button>
        </div>
      </div>
    </>
  );
}
