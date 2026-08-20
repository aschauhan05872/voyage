import { SiteFooter } from "@/components/layout/site-chrome";
import { SiteHeader } from "@/components/layout/site-header";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { CartProvider } from "@/components/cart/cart-provider";
import Link from "next/link";

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <Link href="#main-content" className="skip-link">
        Skip to content
      </Link>
      <SiteHeader />
      <CartDrawer />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <SiteFooter />
      <WhatsAppButton />
    </CartProvider>
  );
}
