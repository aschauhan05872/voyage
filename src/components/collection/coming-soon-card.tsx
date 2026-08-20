import Image from "next/image";
import type { CollectionBirthstoneItem } from "@/lib/data/collection";
import { NotifyMeForm } from "@/components/collection/notify-me-form";

type ComingSoonCardProps = {
  item: CollectionBirthstoneItem;
};

export function ComingSoonCard({ item }: ComingSoonCardProps) {
  return (
    <article className="card-surface flex h-full flex-col p-5" aria-labelledby={`coming-soon-${item.monthSlug}`}>
      <div className="relative mx-auto aspect-square w-24 overflow-hidden rounded-full border border-line">
        <Image
          src={item.image}
          alt=""
          fill
          sizes="96px"
          className="object-cover"
          aria-hidden
        />
        <span
          className="absolute inset-0 rounded-full opacity-50"
          style={{ backgroundColor: item.color }}
          aria-hidden
        />
      </div>
      <p className="mt-4 text-xs uppercase tracking-[0.14em] text-muted">{item.month}</p>
      <h3 id={`coming-soon-${item.monthSlug}`} className="display-font text-xl text-brand">
        {item.gemstone}
      </h3>
      <p className="mt-2 text-sm font-medium text-brand">Coming Soon</p>
      <p className="mt-2 text-sm leading-relaxed text-muted">
        We&apos;re preparing something meaningful for this month.
      </p>
      <NotifyMeForm month={item.month} gemstone={item.gemstone} />
    </article>
  );
}
