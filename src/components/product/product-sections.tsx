import Link from "next/link";
import { businessConfig } from "@/lib/config/business";
import type { ProductDetail } from "@/lib/data/product-detail";
import Image from "next/image";

type ProductSectionsProps = {
  product: ProductDetail;
};

function DetailAccordion({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <details className="border-b border-line py-5 group">
      <summary className="display-font cursor-pointer list-none text-xl text-brand [&::-webkit-details-marker]:hidden">
        {title}
      </summary>
      <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted">{children}</div>
    </details>
  );
}

export function ProductSections({ product }: ProductSectionsProps) {
  return (
    <div className="mt-24 space-y-24">
      {product.symbolism ? (
        <section aria-labelledby="birthstone-context-heading" className="max-w-2xl">
          <p className="text-sm text-muted">{product.month}</p>
          <h2 id="birthstone-context-heading" className="display-font mt-2 text-4xl text-brand md:text-5xl">
            {product.gemstone}
          </h2>
          <p className="editorial-lead mt-6">{product.symbolism}</p>
        </section>
      ) : null}

      {product.story ? (
        <section aria-labelledby="product-story-heading" className="max-w-2xl">
          <h2 id="product-story-heading" className="display-font text-3xl text-brand md:text-4xl">
            The Story Behind Your Stone
          </h2>
          <p className="editorial-lead mt-6">{product.story}</p>
        </section>
      ) : null}

      <section aria-labelledby="gift-heading" className="max-w-2xl">
        <h2 id="gift-heading" className="display-font text-3xl text-brand md:text-4xl">
          Made for Meaningful Moments
        </h2>
        <p className="editorial-lead mt-6">
          Imagine giving this for a birthday, anniversary, graduation, or a quiet moment that
          deserves something personal. Who would you choose it for?
        </p>
      </section>

      <section
        aria-labelledby="packaging-heading"
        className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]"
      >
        <div className="relative min-h-[320px] overflow-hidden bg-[rgba(16,42,36,0.04)] lg:min-h-[420px]">
          <Image
            src="/placeholders/packaging-gift-set.svg"
            alt="VOYAGE gift packaging with jewelry pouch and story card"
            fill
            sizes="(max-width: 1024px) 100vw, 55vw"
            className="object-cover"
          />
        </div>
        <div className="max-w-md">
          <h2 id="packaging-heading" className="display-font text-3xl text-brand md:text-4xl">
            {businessConfig.packaging.heading}
          </h2>
          <p className="editorial-lead mt-6">
            Every piece arrives ready to give — presented with the care and intention of a
            meaningful gift.
          </p>
        </div>
      </section>

      <section aria-labelledby="details-heading" className="max-w-2xl">
        <h2 id="details-heading" className="display-font text-3xl text-brand md:text-4xl">
          The Details
        </h2>
        <div className="mt-8">
          <DetailAccordion title="Materials">
            <p>{product.material}</p>
          </DetailAccordion>

          {product.careInstructions ? (
            <DetailAccordion title="Care">
              <p>{product.careInstructions}</p>
            </DetailAccordion>
          ) : null}

          <DetailAccordion title="Shipping & delivery">
            {businessConfig.shipping.shipsFrom ? (
              <p>Ships from {businessConfig.shipping.shipsFrom}</p>
            ) : null}
            <p>{businessConfig.shipping.summary}</p>
          </DetailAccordion>

          <DetailAccordion title="Returns">
            <p>{businessConfig.returns.summary}</p>
            <Link href={businessConfig.returns.policyPath} className="text-link inline-block pt-1">
              Read our return policy
            </Link>
          </DetailAccordion>
        </div>
      </section>
    </div>
  );
}
