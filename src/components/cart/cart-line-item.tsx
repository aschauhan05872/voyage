"use client";

import Image from "next/image";
import Link from "next/link";
import { CartQuantityControl } from "@/components/cart/cart-quantity-control";
import { formatCartPrice } from "@/lib/cart/format-price";
import type { ValidatedCartLine } from "@/lib/cart/types";

type CartLineItemViewProps = {
  item: ValidatedCartLine;
  compact?: boolean;
  onRemove: () => void;
  onDecrease: () => void;
  onIncrease: () => void;
  disabled?: boolean;
};

export function CartLineItemView({
  item,
  compact = false,
  onRemove,
  onDecrease,
  onIncrease,
  disabled = false,
}: CartLineItemViewProps) {
  const unavailable = !item.canCheckout || item.quantity === 0;
  const maxQuantity = item.maxQuantity > 0 ? item.maxQuantity : 99;

  return (
    <article
      className={`grid gap-4 ${compact ? "grid-cols-[72px_1fr]" : "grid-cols-[96px_1fr] sm:grid-cols-[112px_1fr_auto]"}`}
    >
      <Link
        href={`/products/${item.productSlug}`}
        className={`relative overflow-hidden bg-[rgba(16,42,36,0.04)] ${compact ? "aspect-[4/5] h-[90px]" : "aspect-[4/5] h-[120px] sm:h-[140px]"}`}
        aria-label={`View ${item.name}`}
      >
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt=""
            fill
            sizes={compact ? "72px" : "112px"}
            className="object-cover"
          />
        ) : null}
      </Link>

      <div className="min-w-0 space-y-3">
        <div>
          <Link href={`/products/${item.productSlug}`} className="display-font text-lg text-brand hover:underline">
            {item.name}
          </Link>
          {item.gemstone ? (
            <p className="mt-1 text-sm text-muted">
              {item.month ? `${item.month} · ` : ""}
              {item.gemstone}
              {item.material ? ` · ${item.material}` : ""}
            </p>
          ) : null}
        </div>

        {item.issue ? (
          <p className="text-sm text-muted" role="status">
            {item.issue}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center gap-4">
          {!unavailable ? (
            <CartQuantityControl
              quantity={item.quantity}
              maxQuantity={maxQuantity}
              disabled={disabled}
              label={item.name}
              onDecrease={onDecrease}
              onIncrease={onIncrease}
              compact={compact}
            />
          ) : null}
          <button
            type="button"
            onClick={onRemove}
            disabled={disabled}
            className="text-sm text-muted underline-offset-4 transition hover:text-brand hover:underline disabled:opacity-40"
          >
            Remove
          </button>
        </div>
      </div>

      {!compact ? (
        <div className="hidden text-right sm:block">
          <p className="text-sm text-muted">{formatCartPrice(item.price)}</p>
          {!unavailable ? (
            <p className="mt-2 text-base text-brand">{formatCartPrice(item.lineTotal)}</p>
          ) : null}
        </div>
      ) : null}

      {!unavailable ? (
        <p className={`text-sm text-brand ${compact ? "col-span-2" : "sm:hidden"}`}>
          {formatCartPrice(item.lineTotal)}
        </p>
      ) : null}
    </article>
  );
}
