import { getStockStatus } from "@/lib/utils";

export function StockBadge({ stock }: { stock: number }) {
  const status = getStockStatus(stock);
  const labels = {
    in: `${stock} in stock`,
    low: `${stock} left`,
    out: "Out of stock",
  };
  const colors = {
    in: "text-gray-700",
    low: "text-amber-600",
    out: "text-red-600",
  };
  return (
    <span className={`text-xs ${colors[status]}`}>{labels[status]}</span>
  );
}
