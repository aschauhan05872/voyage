"use client";

import Link from "next/link";
import Image from "next/image";
import type { ProductSummary } from "@/lib/data/product-catalog";
import { trackEvent } from "@/lib/integrations/analytics-client";
import { siteConfig } from "@/lib/config/site";

type ProductCardProps = {
  product: ProductSummary;
  priority?: boolean;
};

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: siteConfig.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  return (
    <article className="group flex h-full flex-col">
      <Link
        href={`/products/${product.slug}`}
        className="flex h-full flex-col focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--champagne-gold)]"
        aria-label={`${product.name}, ${formatPrice(product.price)}`}
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
        <div className="relative aspect-[4/5] overflow-hidden bg-[rgba(16,42,36,0.04)]">
          <Image
            src={product.imageUrl}
            alt={product.imageAlt}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={priority}
            className="object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out motion-safe:group-hover:scale-[1.02]"
          />
        </div>
        <div className="flex flex-1 flex-col pt-5">
          <p className="text-sm text-muted">
            {product.month} · {product.gemstone}
          </p>
          <h3 className="display-font mt-2 text-xl text-brand">{product.name}</h3>
          <p className="mt-3 text-sm text-brand">{formatPrice(product.price)}</p>
        </div>
      </Link>
    </article>
  );
}
