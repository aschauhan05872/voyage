"use client";

import { useState } from "react";
import Image from "next/image";
import type { ProductImageView } from "@/lib/data/product-detail";

type ProductGalleryProps = {
  images: ProductImageView[];
  productName: string;
};

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const sorted = [...images].sort((a, b) => a.sortOrder - b.sortOrder);
  const [activeIndex, setActiveIndex] = useState(0);
  const active = sorted[activeIndex] ?? sorted[0];

  if (!active) {
    return (
      <div
        className="relative aspect-[4/5] bg-[rgba(16,42,36,0.04)]"
        aria-label={`${productName} image placeholder`}
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="relative aspect-[4/5] overflow-hidden bg-[rgba(16,42,36,0.04)]">
        <Image
          key={active.url}
          src={active.url}
          alt={active.alt || productName}
          fill
          priority={activeIndex === 0}
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover motion-safe:transition-transform motion-safe:duration-700 motion-safe:ease-out"
        />
      </div>

      {sorted.length > 1 ? (
        <ul
          className="flex gap-3 overflow-x-auto pb-1"
          role="tablist"
          aria-label={`${productName} image gallery`}
        >
          {sorted.map((image, index) => (
            <li key={`${image.url}-${index}`} role="presentation" className="shrink-0">
              <button
                type="button"
                role="tab"
                aria-selected={index === activeIndex}
                aria-label={image.alt || `${productName} image ${index + 1}`}
                onClick={() => setActiveIndex(index)}
                className={`relative h-16 w-16 overflow-hidden transition-opacity duration-300 ${
                  index === activeIndex ? "opacity-100 ring-1 ring-brand/40" : "opacity-55 hover:opacity-80"
                }`}
              >
                <Image
                  src={image.url}
                  alt=""
                  fill
                  sizes="64px"
                  className="object-cover"
                  aria-hidden
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
