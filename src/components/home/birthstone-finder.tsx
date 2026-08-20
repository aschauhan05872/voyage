import Link from "next/link";
import { birthstones } from "@/lib/data/birthstones";

export function BirthstoneFinder() {
  return (
    <section id="finder" className="section-padding">
      <div className="container-shell">
        <div className="max-w-xl">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">Birthstone Finder</p>
          <h2 className="display-font mt-3 text-4xl text-brand md:text-5xl">
            What&apos;s Your Birthstone?
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {birthstones.map((stone) => (
            <Link
              key={stone.month}
              href={`/products/${stone.slug}`}
              className="group card-surface flex flex-col items-center gap-3 p-4 text-center transition hover:-translate-y-0.5 hover:shadow-sm"
            >
              <span
                className="h-10 w-10 rounded-full border border-line shadow-inner"
                style={{ backgroundColor: stone.color }}
                aria-hidden
              />
              <span className="text-sm font-medium">{stone.month}</span>
              <span className="text-xs text-muted">{stone.gemstone}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
