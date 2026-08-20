/**
 * Payment provider abstraction.
 * Initial provider: NOWPayments. Future: Stripe, PayPal, Authorize.net.
 */
export type PaymentIntentInput = {
  orderId: string;
  orderNumber: string;
  amount: number;
  currency: string;
  customerEmail: string;
  successUrl: string;
  cancelUrl: string;
};

export type PaymentIntentResult = {
  provider: string;
  status: "PENDING" | "REQUIRES_ACTION" | "PAID" | "FAILED";
  externalId?: string;
  checkoutUrl?: string;
};

export type PaymentWebhookPayload = {
  provider: string;
  externalId: string;
  orderId?: string;
  status: "PAID" | "FAILED" | "PENDING";
  raw: unknown;
};

export interface PaymentProvider {
  readonly name: string;
  createPaymentIntent(input: PaymentIntentInput): Promise<PaymentIntentResult>;
  verifyWebhook(payload: unknown, signature: string | null): PaymentWebhookPayload | null;
}

export class NoopPaymentProvider implements PaymentProvider {
  readonly name = "noop";

  async createPaymentIntent(
    input: PaymentIntentInput,
  ): Promise<PaymentIntentResult> {
    return {
      provider: this.name,
      status: "PENDING",
      externalId: input.orderId,
    };
  }

  verifyWebhook(): PaymentWebhookPayload | null {
    return null;
  }
}

export class NOWPaymentsProvider implements PaymentProvider {
  readonly name = "nowpayments";

  async createPaymentIntent(
    input: PaymentIntentInput,
  ): Promise<PaymentIntentResult> {
    // Phase 7: wire to NOWPayments API using server-side credentials.
    void input;
    throw new Error("NOWPayments integration not yet configured.");
  }

  verifyWebhook(): PaymentWebhookPayload | null {
    // Phase 8: verify IPN signature and parse payload.
    return null;
  }
}

export function getPaymentProvider(): PaymentProvider {
  const provider = process.env.PAYMENT_PROVIDER ?? "noop";
  if (provider === "nowpayments") return new NOWPaymentsProvider();
  return new NoopPaymentProvider();
}
