export type CartLineItem = {
  productSlug: string;
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
};

export type CartState = {
  items: CartLineItem[];
};

export const CART_STORAGE_KEY = "voyage_cart_v1";

export function createEmptyCart(): CartState {
  return { items: [] };
}
