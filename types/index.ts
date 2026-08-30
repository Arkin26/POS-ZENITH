export type PaymentMethod = "cash" | "card" | "upi" | "shopify";
export type EmployeeRole = "cashier" | "manager" | "admin";
export type EmployeeStatus = "active" | "inactive";

export interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock: number;
  category: string;
  taxRate: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  loyaltyPoints: number;
  totalSpent: number;
}

export interface Employee {
  id: string;
  name: string;
  role: EmployeeRole;
  pin: string;
  status: EmployeeStatus;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  taxRate: number;
}

export interface PaymentMetadata {
  changeDue?: number;
  amountTendered?: number;
  cardLast4?: string;
  upiRef?: string;
  shopifyTxnId?: string;
}

export interface Payment {
  method: PaymentMethod;
  amount: number;
  status: "completed" | "pending" | "failed";
  metadata?: PaymentMetadata;
}

export interface Order {
  id: string;
  receiptNo: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  customerId?: string;
  employeeId: string;
  payment: Payment;
  createdAt: string;
}

export type DateRange = "today" | "7days" | "30days";
