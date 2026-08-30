"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { usePosStore } from "@/lib/store/pos-store";
import { ROLE_LABELS, textBody, textLabel } from "@/lib/utils";
import type { Employee, EmployeeRole, EmployeeStatus } from "@/types";

const rolePermissions: Record<EmployeeRole, string> = {
  cashier: "Process sales",
  manager: "Discounts and refunds",
  admin: "Full access",
};

const emptyForm = {
  name: "",
  role: "cashier" as EmployeeRole,
  pin: "",
  status: "active" as EmployeeStatus,
};

export default function EmployeesPage() {
  const employees = usePosStore((s) => s.employees);
  const addEmployee = usePosStore((s) => s.addEmployee);
  const updateEmployee = usePosStore((s) => s.updateEmployee);
  const deleteEmployee = usePosStore((s) => s.deleteEmployee);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [form, setForm] = useState(emptyForm);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (employee: Employee) => {
    setEditing(employee);
    setForm({
      name: employee.name,
      role: employee.role,
      pin: employee.pin,
      status: employee.status,
    });
    setModalOpen(true);
  };

  const handleSave = () => {
    if (!form.name || !form.pin) return;
    if (editing) {
      updateEmployee(editing.id, form);
    } else {
      addEmployee(form);
    }
    setModalOpen(false);
  };

  return (
    <AppShell
      title="Staff"
      actions={
        <Button size="sm" onClick={openAdd}>
          Add staff
        </Button>
      }
    >
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#EBEBEB] text-left">
            <th className="pb-2 text-[11px] font-medium uppercase tracking-wide text-gray-600">
              Name
            </th>
            <th className="pb-2 text-[11px] font-medium uppercase tracking-wide text-gray-600">
              Role
            </th>
            <th className="pb-2 text-[11px] font-medium uppercase tracking-wide text-gray-600">
              Access
            </th>
            <th className="pb-2 text-[11px] font-medium uppercase tracking-wide text-gray-600">
              PIN
            </th>
            <th className="pb-2 text-[11px] font-medium uppercase tracking-wide text-gray-600">
              Status
            </th>
            <th className="pb-2 text-[11px] font-medium uppercase tracking-wide text-gray-600">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id} className="border-b border-[#EBEBEB]">
              <td className="py-3 font-medium text-gray-900">{employee.name}</td>
              <td className="py-3 text-gray-700">
                {ROLE_LABELS[employee.role]}
              </td>
              <td className="py-3 text-gray-700">
                {rolePermissions[employee.role]}
              </td>
              <td className="py-3 font-mono text-xs text-gray-700">
                {employee.pin}
              </td>
              <td className="py-3 text-gray-700">{employee.status}</td>
              <td className="py-3">
                <div className="flex gap-3 text-xs text-gray-600">
                  <button
                    onClick={() => openEdit(employee)}
                    className="hover:text-gray-700"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteEmployee(employee.id)}
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
        title={editing ? "Edit staff" : "Add staff"}
      >
        <div className="space-y-4 p-6">
          <Input
            label="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Select
            label="Role"
            value={form.role}
            onChange={(e) =>
              setForm({ ...form, role: e.target.value as EmployeeRole })
            }
            options={[
              { value: "cashier", label: "Cashier" },
              { value: "manager", label: "Manager" },
              { value: "admin", label: "Admin" },
            ]}
          />
          <Input
            label="PIN"
            value={form.pin}
            onChange={(e) => setForm({ ...form, pin: e.target.value })}
            maxLength={4}
          />
          <Select
            label="Status"
            value={form.status}
            onChange={(e) =>
              setForm({ ...form, status: e.target.value as EmployeeStatus })
            }
            options={[
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
            ]}
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
