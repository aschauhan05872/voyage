export type CartLineItem = {
  productSlug: string;
  productId: string;
  sku?: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  month?: string;
  gemstone?: string;
  material?: string;
};

export type CartState = {
  items: CartLineItem[];
};

export const CART_STORAGE_KEY = "voyage_cart_v1";

export function createEmptyCart(): CartState {
  return { items: [] };
}

export type CartValidationRequestItem = {
  productSlug: string;
  quantity: number;
};

export type ValidatedCartLine = {
  productSlug: string;
  productId: string;
  sku: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  requestedQuantity: number;
  month: string;
  gemstone: string;
  material: string;
  lineTotal: number;
  availability: "available" | "sold_out" | "coming_soon" | "inactive";
  maxQuantity: number;
  canCheckout: boolean;
  issue?: string;
};

export type CartValidationResult = {
  items: ValidatedCartLine[];
  subtotal: number;
  currency: string;
  canCheckout: boolean;
};
