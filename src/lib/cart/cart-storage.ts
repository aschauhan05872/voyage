import { CART_STORAGE_KEY, createEmptyCart, type CartLineItem, type CartState } from "@/lib/cart/types";

function sanitizeQuantity(quantity: number): number {
  const parsed = Math.floor(Number(quantity));
  if (!Number.isFinite(parsed) || parsed < 1) return 1;
  return Math.min(99, parsed);
}

function sanitizeItem(item: CartLineItem): CartLineItem | null {
  if (!item.productSlug || !item.productId || !item.name) return null;
  if (item.price < 0 || !Number.isFinite(item.price)) return null;
  const quantity = sanitizeQuantity(item.quantity);
  return { ...item, quantity };
}

export function readCart(): CartState {
  if (typeof window === "undefined") return createEmptyCart();

  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return createEmptyCart();
    const parsed = JSON.parse(raw) as CartState;
    if (!Array.isArray(parsed.items)) return createEmptyCart();
    return {
      items: parsed.items
        .map((item) => sanitizeItem(item))
        .filter((item): item is CartLineItem => item !== null),
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

export function getCartSubtotal(items: CartLineItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function addCartItem(item: Omit<CartLineItem, "quantity">, quantity = 1): CartState {
  const cart = readCart();
  const safeQuantity = sanitizeQuantity(quantity);
  const existing = cart.items.find((line) => line.productSlug === item.productSlug);

  if (existing) {
    existing.quantity = Math.min(99, existing.quantity + safeQuantity);
    existing.price = item.price;
    existing.name = item.name;
    existing.imageUrl = item.imageUrl;
    if (item.sku) existing.sku = item.sku;
    if (item.month) existing.month = item.month;
    if (item.gemstone) existing.gemstone = item.gemstone;
    if (item.material) existing.material = item.material;
  } else {
    cart.items.push({ ...item, quantity: safeQuantity });
  }

  writeCart(cart);
  return cart;
}

export function removeCartItem(productSlug: string): CartState {
  const cart = readCart();
  cart.items = cart.items.filter((item) => item.productSlug !== productSlug);
  writeCart(cart);
  return cart;
}

export function updateCartItemQuantity(productSlug: string, quantity: number): CartState {
  const cart = readCart();
  const parsed = Math.floor(Number(quantity));

  if (!Number.isFinite(parsed) || parsed < 1) {
    return removeCartItem(productSlug);
  }

  const safeQuantity = Math.min(99, parsed);
  const existing = cart.items.find((item) => item.productSlug === productSlug);
  if (!existing) return cart;

  existing.quantity = safeQuantity;
  writeCart(cart);
  return cart;
}

/** Reserved for future authenticated cart merge. */
export function mergeCartItems(
  guestItems: CartLineItem[],
  userItems: CartLineItem[],
): CartLineItem[] {
  const merged = new Map<string, CartLineItem>();

  for (const item of [...userItems, ...guestItems]) {
    const existing = merged.get(item.productSlug);
    if (existing) {
      merged.set(item.productSlug, {
        ...existing,
        quantity: Math.min(99, existing.quantity + item.quantity),
      });
    } else {
      merged.set(item.productSlug, { ...item });
    }
  }

  return Array.from(merged.values());
}

export function syncCartFromValidation(
  validatedItems: {
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
  }[],
): CartState {
  const cart: CartState = {
    items: validatedItems
      .filter((item) => item.quantity > 0)
      .map((item) => ({
        productSlug: item.productSlug,
        productId: item.productId,
        sku: item.sku,
        name: item.name,
        price: item.price,
        imageUrl: item.imageUrl,
        quantity: item.quantity,
        month: item.month,
        gemstone: item.gemstone,
        material: item.material,
      })),
  };
  writeCart(cart);
  return cart;
}

function normalizeCartItems(items: CartLineItem[]): CartLineItem[] {
  return [...items].sort((a, b) => a.productSlug.localeCompare(b.productSlug));
}

export function cartsAreEqual(left: CartLineItem[], right: CartLineItem[]): boolean {
  const a = normalizeCartItems(left);
  const b = normalizeCartItems(right);
  if (a.length !== b.length) return false;

  return a.every((item, index) => {
    const other = b[index];
    return (
      item.productSlug === other.productSlug &&
      item.productId === other.productId &&
      item.quantity === other.quantity &&
      item.price === other.price &&
      item.name === other.name
    );
  });
}
