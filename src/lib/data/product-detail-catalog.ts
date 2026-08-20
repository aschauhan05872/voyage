import { imageConfig } from "@/lib/config/images";
import { getBirthstoneSymbolism } from "@/lib/data/birthstone-symbolism";
import { birthstones, type Birthstone } from "@/lib/data/birthstones";
import {
  availableProductSlugs,
  getCatalogProductBySlug,
  type ProductSummary,
} from "@/lib/data/product-catalog";
import {
  resolveAvailability,
  type ProductDetail,
  type ProductImageView,
} from "@/lib/data/product-detail";

function buildCatalogImages(stone: Birthstone, name: string): ProductImageView[] {
  return [
    { url: stone.image, alt: name, type: "hero", sortOrder: 0 },
    {
      url: imageConfig.productFallback,
      alt: `${name} close-up`,
      type: "closeup",
      sortOrder: 1,
    },
    {
      url: "/placeholders/story-editorial.svg",
      alt: `${name} styled as a meaningful gift`,
      type: "lifestyle",
      sortOrder: 2,
    },
    {
      url: "/placeholders/packaging-gift-set.svg",
      alt: "VOYAGE gift packaging",
      type: "packaging",
      sortOrder: 3,
    },
    {
      url: imageConfig.productFallback,
      alt: `${name} detail view`,
      type: "detail",
      sortOrder: 4,
    },
  ];
}

function buildDescription(stone: Birthstone): string {
  return `Created for ${stone.month}-born journeys, this ${stone.gemstone.toLowerCase()} piece pairs the beauty of natural gemstone jewelry with a story that makes the gift personal.`;
}

function buildStory(stone: Birthstone): string {
  const symbolism = getBirthstoneSymbolism(stone.monthSlug);
  return `${stone.month} is represented by ${stone.gemstone}. ${symbolism ?? ""} A meaningful birthstone gift for someone you love — or a personal reminder of your own journey.`.trim();
}

export function getCatalogProductDetail(slug: string): ProductDetail | undefined {
  const stone = birthstones.find((entry) => entry.productSlug === slug);
  const summary = getCatalogProductBySlug(slug);
  if (!stone || !summary) return undefined;

  const isLaunchProduct = (availableProductSlugs as readonly string[]).includes(slug);
  const inventoryQuantity = isLaunchProduct ? 100 : 0;

  return {
    ...summary,
    sku: `VOY-BS-${stone.monthSlug.toUpperCase().slice(0, 3)}`,
    description: buildDescription(stone),
    story: buildStory(stone),
    careInstructions:
      "Store in the included pouch when not worn. Avoid harsh chemicals, perfumes and prolonged water exposure. Gently wipe with a soft cloth after wear.",
    symbolism: getBirthstoneSymbolism(stone.monthSlug),
    seoTitle: `${summary.name} | VOYAGE`,
    seoDescription: `Shop the ${stone.month} ${stone.gemstone} birthstone necklace from VOYAGE. Meaningful gemstone jewelry crafted as a premium gift.`,
    images: buildCatalogImages(stone, summary.name),
    inventoryQuantity,
    availability: resolveAvailability(slug, isLaunchProduct, true, inventoryQuantity),
  };
}

export function getBirthstoneByProductSlug(slug: string): Birthstone | undefined {
  return birthstones.find((stone) => stone.productSlug === slug);
}

export function isKnownProductSlug(slug: string): boolean {
  return birthstones.some((stone) => stone.productSlug === slug);
}

export function toProductDetailFromSummary(
  summary: ProductSummary,
  extras: Omit<ProductDetail, keyof ProductSummary>,
): ProductDetail {
  return { ...summary, ...extras };
}
