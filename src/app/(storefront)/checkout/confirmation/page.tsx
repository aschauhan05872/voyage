import type { Metadata } from "next";
import { CheckoutConfirmationContent } from "@/components/checkout/checkout-confirmation-page";

export const metadata: Metadata = {
  title: "Request Received | VOYAGE",
  robots: { index: false, follow: false },
};

export default function CheckoutConfirmationPage() {
  return <CheckoutConfirmationContent />;
}
