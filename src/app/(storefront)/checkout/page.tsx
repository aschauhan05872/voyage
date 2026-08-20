import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout | VOYAGE",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <section className="section-padding">
      <div className="container-shell max-w-3xl">
        <h1 className="display-font text-4xl text-brand md:text-5xl">Checkout</h1>
        <p className="editorial-lead mt-6">
          Your journey continues here. Payment and order processing arrive in the next phase.
        </p>
      </div>
    </section>
  );
}
