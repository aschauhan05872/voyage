"use client";

import Link from "next/link";
import Image from "next/image";
import type { ProductSummary } from "@/lib/data/product-catalog";
import { trackEvent } from "@/lib/integrations/analytics-client";
import { siteConfig } from "@/lib/config/site";

type ProductCardProps = {
  product: ProductSummary;
  priority?: boolean;
  availabilityLabel?: string;
};

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: siteConfig.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function ProductCard({
  product,
  priority = false,
  availabilityLabel = "Available",
}: ProductCardProps) {
  return (
    <article className="group flex h-full flex-col">
      <Link
        href={`/products/${product.slug}`}
        className="flex h-full flex-col focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--champagne-gold)]"
        aria-label={`View ${product.name}, ${formatPrice(product.price)}`}
        onClick={() =>
          trackEvent("select_item", {
            product_id: product.id,
            product_name: product.name,
            price: product.price,
            month: product.month,
            gemstone: product.gemstone,
          })
        }
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-brand/5">
          <Image
            src={product.imageUrl}
            alt={product.imageAlt}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={priority}
            className="object-cover transition duration-500 motion-safe:group-hover:scale-[1.03]"
          />
        </div>
        <div className="flex flex-1 flex-col pt-4">
          <p className="text-xs uppercase tracking-[0.14em] text-muted">
            {product.month} · {product.gemstone}
          </p>
          <h3 className="display-font mt-1 text-xl text-brand">{product.name}</h3>
          <p className="mt-2 text-sm font-medium">{formatPrice(product.price)}</p>
          <p className="mt-1 text-xs text-muted">{availabilityLabel}</p>
          <span className="mt-4 inline-flex text-xs uppercase tracking-[0.14em] text-brand underline-offset-4 group-hover:underline">
            View piece
          </span>
        </div>
      </Link>
    </article>
  );
}
