"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { usePosStore } from "@/lib/store/pos-store";
import { formatCurrency, inputSearch, textBody, textLabel, textMuted } from "@/lib/utils";
import type { Customer } from "@/types";

const emptyForm = { name: "", phone: "", email: "" };

export default function CustomersPage() {
  const customers = usePosStore((s) => s.customers);
  const orders = usePosStore((s) => s.orders);
  const addCustomer = usePosStore((s) => s.addCustomer);
  const updateCustomer = usePosStore((s) => s.updateCustomer);
  const deleteCustomer = usePosStore((s) => s.deleteCustomer);

  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editing, setEditing] = useState<Customer | null>(null);
  const [selected, setSelected] = useState<Customer | null>(null);
  const [form, setForm] = useState(emptyForm);

  const filtered = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (customer: Customer) => {
    setEditing(customer);
    setForm({
      name: customer.name,
      phone: customer.phone,
      email: customer.email,
    });
    setModalOpen(true);
  };

  const openDetail = (customer: Customer) => {
    setSelected(customer);
    setDetailOpen(true);
  };

  const handleSave = () => {
    if (!form.name) return;
    if (editing) {
      updateCustomer(editing.id, form);
    } else {
      addCustomer(form);
    }
    setModalOpen(false);
  };

  const customerOrders = selected
    ? orders.filter((o) => o.customerId === selected.id)
    : [];

  return (
    <AppShell
      title="Customers"
      actions={
        <Button size="sm" onClick={openAdd}>
          Add customer
        </Button>
      }
    >
      <div className="mb-6 max-w-md">
        <input
          type="text"
          placeholder="Search customers"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={inputSearch}
        />
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#EBEBEB] text-left">
            <th className="pb-2 text-[11px] font-medium uppercase tracking-wide text-gray-600">
              Name
            </th>
            <th className="pb-2 text-[11px] font-medium uppercase tracking-wide text-gray-600">
              Phone
            </th>
            <th className="pb-2 text-[11px] font-medium uppercase tracking-wide text-gray-600">
              Email
            </th>
            <th className="pb-2 text-[11px] font-medium uppercase tracking-wide text-gray-600">
              Loyalty
            </th>
            <th className="pb-2 text-[11px] font-medium uppercase tracking-wide text-gray-600">
              Total spent
            </th>
            <th className="pb-2 text-[11px] font-medium uppercase tracking-wide text-gray-600">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((customer) => (
            <tr
              key={customer.id}
              className="cursor-pointer border-b border-[#EBEBEB] hover:bg-gray-50"
              onClick={() => openDetail(customer)}
            >
              <td className="py-3 font-medium text-gray-900">{customer.name}</td>
              <td className="py-3 text-gray-700">{customer.phone}</td>
              <td className="py-3 text-gray-700">{customer.email}</td>
              <td className="py-3 text-gray-700">
                {customer.loyaltyPoints} pts
              </td>
              <td className="tabular-nums py-3 text-gray-900">
                {formatCurrency(customer.totalSpent)}
              </td>
              <td className="py-3" onClick={(e) => e.stopPropagation()}>
                <div className="flex gap-3 text-xs text-gray-600">
                  <button
                    onClick={() => openEdit(customer)}
                    className="hover:text-gray-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteCustomer(customer.id)}
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
        title={editing ? "Edit customer" : "Add customer"}
      >
        <div className="space-y-4 p-6">
          <Input
            label="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            label="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
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

      <Modal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        title={selected?.name || "Customer"}
        size="lg"
      >
        {selected && (
          <div className="space-y-4 p-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-gray-600">Phone</p>
                <p className="font-medium">{selected.phone}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Email</p>
                <p className="font-medium">{selected.email}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Loyalty points</p>
                <p className="font-medium">{selected.loyaltyPoints}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Total spent</p>
                <p className="tabular-nums font-medium">
                  {formatCurrency(selected.totalSpent)}
                </p>
              </div>
            </div>

            <div>
              <h4 className="mb-2 text-sm font-medium text-gray-900">
                Purchase history ({customerOrders.length})
              </h4>
              {customerOrders.length === 0 ? (
                <p className="text-xs text-gray-600">No orders yet.</p>
              ) : (
                <div className="max-h-48 space-y-0 overflow-y-auto">
                  {customerOrders.map((o) => (
                    <div
                      key={o.id}
                      className="flex justify-between border-b border-[#EBEBEB] py-2 text-sm"
                    >
                      <span className="font-mono text-xs text-gray-700">
                        {o.receiptNo}
                      </span>
                      <span className="tabular-nums font-medium text-gray-900">
                        {formatCurrency(o.total)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </AppShell>
  );
}
