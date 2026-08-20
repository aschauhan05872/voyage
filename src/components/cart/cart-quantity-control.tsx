"use client";

type CartQuantityControlProps = {
  quantity: number;
  maxQuantity?: number;
  disabled?: boolean;
  label: string;
  onDecrease: () => void;
  onIncrease: () => void;
  compact?: boolean;
};

export function CartQuantityControl({
  quantity,
  maxQuantity = 99,
  disabled = false,
  label,
  onDecrease,
  onIncrease,
  compact = false,
}: CartQuantityControlProps) {
  const atMin = quantity <= 1;
  const atMax = quantity >= maxQuantity;

  return (
    <div
      className={`inline-flex items-center border border-line ${compact ? "text-sm" : ""}`}
      role="group"
      aria-label={`${label} quantity`}
    >
      <button
        type="button"
        disabled={disabled || atMin}
        onClick={onDecrease}
        className="flex h-10 w-10 items-center justify-center text-brand transition hover:bg-brand/[0.04] disabled:cursor-not-allowed disabled:opacity-40"
        aria-label={`Decrease quantity for ${label}`}
      >
        −
      </button>
      <span
        className="flex min-w-10 items-center justify-center px-2 text-brand tabular-nums"
        aria-live="polite"
        aria-atomic="true"
      >
        {quantity}
      </span>
      <button
        type="button"
        disabled={disabled || atMax}
        onClick={onIncrease}
        className="flex h-10 w-10 items-center justify-center text-brand transition hover:bg-brand/[0.04] disabled:cursor-not-allowed disabled:opacity-40"
        aria-label={`Increase quantity for ${label}`}
      >
        +
      </button>
    </div>
  );
}
