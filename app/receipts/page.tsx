"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { ReceiptDetail } from "@/components/receipts/receipt-detail";
import { usePosStore } from "@/lib/store/pos-store";
import {
  formatCurrency,
  formatDate,
  inputSearch,
  PAYMENT_LABELS,
  pluralize,
  textBody,
  textLabel,
  textMuted,
} from "@/lib/utils";
import type { Order } from "@/types";

export default function ReceiptsPage() {
  const orders = usePosStore((s) => s.orders);
  const employees = usePosStore((s) => s.employees);
  const customers = usePosStore((s) => s.customers);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Order | null>(null);

  const filtered = orders.filter(
    (o) =>
      o.receiptNo.toLowerCase().includes(search.toLowerCase()) ||
      PAYMENT_LABELS[o.payment.method]
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  const getEmployeeName = (id: string) =>
    employees.find((e) => e.id === id)?.name || "Unknown";

  const getCustomerName = (id?: string) =>
    id ? customers.find((c) => c.id === id)?.name : undefined;

  return (
    <AppShell title="Receipts">
      <div className="mb-6 max-w-md">
        <input
          type="text"
          placeholder="Search receipt or payment method"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={inputSearch}
        />
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#EBEBEB] text-left">
            <th className={textLabel}>Receipt</th>
            <th className={textLabel}>Date</th>
            <th className={textLabel}>Items</th>
            <th className={textLabel}>Payment</th>
            <th className={textLabel}>Cashier</th>
            <th className={`text-right ${textLabel}`}>Total</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((order) => (
            <tr
              key={order.id}
              onClick={() => setSelected(order)}
              className="cursor-pointer border-b border-[#EBEBEB] hover:bg-gray-50"
            >
              <td className={`py-3 font-mono text-xs ${textBody}`}>
                {order.receiptNo}
              </td>
              <td className={`py-3 ${textBody}`}>
                {formatDate(order.createdAt)}
              </td>
              <td className={`py-3 ${textBody}`}>
                {order.items.length}{" "}
                {pluralize(order.items.length, "item")}
              </td>
              <td className={`py-3 ${textBody}`}>
                {PAYMENT_LABELS[order.payment.method]}
              </td>
              <td className={`py-3 ${textBody}`}>
                {getEmployeeName(order.employeeId)}
              </td>
              <td className="tabular-nums py-3 text-right font-medium text-gray-900">
                {formatCurrency(order.total)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filtered.length === 0 && (
        <p className={`py-12 text-center text-sm ${textMuted}`}>
          No receipts found.
        </p>
      )}

      <ReceiptDetail
        order={selected}
        employeeName={selected ? getEmployeeName(selected.employeeId) : ""}
        customerName={
          selected ? getCustomerName(selected.customerId) : undefined
        }
        onClose={() => setSelected(null)}
      />
    </AppShell>
  );
}
