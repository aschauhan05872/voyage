import Link from "next/link";
import type { ProductDetail } from "@/lib/data/product-detail";

type ProductBreadcrumbsProps = {
  product: ProductDetail;
};

export function ProductBreadcrumbs({ product }: ProductBreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="mb-10 text-sm text-muted">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link href="/collections/birthstones" className="hover:text-brand">
            Birthstone Collection
          </Link>
        </li>
        <li aria-hidden className="text-muted/60">
          /
        </li>
        <li>
          <Link href="/collections/birthstones#finder" className="hover:text-brand">
            {product.month}
          </Link>
        </li>
        <li aria-hidden className="text-muted/60">
          /
        </li>
        <li className="text-brand">{product.gemstone}</li>
      </ol>
    </nav>
  );
}
