import Link from "next/link";

export default function ProductNotFound() {
  return (
    <section className="section-padding">
      <div className="container-shell max-w-xl text-center">
        <h1 className="display-font text-4xl text-brand">This piece could not be found.</h1>
        <p className="mt-4 text-sm text-muted">
          The product you&apos;re looking for may have moved or is not yet available.
        </p>
        <Link href="/collections/birthstones" className="btn-primary mt-8 inline-flex">
          Explore the Birthstone Collection
        </Link>
      </div>
    </section>
  );
}
