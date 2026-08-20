import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckoutOrderSummary } from "@/components/checkout/checkout-order-summary";
import { getCheckoutSessionFromCookie } from "@/lib/checkout/session-cookie";
import { revalidateCheckoutSession } from "@/server/services/checkout-service";

export async function CheckoutPaymentPageContent() {
  const session = await getCheckoutSessionFromCookie();

  if (!session || session.status !== "ready_for_payment") {
    redirect("/checkout");
  }

  const revalidated = await revalidateCheckoutSession(session);

  if (!revalidated.ok) {
    redirect(
      revalidated.reason === "expired"
        ? "/checkout"
        : "/cart",
    );
  }

  const { session: authoritativeSession, totals } = revalidated;

  return (
    <section className="section-padding-lg">
      <div className="container-shell max-w-5xl">
        <h1 className="display-font text-4xl text-brand md:text-5xl">Continue to Payment</h1>
        <p className="editorial-lead mt-4">
          Your checkout is prepared. Secure payment arrives in the next phase.
        </p>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <div className="border border-line p-6">
              <p className="text-sm text-muted">Prepared for</p>
              <p className="mt-2 text-brand">{authoritativeSession.email}</p>
              <p className="mt-4 text-sm text-muted">Shipping to</p>
              <p className="mt-2 text-sm text-brand">
                {authoritativeSession.shippingAddress.firstName}{" "}
                {authoritativeSession.shippingAddress.lastName}
                <br />
                {authoritativeSession.shippingAddress.line1}
                {authoritativeSession.shippingAddress.line2 ? (
                  <>
                    <br />
                    {authoritativeSession.shippingAddress.line2}
                  </>
                ) : null}
                <br />
                {authoritativeSession.shippingAddress.city},{" "}
                {authoritativeSession.shippingAddress.state}{" "}
                {authoritativeSession.shippingAddress.postalCode}
              </p>
            </div>

            <p className="text-sm text-muted">
              Payment processing will be connected in Phase 7. Totals shown here were
              revalidated against current product prices and inventory before display.
            </p>

            <Link href="/checkout" className="btn-secondary inline-flex">
              Back to Checkout
            </Link>
          </div>

          <CheckoutOrderSummary
            items={authoritativeSession.cartItems}
            subtotal={totals.subtotal}
            shippingLabel={
              totals.shipping > 0 ? undefined : "Calculated at checkout"
            }
            taxLabel={totals.tax > 0 ? undefined : "Calculated at checkout"}
            shippingAmount={totals.shipping}
            taxAmount={totals.tax}
            showTotal={totals.totalsFinalized}
            estimatedTotal={totals.totalsFinalized ? undefined : totals.subtotal}
          />
        </div>
      </div>
    </section>
  );
}
