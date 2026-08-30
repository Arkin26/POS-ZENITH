"use client";

import { formatLongDate } from "@/lib/utils";

export function Header({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  return (
    <header className="border-b bg-white px-6 py-6 print:hidden" style={{ borderColor: "#D4D4D4" }}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="pl-12 lg:pl-0">
          <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
          <p className="mt-1 text-[0.9rem] text-gray-600">
            {subtitle ?? formatLongDate(new Date())}
          </p>
        </div>
        {actions && (
          <div className="flex items-center gap-3 pl-12 lg:pl-0">{actions}</div>
        )}
      </div>
    </header>
  );
}
