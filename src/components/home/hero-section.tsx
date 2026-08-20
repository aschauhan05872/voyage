import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative min-h-[78vh] overflow-hidden bg-brand text-[var(--warm-ivory)]">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "linear-gradient(var(--hero-overlay), var(--hero-overlay)), radial-gradient(circle at 70% 20%, rgba(198,166,107,0.25), transparent 40%), linear-gradient(135deg, #0a1f1a 0%, #102a24 55%, #1a3d32 100%)",
        }}
        aria-hidden
      />
      <div className="container-shell relative flex min-h-[78vh] flex-col justify-end pb-16 pt-28 md:pb-20">
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--champagne-gold)]">
          Meaningful Gifts. Greater Journeys.
        </p>
        <h1 className="display-font mt-4 max-w-2xl text-5xl leading-none md:text-7xl">
          Wear Your Story.
        </h1>
        <p className="mt-5 max-w-xl text-base text-[var(--warm-taupe)] md:text-lg">
          Natural gemstones. 925 sterling silver. A meaningful gift for every journey.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/collections/birthstones#finder" className="btn-primary">
            Discover Your Birthstone
          </Link>
          <Link
            href="/collections/birthstones"
            className="btn-secondary border-[var(--warm-ivory)] text-[var(--warm-ivory)] hover:bg-[var(--warm-ivory)] hover:text-brand"
          >
            Shop the Collection
          </Link>
        </div>
      </div>
    </section>
  );
}
