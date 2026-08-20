import type { Metadata } from "next";
import { CollectionPageTracker } from "@/components/collection/collection-page-tracker";
import { CollectionView } from "@/components/collection/collection-view";
import { siteConfig } from "@/lib/config/site";
import { getCollectionPageData } from "@/server/services/product-service";

export const metadata: Metadata = {
  title: "Birthstone Jewelry Collection",
  description:
    "Shop the VOYAGE Birthstone Collection — meaningful birthstone jewelry and premium gifts crafted with natural gemstones and 925 sterling silver.",
  alternates: {
    canonical: `${siteConfig.url}/collections/birthstones`,
  },
  openGraph: {
    title: "Birthstone Jewelry Collection | VOYAGE",
    description:
      "Discover meaningful birthstone jewelry from VOYAGE. 12 months, 12 stories — premium gifts for every journey.",
    url: `${siteConfig.url}/collections/birthstones`,
    siteName: siteConfig.name,
    type: "website",
  },
};

export default async function BirthstonesCollectionPage() {
  const data = await getCollectionPageData();

  return (
    <>
      <CollectionPageTracker />
      <section className="section-padding">
        <div className="container-shell">
          <header className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">Collection</p>
            <h1 className="display-font mt-3 text-4xl text-brand md:text-5xl">
              The Birthstone Collection
            </h1>
            <p className="mt-4 text-base text-muted md:text-lg">
              12 months. 12 stories. One meaningful gift.
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted md:text-base">
              Discover a gemstone chosen for your birth month — or find a meaningful gift for
              someone special.
            </p>
          </header>

          <CollectionView data={data} />
        </div>
      </section>
    </>
  );
}
