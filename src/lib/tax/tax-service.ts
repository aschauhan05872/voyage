/** Tax calculation placeholder — integrate provider in a future phase. */

export type TaxCalculationResult = {
  amount: number;
  label: string;
};

export function calculateTax(): TaxCalculationResult {
  return {
    amount: 0,
    label: "Calculated at checkout",
  };
}
