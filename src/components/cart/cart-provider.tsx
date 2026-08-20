"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  addCartItem,
  cartsAreEqual,
  getCartSubtotal,
  readCart,
  removeCartItem,
  syncCartFromValidation,
  updateCartItemQuantity,
  writeCart,
} from "@/lib/cart/cart-storage";
import type { CartLineItem, CartValidationResult } from "@/lib/cart/types";
import { siteConfig } from "@/lib/config/site";

type AddItemInput = Omit<CartLineItem, "quantity">;

type CartContextValue = {
  items: CartLineItem[];
  validated: CartValidationResult | null;
  itemCount: number;
  subtotal: number;
  currency: string;
  ready: boolean;
  validating: boolean;
  canCheckout: boolean;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addItem: (item: AddItemInput, quantity?: number, options?: { openDrawer?: boolean }) => void;
  removeItem: (productSlug: string) => void;
  updateQuantity: (productSlug: string, quantity: number) => void;
  clear: () => void;
  refreshValidation: () => Promise<void>;
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

async function fetchValidation(items: CartLineItem[]): Promise<CartValidationResult | null> {
  if (items.length === 0) return null;

  const response = await fetch("/api/cart/validate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      items: items.map((item) => ({
        productSlug: item.productSlug,
        quantity: item.quantity,
      })),
    }),
  });

  if (!response.ok) return null;
  return (await response.json()) as CartValidationResult;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const items = useMemo(() => JSON.parse(raw) as CartLineItem[], [raw]);
  const ready = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [validated, setValidated] = useState<CartValidationResult | null>(null);
  const [validating, setValidating] = useState(false);
  const validationRequestId = useRef(0);

  const refreshValidation = useCallback(async () => {
    const currentItems = readCart().items;
    if (currentItems.length === 0) {
      setValidated(null);
      return;
    }

    const requestId = ++validationRequestId.current;
    setValidating(true);

    try {
      const result = await fetchValidation(currentItems);
      if (!result || requestId !== validationRequestId.current) return;

      const syncedItems = result.items
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
        }));

      if (!cartsAreEqual(currentItems, syncedItems)) {
        syncCartFromValidation(result.items);
      }

      setValidated(result);
    } catch {
      if (requestId === validationRequestId.current) {
        setValidated(null);
      }
    } finally {
      if (requestId === validationRequestId.current) {
        setValidating(false);
      }
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    const timer = window.setTimeout(() => {
      void refreshValidation();
    }, 0);
    return () => window.clearTimeout(timer);
  }, [ready, refreshValidation]);

  const scheduleValidation = useCallback(() => {
    window.setTimeout(() => {
      void refreshValidation();
    }, 0);
  }, [refreshValidation]);

  const openDrawer = useCallback(() => setDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const addItem = useCallback(
    (item: AddItemInput, quantity = 1, options?: { openDrawer?: boolean }) => {
      addCartItem(item, quantity);
      if (options?.openDrawer !== false) {
        setDrawerOpen(true);
      }
      scheduleValidation();
    },
    [scheduleValidation],
  );

  const removeItem = useCallback(
    (productSlug: string) => {
      removeCartItem(productSlug);
      scheduleValidation();
    },
    [scheduleValidation],
  );

  const updateQuantity = useCallback(
    (productSlug: string, quantity: number) => {
      updateCartItemQuantity(productSlug, quantity);
      scheduleValidation();
    },
    [scheduleValidation],
  );

  const clear = useCallback(() => {
    writeCart({ items: [] });
    setValidated(null);
  }, []);

  const subtotal = validated?.subtotal ?? getCartSubtotal(items);
  const canCheckout = validated?.canCheckout ?? items.length > 0;

  const value = useMemo(
    () => ({
      items,
      validated,
      itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal,
      currency: validated?.currency ?? siteConfig.currency,
      ready,
      validating,
      canCheckout,
      drawerOpen,
      openDrawer,
      closeDrawer,
      addItem,
      removeItem,
      updateQuantity,
      clear,
      refreshValidation,
    }),
    [
      addItem,
      canCheckout,
      clear,
      closeDrawer,
      drawerOpen,
      items,
      openDrawer,
      ready,
      refreshValidation,
      removeItem,
      subtotal,
      updateQuantity,
      validated,
      validating,
    ],
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
