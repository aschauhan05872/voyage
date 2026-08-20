import Link from "next/link";

export default function GiftsPage() {
  return (
    <section className="section-padding">
      <div className="container-shell max-w-3xl">
        <h1 className="display-font text-4xl text-brand md:text-5xl">Gifts</h1>
        <p className="mt-6 text-muted">
          Curated gifting guides and birthstone recommendations are on their way. In the
          meantime, explore our birthstone collection for meaningful gifts.
        </p>
        <Link href="/collections/birthstones" className="btn-primary mt-8 inline-flex">
          Explore Birthstones
        </Link>
      </div>
    </section>
  );
}
