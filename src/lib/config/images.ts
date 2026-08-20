import { siteConfig } from "@/lib/config/site";

/** Replace paths with final photography without changing components. */
export const imageConfig = {
  hero: {
    desktop: "/placeholders/hero-desktop.svg",
    mobile: "/placeholders/hero-mobile.svg",
    alt: "VOYAGE birthstone pendant necklace — premium jewelry gift",
  },
  story: {
    src: "/placeholders/story-editorial.svg",
    alt: "VOYAGE birthstone jewelry styled as a meaningful gift",
  },
  packaging: {
    src: "/placeholders/packaging-gift-set.svg",
    alt: "VOYAGE gift packaging with branded box, pouch, and story card",
  },
  productFallback: "/placeholders/product-fallback.svg",
} as const;

export const openGraphDefaults = {
  title: "VOYAGE — Meaningful Gifts. Greater Journeys.",
  description:
    "Shop premium birthstone jewelry from VOYAGE. Natural gemstones and 925 sterling silver pendants — meaningful gifts for every journey.",
  image: `${siteConfig.url}/placeholders/og-home.svg`,
} as const;
