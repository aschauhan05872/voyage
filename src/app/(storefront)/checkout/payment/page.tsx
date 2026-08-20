import type { Metadata } from "next";
import { CheckoutPaymentPageContent } from "@/components/checkout/checkout-payment-page";

export const metadata: Metadata = {
  title: "Payment | VOYAGE",
  robots: { index: false, follow: false },
};

export default function CheckoutPaymentPage() {
  return <CheckoutPaymentPageContent />;
}
