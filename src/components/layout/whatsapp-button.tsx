"use client";

import { siteConfig } from "@/lib/config/site";
import { analytics } from "@/lib/integrations/analytics";

export function WhatsAppButton() {
  if (!siteConfig.whatsappNumber) return null;

  const href = `https://wa.me/${siteConfig.whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(siteConfig.whatsappMessage)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-brand text-sm text-[var(--warm-ivory)] shadow-lg"
      aria-label="Contact VOYAGE on WhatsApp"
      onClick={() => analytics.track("whatsapp_click")}
    >
      <span aria-hidden="true">WA</span>
    </a>
  );
}
