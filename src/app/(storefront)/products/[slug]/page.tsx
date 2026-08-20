import type { Metadata } from "next";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: slug.replace(/-/g, " "),
    description: "VOYAGE birthstone pendant necklace.",
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;

  return (
    <section className="section-padding">
      <div className="container-shell">
        <p className="text-xs uppercase tracking-[0.2em] text-muted">Product</p>
        <h1 className="display-font mt-3 text-4xl capitalize text-brand md:text-5xl">
          {slug.replace(/-/g, " ")}
        </h1>
        <p className="mt-6 text-sm text-muted">
          Full product page with gallery, add to cart, and related products — Phase 4.
        </p>
      </div>
    </section>
  );
}
