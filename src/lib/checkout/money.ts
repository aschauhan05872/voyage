/** Round USD amounts to cents to avoid floating-point drift. */
export function roundMoney(amount: number): number {
  if (!Number.isFinite(amount)) return 0;
  return Math.round(amount * 100) / 100;
}

export function sumMoney(...amounts: number[]): number {
  return roundMoney(amounts.reduce((sum, amount) => sum + amount, 0));
}

export function multiplyMoney(unitPrice: number, quantity: number): number {
  return roundMoney(unitPrice * quantity);
}
