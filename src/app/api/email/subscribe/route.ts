import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { getEmailProvider } from "@/lib/integrations/email";
import { emailSubscribeSchema } from "@/lib/validation/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = emailSubscribeSchema.parse(body);

    try {
      await prisma.emailSubscriber.upsert({
        where: { email: input.email },
        update: {
          firstName: input.firstName ?? "",
          source: input.source,
          subscribed: true,
        },
        create: {
          firstName: input.firstName ?? "",
          email: input.email,
          source: input.source ?? "homepage",
          subscribed: true,
        },
      });
    } catch {
      // Database unavailable — continue with provider-only subscription.
    }

    const emailProvider = getEmailProvider();
    await emailProvider.subscribe({
      firstName: input.firstName ?? "",
      email: input.email,
      source: input.source,
    });

    await emailProvider.sendTransactional({
      to: input.email,
      template: "welcome",
      data: { firstName: input.firstName ?? "friend" },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }
}
