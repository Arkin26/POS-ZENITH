"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { StockBadge } from "@/components/inventory/stock-badge";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { usePosStore } from "@/lib/store/pos-store";
import { formatCurrency, inputSearch, textBody, textLabel } from "@/lib/utils";
import type { Product } from "@/types";

const emptyProduct = {
  name: "",
  sku: "",
  price: 0,
  stock: 0,
  category: "Electronics",
  taxRate: 18,
};

export default function InventoryPage() {
  const products = usePosStore((s) => s.products);
  const addProduct = usePosStore((s) => s.addProduct);
  const updateProduct = usePosStore((s) => s.updateProduct);
  const deleteProduct = usePosStore((s) => s.deleteProduct);
  const adjustStock = usePosStore((s) => s.adjustStock);

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyProduct);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditing(null);
    setForm(emptyProduct);
    setModalOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditing(product);
    setForm({
      name: product.name,
      sku: product.sku,
      price: product.price,
      stock: product.stock,
      category: product.category,
      taxRate: product.taxRate,
    });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.sku) return;
    if (editing) {
      updateProduct(editing.id, form);
    } else {
      addProduct(form);
    }
    setModalOpen(false);
  };

  const categories = [...new Set(products.map((p) => p.category))];

  return (
    <AppShell
      title="Inventory"
      actions={
        <Button size="sm" onClick={openAdd}>
          Add product
        </Button>
      }
    >
      <div className="mb-6 max-w-md">
        <input
          type="text"
          placeholder="Search products"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={inputSearch}
        />
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#EBEBEB] text-left">
            <th className="pb-2 text-[11px] font-medium uppercase tracking-wide text-gray-600">
              Product
            </th>
            <th className="pb-2 text-[11px] font-medium uppercase tracking-wide text-gray-600">
              SKU
            </th>
            <th className="pb-2 text-[11px] font-medium uppercase tracking-wide text-gray-600">
              Category
            </th>
            <th className="pb-2 text-[11px] font-medium uppercase tracking-wide text-gray-600">
              Price
            </th>
            <th className="pb-2 text-[11px] font-medium uppercase tracking-wide text-gray-600">
              Stock
            </th>
            <th className="pb-2 text-[11px] font-medium uppercase tracking-wide text-gray-600">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((product) => (
            <tr key={product.id} className="border-b border-[#EBEBEB]">
              <td className="py-3 font-medium text-gray-900">{product.name}</td>
              <td className="py-3 font-mono text-xs text-gray-700">
                {product.sku}
              </td>
              <td className="py-3 text-gray-700">{product.category}</td>
              <td className="tabular-nums py-3 text-gray-900">
                {formatCurrency(product.price)}
              </td>
              <td className="py-3">
                <div className="flex items-center gap-3">
                  <StockBadge stock={product.stock} />
                  <span className="text-xs text-gray-600">
                    <button
                      onClick={() => adjustStock(product.id, -1)}
                      className="hover:text-gray-700"
                    >
                      −
                    </button>
                    {" / "}
                    <button
                      onClick={() => adjustStock(product.id, 1)}
                      className="hover:text-gray-700"
                    >
                      +
                    </button>
                  </span>
                </div>
              </td>
              <td className="py-3">
                <div className="flex gap-3 text-xs text-gray-600">
                  <button
                    onClick={() => openEdit(product)}
                    className="hover:text-gray-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="hover:text-red-600"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit product" : "Add product"}
      >
        <div className="space-y-4 p-6">
          <Input
            label="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            label="SKU"
            value={form.sku}
            onChange={(e) => setForm({ ...form, sku: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price"
              type="number"
              value={form.price || ""}
              onChange={(e) =>
                setForm({ ...form, price: parseFloat(e.target.value) || 0 })
              }
            />
            <Input
              label="Stock"
              type="number"
              value={form.stock || ""}
              onChange={(e) =>
                setForm({ ...form, stock: parseInt(e.target.value) || 0 })
              }
            />
          </div>
          <Select
            label="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            options={categories.map((c) => ({ value: c, label: c }))}
          />
          <Input
            label="Tax rate (%)"
            type="number"
            value={form.taxRate || ""}
            onChange={(e) =>
              setForm({ ...form, taxRate: parseFloat(e.target.value) || 0 })
            }
          />
          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleSave}>
              Save
            </Button>
          </div>
        </div>
      </Modal>
    </AppShell>
  );
}
