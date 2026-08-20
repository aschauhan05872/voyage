/** Mask phone for customer-facing confirmation display. */
export function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length <= 4) return "••••";
  const lastFour = digits.slice(-4);
  return `••• ••• ${lastFour}`;
}
