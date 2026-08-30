import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: "INR" | "USD" = "INR") {
  return new Intl.NumberFormat(currency === "INR" ? "en-IN" : "en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatLongDate(date: string | Date) {
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(date));
}

export function pluralize(count: number, singular: string, plural?: string) {
  return count === 1 ? singular : (plural ?? `${singular}s`);
}

export function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function formatDateShort(date: string | Date) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function generateId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export function generateReceiptNo() {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `RCP-${num}`;
}

export function isToday(date: string) {
  const d = new Date(date);
  const now = new Date();
  return (
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  );
}

export function isWithinDays(date: string, days: number) {
  const d = new Date(date);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  return diff >= 0 && diff <= days * 24 * 60 * 60 * 1000;
}

export const LOW_STOCK_THRESHOLD = 10;

export function getStockStatus(stock: number) {
  if (stock <= 0) return "out" as const;
  if (stock <= LOW_STOCK_THRESHOLD) return "low" as const;
  return "in" as const;
}

export const PAYMENT_LABELS: Record<string, string> = {
  cash: "Cash",
  card: "Card",
  upi: "UPI",
  shopify: "Shopify",
};

export const ROLE_LABELS: Record<string, string> = {
  cashier: "Cashier",
  manager: "Manager",
  admin: "Admin",
};

/** Readable secondary text — avoid gray-400 */
export const textLabel =
  "text-[11px] font-medium uppercase tracking-wide text-gray-600";
export const textMuted = "text-gray-600";
export const textBody = "text-gray-700";
export const textAction = "text-gray-600 hover:text-gray-800";
export const inputSearch =
  "w-full rounded-md border border-[#EBEBEB] bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-500 focus:border-gray-300 focus:outline-none";

export const CHART_COLOR = "#EA580C";

export const chartTooltipStyle = {
  borderRadius: 4,
  border: "1px solid #EBEBEB",
  fontSize: 12,
} as const;

export const chartActiveDot = {
  r: 4,
  fill: CHART_COLOR,
  stroke: "#fff",
  strokeWidth: 2,
} as const;
