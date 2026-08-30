"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  LayoutDashboard,
  Package,
  Receipt,
  ShoppingCart,
  UserCog,
  Users,
} from "lucide-react";
import { useState } from "react";
import { usePosStore } from "@/lib/store/pos-store";
import { cn, getInitials, ROLE_LABELS } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/pos", label: "Point of Sale", icon: ShoppingCart },
  { href: "/receipts", label: "Receipts", icon: Receipt },
  { href: "/inventory", label: "Inventory", icon: Package },
  { href: "/reports", label: "Reports", icon: BarChart3 },
  { href: "/customers", label: "Customers", icon: Users },
  { href: "/employees", label: "Staff", icon: UserCog },
];

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const employees = usePosStore((s) => s.employees);
  const activeEmployeeId = usePosStore((s) => s.activeEmployeeId);
  const setActiveEmployee = usePosStore((s) => s.setActiveEmployee);

  const activeEmployee = employees.find((e) => e.id === activeEmployeeId);

  const NavContent = () => (
    <>
      <div
        className="flex min-h-14 flex-col justify-center border-b px-5 py-3"
        style={{ borderColor: "#D4D4D4" }}
      >
        <p className="font-lexend text-sm font-semibold tracking-wide text-black">
          POS SOFTWARE
        </p>
        <p className="font-lexend text-[10px] text-gray-500">
          built by Zenith Media
        </p>
      </div>

      <nav className="flex-1 space-y-1.5 p-4">
        {navItems.map((item) => {
          const active =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "relative flex items-center gap-3 rounded-md py-2.5 pl-3 pr-3 text-[15px] transition-colors",
                active
                  ? "bg-gray-100 font-medium text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              {active && (
                <span className="absolute bottom-2 left-0 top-2 w-0.5 rounded-full bg-orange-600" />
              )}
              <Icon
                className={cn(
                  "h-[18px] w-[18px] shrink-0 stroke-[1.75]",
                  active ? "text-gray-900" : "text-gray-600"
                )}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {activeEmployee && (
        <div className="border-t p-4" style={{ borderColor: "#D4D4D4" }}>
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-200 text-[11px] font-medium text-gray-600">
              {getInitials(activeEmployee.name)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-gray-900">
                {activeEmployee.name}
              </p>
              <select
                value={activeEmployeeId}
                onChange={(e) => setActiveEmployee(e.target.value)}
                className="mt-0.5 w-full truncate bg-transparent text-[11px] text-gray-600 focus:outline-none"
                aria-label="Switch employee"
              >
                {employees
                  .filter((e) => e.status === "active")
                  .map((e) => (
                    <option key={e.id} value={e.id}>
                      {ROLE_LABELS[e.role]}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </>
  );

  return (
    <>
      <button
        className="fixed left-4 top-4 z-40 rounded border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-600 lg:hidden"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        Menu
      </button>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative flex h-full w-60 flex-col bg-[#FAFAFA]">
            <button
              className="absolute right-3 top-4 text-xs text-gray-600"
              onClick={() => setMobileOpen(false)}
            >
              Close
            </button>
            <NavContent />
          </aside>
        </div>
      )}

      <aside className="hidden h-screen w-60 shrink-0 flex-col border-r bg-[#FAFAFA] lg:flex print:hidden" style={{ borderColor: "#D4D4D4" }}>
        <NavContent />
      </aside>
    </>
  );
}
