"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { StatGrid } from "@/components/ui/stat-grid";
import { usePosStore } from "@/lib/store/pos-store";
import {
  formatCurrency,
  getStockStatus,
  isToday,
  isWithinDays,
  pluralize,
  PAYMENT_LABELS,
  CHART_COLOR,
  chartActiveDot,
  chartTooltipStyle,
  textBody,
  textLabel,
  textMuted,
} from "@/lib/utils";

export default function DashboardPage() {
  const orders = usePosStore((s) => s.orders);
  const products = usePosStore((s) => s.products);

  const todayOrders = orders.filter((o) => isToday(o.createdAt));
  const yesterdayOrders = orders.filter((o) => isWithinDays(o.createdAt, 2) && !isToday(o.createdAt));

  const todayRevenue = todayOrders.reduce((s, o) => s + o.total, 0);
  const yesterdayRevenue = yesterdayOrders.reduce((s, o) => s + o.total, 0);
  const revenueChange =
    yesterdayRevenue > 0
      ? ((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100
      : null;

  const lowStockProducts = products
    .filter((p) => getStockStatus(p.stock) !== "in")
    .sort((a, b) => a.stock - b.stock);

  const lowStockDotColors = ["bg-blue-500", "bg-orange-500", "bg-emerald-500"];

  const getAttentionDotColor = (stock: number, index: number) => {
    if (stock === 0) return "bg-amber-500";
    const nonZeroIndex = lowStockProducts
      .slice(0, index)
      .filter((p) => p.stock > 0).length;
    return lowStockDotColors[nonZeroIndex % lowStockDotColors.length];
  };

  const recentOrders = [...orders]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 10);

  const dailyRevenue = useMemo(() => {
    const map: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      map[key] = 0;
    }
    orders.forEach((o) => {
      const key = o.createdAt.split("T")[0];
      if (key in map) map[key] += o.total;
    });
    return Object.entries(map).map(([date, revenue]) => {
      const d = new Date(date);
      return {
        day: d.toLocaleDateString("en-IN", { weekday: "short" }),
        revenue: Math.round(revenue * 100) / 100,
      };
    });
  }, [orders]);

  const stats = [
    {
      label: "Today's revenue",
      value: formatCurrency(todayRevenue),
      caption:
        revenueChange !== null
          ? `${revenueChange >= 0 ? "+" : ""}${revenueChange.toFixed(1)}% vs yesterday`
          : "vs yesterday",
      captionPositive: revenueChange !== null && revenueChange >= 0,
    },
    {
      label: "Orders",
      value: todayOrders.length.toString(),
      caption: `${todayOrders.length} today`,
      captionPositive: true,
    },
    {
      label: "Average order",
      value: formatCurrency(
        todayOrders.length ? todayRevenue / todayOrders.length : 0
      ),
      caption: "per transaction",
      captionPositive: false,
    },
    {
      label: "Low stock",
      value: lowStockProducts.length.toString(),
      caption:
        lowStockProducts.length > 0
          ? `${lowStockProducts.length} ${pluralize(lowStockProducts.length, "item")} need reorder`
          : "all stocked",
      captionPositive: false,
      captionWarning: lowStockProducts.length > 0,
    },
  ];

  return (
    <AppShell
      title="Dashboard"
      actions={
        <>
          <Button variant="ghost" size="md" className="px-4 py-2 text-[0.9rem]">
            Export
          </Button>
          <Link href="/pos">
            <Button size="md" className="px-4 py-2 text-[0.9rem]">
              New sale +
            </Button>
          </Link>
        </>
      }
    >
      <StatGrid
        flushTop
        stats={stats.map((stat) => ({
          label: stat.label,
          value: stat.value,
          caption: stat.caption,
          captionClassName: stat.captionWarning
            ? "text-amber-600"
            : stat.captionPositive
              ? "text-emerald-600"
              : undefined,
        }))}
      />

      <div className="mt-8 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <h2 className="text-sm font-semibold text-gray-900">
                Recent orders
              </h2>
              <span className={`text-xs ${textMuted}`}>
                · {todayOrders.length} today
              </span>
            </div>
            <Link
              href="/receipts"
              className={`text-xs ${textMuted} hover:text-gray-800`}
            >
              View all
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <p className={`text-sm ${textMuted}`}>No orders yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#EBEBEB] text-left">
                  <th className={`pb-2 text-left ${textLabel}`}>
                    Order
                  </th>
                  <th className={`pb-2 text-left ${textLabel}`}>
                    Items
                  </th>
                  <th className={`pb-2 text-left ${textLabel}`}>
                    Method
                  </th>
                  <th className={`pb-2 text-right ${textLabel}`}>
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-[#EBEBEB] last:border-0"
                  >
                    <td className={`py-3 font-mono text-xs ${textBody}`}>
                      {order.receiptNo}
                    </td>
                    <td className={`py-3 ${textBody}`}>
                      {order.items.length}{" "}
                      {pluralize(order.items.length, "item")}
                    </td>
                    <td className={`py-3 ${textBody}`}>
                      {PAYMENT_LABELS[order.payment.method]}
                    </td>
                    <td className="tabular-nums py-3 text-right font-medium text-gray-900">
                      {formatCurrency(order.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="mb-4 text-sm font-semibold text-gray-900">
              Revenue, last 7 days
            </h2>
            <ResponsiveContainer width="100%" height={168}>
              <AreaChart
                data={dailyRevenue}
                margin={{ top: 12, right: 4, left: 4, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={CHART_COLOR} stopOpacity={0.22} />
                    <stop offset="100%" stopColor={CHART_COLOR} stopOpacity={0.04} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="day"
                  axisLine={{ stroke: "#D4D4D4", strokeWidth: 1 }}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "#6B7280" }}
                  dy={10}
                />
                <YAxis hide domain={[0, "auto"]} />
                <Tooltip
                  formatter={(value) => formatCurrency(Number(value))}
                  contentStyle={chartTooltipStyle}
                  cursor={{ stroke: CHART_COLOR, strokeWidth: 1 }}
                />
                <Area
                  type="linear"
                  dataKey="revenue"
                  stroke={CHART_COLOR}
                  strokeWidth={2}
                  fill="url(#revenueFill)"
                  dot={false}
                  activeDot={chartActiveDot}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h2 className="mb-3 text-sm font-semibold text-gray-900">
              Needs attention
            </h2>
            {lowStockProducts.length === 0 ? (
              <p className={`text-sm ${textMuted}`}>Nothing flagged.</p>
            ) : (
              <ul>
                {lowStockProducts.slice(0, 5).map((product, index) => (
                  <li
                    key={product.id}
                    className="flex items-center justify-between border-b border-[#D4D4D4] py-3.5 text-sm last:border-0"
                  >
                    <span className="flex items-center gap-2.5 text-gray-700">
                      <span
                        className={`h-2 w-2 shrink-0 rounded-full ${getAttentionDotColor(product.stock, index)}`}
                      />
                      {product.name}
                    </span>
                    <span className={`${textBody} font-medium`}>{product.stock} left</span>
                  </li>
                ))}
              </ul>
            )}
            <Link
              href="/inventory"
              className={`mt-4 inline-block text-sm ${textMuted} hover:text-gray-800`}
            >
              Open inventory
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
