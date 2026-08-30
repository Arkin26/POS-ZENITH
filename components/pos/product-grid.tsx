"use client";

import { useState } from "react";
import { usePosStore } from "@/lib/store/pos-store";
import { formatCurrency, getStockStatus, inputSearch } from "@/lib/utils";

export function ProductGrid() {
  const products = usePosStore((s) => s.products);
  const addToCart = usePosStore((s) => s.addToCart);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const categories = ["all", ...new Set(products.map((p) => p.category))];

  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "all" || p.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Search products"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={inputSearch}
      />

      <div className="flex flex-wrap gap-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`rounded-md px-2.5 py-1 text-xs ${
              category === cat
                ? "bg-gray-900 text-white"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {cat === "all" ? "All" : cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-4">
        {filtered.map((product) => {
          const status = getStockStatus(product.stock);
          const outOfStock = status === "out";
          return (
            <button
              key={product.id}
              onClick={() => !outOfStock && addToCart(product.id)}
              disabled={outOfStock}
              className="rounded-md border border-[#EBEBEB] bg-white p-3 text-left hover:border-gray-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <p className="text-sm font-medium text-gray-900 line-clamp-2">
                {product.name}
              </p>
              <p className="mt-0.5 font-mono text-[11px] text-gray-600">
                {product.sku}
              </p>
              <p className="tabular-nums mt-2 text-sm font-medium text-gray-900">
                {formatCurrency(product.price)}
              </p>
              <p
                className={`mt-1 text-xs font-medium ${
                  status === "out"
                    ? "text-red-600"
                    : status === "low"
                      ? "text-amber-700"
                      : "text-gray-700"
                }`}
              >
                {status === "out" ? "Out of stock" : `${product.stock} left`}
              </p>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="py-8 text-center text-sm text-gray-600">
          No products found.
        </p>
      )}
    </div>
  );
}
