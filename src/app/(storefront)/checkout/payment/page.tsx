import { redirect } from "next/navigation";
import { getAssistanceConfirmationFromCookie } from "@/lib/checkout/confirmation-cookie";

export default async function CheckoutPaymentPage() {
  const confirmation = await getAssistanceConfirmationFromCookie();
  if (confirmation) {
    redirect("/checkout/confirmation");
  }
  redirect("/checkout");
}
