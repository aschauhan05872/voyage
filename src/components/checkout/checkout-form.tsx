"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { nanoid } from "nanoid";
import { CheckoutOrderSummary } from "@/components/checkout/checkout-order-summary";
import { useCart } from "@/components/cart/cart-provider";
import { useCartLineActions } from "@/components/cart/use-cart-line-actions";
import { checkoutConfig, US_STATES } from "@/lib/config/checkout";
import { getActiveShippingMethods } from "@/lib/shipping/shipping-service";
import { siteConfig } from "@/lib/config/site";
import { trackEvent } from "@/lib/integrations/analytics-client";
import type { CheckoutAddressInput, CheckoutContactInput } from "@/lib/validation/checkout";

const inputClass =
  "w-full border border-line bg-transparent px-3 py-3 text-sm text-brand placeholder:text-muted/70";
const labelClass = "mb-2 block text-sm text-brand";

type FormState = {
  contact: CheckoutContactInput;
  shippingAddress: CheckoutAddressInput;
  billingSameAsShipping: boolean;
  billingAddress: CheckoutAddressInput;
  shippingMethodId: string;
  orderNotes: string;
  marketingConsent: boolean;
  termsAccepted: boolean;
};

const emptyAddress = (): CheckoutAddressInput => ({
  firstName: "",
  lastName: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postalCode: "",
  country: checkoutConfig.defaultCountry,
});

const initialFormState = (): FormState => ({
  contact: { email: "", phone: "" },
  shippingAddress: emptyAddress(),
  billingSameAsShipping: true,
  billingAddress: emptyAddress(),
  shippingMethodId: getActiveShippingMethods()[0]?.id ?? "standard",
  orderNotes: "",
  marketingConsent: false,
  termsAccepted: false,
});

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1 text-sm text-[#7a4545]" role="alert">
      {message}
    </p>
  );
}

export function CheckoutForm() {
  const router = useRouter();
  const { items, subtotal, validated, validating, canCheckout } = useCart();
  const { activeItems } = useCartLineActions();
  const shippingMethods = useMemo(() => getActiveShippingMethods(), []);

  const [form, setForm] = useState<FormState>(initialFormState);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [priceChanged, setPriceChanged] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [contactTracked, setContactTracked] = useState(false);
  const [addressTracked, setAddressTracked] = useState(false);
  const [shippingTracked, setShippingTracked] = useState(false);
  const idempotencyKey = useMemo(() => nanoid(), []);

  const summaryItems = validated?.items ?? activeItems;

  function updateContact(field: keyof CheckoutContactInput, value: string) {
    setForm((current) => ({
      ...current,
      contact: { ...current.contact, [field]: value },
    }));
  }

  function updateShipping(field: keyof CheckoutAddressInput, value: string) {
    setForm((current) => ({
      ...current,
      shippingAddress: { ...current.shippingAddress, [field]: value },
    }));
  }

  function updateBilling(field: keyof CheckoutAddressInput, value: string) {
    setForm((current) => ({
      ...current,
      billingAddress: { ...current.billingAddress, [field]: value },
    }));
  }

  function validateContactLocally(): boolean {
    const email = form.contact.email.trim();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFieldErrors((current) => ({
        ...current,
        "contact.email": "Please enter a valid email address.",
      }));
      return false;
    }
    if (checkoutConfig.phoneRequired && !form.contact.phone?.trim()) {
      setFieldErrors((current) => ({
        ...current,
        "contact.phone": "Phone number is required.",
      }));
      return false;
    }
    if (!contactTracked) {
      trackEvent("checkout_contact_entered", {
        item_count: items.reduce((sum, item) => sum + item.quantity, 0),
        currency: siteConfig.currency,
      });
      setContactTracked(true);
    }
    return true;
  }

  function validateAddressLocally(): boolean {
    const required: (keyof CheckoutAddressInput)[] = [
      "firstName",
      "lastName",
      "line1",
      "city",
      "state",
      "postalCode",
    ];
    let valid = true;
    const errors: Record<string, string> = {};

    for (const field of required) {
      const value = form.shippingAddress[field];
      if (!value || String(value).trim().length === 0) {
        errors[`shippingAddress.${field}`] = "This field is required.";
        valid = false;
      }
    }

    if (
      form.shippingAddress.postalCode &&
      !/^\d{5}(-\d{4})?$/.test(form.shippingAddress.postalCode.trim())
    ) {
      errors["shippingAddress.postalCode"] = "Please enter a valid ZIP code.";
      valid = false;
    }

    if (!form.billingSameAsShipping) {
      for (const field of required) {
        const value = form.billingAddress[field];
        if (!value || String(value).trim().length === 0) {
          errors[`billingAddress.${field}`] = "This field is required.";
          valid = false;
        }
      }
    }

    if (valid && !addressTracked) {
      trackEvent("checkout_address_entered", {
        item_count: items.reduce((sum, item) => sum + item.quantity, 0),
        currency: siteConfig.currency,
      });
      setAddressTracked(true);
    }

    setFieldErrors((current) => ({ ...current, ...errors }));
    return valid;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    setFieldErrors({});
    setPriceChanged(false);

    if (!canCheckout || items.length === 0) {
      setFormError("Your cart is empty or unavailable. Please review your cart.");
      return;
    }

    if (!validateContactLocally() || !validateAddressLocally()) {
      setFormError("Please check your information and try again.");
      return;
    }

    if (!form.termsAccepted) {
      setFieldErrors({ termsAccepted: "Please accept the terms to continue." });
      setFormError("Please accept the terms to continue.");
      return;
    }

    if (!shippingTracked) {
      trackEvent("checkout_shipping_selected", {
        shipping_method: form.shippingMethodId,
        currency: siteConfig.currency,
      });
      setShippingTracked(true);
    }

    setSubmitting(true);

    try {
      const response = await fetch("/api/checkout/prepare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productSlug: item.productSlug,
            quantity: item.quantity,
          })),
          contact: {
            email: form.contact.email.trim(),
            phone: form.contact.phone?.trim() || undefined,
          },
          shippingAddress: {
            ...form.shippingAddress,
            line2: form.shippingAddress.line2?.trim() || undefined,
            country: form.shippingAddress.country || checkoutConfig.defaultCountry,
          },
          billingSameAsShipping: form.billingSameAsShipping,
          billingAddress: form.billingSameAsShipping
            ? undefined
            : {
                ...form.billingAddress,
                line2: form.billingAddress.line2?.trim() || undefined,
                country: form.billingAddress.country || checkoutConfig.defaultCountry,
              },
          shippingMethodId: form.shippingMethodId,
          orderNotes: form.orderNotes.trim() || undefined,
          marketingConsent: form.marketingConsent,
          termsAccepted: form.termsAccepted,
          clientSubtotal: subtotal,
          idempotencyKey,
        }),
      });

      const data = (await response.json()) as {
        ok: boolean;
        error?: string;
        fieldErrors?: Record<string, string>;
        issues?: string[];
        priceChanged?: boolean;
        summary?: { total: number };
      };

      if (!response.ok || !data.ok) {
        if (data.fieldErrors) setFieldErrors(data.fieldErrors);
        if (data.priceChanged) setPriceChanged(true);
        setFormError(
          data.error ??
            data.issues?.[0] ??
            "We couldn't prepare your checkout right now. Please try again.",
        );
        return;
      }

      if (data.priceChanged) {
        setPriceChanged(true);
        setFormError(
          "One or more items in your cart have changed in price. Please review your order.",
        );
        return;
      }

      trackEvent("checkout_payment_continue", {
        cart_value: subtotal,
        currency: siteConfig.currency,
        item_count: items.reduce((sum, item) => sum + item.quantity, 0),
        shipping_method: form.shippingMethodId,
      });

      router.push("/checkout/payment");
    } catch {
      setFormError("We couldn't prepare your checkout right now. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-12">
      {formError ? (
        <div
          className="border border-[rgba(122,69,69,0.25)] bg-[rgba(122,69,69,0.06)] px-4 py-3 text-sm text-[#7a4545]"
          role="alert"
        >
          {formError}
          {priceChanged ? (
            <Link href="/cart" className="mt-2 block text-link">
              Review your cart
            </Link>
          ) : null}
        </div>
      ) : null}

      <section aria-labelledby="contact-heading">
        <h2 id="contact-heading" className="display-font text-2xl text-brand">
          Contact
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="checkout-email" className={labelClass}>
              Email
            </label>
            <input
              id="checkout-email"
              type="email"
              autoComplete="email"
              required
              value={form.contact.email}
              onChange={(event) => updateContact("email", event.target.value)}
              onBlur={validateContactLocally}
              className={inputClass}
            />
            <FieldError message={fieldErrors["contact.email"]} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="checkout-phone" className={labelClass}>
              Phone{checkoutConfig.phoneRequired ? "" : " (optional)"}
            </label>
            <input
              id="checkout-phone"
              type="tel"
              autoComplete="tel"
              value={form.contact.phone ?? ""}
              onChange={(event) => updateContact("phone", event.target.value)}
              className={inputClass}
            />
            <FieldError message={fieldErrors["contact.phone"]} />
          </div>
        </div>
      </section>

      <section aria-labelledby="shipping-heading">
        <h2 id="shipping-heading" className="display-font text-2xl text-brand">
          Shipping Address
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="shipping-first-name" className={labelClass}>
              First name
            </label>
            <input
              id="shipping-first-name"
              autoComplete="shipping given-name"
              required
              value={form.shippingAddress.firstName}
              onChange={(event) => updateShipping("firstName", event.target.value)}
              className={inputClass}
            />
            <FieldError message={fieldErrors["shippingAddress.firstName"]} />
          </div>
          <div>
            <label htmlFor="shipping-last-name" className={labelClass}>
              Last name
            </label>
            <input
              id="shipping-last-name"
              autoComplete="shipping family-name"
              required
              value={form.shippingAddress.lastName}
              onChange={(event) => updateShipping("lastName", event.target.value)}
              className={inputClass}
            />
            <FieldError message={fieldErrors["shippingAddress.lastName"]} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="shipping-line1" className={labelClass}>
              Address
            </label>
            <input
              id="shipping-line1"
              autoComplete="shipping address-line1"
              required
              value={form.shippingAddress.line1}
              onChange={(event) => updateShipping("line1", event.target.value)}
              className={inputClass}
            />
            <FieldError message={fieldErrors["shippingAddress.line1"]} />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="shipping-line2" className={labelClass}>
              Apartment, suite, etc. (optional)
            </label>
            <input
              id="shipping-line2"
              autoComplete="shipping address-line2"
              value={form.shippingAddress.line2 ?? ""}
              onChange={(event) => updateShipping("line2", event.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="shipping-city" className={labelClass}>
              City
            </label>
            <input
              id="shipping-city"
              autoComplete="shipping address-level2"
              required
              value={form.shippingAddress.city}
              onChange={(event) => updateShipping("city", event.target.value)}
              className={inputClass}
            />
            <FieldError message={fieldErrors["shippingAddress.city"]} />
          </div>
          <div>
            <label htmlFor="shipping-state" className={labelClass}>
              State
            </label>
            <select
              id="shipping-state"
              autoComplete="shipping address-level1"
              required
              value={form.shippingAddress.state}
              onChange={(event) => updateShipping("state", event.target.value)}
              className={inputClass}
            >
              <option value="">Select state</option>
              {US_STATES.map((state) => (
                <option key={state.code} value={state.code}>
                  {state.name}
                </option>
              ))}
            </select>
            <FieldError message={fieldErrors["shippingAddress.state"]} />
          </div>
          <div>
            <label htmlFor="shipping-postal" className={labelClass}>
              ZIP code
            </label>
            <input
              id="shipping-postal"
              autoComplete="shipping postal-code"
              required
              value={form.shippingAddress.postalCode}
              onChange={(event) => updateShipping("postalCode", event.target.value)}
              className={inputClass}
            />
            <FieldError message={fieldErrors["shippingAddress.postalCode"]} />
          </div>
          <div>
            <label htmlFor="shipping-country" className={labelClass}>
              Country
            </label>
            <input
              id="shipping-country"
              autoComplete="shipping country"
              readOnly
              value={checkoutConfig.defaultCountryLabel}
              className={`${inputClass} bg-[rgba(16,42,36,0.03)]`}
            />
          </div>
        </div>
      </section>

      <section aria-labelledby="billing-heading">
        <h2 id="billing-heading" className="display-font text-2xl text-brand">
          Billing Address
        </h2>
        <label className="mt-6 flex items-start gap-3 text-sm text-brand">
          <input
            type="checkbox"
            checked={form.billingSameAsShipping}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                billingSameAsShipping: event.target.checked,
              }))
            }
            className="mt-1"
          />
          Billing address same as shipping
        </label>

        {!form.billingSameAsShipping ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="billing-first-name" className={labelClass}>
                First name
              </label>
              <input
                id="billing-first-name"
                autoComplete="billing given-name"
                value={form.billingAddress.firstName}
                onChange={(event) => updateBilling("firstName", event.target.value)}
                className={inputClass}
              />
              <FieldError message={fieldErrors["billingAddress.firstName"]} />
            </div>
            <div>
              <label htmlFor="billing-last-name" className={labelClass}>
                Last name
              </label>
              <input
                id="billing-last-name"
                autoComplete="billing family-name"
                value={form.billingAddress.lastName}
                onChange={(event) => updateBilling("lastName", event.target.value)}
                className={inputClass}
              />
              <FieldError message={fieldErrors["billingAddress.lastName"]} />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="billing-line1" className={labelClass}>
                Address
              </label>
              <input
                id="billing-line1"
                autoComplete="billing address-line1"
                value={form.billingAddress.line1}
                onChange={(event) => updateBilling("line1", event.target.value)}
                className={inputClass}
              />
              <FieldError message={fieldErrors["billingAddress.line1"]} />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="billing-line2" className={labelClass}>
                Apartment, suite, etc. (optional)
              </label>
              <input
                id="billing-line2"
                autoComplete="billing address-line2"
                value={form.billingAddress.line2 ?? ""}
                onChange={(event) => updateBilling("line2", event.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="billing-city" className={labelClass}>
                City
              </label>
              <input
                id="billing-city"
                autoComplete="billing address-level2"
                value={form.billingAddress.city}
                onChange={(event) => updateBilling("city", event.target.value)}
                className={inputClass}
              />
              <FieldError message={fieldErrors["billingAddress.city"]} />
            </div>
            <div>
              <label htmlFor="billing-state" className={labelClass}>
                State
              </label>
              <select
                id="billing-state"
                autoComplete="billing address-level1"
                value={form.billingAddress.state}
                onChange={(event) => updateBilling("state", event.target.value)}
                className={inputClass}
              >
                <option value="">Select state</option>
                {US_STATES.map((state) => (
                  <option key={state.code} value={state.code}>
                    {state.name}
                  </option>
                ))}
              </select>
              <FieldError message={fieldErrors["billingAddress.state"]} />
            </div>
            <div>
              <label htmlFor="billing-postal" className={labelClass}>
                ZIP code
              </label>
              <input
                id="billing-postal"
                autoComplete="billing postal-code"
                value={form.billingAddress.postalCode}
                onChange={(event) => updateBilling("postalCode", event.target.value)}
                className={inputClass}
              />
              <FieldError message={fieldErrors["billingAddress.postalCode"]} />
            </div>
          </div>
        ) : null}
      </section>

      <section aria-labelledby="shipping-method-heading">
        <h2 id="shipping-method-heading" className="display-font text-2xl text-brand">
          Shipping Method
        </h2>
        <fieldset className="mt-6 space-y-3">
          <legend className="sr-only">Choose a shipping method</legend>
          {shippingMethods.map((method) => (
            <label
              key={method.id}
              className={`flex cursor-pointer items-start gap-3 border p-4 transition ${
                form.shippingMethodId === method.id
                  ? "border-brand/40 bg-[rgba(16,42,36,0.03)]"
                  : "border-line"
              }`}
            >
              <input
                type="radio"
                name="shippingMethod"
                value={method.id}
                checked={form.shippingMethodId === method.id}
                onChange={() => {
                  setForm((current) => ({ ...current, shippingMethodId: method.id }));
                  if (!shippingTracked) {
                    trackEvent("checkout_shipping_selected", {
                      shipping_method: method.id,
                      currency: siteConfig.currency,
                    });
                    setShippingTracked(true);
                  }
                }}
                className="mt-1"
              />
              <span>
                <span className="block text-sm text-brand">{method.name}</span>
                <span className="mt-1 block text-sm text-muted">{method.description}</span>
                <span className="mt-1 block text-xs text-muted">
                  {method.price === null ? "Calculated at checkout" : `$${method.price}`}
                </span>
              </span>
            </label>
          ))}
        </fieldset>
        <FieldError message={fieldErrors.shippingMethodId} />
      </section>

      <section aria-labelledby="notes-heading">
        <h2 id="notes-heading" className="display-font text-2xl text-brand">
          Order Notes
        </h2>
        <label htmlFor="order-notes" className="mt-6 block">
          <span className={labelClass}>Gift message or delivery notes (optional)</span>
          <textarea
            id="order-notes"
            rows={4}
            value={form.orderNotes}
            onChange={(event) =>
              setForm((current) => ({ ...current, orderNotes: event.target.value }))
            }
            className={inputClass}
          />
        </label>
      </section>

      <section aria-labelledby="consent-heading" className="space-y-4">
        <h2 id="consent-heading" className="display-font text-2xl text-brand">
          Before You Continue
        </h2>
        <label className="flex items-start gap-3 text-sm text-brand">
          <input
            type="checkbox"
            checked={form.termsAccepted}
            onChange={(event) =>
              setForm((current) => ({ ...current, termsAccepted: event.target.checked }))
            }
            className="mt-1"
            required
          />
          <span>
            I agree to the{" "}
            <Link href="/terms" className="text-link">
              Terms &amp; Conditions
            </Link>
            ,{" "}
            <Link href="/privacy" className="text-link">
              Privacy Policy
            </Link>
            , and{" "}
            <Link href="/returns" className="text-link">
              Returns Policy
            </Link>
            .
          </span>
        </label>
        <FieldError message={fieldErrors.termsAccepted} />

        <label className="flex items-start gap-3 text-sm text-muted">
          <input
            type="checkbox"
            checked={form.marketingConsent}
            onChange={(event) =>
              setForm((current) => ({ ...current, marketingConsent: event.target.checked }))
            }
            className="mt-1"
          />
          <span>
            Send me occasional stories, new collections, and gift inspiration from VOYAGE.
          </span>
        </label>
      </section>

      <div className="lg:hidden">
        <CheckoutOrderSummary items={summaryItems} subtotal={subtotal} compact />
      </div>

      <button
        type="submit"
        disabled={submitting || validating || !canCheckout}
        className="btn-primary w-full sm:w-auto sm:min-w-[240px]"
      >
        {submitting ? "Preparing..." : "Continue to Payment"}
      </button>
    </form>
  );
}
