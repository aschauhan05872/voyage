import { CART_STORAGE_KEY, createEmptyCart, type CartLineItem, type CartState } from "@/lib/cart/types";

export function readCart(): CartState {
  if (typeof window === "undefined") return createEmptyCart();

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return createEmptyCart();
    const parsed = JSON.parse(raw) as CartState;
    if (!Array.isArray(parsed.items)) return createEmptyCart();
    return {
      items: parsed.items.filter(
        (item) => item.productSlug && item.quantity > 0 && item.price >= 0,
      ),
    };
  } catch {
    return createEmptyCart();
  }
}

export function writeCart(cart: CartState): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  window.dispatchEvent(new CustomEvent("voyage:cart"));
}

export function addCartItem(item: Omit<CartLineItem, "quantity">, quantity = 1): CartState {
  const cart = readCart();
  const existing = cart.items.find((line) => line.productSlug === item.productSlug);

  if (existing) {
    existing.quantity = Math.min(99, existing.quantity + quantity);
  } else {
    cart.items.push({ ...item, quantity: Math.min(99, Math.max(1, quantity)) });
  }

  writeCart(cart);
  return cart;
}
