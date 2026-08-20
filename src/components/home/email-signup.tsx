"use client";

import { useState } from "react";
import { siteConfig } from "@/lib/config/site";
import { trackEvent } from "@/lib/integrations/analytics-client";

type FormState = "idle" | "submitting" | "success" | "error";

function EmailSignupForm({
  variant,
  onSuccess,
}: {
  variant: "default" | "footer";
  onSuccess?: () => void;
}) {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");
  const isFooter = variant === "footer";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim()) {
      setMessage("Please enter your email address.");
      setState("error");
      return;
    }

    if (!consent) {
      setMessage("Please agree to receive marketing emails from VOYAGE.");
      setState("error");
      return;
    }

    setState("submitting");
    setMessage("");

    try {
      const response = await fetch("/api/email/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim() || undefined,
          email: email.trim(),
          source: isFooter ? "footer" : "homepage",
        }),
      });

      if (!response.ok) {
        throw new Error("Subscription failed");
      }

      trackEvent("email_signup", { source: isFooter ? "footer" : "homepage" });
      setState("success");
      setMessage("Welcome to the voyage. We'll be in touch soon.");
      setFirstName("");
      setEmail("");
      setConsent(false);
      onSuccess?.();
    } catch {
      setState("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  const inputClass = isFooter
    ? "w-full border border-white/20 bg-white/5 px-3 py-2.5 text-sm text-[var(--warm-ivory)] placeholder:text-[var(--warm-taupe)]"
    : "w-full border border-white/20 bg-white/5 px-4 py-3 text-[var(--warm-ivory)] placeholder:text-[var(--warm-taupe)]";

  return (
    <form onSubmit={handleSubmit} className={isFooter ? "mt-6 space-y-3 text-left" : "mt-8 space-y-4 text-left"}>
      {!isFooter ? (
        <div>
          <label htmlFor="signup-first-name" className="sr-only">
            First name (optional)
          </label>
          <input
            id="signup-first-name"
            name="firstName"
            type="text"
            autoComplete="given-name"
            placeholder="First name (optional)"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            className={inputClass}
          />
        </div>
      ) : null}
      <div>
        <label htmlFor={isFooter ? "footer-signup-email" : "signup-email"} className="sr-only">
          Email address
        </label>
        <input
          id={isFooter ? "footer-signup-email" : "signup-email"}
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="Email address"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className={inputClass}
        />
      </div>
      <label className="flex items-start gap-3 text-xs leading-relaxed text-[var(--warm-taupe)]">
        <input
          type="checkbox"
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
          className="mt-0.5"
          required
        />
        <span>
          I agree to receive marketing emails from VOYAGE. You can unsubscribe at any time.
        </span>
      </label>
      <button
        type="submit"
        disabled={state === "submitting"}
        className={
          isFooter
            ? "w-full border border-[var(--champagne-gold)] bg-transparent px-4 py-2.5 text-xs uppercase tracking-[0.14em] text-[var(--warm-ivory)] transition-colors hover:bg-[var(--champagne-gold)] hover:text-brand disabled:opacity-60"
            : "btn-primary w-full border-[var(--champagne-gold)] bg-[var(--champagne-gold)] text-brand hover:bg-[#b8955a] disabled:opacity-60"
        }
      >
        {state === "submitting" ? "Joining..." : "Join the Voyage"}
      </button>
      {message ? (
        <p
          className={`text-sm ${state === "error" ? "text-red-200" : "text-[var(--warm-taupe)]"}`}
          role="status"
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}

export function EmailSignup() {
  return (
    <section className="section-padding bg-brand text-[var(--warm-ivory)]" aria-labelledby="email-signup-heading">
      <div className="container-shell max-w-2xl text-center">
        <h2 id="email-signup-heading" className="display-font text-4xl md:text-5xl">
          {siteConfig.emailCapture.heading}
        </h2>
        <p className="mt-3 text-sm text-[var(--warm-taupe)]">
          {siteConfig.emailCapture.subheading}
        </p>
        <EmailSignupForm variant="default" />
      </div>
    </section>
  );
}

export function FooterEmailSignup() {
  return (
    <div className="mt-6 max-w-sm">
      <p className="text-sm">{siteConfig.emailCapture.heading}</p>
      <p className="mt-1 text-xs text-[var(--warm-taupe)]">{siteConfig.emailCapture.subheading}</p>
      <EmailSignupForm variant="footer" />
    </div>
  );
}
