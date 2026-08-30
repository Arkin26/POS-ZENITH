"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { usePosStore } from "@/lib/store/pos-store";
import { formatCurrency } from "@/lib/utils";
import type { Order, PaymentMethod } from "@/types";

const methods: { id: PaymentMethod; label: string }[] = [
  { id: "cash", label: "Cash" },
  { id: "card", label: "Card" },
  { id: "upi", label: "UPI" },
  { id: "shopify", label: "Shopify" },
];

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  total: number;
  onComplete: (order: Order) => void;
}

export function PaymentModal({
  open,
  onClose,
  total,
  onComplete,
}: PaymentModalProps) {
  const completeOrder = usePosStore((s) => s.completeOrder);
  const [method, setMethod] = useState<PaymentMethod>("cash");
  const [amountTendered, setAmountTendered] = useState("");
  const [processing, setProcessing] = useState(false);
  const [upiConfirmed, setUpiConfirmed] = useState(false);

  const tendered = parseFloat(amountTendered) || 0;
  const changeDue = Math.max(0, tendered - total);

  const reset = () => {
    setMethod("cash");
    setAmountTendered("");
    setProcessing(false);
    setUpiConfirmed(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const finish = async (
    payment: Parameters<typeof completeOrder>[0]
  ) => {
    setProcessing(true);
    await new Promise((r) => setTimeout(r, 1200));
    const order = completeOrder(payment);
    setProcessing(false);
    if (order) {
      onComplete(order);
      reset();
      onClose();
    }
  };

  const handlePay = () => {
    if (method === "cash") {
      if (tendered < total) return;
      finish({
        method: "cash",
        amount: total,
        status: "completed",
        metadata: { amountTendered: tendered, changeDue },
      });
    } else if (method === "card") {
      finish({
        method: "card",
        amount: total,
        status: "completed",
        metadata: { cardLast4: "4242" },
      });
    } else if (method === "upi") {
      if (!upiConfirmed) return;
      finish({
        method: "upi",
        amount: total,
        status: "completed",
        metadata: { upiRef: `UPI${Date.now().toString().slice(-8)}` },
      });
    } else if (method === "shopify") {
      finish({
        method: "shopify",
        amount: total,
        status: "completed",
        metadata: {
          shopifyTxnId: `shp_${Math.random().toString(36).slice(2, 12)}`,
        },
      });
    }
  };

  return (
    <Modal open={open} onClose={handleClose} title="Take Payment" size="lg">
      <div className="p-6">
        <div className="mb-6 border-b border-[#EBEBEB] pb-4">
          <p className="text-xs text-gray-600">Amount due</p>
          <p className="tabular-nums text-2xl font-semibold text-gray-900">
            {formatCurrency(total)}
          </p>
        </div>

        <div className="mb-6 flex gap-1 border-b border-[#EBEBEB]">
          {methods.map((m) => (
            <button
              key={m.id}
              onClick={() => {
                setMethod(m.id);
                setUpiConfirmed(false);
              }}
              className={`flex-1 border-b-2 px-3 py-2 text-sm ${
                method === m.id
                  ? "border-gray-900 font-medium text-gray-900"
                  : "border-transparent text-gray-600 hover:text-gray-800"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {method === "cash" && (
          <div className="space-y-4">
            <Input
              label="Amount tendered"
              type="number"
              min={total}
              step="1"
              placeholder={total.toString()}
              value={amountTendered}
              onChange={(e) => setAmountTendered(e.target.value)}
            />
            {tendered >= total && (
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-gray-700">Change due</p>
                <p className="text-xl font-semibold text-gray-900">
                  {formatCurrency(changeDue)}
                </p>
              </div>
            )}
          </div>
        )}

        {method === "card" && (
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-32 w-48 items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50">
              <div>
                <p className="text-sm font-medium text-gray-700">
                  Tap or swipe card
                </p>
                <p className="mt-1 text-xs text-gray-600">
                  Visa · Mastercard · Amex
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-700">
              International card payment (demo)
            </p>
          </div>
        )}

        {method === "upi" && (
          <div className="space-y-4 text-center">
            <div className="mx-auto flex h-40 w-40 items-center justify-center rounded-xl border border-gray-200 bg-white">
              <div className="grid grid-cols-5 gap-1 p-2">
                {Array.from({ length: 25 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-3 w-3 ${i % 3 === 0 ? "bg-gray-900" : "bg-gray-200"}`}
                  />
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-600">
              Scan with PhonePe, GPay, or Paytm
            </p>
            <Button
              variant={upiConfirmed ? "secondary" : "primary"}
              onClick={() => setUpiConfirmed(true)}
              className="w-full"
            >
              {upiConfirmed ? "Payment received ✓" : "Confirm UPI payment"}
            </Button>
          </div>
        )}

        {method === "shopify" && (
          <div className="space-y-4 text-center">
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
              <p className="text-lg font-semibold text-gray-900">
                Pay with Shopify
              </p>
              <p className="mt-2 text-sm text-gray-700">
                Redirects to Shopify checkout (simulated)
              </p>
              <p className="mt-4 text-2xl font-bold text-orange-600">
                {formatCurrency(total)}
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            className="flex-1"
            onClick={handlePay}
            disabled={
              processing ||
              (method === "cash" && tendered < total) ||
              (method === "upi" && !upiConfirmed)
            }
          >
            {processing ? "Processing..." : "Complete payment"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
