import type { Customer, Employee, Order, Product } from "@/types";

export const STORE_NAME = "POS Software Demo Store";

export const seedProducts: Product[] = [
  { id: "p1", name: "Wireless Earbuds", sku: "ELC-001", price: 2499, stock: 45, category: "Electronics", taxRate: 18 },
  { id: "p2", name: "USB-C Cable", sku: "ELC-002", price: 399, stock: 120, category: "Electronics", taxRate: 18 },
  { id: "p3", name: "Phone Case", sku: "ELC-003", price: 599, stock: 8, category: "Electronics", taxRate: 18 },
  { id: "p4", name: "Bluetooth Speaker", sku: "ELC-004", price: 1899, stock: 22, category: "Electronics", taxRate: 18 },
  { id: "p5", name: "Organic Green Tea", sku: "GRO-001", price: 299, stock: 60, category: "Groceries", taxRate: 5 },
  { id: "p6", name: "Almonds 500g", sku: "GRO-002", price: 549, stock: 35, category: "Groceries", taxRate: 5 },
  { id: "p7", name: "Olive Oil 1L", sku: "GRO-003", price: 899, stock: 5, category: "Groceries", taxRate: 5 },
  { id: "p8", name: "Instant Coffee", sku: "GRO-004", price: 449, stock: 0, category: "Groceries", taxRate: 5 },
  { id: "p9", name: "Cotton T-Shirt", sku: "CLT-001", price: 799, stock: 50, category: "Clothing", taxRate: 12 },
  { id: "p10", name: "Denim Jeans", sku: "CLT-002", price: 1999, stock: 18, category: "Clothing", taxRate: 12 },
  { id: "p11", name: "Running Shoes", sku: "CLT-003", price: 3499, stock: 12, category: "Clothing", taxRate: 12 },
  { id: "p12", name: "Wool Scarf", sku: "CLT-004", price: 699, stock: 7, category: "Clothing", taxRate: 12 },
  { id: "p13", name: "Notebook A5", sku: "STN-001", price: 149, stock: 200, category: "Stationery", taxRate: 12 },
  { id: "p14", name: "Ballpoint Pen Pack", sku: "STN-002", price: 99, stock: 150, category: "Stationery", taxRate: 12 },
  { id: "p15", name: "Desk Organizer", sku: "STN-003", price: 449, stock: 30, category: "Stationery", taxRate: 12 },
  { id: "p16", name: "Face Moisturizer", sku: "HLT-001", price: 649, stock: 40, category: "Health", taxRate: 18 },
  { id: "p17", name: "Hand Sanitizer", sku: "HLT-002", price: 199, stock: 80, category: "Health", taxRate: 18 },
  { id: "p18", name: "Vitamin C Tablets", sku: "HLT-003", price: 349, stock: 25, category: "Health", taxRate: 12 },
  { id: "p19", name: "Water Bottle 1L", sku: "ACC-001", price: 499, stock: 55, category: "Accessories", taxRate: 18 },
  { id: "p20", name: "Laptop Sleeve", sku: "ACC-002", price: 899, stock: 15, category: "Accessories", taxRate: 18 },
];

export const seedCustomers: Customer[] = [
  { id: "c1", name: "Priya Sharma", phone: "+91 98765 43210", email: "priya@email.com", loyaltyPoints: 450, totalSpent: 12500 },
  { id: "c2", name: "Rahul Mehta", phone: "+91 87654 32109", email: "rahul@email.com", loyaltyPoints: 120, totalSpent: 3200 },
  { id: "c3", name: "Ananya Patel", phone: "+91 76543 21098", email: "ananya@email.com", loyaltyPoints: 890, totalSpent: 24800 },
  { id: "c4", name: "James Wilson", phone: "+1 555 0101", email: "james@email.com", loyaltyPoints: 200, totalSpent: 5600 },
  { id: "c5", name: "Sarah Chen", phone: "+1 555 0102", email: "sarah@email.com", loyaltyPoints: 75, totalSpent: 1890 },
  { id: "c6", name: "Vikram Singh", phone: "+91 65432 10987", email: "vikram@email.com", loyaltyPoints: 320, totalSpent: 7800 },
  { id: "c7", name: "Emily Brown", phone: "+1 555 0103", email: "emily@email.com", loyaltyPoints: 150, totalSpent: 4100 },
  { id: "c8", name: "Kavya Reddy", phone: "+91 54321 09876", email: "kavya@email.com", loyaltyPoints: 600, totalSpent: 15200 },
  { id: "c9", name: "Michael Lee", phone: "+1 555 0104", email: "michael@email.com", loyaltyPoints: 50, totalSpent: 980 },
  { id: "c10", name: "Neha Gupta", phone: "+91 43210 98765", email: "neha@email.com", loyaltyPoints: 280, totalSpent: 6300 },
];

export const seedEmployees: Employee[] = [
  { id: "e1", name: "Admin User", role: "admin", pin: "0000", status: "active" },
  { id: "e2", name: "Manager Raj", role: "manager", pin: "1111", status: "active" },
  { id: "e3", name: "Cashier Amit", role: "cashier", pin: "2222", status: "active" },
  { id: "e4", name: "Cashier Sita", role: "cashier", pin: "3333", status: "active" },
  { id: "e5", name: "Cashier Tom", role: "cashier", pin: "4444", status: "inactive" },
];

function daysAgo(n: number, hour = 12) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(hour, Math.floor(Math.random() * 60), 0, 0);
  return d.toISOString();
}

function makeOrder(
  id: string,
  receiptNo: string,
  productIds: { id: string; qty: number }[],
  employeeId: string,
  paymentMethod: Order["payment"]["method"],
  daysBack: number,
  customerId?: string,
  discount = 0
): Order {
  const items = productIds.map(({ id: pid, qty }) => {
    const p = seedProducts.find((x) => x.id === pid)!;
    return {
      productId: p.id,
      name: p.name,
      sku: p.sku,
      price: p.price,
      quantity: qty,
      taxRate: p.taxRate,
    };
  });
  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const tax = items.reduce((s, i) => s + (i.price * i.quantity * i.taxRate) / 100, 0);
  const total = subtotal + tax - discount;
  return {
    id,
    receiptNo,
    items,
    subtotal,
    tax,
    discount,
    total,
    customerId,
    employeeId,
    payment: {
      method: paymentMethod,
      amount: total,
      status: "completed",
      metadata:
        paymentMethod === "card"
          ? { cardLast4: "4242" }
          : paymentMethod === "upi"
            ? { upiRef: `UPI${Math.floor(Math.random() * 1000000)}` }
            : paymentMethod === "shopify"
              ? { shopifyTxnId: `shp_${Math.random().toString(36).slice(2, 10)}` }
              : undefined,
    },
    createdAt: daysAgo(daysBack),
  };
}

export const seedOrders: Order[] = [
  makeOrder("o31", "RCP-100031", [{ id: "p15", qty: 1 }, { id: "p14", qty: 2 }], "e4", "card", 0, "c1"),
  makeOrder("o32", "RCP-100032", [{ id: "p18", qty: 2 }], "e3", "upi", 0, "c3"),
  makeOrder("o33", "RCP-100033", [{ id: "p10", qty: 1 }], "e4", "cash", 0),
  makeOrder("o34", "RCP-100034", [{ id: "p4", qty: 1 }, { id: "p2", qty: 1 }], "e3", "shopify", 0, "c5"),
  makeOrder("o35", "RCP-100035", [{ id: "p7", qty: 1 }], "e4", "upi", 0, "c8"),
  makeOrder("o1", "RCP-100001", [{ id: "p1", qty: 1 }, { id: "p2", qty: 2 }], "e3", "upi", 0, "c1"),
  makeOrder("o2", "RCP-100002", [{ id: "p5", qty: 3 }, { id: "p6", qty: 1 }], "e4", "cash", 0, "c2"),
  makeOrder("o3", "RCP-100003", [{ id: "p9", qty: 2 }], "e3", "card", 1, "c3"),
  makeOrder("o4", "RCP-100004", [{ id: "p4", qty: 1 }], "e4", "shopify", 1),
  makeOrder("o5", "RCP-100005", [{ id: "p10", qty: 1 }, { id: "p11", qty: 1 }], "e3", "upi", 2, "c4"),
  makeOrder("o6", "RCP-100006", [{ id: "p13", qty: 5 }], "e4", "cash", 2),
  makeOrder("o7", "RCP-100007", [{ id: "p16", qty: 2 }, { id: "p17", qty: 3 }], "e3", "card", 3, "c5"),
  makeOrder("o8", "RCP-100008", [{ id: "p19", qty: 1 }], "e4", "upi", 3, "c6"),
  makeOrder("o9", "RCP-100009", [{ id: "p3", qty: 1 }, { id: "p20", qty: 1 }], "e3", "shopify", 4, "c7"),
  makeOrder("o10", "RCP-100010", [{ id: "p7", qty: 2 }], "e4", "cash", 4, "c8"),
  makeOrder("o11", "RCP-100011", [{ id: "p1", qty: 1 }], "e3", "card", 5, "c1"),
  makeOrder("o12", "RCP-100012", [{ id: "p11", qty: 1 }], "e4", "upi", 5),
  makeOrder("o13", "RCP-100013", [{ id: "p5", qty: 2 }, { id: "p8", qty: 1 }], "e3", "cash", 6, "c9"),
  makeOrder("o14", "RCP-100014", [{ id: "p14", qty: 10 }], "e4", "card", 7),
  makeOrder("o15", "RCP-100015", [{ id: "p18", qty: 3 }], "e3", "upi", 8, "c10"),
  makeOrder("o16", "RCP-100016", [{ id: "p2", qty: 3 }], "e4", "shopify", 9),
  makeOrder("o17", "RCP-100017", [{ id: "p12", qty: 1 }], "e3", "cash", 10, "c2"),
  makeOrder("o18", "RCP-100018", [{ id: "p15", qty: 2 }], "e4", "card", 12, "c3"),
  makeOrder("o19", "RCP-100019", [{ id: "p4", qty: 1 }, { id: "p19", qty: 2 }], "e3", "upi", 14),
  makeOrder("o20", "RCP-100020", [{ id: "p9", qty: 3 }], "e4", "cash", 15, "c4"),
  makeOrder("o21", "RCP-100021", [{ id: "p1", qty: 2 }], "e3", "card", 18, "c5"),
  makeOrder("o22", "RCP-100022", [{ id: "p6", qty: 2 }], "e4", "upi", 20),
  makeOrder("o23", "RCP-100023", [{ id: "p10", qty: 1 }], "e3", "shopify", 22, "c6"),
  makeOrder("o24", "RCP-100024", [{ id: "p17", qty: 5 }], "e4", "cash", 25),
  makeOrder("o25", "RCP-100025", [{ id: "p3", qty: 2 }], "e3", "card", 28, "c7"),
  makeOrder("o26", "RCP-100026", [{ id: "p20", qty: 1 }], "e4", "upi", 0, "c8"),
  makeOrder("o27", "RCP-100027", [{ id: "p5", qty: 4 }], "e3", "cash", 1),
  makeOrder("o28", "RCP-100028", [{ id: "p11", qty: 1 }, { id: "p12", qty: 1 }], "e4", "shopify", 2, "c9"),
  makeOrder("o29", "RCP-100029", [{ id: "p16", qty: 1 }], "e3", "upi", 3, "c10"),
  makeOrder("o30", "RCP-100030", [{ id: "p13", qty: 8 }], "e4", "card", 6),
];
