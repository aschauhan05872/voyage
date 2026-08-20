"use client";

import { useMemo, useState } from "react";
import { ProductCard } from "@/components/storefront/product-card";
import { BirthstoneNav } from "@/components/collection/birthstone-nav";
import { ComingSoonCard } from "@/components/collection/coming-soon-card";
import type {
  CollectionPageData,
  PriceRangeOption,
} from "@/lib/data/collection";
import type { ProductSummary } from "@/lib/data/product-catalog";
import { trackEvent } from "@/lib/integrations/analytics-client";

type CollectionViewProps = {
  data: CollectionPageData;
};

type SortOption = "featured" | "price-asc" | "price-desc" | "newest";

function applyPriceFilter(
  products: ProductSummary[],
  priceFilter: string,
  priceRanges: PriceRangeOption[],
): ProductSummary[] {
  if (priceFilter === "all") return products;

  const range = priceRanges.find((option) => option.id === priceFilter);
  if (!range) return products;

  return products.filter((product) => {
    if (range.min !== undefined && product.price < range.min) return false;
    if (range.max !== undefined && product.price > range.max) return false;
    return true;
  });
}

function sortProducts(products: ProductSummary[], sort: SortOption): ProductSummary[] {
  const sorted = [...products];

  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "newest":
      return sorted.sort((a, b) => {
        const aTime = a.createdAt ? Date.parse(a.createdAt) : 0;
        const bTime = b.createdAt ? Date.parse(b.createdAt) : 0;
        return bTime - aTime;
      });
    case "featured":
    default:
      return sorted.sort((a, b) => {
        const featuredDiff = Number(Boolean(b.featured)) - Number(Boolean(a.featured));
        if (featuredDiff !== 0) return featuredDiff;
        return a.name.localeCompare(b.name);
      });
  }
}

export function CollectionView({ data }: CollectionViewProps) {
  const [monthFilter, setMonthFilter] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
  const [sort, setSort] = useState<SortOption>("featured");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    let products = data.products;

    if (monthFilter !== "all") {
      products = products.filter((product) => {
        const stone = data.birthstones.find((item) => item.monthSlug === monthFilter);
        return stone ? product.slug === stone.productSlug : false;
      });
    }

    products = applyPriceFilter(products, priceFilter, data.priceRanges);
    return sortProducts(products, sort);
  }, [data, monthFilter, priceFilter, sort]);

  const activeBirthstone = data.birthstones.find((item) => item.monthSlug === monthFilter);
  const showComingSoon =
    monthFilter !== "all" &&
    activeBirthstone?.availability === "coming_soon" &&
    filteredProducts.length === 0;

  const showEmptyState =
    filteredProducts.length === 0 && !showComingSoon;

  function clearFilters() {
    setMonthFilter("all");
    setPriceFilter("all");
    setSort("featured");
    trackEvent("filter_used", { filter: "clear_all" });
  }

  function handleMonthChange(monthSlug: string) {
    setMonthFilter(monthSlug);
    trackEvent("filter_used", {
      filter: "month",
      value: monthSlug,
    });
  }

  function handlePriceChange(value: string) {
    setPriceFilter(value);
    trackEvent("filter_used", {
      filter: "price",
      value,
    });
  }

  function handleSortChange(value: SortOption) {
    setSort(value);
    trackEvent("sort_used", { sort: value });
  }

  const filterControls = (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <label className="block text-sm">
        <span className="mb-2 block text-xs uppercase tracking-[0.14em] text-muted">Birth month</span>
        <select
          value={monthFilter}
          onChange={(event) => handleMonthChange(event.target.value)}
          className="w-full border border-line bg-white/70 px-3 py-2.5"
          aria-label="Filter by birth month"
        >
          <option value="all">All months</option>
          {data.birthstones.map((item) => (
            <option key={item.monthSlug} value={item.monthSlug}>
              {item.month}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm">
        <span className="mb-2 block text-xs uppercase tracking-[0.14em] text-muted">Price</span>
        <select
          value={priceFilter}
          onChange={(event) => handlePriceChange(event.target.value)}
          className="w-full border border-line bg-white/70 px-3 py-2.5"
          aria-label="Filter by price"
        >
          {data.priceRanges.map((range) => (
            <option key={range.id} value={range.id}>
              {range.label}
            </option>
          ))}
        </select>
      </label>

      <label className="block text-sm">
        <span className="mb-2 block text-xs uppercase tracking-[0.14em] text-muted">Sort by</span>
        <select
          value={sort}
          onChange={(event) => handleSortChange(event.target.value as SortOption)}
          className="w-full border border-line bg-white/70 px-3 py-2.5"
          aria-label="Sort products"
        >
          <option value="featured">Featured</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
          {data.supportsNewestSort ? <option value="newest">Newest</option> : null}
        </select>
      </label>
    </div>
  );

  return (
    <>
      <BirthstoneNav
        items={data.birthstones}
        activeMonth={monthFilter}
        onSelectMonth={handleMonthChange}
      />

      <div className="mt-10 border-t border-line pt-8" id="products">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-muted">
            {filteredProducts.length} {filteredProducts.length === 1 ? "piece" : "pieces"}
          </p>
          <button
            type="button"
            className="btn-secondary min-h-10 px-4 text-xs uppercase tracking-[0.12em] lg:hidden"
            onClick={() => setFiltersOpen((open) => !open)}
            aria-expanded={filtersOpen}
            aria-controls="collection-filters"
          >
            Filters
          </button>
        </div>

        <div
          id="collection-filters"
          className={`mt-4 ${filtersOpen ? "block" : "hidden"} lg:block`}
        >
          {filterControls}
        </div>

        {showComingSoon && activeBirthstone ? (
          <div className="mt-10 grid max-w-md gap-4">
            <ComingSoonCard item={activeBirthstone} />
          </div>
        ) : null}

        {showEmptyState ? (
          <div className="mt-12 text-center">
            <h2 className="display-font text-3xl text-brand">No pieces found</h2>
            <p className="mt-3 text-sm text-muted">
              Try another birth month or adjust your filters.
            </p>
            <button type="button" onClick={clearFilters} className="btn-primary mt-6 inline-flex">
              Clear Filters
            </button>
          </div>
        ) : null}

        {filteredProducts.length > 0 ? (
          <ul className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-3">
            {filteredProducts.map((product, index) => (
              <li key={product.id}>
                <ProductCard
                  product={product}
                  priority={index < 2}
                  availabilityLabel="Available"
                />
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </>
  );
}
