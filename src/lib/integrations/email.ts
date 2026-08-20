/**
 * Email provider abstraction.
 * Future providers: Maileroo, Resend, Klaviyo, Mailchimp.
 */
export type EmailSubscriberInput = {
  firstName: string;
  email: string;
  source?: string;
};

export type TransactionalEmailInput = {
  to: string;
  template:
    | "welcome"
    | "abandoned_cart"
    | "order_confirmation"
    | "shipping_notification"
    | "delivery_followup"
    | "review_request";
  data: Record<string, unknown>;
};

export interface EmailProvider {
  readonly name: string;
  subscribe(input: EmailSubscriberInput): Promise<{ ok: boolean }>;
  sendTransactional(input: TransactionalEmailInput): Promise<{ ok: boolean }>;
}

export class NoopEmailProvider implements EmailProvider {
  readonly name = "noop";

  async subscribe(input: EmailSubscriberInput): Promise<{ ok: boolean }> {
    console.info("[email] subscribe", { email: input.email, source: input.source });
    return { ok: true };
  }

  async sendTransactional(input: TransactionalEmailInput): Promise<{ ok: boolean }> {
    console.info("[email] send", { to: input.to, template: input.template });
    return { ok: true };
  }
}

export function getEmailProvider(): EmailProvider {
  return new NoopEmailProvider();
}
