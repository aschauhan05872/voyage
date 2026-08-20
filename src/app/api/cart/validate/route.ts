import { NextResponse } from "next/server";
import { z } from "zod";
import { validateCartItems } from "@/server/services/cart-service";

const cartValidateSchema = z.object({
  items: z.array(
    z.object({
      productSlug: z.string().min(1),
      quantity: z.number().int().min(1).max(99),
    }),
  ),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = cartValidateSchema.parse(body);
    const result = await validateCartItems(input.items);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Invalid cart request" }, { status: 400 });
  }
}
