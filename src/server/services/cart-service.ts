import { siteConfig } from "@/lib/config/site";
import type {
  CartValidationRequestItem,
  CartValidationResult,
  ValidatedCartLine,
} from "@/lib/cart/types";
import { getProductDetailBySlug } from "@/server/services/product-service";

function sanitizeRequestQuantity(quantity: number): number {
  const parsed = Math.floor(Number(quantity));
  if (!Number.isFinite(parsed) || parsed < 1) return 1;
  return Math.min(99, parsed);
}

export async function validateCartItems(
  items: CartValidationRequestItem[],
): Promise<CartValidationResult> {
  const validated: ValidatedCartLine[] = [];
  let subtotal = 0;

  for (const { productSlug, quantity } of items) {
    const requestedQuantity = sanitizeRequestQuantity(quantity);
    const product = await getProductDetailBySlug(productSlug);

    if (!product) {
      validated.push({
        productSlug,
        productId: productSlug,
        sku: "",
        name: "Unavailable piece",
        price: 0,
        imageUrl: "",
        quantity: 0,
        requestedQuantity,
        month: "",
        gemstone: "",
        material: "",
        lineTotal: 0,
        availability: "inactive",
        maxQuantity: 0,
        canCheckout: false,
        issue: "This piece is no longer available.",
      });
      continue;
    }

    const isAvailable = product.availability === "available";
    const maxQuantity = isAvailable ? Math.min(99, product.inventoryQuantity) : 0;
    const effectiveQuantity = isAvailable ? Math.min(requestedQuantity, maxQuantity) : 0;

    let issue: string | undefined;
    if (!isAvailable) {
      issue =
        product.availability === "sold_out"
          ? "Sorry, this piece is currently unavailable."
          : "This piece is no longer available.";
    } else if (requestedQuantity > maxQuantity) {
      issue =
        maxQuantity === 0
          ? "Sorry, this piece is currently unavailable."
          : `Only ${maxQuantity} available. Quantity adjusted.`;
    }

    const lineTotal = effectiveQuantity * product.price;
    subtotal += lineTotal;

    validated.push({
      productSlug: product.slug,
      productId: product.id,
      sku: product.sku,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      quantity: effectiveQuantity,
      requestedQuantity,
      month: product.month,
      gemstone: product.gemstone,
      material: product.material,
      lineTotal,
      availability: product.availability,
      maxQuantity,
      canCheckout: isAvailable && effectiveQuantity > 0,
      issue,
    });
  }

  const checkoutItems = validated.filter((item) => item.quantity > 0);
  const canCheckout =
    checkoutItems.length > 0 && checkoutItems.every((item) => item.canCheckout);

  return {
    items: validated,
    subtotal,
    currency: siteConfig.currency,
    canCheckout,
  };
}
