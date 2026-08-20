export const siteConfig = {
  name: "VOYAGE",
  tagline: "Meaningful Gifts. Greater Journeys.",
  description:
    "Premium birthstone jewelry — natural gemstones and 925 sterling silver, crafted as meaningful gifts for every journey.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  currency: process.env.NEXT_PUBLIC_CURRENCY ?? "USD",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "",
  whatsappMessage: "Hi VOYAGE, I need help with my order.",
  social: {
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "",
    tiktok: process.env.NEXT_PUBLIC_TIKTOK_URL ?? "",
    pinterest: process.env.NEXT_PUBLIC_PINTEREST_URL ?? "",
  },
  emailCapture: {
    heading: "Join the Voyage",
    subheading:
      "Be the first to discover new stories, gifts and collections.",
    incentive: "10% off your first order.",
  },
} as const;

export const brandColors = {
  forestGreen: "#102A24",
  warmIvory: "#F7F2E9",
  champagneGold: "#C6A66B",
  charcoal: "#20201D",
  warmTaupe: "#A99A87",
} as const;
