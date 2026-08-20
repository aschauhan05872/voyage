"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/cart/cart-provider";
import { NotifyMeForm } from "@/components/collection/notify-me-form";
import type { ProductDetail } from "@/lib/data/product-detail";
import { siteConfig } from "@/lib/config/site";
import { trackEvent } from "@/lib/integrations/analytics-client";

type ProductPurchaseControlsProps = {
  product: ProductDetail;
  variant?: "full" | "sticky";
};

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: siteConfig.currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

function buildWhatsAppHref(productName: string): string | null {
  if (!siteConfig.whatsappNumber) return null;
  const message = `Hi VOYAGE, I have a question about the ${productName}.`;
  return `https://wa.me/${siteConfig.whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
}

export function ProductPurchaseControls({
  product,
  variant = "full",
}: ProductPurchaseControlsProps) {
  const router = useRouter();
  const { addItem, ready } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const whatsappHref = buildWhatsAppHref(product.name);

  function handleAddToCart(redirectToCheckout = false) {
    if (product.availability !== "available") return;

    addItem(
      {
        productSlug: product.slug,
        productId: product.id,
        sku: product.sku,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        month: product.month,
        gemstone: product.gemstone,
        material: product.material,
      },
      quantity,
      { openDrawer: !redirectToCheckout },
    );

    trackEvent("add_to_cart", {
      product_id: product.id,
      product_name: product.name,
      sku: product.sku,
      price: product.price,
      quantity,
      currency: siteConfig.currency,
      gemstone: product.gemstone,
      birth_month: product.month,
    });

    setAdded(true);

    if (redirectToCheckout) {
      trackEvent("begin_checkout", {
        product_id: product.id,
        product_name: product.name,
        quantity,
        cart_value: product.price * quantity,
        currency: siteConfig.currency,
      });
      router.push("/checkout");
      return;
    }

    setTimeout(() => setAdded(false), 2500);
  }

  if (product.availability === "coming_soon") {
    return (
      <div className="space-y-4">
        <p className="display-font text-2xl text-brand">Coming Soon</p>
        <p className="editorial-lead">
          We&apos;re preparing something meaningful for this month.
        </p>
        {variant === "full" ? (
          <NotifyMeForm month={product.month} gemstone={product.gemstone} />
        ) : null}
      </div>
    );
  }

  if (product.availability === "sold_out") {
    return (
      <div className="space-y-4">
        <p className="display-font text-2xl text-brand">Currently Unavailable</p>
        <p className="editorial-lead">This piece is not available at the moment.</p>
        {variant === "full" ? (
          <NotifyMeForm month={product.month} gemstone={product.gemstone} />
        ) : null}
      </div>
    );
  }

  if (product.availability === "inactive") {
    return <p className="editorial-lead">This piece is no longer available.</p>;
  }

  if (variant === "sticky") {
    return (
      <div className="flex items-center gap-4">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm text-brand">{product.gemstone}</p>
          <p className="product-price mt-1">{formatPrice(product.price)}</p>
        </div>
        <button
          type="button"
          disabled={!ready}
          onClick={() => handleAddToCart(false)}
          className="btn-primary shrink-0 px-6"
        >
          {added ? "Added" : "Add to Cart"}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <p className="product-price">{formatPrice(product.price)}</p>

      <p className="editorial-lead">{product.description}</p>

      <div className="flex items-center gap-4">
        <label htmlFor="product-quantity" className="text-sm text-muted">
          Quantity
        </label>
        <select
          id="product-quantity"
          value={quantity}
          onChange={(event) => setQuantity(Number(event.target.value))}
          className="border border-line bg-transparent px-3 py-2 text-sm"
          aria-label="Quantity"
        >
          {Array.from({ length: Math.min(10, product.inventoryQuantity) }, (_, index) => {
            const value = index + 1;
            return (
              <option key={value} value={value}>
                {value}
              </option>
            );
          })}
        </select>
      </div>

      <div className="space-y-4">
        <button
          type="button"
          disabled={!ready}
          onClick={() => handleAddToCart(false)}
          className="btn-primary w-full sm:w-auto sm:min-w-[220px]"
        >
          {added ? "Added to Cart" : "Add to Cart"}
        </button>
        <button
          type="button"
          disabled={!ready}
          onClick={() => handleAddToCart(true)}
          className="btn-ghost block text-sm"
        >
          Continue your journey →
        </button>
      </div>

      {whatsappHref ? (
        <p className="text-sm text-muted">
          Questions?{" "}
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-link"
            onClick={() => trackEvent("whatsapp_click", { source: "product_page" })}
          >
            Chat with us
          </a>
        </p>
      ) : null}
    </div>
  );
}

export function ProductStickyPurchaseBar({ product }: { product: ProductDetail }) {
  if (product.availability !== "available") return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-[rgba(247,242,233,0.96)] px-4 py-4 backdrop-blur-sm lg:hidden pb-[max(1rem,env(safe-area-inset-bottom))]">
      <div className="container-shell">
        <ProductPurchaseControls product={product} variant="sticky" />
      </div>
    </div>
  );
}
