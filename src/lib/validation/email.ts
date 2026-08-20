import { z } from "zod";

export const emailSubscribeSchema = z.object({
  firstName: z.string().trim().max(80).optional(),
  email: z.email(),
  source: z.string().trim().max(80).optional(),
});

export type EmailSubscribeInput = z.infer<typeof emailSubscribeSchema>;
