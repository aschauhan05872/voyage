"use client";

import { useCallback } from "react";
import { useCart } from "@/components/cart/cart-provider";
import { siteConfig } from "@/lib/config/site";
import type { ValidatedCartLine } from "@/lib/cart/types";
import { trackEvent } from "@/lib/integrations/analytics-client";

export function useCartLineActions() {
  const { removeItem, updateQuantity, items, validated } = useCart();

  const displayItems: ValidatedCartLine[] = validated
    ? validated.items
    : items.map((item) => ({
        productSlug: item.productSlug,
        productId: item.productId,
        sku: item.sku ?? "",
        name: item.name,
        price: item.price,
        imageUrl: item.imageUrl,
        quantity: item.quantity,
        requestedQuantity: item.quantity,
        month: item.month ?? "",
        gemstone: item.gemstone ?? "",
        material: item.material ?? "",
        lineTotal: item.price * item.quantity,
        availability: "available" as const,
        maxQuantity: 99,
        canCheckout: true,
      }));

  const activeItems = displayItems.filter((item) => item.quantity > 0);
  const issueItems = displayItems.filter((item) => item.quantity === 0 && item.issue);

  const handleRemove = useCallback(
    (item: ValidatedCartLine) => {
      removeItem(item.productSlug);
      trackEvent("remove_from_cart", {
        product_id: item.productId,
        product_name: item.name,
        sku: item.sku,
        price: item.price,
        quantity: item.quantity,
        currency: siteConfig.currency,
        gemstone: item.gemstone,
        birth_month: item.month,
      });
    },
    [removeItem],
  );

  const handleDecrease = useCallback(
    (item: ValidatedCartLine) => {
      const nextQuantity = item.quantity - 1;
      updateQuantity(item.productSlug, nextQuantity);
      trackEvent("cart_quantity_updated", {
        product_id: item.productId,
        product_name: item.name,
        sku: item.sku,
        price: item.price,
        quantity: nextQuantity,
        currency: siteConfig.currency,
        gemstone: item.gemstone,
        birth_month: item.month,
      });
    },
    [updateQuantity],
  );

  const handleIncrease = useCallback(
    (item: ValidatedCartLine) => {
      const nextQuantity = item.quantity + 1;
      updateQuantity(item.productSlug, nextQuantity);
      trackEvent("cart_quantity_updated", {
        product_id: item.productId,
        product_name: item.name,
        sku: item.sku,
        price: item.price,
        quantity: nextQuantity,
        currency: siteConfig.currency,
        gemstone: item.gemstone,
        birth_month: item.month,
      });
    },
    [updateQuantity],
  );

  return {
    activeItems,
    issueItems,
    displayItems,
    handleRemove,
    handleDecrease,
    handleIncrease,
  };
}
