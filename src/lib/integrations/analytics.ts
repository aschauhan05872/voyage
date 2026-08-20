/**
 * Centralized analytics abstraction.
 * Providers: GA4, Meta Pixel, TikTok Pixel (client-side loaders in Phase 9).
 */
export type AnalyticsEvent =
  | "page_view"
  | "product_view"
  | "view_item"
  | "birthstone_selected"
  | "select_item"
  | "filter_used"
  | "sort_used"
  | "add_to_cart"
  | "remove_from_cart"
  | "view_cart"
  | "begin_checkout"
  | "payment_started"
  | "purchase"
  | "email_signup"
  | "whatsapp_click"
  | "social_click"
  | "search"
  | "coupon_applied";

export type AnalyticsPayload = Record<string, string | number | boolean | undefined>;

export interface AnalyticsProvider {
  readonly name: string;
  track(event: AnalyticsEvent, payload?: AnalyticsPayload): void;
}

class ConsoleAnalyticsProvider implements AnalyticsProvider {
  readonly name = "console";

  track(event: AnalyticsEvent, payload?: AnalyticsPayload): void {
    if (process.env.NODE_ENV === "development") {
      console.info("[analytics]", event, payload);
    }
  }
}

const providers: AnalyticsProvider[] = [new ConsoleAnalyticsProvider()];

export const analytics = {
  track(event: AnalyticsEvent, payload?: AnalyticsPayload): void {
    for (const provider of providers) {
      provider.track(event, payload);
    }
  },
};
