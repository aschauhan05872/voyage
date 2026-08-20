import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckoutOrderSummary } from "@/components/checkout/checkout-order-summary";
import { getCheckoutSessionFromCookie } from "@/lib/checkout/session-cookie";

export async function CheckoutPaymentPageContent() {
  const session = await getCheckoutSessionFromCookie();

  if (!session || session.status !== "ready_for_payment") {
    redirect("/checkout");
  }

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
              <p className="mt-2 text-brand">{session.email}</p>
              <p className="mt-4 text-sm text-muted">Shipping to</p>
              <p className="mt-2 text-sm text-brand">
                {session.shippingAddress.firstName} {session.shippingAddress.lastName}
                <br />
                {session.shippingAddress.line1}
                {session.shippingAddress.line2 ? (
                  <>
                    <br />
                    {session.shippingAddress.line2}
                  </>
                ) : null}
                <br />
                {session.shippingAddress.city}, {session.shippingAddress.state}{" "}
                {session.shippingAddress.postalCode}
              </p>
            </div>

            <p className="text-sm text-muted">
              Payment processing will be connected in Phase 7. Your selections and totals have
              been validated on our server.
            </p>

            <Link href="/checkout" className="btn-secondary inline-flex">
              Back to Checkout
            </Link>
          </div>

          <CheckoutOrderSummary
            items={session.cartItems}
            subtotal={session.subtotal}
            shippingLabel={
              session.shippingAmount > 0 ? undefined : "Calculated at checkout"
            }
            taxLabel={session.taxAmount > 0 ? undefined : "Calculated at checkout"}
            shippingAmount={session.shippingAmount}
            taxAmount={session.taxAmount}
            showTotal
          />
        </div>
      </div>
    </section>
  );
}
