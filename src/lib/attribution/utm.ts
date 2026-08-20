export const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

export type UtmParams = Partial<Record<(typeof UTM_KEYS)[number], string>>;

export function parseUtmFromSearch(search: string): UtmParams {
  const params = new URLSearchParams(search);
  const result: UtmParams = {};
  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) result[key] = value;
  }
  return result;
}

export function hasUtm(params: UtmParams): boolean {
  return Object.keys(params).length > 0;
}

export const ATTRIBUTION_COOKIE = "voyage_attribution";
export const ATTRIBUTION_MAX_AGE = 60 * 60 * 24 * 90; // 90 days
