import { siteConfig } from "@/lib/config/site";
import type { ProductDetail } from "@/lib/data/product-detail";

type ProductJsonLdProps = {
  product: ProductDetail;
};

export function ProductJsonLd({ product }: ProductJsonLdProps) {
  if (product.availability !== "available") {
    return null;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((image) => `${siteConfig.url}${image.url}`),
    sku: product.sku,
    brand: {
      "@type": "Brand",
      name: siteConfig.name,
    },
    offers: {
      "@type": "Offer",
      url: `${siteConfig.url}/products/${product.slug}`,
      priceCurrency: siteConfig.currency,
      price: product.price,
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
