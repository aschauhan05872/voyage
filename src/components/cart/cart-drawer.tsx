"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CartLineItemView } from "@/components/cart/cart-line-item";
import { CartSummary } from "@/components/cart/cart-summary";
import { useCart } from "@/components/cart/cart-provider";
import { useCartLineActions } from "@/components/cart/use-cart-line-actions";

export function CartDrawer() {
  const router = useRouter();
  const { drawerOpen, closeDrawer, subtotal, canCheckout, validating } = useCart();
  const { activeItems, handleRemove, handleDecrease, handleIncrease } = useCartLineActions();
  const panelRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!drawerOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        closeDrawer();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [closeDrawer, drawerOpen]);

  if (!drawerOpen) return null;

  return (
    <div className="fixed inset-0 z-[60]" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-[rgba(16,42,36,0.35)] motion-safe:transition-opacity"
        aria-label="Close cart"
        onClick={closeDrawer}
      />

      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-[var(--warm-ivory)] shadow-2xl motion-safe:transition-transform"
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="display-font text-2xl text-brand">
            {activeItems.length === 0 ? "Your Cart" : "Added to Your Cart"}
          </h2>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={closeDrawer}
            className="flex h-10 w-10 items-center justify-center text-brand hover:text-accent"
            aria-label="Close cart drawer"
          >
            ×
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-6">
          {activeItems.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="display-font text-2xl text-brand">Your collection awaits.</p>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
                Discover a meaningful birthstone piece for your journey or someone special.
              </p>
              <Link
                href="/collections/birthstones"
                onClick={closeDrawer}
                className="btn-primary mt-8 inline-flex"
              >
                Explore the Birthstone Collection
              </Link>
            </div>
          ) : (
            <ul className="space-y-8">
              {activeItems.map((item) => (
                <li key={item.productSlug}>
                  <CartLineItemView
                    item={item}
                    compact
                    disabled={validating}
                    onRemove={() => handleRemove(item)}
                    onDecrease={() => handleDecrease(item)}
                    onIncrease={() => handleIncrease(item)}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        {activeItems.length > 0 ? (
        <div className="border-t border-line px-5 py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
          <CartSummary
            variant="drawer"
            subtotal={subtotal}
            canCheckout={canCheckout}
            validating={validating}
            onCheckout={() => {
              closeDrawer();
              router.push("/checkout");
            }}
          />
          <Link
            href="/cart"
            onClick={closeDrawer}
            className="mt-4 block text-center text-sm text-link"
          >
            View Cart
          </Link>
        </div>
        ) : null}
      </aside>
    </div>
  );
}
