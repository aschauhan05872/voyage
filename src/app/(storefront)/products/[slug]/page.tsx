import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ProductBreadcrumbs } from "@/components/product/product-breadcrumbs";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductJsonLd } from "@/components/product/product-json-ld";
import { ProductPageTracker } from "@/components/product/product-page-tracker";
import {
  ProductPurchaseControls,
  ProductStickyPurchaseBar,
} from "@/components/product/product-purchase-controls";
import { ProductSections } from "@/components/product/product-sections";
import { RelatedProducts } from "@/components/product/related-products";
import { birthstones } from "@/lib/data/birthstones";
import { siteConfig } from "@/lib/config/site";
import { getProductDetailBySlug } from "@/server/services/product-service";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return birthstones.map((stone) => ({ slug: stone.productSlug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductDetailBySlug(slug);

  if (!product) {
    return { title: "Product Not Found" };
  }

  const title = product.seoTitle ?? `${product.name} | VOYAGE`;
  const description =
    product.seoDescription ??
    `Discover the ${product.month} ${product.gemstone} birthstone necklace from VOYAGE.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${siteConfig.url}/products/${product.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/products/${product.slug}`,
      siteName: siteConfig.name,
      type: "website",
      images: product.images[0]
        ? [{ url: `${siteConfig.url}${product.images[0].url}`, alt: product.name }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: product.images[0]
        ? [`${siteConfig.url}${product.images[0].url}`]
        : undefined,
    },
  };
}

function RelatedProductsFallback() {
  return <div className="mt-24 h-32 bg-brand/[0.03]" aria-hidden />;
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductDetailBySlug(slug);

  if (!product) {
    notFound();
  }

  return (
    <>
      <ProductPageTracker product={product} />
      <ProductJsonLd product={product} />
      <section className="section-padding-lg pb-28 lg:pb-20">
        <div className="container-shell">
          <ProductBreadcrumbs product={product} />

          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 xl:gap-24">
            <ProductGallery images={product.images} productName={product.name} />

            <div className="lg:pt-4">
              <p className="text-sm text-muted">{product.month} Birthstone</p>
              <h1 className="display-font mt-3 text-[clamp(2.25rem,5vw,3.5rem)] leading-[1.05] text-brand">
                {product.name}
              </h1>
              <p className="mt-4 text-base text-muted">
                {product.gemstone} · {product.material}
              </p>

              <div className="mt-10 hidden lg:block">
                <ProductPurchaseControls product={product} />
              </div>
            </div>
          </div>

          <div className="mt-12 lg:hidden">
            <ProductPurchaseControls product={product} />
          </div>

          <ProductSections product={product} />

          <Suspense fallback={<RelatedProductsFallback />}>
            <RelatedProducts slug={product.slug} />
          </Suspense>
        </div>
      </section>

      <ProductStickyPurchaseBar product={product} />
    </>
  );
}
