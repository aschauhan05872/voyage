import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { formatCartPrice } from "@/lib/cart/format-price";
import { getAssistanceConfirmationFromCookie } from "@/lib/checkout/confirmation-cookie";
import { businessConfig } from "@/lib/config/business";
import { siteConfig } from "@/lib/config/site";

function buildWhatsAppHref(): string | null {
  if (!siteConfig.whatsappNumber) return null;
  return `https://wa.me/${siteConfig.whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(siteConfig.whatsappMessage)}`;
}

export async function CheckoutConfirmationContent() {
  const confirmation = await getAssistanceConfirmationFromCookie();

  if (!confirmation) {
    redirect("/checkout");
  }

  const whatsappHref = buildWhatsAppHref();

  return (
    <section className="section-padding-lg">
      <div className="container-shell max-w-3xl">
        <h1 className="display-font text-4xl text-brand md:text-5xl">
          Your Request Has Been Received
        </h1>
        <p className="editorial-lead mt-6">Thank you for choosing VOYAGE.</p>
        <p className="mt-4 text-base leading-relaxed text-muted">
          Our dedicated payment team will contact you shortly using the email address and phone
          number provided during checkout to help you complete your order securely.
        </p>

        {!confirmation.persisted ? (
          <p className="mt-6 border border-line bg-[rgba(16,42,36,0.03)] px-4 py-3 text-sm text-muted">
            {process.env.NODE_ENV === "production"
              ? "We couldn't save your request. Please try again or contact VOYAGE."
              : "Development mode: request storage is unavailable. Production deployment requires persistent request storage."}
          </p>
        ) : null}

        <div className="mt-10 border border-line p-6">
          <p className="text-sm text-muted">Reference</p>
          <p className="display-font mt-2 text-2xl text-brand">{confirmation.requestNumber}</p>
        </div>

        <div className="mt-8 space-y-3 text-sm">
          <div className="flex justify-between gap-4 border-b border-line pb-3">
            <span className="text-muted">Email</span>
            <span className="text-brand">{confirmation.email}</span>
          </div>
          <div className="flex justify-between gap-4 border-b border-line pb-3">
            <span className="text-muted">Primary phone</span>
            <span className="text-brand">{confirmation.primaryPhoneMasked}</span>
          </div>
          {confirmation.secondaryPhoneProvided ? (
            <p className="pt-2 text-sm text-muted">
              Your secondary contact number has also been included for our team.
            </p>
          ) : null}
        </div>

        <div className="mt-12">
          <h2 className="display-font text-2xl text-brand">Your Selection</h2>
          <ul className="mt-6 space-y-6">
            {confirmation.items.map((item) => (
              <li
                key={item.productSlug}
                className="grid grid-cols-[72px_1fr_auto] items-start gap-4"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-[rgba(16,42,36,0.04)]">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt=""
                      fill
                      sizes="72px"
                      className="object-cover"
                    />
                  ) : null}
                </div>
                <div>
                  <p className="display-font text-base text-brand">{item.name}</p>
                  <p className="mt-1 text-sm text-muted">
                    {item.gemstone} · Qty {item.quantity}
                  </p>
                </div>
                <p className="text-sm text-brand">{formatCartPrice(item.lineTotal)}</p>
              </li>
            ))}
          </ul>

          <div className="mt-8 space-y-3 border-t border-line pt-6 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-muted">Subtotal</span>
              <span className="text-brand">{formatCartPrice(confirmation.subtotal)}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted">Shipping</span>
              <span className="text-muted">To be confirmed by our team</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted">Tax</span>
              <span className="text-muted">To be confirmed by our team</span>
            </div>
            <div className="flex justify-between gap-4 border-t border-line pt-4">
              <span className="text-muted">Payment</span>
              <span className="text-brand">To be arranged with VOYAGE</span>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
          <Link href="/collections/birthstones" className="btn-primary inline-flex justify-center">
            Continue Shopping
          </Link>
          {whatsappHref ? (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary inline-flex justify-center text-center"
            >
              Contact VOYAGE
            </a>
          ) : (
            <Link href="/contact" className="btn-secondary inline-flex justify-center text-center">
              Contact VOYAGE
            </Link>
          )}
          <Link href="/" className="btn-secondary inline-flex justify-center text-center">
            Return Home
          </Link>
        </div>

        <p className="mt-8 text-sm text-muted">
          Questions? Review our{" "}
          <Link href="/shipping" className="text-link">
            shipping
          </Link>{" "}
          and{" "}
          <Link href={businessConfig.returns.policyPath} className="text-link">
            returns
          </Link>{" "}
          policies anytime.
        </p>
      </div>
    </section>
  );
}
