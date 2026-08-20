export type CheckoutAddress = {
  firstName: string;
  lastName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone?: string;
};

export type CheckoutContact = {
  email: string;
  phone?: string;
};

export type CheckoutCartSnapshotItem = {
  productSlug: string;
  productId: string;
  sku: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  month: string;
  gemstone: string;
  material: string;
  lineTotal: number;
};

export type CheckoutSessionStatus = "open" | "ready_for_payment" | "expired";

export type CheckoutSessionData = {
  id: string;
  idempotencyKey: string;
  requestFingerprint?: string;
  status: CheckoutSessionStatus;
  cartItems: CheckoutCartSnapshotItem[];
  subtotal: number;
  shippingAmount: number;
  taxAmount: number;
  discountAmount: number;
  total: number;
  currency: string;
  /** False until shipping and tax are calculated with real providers. */
  totalsFinalized: boolean;
  shippingMethodId: string | null;
  shippingMethodName: string | null;
  email: string;
  phone?: string;
  shippingAddress: CheckoutAddress;
  billingAddress: CheckoutAddress;
  billingSameAsShipping: boolean;
  orderNotes?: string;
  marketingConsent: boolean;
  termsAccepted: boolean;
  priceChanged: boolean;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  referrer?: string;
  createdAt: number;
  expiresAt: number;
};

export type PrepareCheckoutResult = {
  checkoutSessionId: string;
  summary: {
    items: CheckoutCartSnapshotItem[];
    subtotal: number;
    shippingAmount: number;
    taxAmount: number;
    discountAmount: number;
    total: number;
    currency: string;
    shippingLabel: string;
    taxLabel: string;
    totalsFinalized: boolean;
  };
  priceChanged: boolean;
  canProceed: boolean;
  issues?: string[];
};

/** Authoritative payable breakdown — server source of truth for Phase 7 payment. */
export type AuthoritativeCheckoutTotals = {
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  currency: string;
  totalsFinalized: boolean;
};
