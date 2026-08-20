"use client";

import Link from "next/link";
import Image from "next/image";
import {
  birthstones,
  getBirthstoneProductPath,
  type Birthstone,
} from "@/lib/data/birthstones";
import { trackEvent } from "@/lib/integrations/analytics-client";

function handleBirthstoneSelect(stone: Birthstone) {
  trackEvent("birthstone_selected", {
    month: stone.month,
    gemstone: stone.gemstone,
    product_slug: stone.productSlug,
  });
}

export function BirthstoneFinder() {
  return (
    <section id="finder" className="section-padding" aria-labelledby="birthstone-finder-heading">
      <div className="container-shell">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.2em] text-muted">Birthstone Finder</p>
          <h2 id="birthstone-finder-heading" className="display-font mt-3 text-4xl text-brand md:text-5xl">
            What&apos;s Your Birthstone?
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted md:text-base">
            Find the gemstone that represents your month — or choose one for someone special.
          </p>
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {birthstones.map((stone) => (
            <li key={stone.monthSlug}>
              <Link
                href={getBirthstoneProductPath(stone)}
                onClick={() => handleBirthstoneSelect(stone)}
                className="group card-surface flex flex-col items-center gap-3 p-4 text-center transition motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--champagne-gold)]"
                aria-label={`${stone.month} birthstone, ${stone.gemstone}`}
              >
                <span className="relative h-10 w-10 overflow-hidden rounded-full border border-line shadow-inner">
                  <Image
                    src={stone.image}
                    alt=""
                    fill
                    sizes="40px"
                    className="object-cover"
                    aria-hidden
                  />
                  <span
                    className="absolute inset-0 rounded-full opacity-60"
                    style={{ backgroundColor: stone.color }}
                    aria-hidden
                  />
                </span>
                <span className="text-sm font-medium">{stone.month}</span>
                <span className="text-xs text-muted">{stone.gemstone}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
