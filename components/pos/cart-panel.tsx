"use client";

import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/input";
import { usePosStore } from "@/lib/store/pos-store";
import { formatCurrency, pluralize } from "@/lib/utils";

interface CartPanelProps {
  onPay: () => void;
}

export function CartPanel({ onPay }: CartPanelProps) {
  const cart = usePosStore((s) => s.cart);
  const customers = usePosStore((s) => s.customers);
  const selectedCustomerId = usePosStore((s) => s.selectedCustomerId);
  const discount = usePosStore((s) => s.discount);
  const getCartItems = usePosStore((s) => s.getCartItems);
  const getCartTotals = usePosStore((s) => s.getCartTotals);
  const updateCartQuantity = usePosStore((s) => s.updateCartQuantity);
  const removeFromCart = usePosStore((s) => s.removeFromCart);
  const setSelectedCustomer = usePosStore((s) => s.setSelectedCustomer);
  const setDiscount = usePosStore((s) => s.setDiscount);
  const clearCart = usePosStore((s) => s.clearCart);

  const items = getCartItems();
  const { subtotal, tax, total } = getCartTotals();

  return (
    <div className="flex h-full flex-col rounded-md border border-[#EBEBEB] bg-white">
      <div className="border-b border-[#EBEBEB] px-4 py-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-gray-900">Cart</h2>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs text-gray-600 hover:text-gray-700"
            >
              Clear
            </button>
          )}
        </div>
        <p className="text-xs text-gray-600">
          {items.length} {pluralize(items.length, "item")}
        </p>
      </div>

      <div className="flex-1 space-y-0 overflow-y-auto">
        {items.length === 0 ? (
          <p className="px-4 py-8 text-center text-xs text-gray-600">
            Add products to start a sale
          </p>
        ) : (
          items.map((item) => (
            <div
              key={item.productId}
              className="flex gap-3 border-b border-[#EBEBEB] px-4 py-3"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm text-gray-900">{item.name}</p>
                <p className="tabular-nums text-xs text-gray-600">
                  {formatCurrency(item.price)}
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <button
                  onClick={() =>
                    updateCartQuantity(item.productId, item.quantity - 1)
                  }
                  className="hover:text-gray-800"
                >
                  −
                </button>
                <span className="w-4 text-center">{item.quantity}</span>
                <button
                  onClick={() =>
                    updateCartQuantity(item.productId, item.quantity + 1)
                  }
                  className="hover:text-gray-800"
                  disabled={item.quantity >= item.stock}
                >
                  +
                </button>
                <button
                  onClick={() => removeFromCart(item.productId)}
                  className="ml-1 text-gray-600 hover:text-red-500"
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="space-y-3 border-t border-[#EBEBEB] p-4">
        <Select
          label="Customer"
          value={selectedCustomerId || ""}
          onChange={(e) => setSelectedCustomer(e.target.value || null)}
          options={[
            { value: "", label: "Walk-in" },
            ...customers.map((c) => ({
              value: c.id,
              label: c.name,
            })),
          ]}
        />

        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">
            Discount (₹)
          </label>
          <input
            type="number"
            min="0"
            value={discount || ""}
            onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
            className="w-full rounded-md border border-[#EBEBEB] px-3 py-2 text-sm focus:border-gray-300 focus:outline-none"
            placeholder="0.00"
          />
        </div>

        <div className="space-y-1 text-xs">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span className="tabular-nums">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Tax</span>
            <span className="tabular-nums">{formatCurrency(tax)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-gray-600">
              <span>Discount</span>
              <span className="tabular-nums">−{formatCurrency(discount)}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-[#EBEBEB] pt-2 text-sm font-medium text-gray-900">
            <span>Total</span>
            <span className="tabular-nums">{formatCurrency(total)}</span>
          </div>
        </div>

        <Button className="w-full" onClick={onPay} disabled={items.length === 0}>
          Pay now
        </Button>
      </div>
    </div>
  );
}
