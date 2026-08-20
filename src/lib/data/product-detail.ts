import type { ProductSummary } from "@/lib/data/product-catalog";

export type ProductImageView = {
  url: string;
  alt: string;
  type: string;
  sortOrder: number;
};

export type ProductAvailability = "available" | "sold_out" | "coming_soon" | "inactive";

export type ProductDetail = ProductSummary & {
  sku: string;
  description: string;
  story?: string;
  careInstructions?: string;
  symbolism?: string;
  seoTitle?: string;
  seoDescription?: string;
  images: ProductImageView[];
  inventoryQuantity: number;
  availability: ProductAvailability;
};

export function resolveAvailability(
  slug: string,
  isLaunchProduct: boolean,
  active: boolean,
  inventoryQuantity: number,
): ProductAvailability {
  if (!active) return "inactive";
  if (!isLaunchProduct) return "coming_soon";
  if (inventoryQuantity <= 0) return "sold_out";
  return "available";
}
