"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/cart-provider";

export function CartHeaderLink() {
  const { itemCount } = useCart();

  return (
    <Link
      href="/cart"
      className="relative inline-flex items-center text-sm uppercase tracking-[0.12em] hover:text-accent"
      aria-label={itemCount > 0 ? `View cart, ${itemCount} items` : "View cart"}
    >
      Cart
      {itemCount > 0 ? (
        <span
          className="ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1.5 text-[10px] font-medium text-[var(--warm-ivory)]"
          aria-hidden
        >
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      ) : null}
    </Link>
  );
}
