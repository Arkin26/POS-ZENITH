"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  seedCustomers,
  seedEmployees,
  seedOrders,
  seedProducts,
} from "@/lib/mock/seed";
import { generateId, generateReceiptNo } from "@/lib/utils";
import type {
  CartItem,
  Customer,
  Employee,
  Order,
  OrderItem,
  Payment,
  Product,
} from "@/types";

interface CartTotals {
  subtotal: number;
  tax: number;
  total: number;
}

interface PosState {
  products: Product[];
  customers: Customer[];
  employees: Employee[];
  orders: Order[];
  cart: CartItem[];
  discount: number;
  selectedCustomerId: string | null;
  activeEmployeeId: string;
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setDiscount: (discount: number) => void;
  setSelectedCustomer: (customerId: string | null) => void;
  setActiveEmployee: (employeeId: string) => void;
  completeOrder: (payment: Payment) => Order | null;
  addProduct: (product: Omit<Product, "id">) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  adjustStock: (id: string, delta: number) => void;
  addCustomer: (customer: Omit<Customer, "id" | "loyaltyPoints" | "totalSpent">) => void;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  addEmployee: (employee: Omit<Employee, "id">) => void;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  getCartTotals: () => CartTotals;
  getCartItems: () => (OrderItem & { stock: number })[];
  resetDemo: () => void;
}

function calcTotals(items: OrderItem[], discount: number): CartTotals {
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const tax = items.reduce(
    (s, i) => s + (i.price * i.quantity * i.taxRate) / 100,
    0
  );
  const total = Math.max(0, subtotal + tax - discount);
  return { subtotal, tax, total };
}

export const usePosStore = create<PosState>()(
  persist(
    (set, get) => ({
      products: seedProducts,
      customers: seedCustomers,
      employees: seedEmployees,
      orders: seedOrders,
      cart: [],
      discount: 0,
      selectedCustomerId: null,
      activeEmployeeId: "e3",

      addToCart: (productId) => {
        const product = get().products.find((p) => p.id === productId);
        if (!product || product.stock <= 0) return;
        set((state) => {
          const existing = state.cart.find((c) => c.productId === productId);
          if (existing) {
            if (existing.quantity >= product.stock) return state;
            return {
              cart: state.cart.map((c) =>
                c.productId === productId
                  ? { ...c, quantity: c.quantity + 1 }
                  : c
              ),
            };
          }
          return { cart: [...state.cart, { productId, quantity: 1 }] };
        });
      },

      removeFromCart: (productId) => {
        set((state) => ({
          cart: state.cart.filter((c) => c.productId !== productId),
        }));
      },

      updateCartQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(productId);
          return;
        }
        const product = get().products.find((p) => p.id === productId);
        if (!product) return;
        const qty = Math.min(quantity, product.stock);
        set((state) => ({
          cart: state.cart.map((c) =>
            c.productId === productId ? { ...c, quantity: qty } : c
          ),
        }));
      },

      clearCart: () => set({ cart: [], discount: 0, selectedCustomerId: null }),

      setDiscount: (discount) => set({ discount: Math.max(0, discount) }),

      setSelectedCustomer: (customerId) =>
        set({ selectedCustomerId: customerId }),

      setActiveEmployee: (employeeId) =>
        set({ activeEmployeeId: employeeId }),

      getCartItems: () => {
        const { cart, products } = get();
        return cart
          .map((item) => {
            const product = products.find((p) => p.id === item.productId);
            if (!product) return null;
            return {
              productId: product.id,
              name: product.name,
              sku: product.sku,
              price: product.price,
              quantity: item.quantity,
              taxRate: product.taxRate,
              stock: product.stock,
            };
          })
          .filter(Boolean) as (OrderItem & { stock: number })[];
      },

      getCartTotals: () => {
        const items = get().getCartItems();
        return calcTotals(items, get().discount);
      },

      completeOrder: (payment) => {
        const items = get().getCartItems();
        if (items.length === 0) return null;

        const { subtotal, tax, total } = calcTotals(items, get().discount);
        const order: Order = {
          id: generateId("order"),
          receiptNo: generateReceiptNo(),
          items: items.map(({ stock: _, ...rest }) => rest),
          subtotal,
          tax,
          discount: get().discount,
          total,
          customerId: get().selectedCustomerId ?? undefined,
          employeeId: get().activeEmployeeId,
          payment: { ...payment, amount: total, status: "completed" },
          createdAt: new Date().toISOString(),
        };

        set((state) => {
          const updatedProducts = state.products.map((p) => {
            const cartItem = items.find((i) => i.productId === p.id);
            if (!cartItem) return p;
            return { ...p, stock: p.stock - cartItem.quantity };
          });

          const updatedCustomers = state.customers.map((c) => {
            if (c.id !== state.selectedCustomerId) return c;
            return {
              ...c,
              totalSpent: c.totalSpent + total,
              loyaltyPoints: c.loyaltyPoints + Math.floor(total / 100),
            };
          });

          return {
            products: updatedProducts,
            customers: updatedCustomers,
            orders: [order, ...state.orders],
            cart: [],
            discount: 0,
            selectedCustomerId: null,
          };
        });

        return order;
      },

      addProduct: (product) => {
        set((state) => ({
          products: [
            ...state.products,
            { ...product, id: generateId("product") },
          ],
        }));
      },

      updateProduct: (id, updates) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id ? { ...p, ...updates } : p
          ),
        }));
      },

      deleteProduct: (id) => {
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        }));
      },

      adjustStock: (id, delta) => {
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id
              ? { ...p, stock: Math.max(0, p.stock + delta) }
              : p
          ),
        }));
      },

      addCustomer: (customer) => {
        set((state) => ({
          customers: [
            ...state.customers,
            {
              ...customer,
              id: generateId("customer"),
              loyaltyPoints: 0,
              totalSpent: 0,
            },
          ],
        }));
      },

      updateCustomer: (id, updates) => {
        set((state) => ({
          customers: state.customers.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
        }));
      },

      deleteCustomer: (id) => {
        set((state) => ({
          customers: state.customers.filter((c) => c.id !== id),
        }));
      },

      addEmployee: (employee) => {
        set((state) => ({
          employees: [
            ...state.employees,
            { ...employee, id: generateId("employee") },
          ],
        }));
      },

      updateEmployee: (id, updates) => {
        set((state) => ({
          employees: state.employees.map((e) =>
            e.id === id ? { ...e, ...updates } : e
          ),
        }));
      },

      deleteEmployee: (id) => {
        set((state) => ({
          employees: state.employees.filter((e) => e.id !== id),
        }));
      },

      resetDemo: () => {
        set({
          products: seedProducts,
          customers: seedCustomers,
          employees: seedEmployees,
          orders: seedOrders,
          cart: [],
          discount: 0,
          selectedCustomerId: null,
          activeEmployeeId: "e3",
        });
      },
    }),
    {
      name: "pos-demo-store-v2",
      partialize: (state) => ({
        products: state.products,
        customers: state.customers,
        employees: state.employees,
        orders: state.orders,
        activeEmployeeId: state.activeEmployeeId,
      }),
    }
  )
);
