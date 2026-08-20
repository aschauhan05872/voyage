import { ProductCard } from "@/components/storefront/product-card";
import { getRelatedProducts } from "@/server/services/product-service";

type RelatedProductsProps = {
  slug: string;
};

export async function RelatedProducts({ slug }: RelatedProductsProps) {
  const products = await getRelatedProducts(slug, 3);

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="mt-24 border-t border-line pt-20" aria-labelledby="related-heading">
      <h2 id="related-heading" className="display-font text-3xl text-brand md:text-4xl">
        Explore More Birthstones
      </h2>
      <ul className="mt-10 grid grid-cols-2 gap-5 md:grid-cols-3 md:gap-8">
        {products.map((product) => (
          <li key={product.id}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </section>
  );
}
