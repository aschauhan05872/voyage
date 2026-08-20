export type ShippingMethod = {
  id: string;
  name: string;
  description: string;
  price: number | null;
  estimatedDelivery: string;
  active: boolean;
};

/** Static shipping methods — replace with provider integration later. */
export const shippingMethods: ShippingMethod[] = [
  {
    id: "standard",
    name: "Standard Shipping",
    description: "Delivery estimate provided when your order ships.",
    price: null,
    estimatedDelivery: "Shared after dispatch",
    active: true,
  },
];

export function getActiveShippingMethods(): ShippingMethod[] {
  return shippingMethods.filter((method) => method.active);
}

export function getShippingMethodById(id: string): ShippingMethod | undefined {
  return shippingMethods.find((method) => method.id === id && method.active);
}

export function calculateShippingAmount(methodId: string): {
  amount: number;
  label: string;
} {
  const method = getShippingMethodById(methodId);
  if (!method) {
    return { amount: 0, label: "Calculated at checkout" };
  }

  if (method.price === null) {
    return { amount: 0, label: "Calculated at checkout" };
  }

  return { amount: method.price, label: method.name };
}
