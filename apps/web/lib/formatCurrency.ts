export function formatCurrency(value: number) {
  if (!value) return "₹0";

  const abs = Math.abs(value);

  if (abs >= 10000000) {
    return `₹${(value / 10000000).toFixed(2)} Cr`;
  }

  if (abs >= 100000) {
    return `₹${(value / 100000).toFixed(2)} L`;
  }

  if (abs >= 1000) {
    return `₹${(value / 1000).toFixed(1)} K`;
  }

  return `₹${value.toLocaleString("en-IN")}`;
}