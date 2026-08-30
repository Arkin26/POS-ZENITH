"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { CartPanel } from "@/components/pos/cart-panel";
import { PaymentModal } from "@/components/pos/payment-modal";
import { ProductGrid } from "@/components/pos/product-grid";
import { ReceiptDetail } from "@/components/receipts/receipt-detail";
import { usePosStore } from "@/lib/store/pos-store";
import type { Order } from "@/types";

export default function PosPage() {
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const getCartTotals = usePosStore((s) => s.getCartTotals);
  const employees = usePosStore((s) => s.employees);
  const customers = usePosStore((s) => s.customers);
  const activeEmployeeId = usePosStore((s) => s.activeEmployeeId);

  const { total } = getCartTotals();
  const activeEmployee = employees.find((e) => e.id === activeEmployeeId);

  const handleComplete = (order: Order) => {
    setCompletedOrder(order);
  };

  const customerName = completedOrder?.customerId
    ? customers.find((c) => c.id === completedOrder.customerId)?.name
    : undefined;

  return (
    <AppShell title="Point of Sale">
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ProductGrid />
        </div>
        <div className="lg:sticky lg:top-6 lg:self-start">
          <CartPanel onPay={() => setPaymentOpen(true)} />
        </div>
      </div>

      <PaymentModal
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        total={total}
        onComplete={handleComplete}
      />

      <ReceiptDetail
        order={completedOrder}
        employeeName={activeEmployee?.name || "Staff"}
        customerName={customerName}
        onClose={() => setCompletedOrder(null)}
      />
    </AppShell>
  );
}
