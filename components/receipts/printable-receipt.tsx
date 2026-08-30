"use client";

import { STORE_NAME } from "@/lib/mock/seed";
import { formatCurrency, formatDate, PAYMENT_LABELS } from "@/lib/utils";
import type { Order } from "@/types";

interface PrintableReceiptProps {
  order: Order;
  employeeName: string;
  customerName?: string;
}

export function PrintableReceipt({
  order,
  employeeName,
  customerName,
}: PrintableReceiptProps) {
  const cgst = order.tax / 2;
  const sgst = order.tax / 2;

  return (
    <div className="mx-auto max-w-sm bg-white p-6 font-mono text-sm text-black">
      <div className="text-center">
        <h2 className="text-lg font-bold">{STORE_NAME}</h2>
        <p className="text-xs text-gray-600">123 Demo Street, Mumbai</p>
        <p className="text-xs text-gray-600">GSTIN: 27AAAAA0000A1Z5</p>
      </div>

      <div className="my-4 border-t border-dashed border-gray-400" />

      <div className="space-y-1 text-xs">
        <p>Receipt: {order.receiptNo}</p>
        <p>Date: {formatDate(order.createdAt)}</p>
        <p>Cashier: {employeeName}</p>
        {customerName && <p>Customer: {customerName}</p>}
      </div>

      <div className="my-4 border-t border-dashed border-gray-400" />

      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-gray-300">
            <th className="py-1 text-left">Item</th>
            <th className="py-1 text-right">Qty</th>
            <th className="py-1 text-right">Amt</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item) => (
            <tr key={item.productId}>
              <td className="py-1">{item.name}</td>
              <td className="py-1 text-right">{item.quantity}</td>
              <td className="py-1 text-right">
                {formatCurrency(item.price * item.quantity)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="my-4 border-t border-dashed border-gray-400" />

      <div className="space-y-1 text-xs">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatCurrency(order.subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>CGST</span>
          <span>{formatCurrency(cgst)}</span>
        </div>
        <div className="flex justify-between">
          <span>SGST</span>
          <span>{formatCurrency(sgst)}</span>
        </div>
        {order.discount > 0 && (
          <div className="flex justify-between">
            <span>Discount</span>
            <span>-{formatCurrency(order.discount)}</span>
          </div>
        )}
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span>{formatCurrency(order.total)}</span>
        </div>
      </div>

      <div className="my-4 border-t border-dashed border-gray-400" />

      <div className="text-xs">
        <p>
          Payment: {PAYMENT_LABELS[order.payment.method]}
        </p>
        {order.payment.metadata?.changeDue !== undefined && (
          <p>Change: {formatCurrency(order.payment.metadata.changeDue)}</p>
        )}
        {order.payment.metadata?.cardLast4 && (
          <p>Card: **** {order.payment.metadata.cardLast4}</p>
        )}
        {order.payment.metadata?.upiRef && (
          <p>Ref: {order.payment.metadata.upiRef}</p>
        )}
        {order.payment.metadata?.shopifyTxnId && (
          <p>Shopify: {order.payment.metadata.shopifyTxnId}</p>
        )}
      </div>

      <div className="my-4 border-t border-dashed border-gray-400" />

      <p className="text-center text-xs">Thank you for shopping!</p>
    </div>
  );
}
