import { prisma } from "@/lib/db/prisma";
import {
  availableProductSlugs,
  getCatalogAvailableProducts,
  getCatalogFeaturedProducts,
  type ProductSummary,
} from "@/lib/data/product-catalog";
import {
  buildPriceRanges,
  mergeBirthstonesWithProducts,
  type CollectionPageData,
} from "@/lib/data/collection";
import {
  getBirthstoneByProductSlug,
  getCatalogProductDetail,
  isKnownProductSlug,
} from "@/lib/data/product-detail-catalog";
import { getBirthstoneSymbolism } from "@/lib/data/birthstone-symbolism";
import {
  resolveAvailability,
  type ProductDetail,
  type ProductImageView,
} from "@/lib/data/product-detail";
import { imageConfig } from "@/lib/config/images";

function mapDbProduct(product: {
  id: string;
  slug: string;
  sku: string;
  name: string;
  month: string;
  gemstone: string;
  material: string;
  price: { toNumber(): number };
  compareAtPrice: { toNumber(): number } | null;
  description: string;
  story: string | null;
  careInstructions: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  featured: boolean;
  active: boolean;
  createdAt: Date;
  images: { url: string; alt: string | null; type: string; sortOrder: number }[];
  inventory: { quantity: number } | null;
}): ProductDetail {
  const stone = getBirthstoneByProductSlug(product.slug);
  const primaryImage = product.images[0];
  const isLaunchProduct = (availableProductSlugs as readonly string[]).includes(product.slug);
  const inventoryQuantity = product.inventory?.quantity ?? 0;

  const images: ProductImageView[] =
    product.images.length > 0
      ? product.images.map((image) => ({
          url: image.url,
          alt: image.alt ?? product.name,
          type: image.type,
          sortOrder: image.sortOrder,
        }))
      : [
          {
            url: primaryImage?.url ?? imageConfig.productFallback,
            alt: product.name,
            type: "hero",
            sortOrder: 0,
          },
        ];

  return {
    id: product.id,
    slug: product.slug,
    sku: product.sku,
    name: product.name,
    month: product.month,
    gemstone: product.gemstone,
    material: product.material,
    price: product.price.toNumber(),
    compareAtPrice: product.compareAtPrice?.toNumber(),
    description: product.description,
    story: product.story ?? undefined,
    careInstructions: product.careInstructions ?? undefined,
    symbolism: stone ? getBirthstoneSymbolism(stone.monthSlug) : undefined,
    seoTitle: product.seoTitle ?? undefined,
    seoDescription: product.seoDescription ?? undefined,
    imageUrl: images[0]?.url ?? imageConfig.productFallback,
    imageAlt: images[0]?.alt ?? product.name,
    featured: product.featured,
    createdAt: product.createdAt.toISOString(),
    available: isLaunchProduct && product.active && inventoryQuantity > 0,
    images,
    inventoryQuantity,
    availability: resolveAvailability(
      product.slug,
      isLaunchProduct,
      product.active,
      inventoryQuantity,
    ),
  };
}

function mapDbProductSummary(product: {
  id: string;
  slug: string;
  name: string;
  month: string;
  gemstone: string;
  material: string;
  price: { toNumber(): number };
  compareAtPrice: { toNumber(): number } | null;
  featured: boolean;
  createdAt: Date;
  images: { url: string; alt: string | null }[];
}): ProductSummary {
  const primaryImage = product.images[0];
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    month: product.month,
    gemstone: product.gemstone,
    material: product.material,
    price: product.price.toNumber(),
    compareAtPrice: product.compareAtPrice?.toNumber(),
    imageUrl: primaryImage?.url ?? imageConfig.productFallback,
    imageAlt: primaryImage?.alt ?? product.name,
    featured: product.featured,
    createdAt: product.createdAt.toISOString(),
    available: true,
  };
}

export async function getAvailableProducts(): Promise<ProductSummary[]> {
  try {
    const products = await prisma.product.findMany({
      where: {
        active: true,
        slug: { in: [...availableProductSlugs] },
      },
      include: {
        images: { orderBy: { sortOrder: "asc" }, take: 1 },
      },
      orderBy: { createdAt: "asc" },
    });

    if (products.length > 0) {
      return products.map(mapDbProductSummary);
    }
  } catch {
    // Database unavailable — fall back to catalog configuration.
  }

  return getCatalogAvailableProducts();
}

export async function getFeaturedProducts(limit = 3): Promise<ProductSummary[]> {
  const available = await getAvailableProducts();
  const featured = available.filter((product) => product.featured);

  if (featured.length > 0) {
    return featured.slice(0, limit);
  }

  return getCatalogFeaturedProducts().slice(0, limit);
}

export async function getProductBySlug(slug: string): Promise<ProductSummary | undefined> {
  const detail = await getProductDetailBySlug(slug);
  return detail;
}

export async function getProductDetailBySlug(slug: string): Promise<ProductDetail | undefined> {
  if (!isKnownProductSlug(slug)) {
    return undefined;
  }

  try {
    const product = await prisma.product.findFirst({
      where: { slug },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        inventory: true,
      },
    });

    if (product) {
      return mapDbProduct(product);
    }
  } catch {
    // Fall through to catalog.
  }

  return getCatalogProductDetail(slug);
}

export async function getRelatedProducts(
  slug: string,
  limit = 3,
): Promise<ProductSummary[]> {
  const available = await getAvailableProducts();
  const related = available.filter((product) => product.slug !== slug);
  return related.slice(0, limit);
}

export async function getCollectionPageData(): Promise<CollectionPageData> {
  const products = await getAvailableProducts();
  const birthstoneItems = mergeBirthstonesWithProducts(products);

  return {
    birthstones: birthstoneItems,
    products,
    priceRanges: buildPriceRanges(products),
    supportsNewestSort: products.some((product) => Boolean(product.createdAt)),
  };
}
