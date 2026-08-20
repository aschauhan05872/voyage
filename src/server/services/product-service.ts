import { prisma } from "@/lib/db/prisma";
import {
  availableProductSlugs,
  getCatalogAvailableProducts,
  getCatalogFeaturedProducts,
  getCatalogProductBySlug,
  type ProductSummary,
} from "@/lib/data/product-catalog";
import {
  buildPriceRanges,
  mergeBirthstonesWithProducts,
  type CollectionPageData,
} from "@/lib/data/collection";
import { imageConfig } from "@/lib/config/images";

function mapDbProduct(product: {
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
      return products.map(mapDbProduct);
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
  const available = await getAvailableProducts();
  const match = available.find((product) => product.slug === slug);
  if (match) return match;

  try {
    const product = await prisma.product.findFirst({
      where: { slug, active: true },
      include: {
        images: { orderBy: { sortOrder: "asc" }, take: 1 },
      },
    });

    if (product && (availableProductSlugs as readonly string[]).includes(product.slug)) {
      return mapDbProduct(product);
    }
  } catch {
    // Fall through to catalog.
  }

  const catalogProduct = getCatalogProductBySlug(slug);
  if (catalogProduct?.available) return catalogProduct;

  return undefined;
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
