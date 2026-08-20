/**
 * Client-safe analytics wrapper with attribution context.
 */
import type { AnalyticsEvent, AnalyticsPayload } from "@/lib/integrations/analytics";
import { analytics } from "@/lib/integrations/analytics";
import { ATTRIBUTION_COOKIE } from "@/lib/attribution/utm";

function readAttributionContext(): AnalyticsPayload {
  if (typeof document === "undefined") return {};

  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${ATTRIBUTION_COOKIE}=`));

  if (!match) return {};

  try {
    const value = decodeURIComponent(match.split("=")[1] ?? "");
    const parsed = JSON.parse(value) as AnalyticsPayload;
    return parsed;
  } catch {
    return {};
  }
}

export function trackEvent(event: AnalyticsEvent, payload?: AnalyticsPayload): void {
  analytics.track(event, {
    ...readAttributionContext(),
    ...payload,
  });
}
