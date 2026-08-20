import type { Metadata } from "next";
import { CheckoutPageView } from "@/components/checkout/checkout-page-view";

export const metadata: Metadata = {
  title: "Checkout | VOYAGE",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return <CheckoutPageView />;
}
