export function formatPrice(amount: number): string {
  return `₹${amount.toFixed(2)}`;
}

export function formatPriceShort(amount: number): string {
  return `₹${amount.toFixed(0)}`;
}
