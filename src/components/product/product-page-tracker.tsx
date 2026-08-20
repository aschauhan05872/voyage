"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/integrations/analytics-client";
import type { ProductDetail } from "@/lib/data/product-detail";
import { siteConfig } from "@/lib/config/site";

type ProductPageTrackerProps = {
  product: ProductDetail;
};

export function ProductPageTracker({ product }: ProductPageTrackerProps) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;

    trackEvent("view_item", {
      product_id: product.id,
      sku: product.sku,
      product_name: product.name,
      price: product.price,
      currency: siteConfig.currency,
      gemstone: product.gemstone,
      birth_month: product.month,
    });
    trackEvent("page_view", {
      page_path: `/products/${product.slug}`,
      page_title: product.name,
    });
  }, [product]);

  return null;
}
