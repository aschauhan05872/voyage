import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "The Birthstone Collection",
  description: "12 months. 12 stories. One meaningful gift.",
};

export default function BirthstonesCollectionPage() {
  return (
    <section className="section-padding">
      <div className="container-shell">
        <p className="text-xs uppercase tracking-[0.2em] text-muted">Collection</p>
        <h1 className="display-font mt-3 text-4xl text-brand md:text-5xl">
          The Birthstone Collection
        </h1>
        <p className="mt-4 max-w-2xl text-muted">
          12 months. 12 stories. One meaningful gift.
        </p>
        <p className="mt-8 text-sm text-muted">
          Product grid — Phase 3 (data-driven from database).
        </p>
      </div>
    </section>
  );
}
