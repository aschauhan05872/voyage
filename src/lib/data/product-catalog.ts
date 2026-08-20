import { birthstones, type Birthstone } from "@/lib/data/birthstones";
import { imageConfig } from "@/lib/config/images";

export type ProductSummary = {
  id: string;
  slug: string;
  name: string;
  month: string;
  gemstone: string;
  material: string;
  price: number;
  compareAtPrice?: number;
  imageUrl: string;
  imageAlt: string;
  featured?: boolean;
  createdAt?: string;
  available?: boolean;
};

/** Products currently available to purchase at launch. Expand as inventory goes live. */
export const availableProductSlugs = [
  "february-birthstone-amethyst-necklace",
  "june-birthstone-moonstone-necklace",
  "january-birthstone-garnet-necklace",
] as const;

/** Featured slugs for homepage — subset of available products. */
export const featuredProductSlugs = availableProductSlugs;

function toProductSummary(stone: Birthstone): ProductSummary {
  const name = `${stone.month} Birthstone ${stone.gemstone} Necklace`;
  const isAvailable = (availableProductSlugs as readonly string[]).includes(stone.productSlug);
  return {
    id: `catalog-${stone.monthSlug}`,
    slug: stone.productSlug,
    name,
    month: stone.month,
    gemstone: stone.gemstone,
    material: "925 Sterling Silver",
    price: 89,
    compareAtPrice: 109,
    imageUrl: stone.image ?? `${imageConfig.productFallback}`,
    imageAlt: name,
    featured: (featuredProductSlugs as readonly string[]).includes(stone.productSlug),
    available: isAvailable,
  };
}

export const productCatalog: ProductSummary[] = birthstones.map(toProductSummary);

export function getCatalogProductBySlug(slug: string): ProductSummary | undefined {
  return productCatalog.find((product) => product.slug === slug);
}

export function getCatalogAvailableProducts(): ProductSummary[] {
  return availableProductSlugs
    .map((slug) => getCatalogProductBySlug(slug))
    .filter((product): product is ProductSummary => Boolean(product));
}

export function getCatalogFeaturedProducts(): ProductSummary[] {
  return featuredProductSlugs
    .map((slug) => getCatalogProductBySlug(slug))
    .filter((product): product is ProductSummary => Boolean(product));
}

export function getBirthstoneProductUrl(productSlug: string): string {
  return `/products/${productSlug}`;
}
