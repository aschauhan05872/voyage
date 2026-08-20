"use client";

import Image from "next/image";
import Link from "next/link";
import type { CollectionBirthstoneItem } from "@/lib/data/collection";
import { trackEvent } from "@/lib/integrations/analytics-client";

type BirthstoneNavProps = {
  items: CollectionBirthstoneItem[];
  activeMonth: string;
  onSelectMonth: (monthSlug: string) => void;
};

export function BirthstoneNav({ items, activeMonth, onSelectMonth }: BirthstoneNavProps) {
  return (
    <nav id="finder" aria-label="Birthstone months" className="mt-8">
      <ul className="flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <li className="shrink-0">
          <button
            type="button"
            onClick={() => onSelectMonth("all")}
            className={`min-h-11 rounded-full border px-4 py-2 text-xs uppercase tracking-[0.12em] transition ${
              activeMonth === "all"
                ? "border-brand bg-brand text-[var(--warm-ivory)]"
                : "border-line bg-white/50 text-brand hover:border-brand"
            }`}
          >
            All
          </button>
        </li>
        {items.map((item) => (
          <li key={item.monthSlug} className="shrink-0">
            <button
              type="button"
              onClick={() => {
                trackEvent("birthstone_selected", {
                  month: item.month,
                  gemstone: item.gemstone,
                  availability: item.availability,
                });
                onSelectMonth(item.monthSlug);
              }}
              className={`flex min-h-11 items-center gap-2 rounded-full border px-3 py-2 text-xs uppercase tracking-[0.1em] transition ${
                activeMonth === item.monthSlug
                  ? "border-brand bg-brand text-[var(--warm-ivory)]"
                  : "border-line bg-white/50 text-brand hover:border-brand"
              }`}
              aria-current={activeMonth === item.monthSlug ? "true" : undefined}
            >
              <span className="relative h-5 w-5 overflow-hidden rounded-full border border-line">
                <Image src={item.image} alt="" fill sizes="20px" className="object-cover" aria-hidden />
              </span>
              {item.month.slice(0, 3)}
            </button>
          </li>
        ))}
      </ul>

      {activeMonth !== "all" ? (
        <div className="mt-4">
          {(() => {
            const active = items.find((item) => item.monthSlug === activeMonth);
            if (!active) return null;
            if (active.availability === "available" && active.product) {
              const product = active.product;
              return (
                <Link
                  href={`/products/${active.productSlug}`}
                  className="btn-primary inline-flex text-sm"
                  onClick={() =>
                    trackEvent("select_item", {
                      product_id: product.id,
                      product_name: product.name,
                      price: product.price,
                      month: active.month,
                      gemstone: active.gemstone,
                    })
                  }
                >
                  Shop {active.gemstone}
                </Link>
              );
            }
            return (
              <p className="text-sm text-muted">
                {active.gemstone} — <span className="font-medium text-brand">Coming Soon</span>
              </p>
            );
          })()}
        </div>
      ) : null}
    </nav>
  );
}
