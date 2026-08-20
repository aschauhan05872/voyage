import { ProductCard } from "@/components/storefront/product-card";
import { getFeaturedProducts } from "@/server/services/product-service";

export async function FeaturedProducts() {
  const products = await getFeaturedProducts(3);

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="section-padding">
      <div className="container-shell">
        <div className="max-w-xl">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">Featured</p>
          <h2 className="display-font mt-3 text-4xl text-brand md:text-5xl">
            Discover the Collection
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}
