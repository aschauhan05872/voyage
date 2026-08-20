import Link from "next/link";
import { HeroImage } from "@/components/home/hero-image";

export function HeroSection() {
  return (
    <section className="relative min-h-[min(88vh,760px)] overflow-hidden bg-brand text-[var(--warm-ivory)] md:min-h-[78vh]">
      <HeroImage />
      <div className="container-shell relative flex min-h-[min(88vh,760px)] flex-col justify-end pb-12 pt-24 md:min-h-[78vh] md:pb-20 md:pt-28">
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--champagne-gold)]">
          Meaningful Gifts. Greater Journeys.
        </p>
        <h1 className="display-font mt-4 max-w-2xl text-[clamp(2.75rem,8vw,4.5rem)] leading-[0.95]">
          Wear Your Story.
        </h1>
        <p className="mt-5 max-w-md text-base leading-relaxed text-[var(--warm-taupe)] md:max-w-xl md:text-lg">
          Natural gemstones. 925 sterling silver.
          <br className="hidden sm:block" />
          A meaningful gift for every journey.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link href="/collections/birthstones" className="btn-primary">
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
