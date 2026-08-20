import { SiteFooter, SiteHeader } from "@/components/layout/site-chrome";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <WhatsAppButton />
    </>
  );
}
