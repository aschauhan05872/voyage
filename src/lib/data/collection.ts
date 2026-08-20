import { birthstones } from "@/lib/data/birthstones";
import type { ProductSummary } from "@/lib/data/product-catalog";

export type CollectionBirthstoneItem = {
  month: string;
  monthSlug: string;
  gemstone: string;
  productSlug: string;
  image: string;
  color: string;
  availability: "available" | "coming_soon";
  product?: ProductSummary;
};

export type PriceRangeOption = {
  id: string;
  label: string;
  min?: number;
  max?: number;
};

export type CollectionPageData = {
  birthstones: CollectionBirthstoneItem[];
  products: ProductSummary[];
  priceRanges: PriceRangeOption[];
  supportsNewestSort: boolean;
};

export function buildPriceRanges(products: ProductSummary[]): PriceRangeOption[] {
  if (products.length === 0) {
    return [{ id: "all", label: "All prices" }];
  }

  const prices = products.map((product) => product.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);

  if (min === max) {
    return [
      { id: "all", label: "All prices" },
      { id: "at-price", label: `$${min}`, min, max: min },
    ];
  }

  const midpoint = Math.floor((min + max) / 2);
  return [
    { id: "all", label: "All prices" },
    { id: "under-mid", label: `Under $${midpoint + 1}`, max: midpoint },
    { id: "mid-plus", label: `$${midpoint + 1}+`, min: midpoint + 1 },
  ];
}

export function mergeBirthstonesWithProducts(
  products: ProductSummary[],
): CollectionBirthstoneItem[] {
  const productBySlug = new Map(products.map((product) => [product.slug, product]));

  return birthstones.map((stone) => {
    const product = productBySlug.get(stone.productSlug);
    return {
      month: stone.month,
      monthSlug: stone.monthSlug,
      gemstone: stone.gemstone,
      productSlug: stone.productSlug,
      image: stone.image,
      color: stone.color,
      availability: product ? "available" : "coming_soon",
      product,
    };
  });
}
