"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell } from "@/components/layout/app-shell";
import { StatGrid } from "@/components/ui/stat-grid";
import { usePosStore } from "@/lib/store/pos-store";
import {
  formatCurrency,
  formatDateShort,
  CHART_COLOR,
  chartActiveDot,
  chartTooltipStyle,
  isToday,
  isWithinDays,
  PAYMENT_LABELS,
  textBody,
  textLabel,
  textMuted,
} from "@/lib/utils";
import type { DateRange } from "@/types";

export default function ReportsPage() {
  const orders = usePosStore((s) => s.orders);
  const [range, setRange] = useState<DateRange>("7days");

  const filtered = useMemo(() => {
    if (range === "today") return orders.filter((o) => isToday(o.createdAt));
    if (range === "7days")
      return orders.filter((o) => isWithinDays(o.createdAt, 7));
    return orders.filter((o) => isWithinDays(o.createdAt, 30));
  }, [orders, range]);

  const revenue = filtered.reduce((s, o) => s + o.total, 0);
  const orderCount = filtered.length;
  const avgOrder = orderCount ? revenue / orderCount : 0;

  const paymentCounts: Record<string, number> = {};
  filtered.forEach((o) => {
    paymentCounts[o.payment.method] =
      (paymentCounts[o.payment.method] || 0) + 1;
  });
  const topPayment = Object.entries(paymentCounts).sort(
    (a, b) => b[1] - a[1]
  )[0];

  const dailyRevenue = useMemo(() => {
    const days = range === "today" ? 1 : range === "7days" ? 7 : 30;
    const map: Record<string, number> = {};
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      map[key] = 0;
    }
    filtered.forEach((o) => {
      const key = o.createdAt.split("T")[0];
      if (key in map) map[key] += o.total;
    });
    return Object.entries(map).map(([date, total]) => ({
      date: formatDateShort(date),
      revenue: Math.round(total),
    }));
  }, [filtered, range]);

  const categorySales = useMemo(() => {
    const map: Record<string, number> = {};
    filtered.forEach((o) => {
      o.items.forEach((item) => {
        const products = usePosStore.getState().products;
        const product = products.find((p) => p.id === item.productId);
        const cat = product?.category || "Other";
        map[cat] = (map[cat] || 0) + item.price * item.quantity;
      });
    });
    return Object.entries(map)
      .map(([category, sales]) => ({ category, sales: Math.round(sales) }))
      .sort((a, b) => b.sales - a.sales);
  }, [filtered]);

  const ranges: { id: DateRange; label: string }[] = [
    { id: "today", label: "Today" },
    { id: "7days", label: "7 days" },
    { id: "30days", label: "30 days" },
  ];

  const stats = [
    { label: "Revenue", value: formatCurrency(revenue) },
    { label: "Orders", value: orderCount.toString() },
    { label: "Average order", value: formatCurrency(avgOrder) },
    {
      label: "Top payment",
      value: topPayment ? PAYMENT_LABELS[topPayment[0]] : "—",
    },
  ];

  return (
    <AppShell title="Reports">
      <div className="mb-6 flex gap-1 px-0">
        {ranges.map((r) => (
          <button
            key={r.id}
            onClick={() => setRange(r.id)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium ${
              range === r.id
                ? "bg-gray-900 text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>

      <StatGrid stats={stats} />

      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <div>
          <h3 className="mb-4 text-sm font-semibold text-gray-900">
            Revenue trend
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={dailyRevenue}>
              <CartesianGrid stroke="#EBEBEB" strokeDasharray="0" vertical={false} />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#6B7280" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#6B7280" }}
              />
              <Tooltip
                formatter={(value) => formatCurrency(Number(value))}
                contentStyle={chartTooltipStyle}
                cursor={{ stroke: CHART_COLOR, strokeWidth: 1 }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke={CHART_COLOR}
                strokeWidth={1.5}
                dot={false}
                activeDot={chartActiveDot}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold text-gray-900">
            Sales by category
          </h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={categorySales}>
              <CartesianGrid stroke="#EBEBEB" strokeDasharray="0" vertical={false} />
              <XAxis
                dataKey="category"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#6B7280" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "#6B7280" }}
              />
              <Tooltip
                formatter={(value) => formatCurrency(Number(value))}
                contentStyle={chartTooltipStyle}
                cursor={{ fill: "color-mix(in srgb, #EA580C 10%, transparent)" }}
              />
              <Bar dataKey="sales" fill={CHART_COLOR} radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-sm font-semibold text-gray-900">
          Recent transactions
        </h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#EBEBEB] text-left">
              <th className="pb-2 text-[11px] font-medium uppercase tracking-wide text-gray-600">
                Receipt
              </th>
              <th className="pb-2 text-[11px] font-medium uppercase tracking-wide text-gray-600">
                Date
              </th>
              <th className="pb-2 text-[11px] font-medium uppercase tracking-wide text-gray-600">
                Payment
              </th>
              <th className="pb-2 text-right text-[11px] font-medium uppercase tracking-wide text-gray-600">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 10).map((order) => (
              <tr key={order.id} className="border-b border-[#EBEBEB]">
                <td className="py-3 font-mono text-xs text-gray-700">
                  {order.receiptNo}
                </td>
                <td className="py-3 text-gray-700">
                  {formatDateShort(order.createdAt)}
                </td>
                <td className="py-3 text-gray-700">
                  {PAYMENT_LABELS[order.payment.method]}
                </td>
                <td className="tabular-nums py-3 text-right font-medium text-gray-900">
                  {formatCurrency(order.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
