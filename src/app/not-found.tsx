import Link from "next/link";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { CartProvider } from "@/components/cart/cart-provider";
import { SiteFooter } from "@/components/layout/site-chrome";
import { SiteHeader } from "@/components/layout/site-header";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";

export default function NotFound() {
  return (
    <CartProvider>
      <SiteHeader />
      <CartDrawer />
      <main id="main-content" className="flex-1">
        <section className="section-padding-lg">
          <div className="container-shell max-w-xl text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-muted">404</p>
            <h1 className="display-font mt-4 text-4xl text-brand md:text-5xl">
              That page has wandered.
            </h1>
            <p className="editorial-lead mx-auto mt-6">
              The path you followed isn&apos;t part of the VOYAGE collection. Let us guide you
              back to something meaningful.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/" className="btn-primary inline-flex min-w-[200px] justify-center">
                Return Home
              </Link>
              <Link
                href="/collections/birthstones"
                className="btn-secondary inline-flex min-w-[200px] justify-center"
              >
                Browse Birthstones
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
      <WhatsAppButton />
    </CartProvider>
  );
}
