/** Configurable business policies — update via env or admin later. */
export const businessConfig = {
  packaging: {
    heading: "Your Voyage Gift Experience",
    items: [
      "Birthstone pendant necklace",
      "Jewelry pouch",
      "Story card",
      "Premium VOYAGE presentation",
    ] as const,
  },
  shipping: {
    shipsFrom: process.env.NEXT_PUBLIC_SHIPS_FROM ?? "",
    summary:
      process.env.NEXT_PUBLIC_SHIPPING_SUMMARY ??
      "Shipping options and delivery estimates are confirmed at checkout.",
    tracking: "Tracking is provided when your order ships.",
    cost: "Shipping is calculated at checkout.",
  },
  returns: {
    windowDays: process.env.NEXT_PUBLIC_RETURN_WINDOW_DAYS
      ? Number(process.env.NEXT_PUBLIC_RETURN_WINDOW_DAYS)
      : null,
    summary:
      process.env.NEXT_PUBLIC_RETURN_SUMMARY ??
      "Return eligibility and instructions are available on our Returns page.",
    policyPath: "/returns",
  },
} as const;
