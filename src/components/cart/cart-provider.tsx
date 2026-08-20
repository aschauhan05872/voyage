"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { addCartItem, readCart, writeCart } from "@/lib/cart/cart-storage";
import type { CartLineItem } from "@/lib/cart/types";

type AddItemInput = Omit<CartLineItem, "quantity">;

type CartContextValue = {
  items: CartLineItem[];
  itemCount: number;
  ready: boolean;
  addItem: (item: AddItemInput, quantity?: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function subscribe(onStoreChange: () => void) {
  if (typeof window === "undefined") return () => undefined;
  const onStorage = (event: StorageEvent) => {
    if (event.key === "voyage_cart_v1") onStoreChange();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener("voyage:cart", onStoreChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener("voyage:cart", onStoreChange);
  };
}

function getSnapshot() {
  return JSON.stringify(readCart().items);
}

function getServerSnapshot() {
  return "[]";
}

export function CartProvider({ children }: { children: ReactNode }) {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const items = useMemo(() => JSON.parse(raw) as CartLineItem[], [raw]);
  const ready = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );

  const addItem = useCallback((item: AddItemInput, quantity = 1) => {
    addCartItem(item, quantity);
  }, []);

  const clear = useCallback(() => {
    writeCart({ items: [] });
  }, []);

  const value = useMemo(
    () => ({
      items,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      ready,
      addItem,
      clear,
    }),
    [addItem, clear, items, ready],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
