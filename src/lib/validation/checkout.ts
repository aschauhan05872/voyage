import { z } from "zod";
import { checkoutConfig, US_STATES } from "@/lib/config/checkout";

const US_STATE_CODES = new Set<string>(US_STATES.map((state) => state.code));

const nameField = z
  .string()
  .trim()
  .min(1, "This field is required.")
  .max(80, "Please shorten this field.");

const addressLine = z
  .string()
  .trim()
  .min(1, "This field is required.")
  .max(120, "Please shorten this field.");

const optionalAddressLine = z
  .string()
  .trim()
  .max(120, "Please shorten this field.")
  .optional()
  .transform((value) => value || undefined);

export const checkoutAddressSchema = z.object({
  firstName: nameField,
  lastName: nameField,
  line1: addressLine,
  line2: optionalAddressLine,
  city: z.string().trim().min(1, "City is required.").max(80),
  state: z
    .string()
    .trim()
    .min(2, "State is required.")
    .max(2, "Please select a valid state.")
    .refine((value) => US_STATE_CODES.has(value), "Please select a valid state."),
  postalCode: z
    .string()
    .trim()
    .min(5, "Please enter a valid ZIP code.")
    .max(10, "Please enter a valid ZIP code.")
    .regex(/^\d{5}(-\d{4})?$/, "Please enter a valid ZIP code."),
  country: z.literal(checkoutConfig.defaultCountry),
  phone: z.string().trim().max(30).optional(),
});

export const checkoutContactSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .max(254, "Please enter a valid email address.")
    .pipe(z.email({ message: "Please enter a valid email address." })),
  phone: z
    .string()
    .trim()
    .max(30, "Please enter a valid phone number.")
    .optional()
    .transform((value) => value || undefined),
});

export const prepareCheckoutSchema = z
  .object({
    items: z
      .array(
        z.object({
          productSlug: z.string().min(1),
          quantity: z.number().int().min(1).max(99),
        }),
      )
      .min(1, "Your cart is empty."),
    contact: checkoutContactSchema,
    shippingAddress: checkoutAddressSchema,
    billingSameAsShipping: z.boolean().default(true),
    billingAddress: checkoutAddressSchema.optional(),
    shippingMethodId: z.string().min(1, "Please select a shipping method."),
    orderNotes: z.string().trim().max(500).optional(),
    marketingConsent: z.boolean().default(false),
    termsAccepted: z.literal(true, {
      error: "Please accept the terms to continue.",
    }),
    clientSubtotal: z.number().optional(),
    idempotencyKey: z.string().min(8).max(64).optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.billingSameAsShipping && !data.billingAddress) {
      ctx.addIssue({
        code: "custom",
        message: "Billing address is required.",
        path: ["billingAddress"],
      });
    }
  });

export type PrepareCheckoutInput = z.infer<typeof prepareCheckoutSchema>;
export type CheckoutAddressInput = z.infer<typeof checkoutAddressSchema>;
export type CheckoutContactInput = z.infer<typeof checkoutContactSchema>;

export function formatZodErrors(error: z.ZodError): Record<string, string> {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const path = issue.path.join(".");
    if (!fieldErrors[path]) {
      fieldErrors[path] = issue.message;
    }
  }
  return fieldErrors;
}
