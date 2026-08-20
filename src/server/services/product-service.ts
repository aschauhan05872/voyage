import { prisma } from "@/lib/db/prisma";
import {
  getCatalogFeaturedProducts,
  getCatalogProductBySlug,
  type ProductSummary,
} from "@/lib/data/product-catalog";
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
  };
}

export async function getFeaturedProducts(limit = 3): Promise<ProductSummary[]> {
  try {
    const products = await prisma.product.findMany({
      where: { active: true, featured: true },
      include: {
        images: { orderBy: { sortOrder: "asc" }, take: 1 },
      },
      orderBy: { createdAt: "asc" },
      take: limit,
    });

    if (products.length > 0) {
      return products.map(mapDbProduct);
    }
  } catch {
    // Database unavailable — fall back to catalog configuration.
  }

  return getCatalogFeaturedProducts().slice(0, limit);
}

export async function getProductBySlug(slug: string): Promise<ProductSummary | undefined> {
  try {
    const product = await prisma.product.findFirst({
      where: { slug, active: true },
      include: {
        images: { orderBy: { sortOrder: "asc" }, take: 1 },
      },
    });

    if (product) return mapDbProduct(product);
  } catch {
    // Fall through to catalog.
  }

  return getCatalogProductBySlug(slug);
}
