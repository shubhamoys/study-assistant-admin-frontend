/** `price` is stored in paise (see DATABASE_DESIGN.md §4.3) — formats as a rupee amount, e.g. 49900 -> "₹499". */
export function formatPrice(paise: number): string {
  const rupees = paise / 100;
  return `₹${Number.isInteger(rupees) ? rupees : rupees.toFixed(2)}`;
}
