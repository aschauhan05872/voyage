import Image from "next/image";
import Link from "next/link";

export function CartEmptyState() {
  return (
    <section className="mx-auto max-w-xl text-center">
      <div className="relative mx-auto aspect-[4/3] max-w-sm overflow-hidden bg-[rgba(16,42,36,0.04)]">
        <Image
          src="/placeholders/packaging-gift-set.svg"
          alt=""
          fill
          sizes="(max-width: 640px) 80vw, 384px"
          className="object-cover"
          aria-hidden
        />
      </div>
      <h1 className="display-font mt-10 text-4xl text-brand md:text-5xl">
        Your Journey Starts Here
      </h1>
      <p className="editorial-lead mx-auto mt-6">
        Discover a meaningful piece chosen for your story or someone special.
      </p>
      <Link href="/collections/birthstones" className="btn-primary mt-10 inline-flex">
        Explore Birthstones
      </Link>
    </section>
  );
}
