import { SiteFooter, SiteHeader } from "@/components/layout/site-chrome";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";
import { CartProvider } from "@/components/cart/cart-provider";

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <WhatsAppButton />
    </CartProvider>
  );
}
