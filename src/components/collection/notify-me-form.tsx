"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/integrations/analytics-client";

type NotifyMeFormProps = {
  month: string;
  gemstone: string;
};

type FormState = "idle" | "submitting" | "success" | "error";

export function NotifyMeForm({ month, gemstone }: NotifyMeFormProps) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<FormState>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!email.trim() || !consent) {
      setMessage("Please enter your email and agree to receive updates.");
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
          email: email.trim(),
          source: `notify-me-${month.toLowerCase()}`,
        }),
      });

      if (!response.ok) throw new Error("Failed");

      trackEvent("email_signup", {
        source: "notify_me",
        month,
        gemstone,
      });
      setState("success");
      setMessage("You're on the list. We'll notify you when it's ready.");
      setEmail("");
      setConsent(false);
    } catch {
      setState("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-3">
      <label htmlFor={`notify-${month}`} className="sr-only">
        Email for {month} {gemstone} notify me
      </label>
      <input
        id={`notify-${month}`}
        type="email"
        required
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        placeholder="Email address"
        className="w-full border border-line bg-white/80 px-3 py-2 text-sm"
      />
      <label className="flex items-start gap-2 text-xs text-muted">
        <input
          type="checkbox"
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
          className="mt-0.5"
          required
        />
        <span>I agree to receive updates from VOYAGE. Unsubscribe anytime.</span>
      </label>
      <button type="submit" disabled={state === "submitting"} className="btn-secondary w-full text-xs">
        {state === "submitting" ? "Submitting..." : "Notify Me"}
      </button>
      {message ? (
        <p className={`text-xs ${state === "error" ? "text-red-700" : "text-muted"}`} role="status">
          {message}
        </p>
      ) : null}
    </form>
  );
}
