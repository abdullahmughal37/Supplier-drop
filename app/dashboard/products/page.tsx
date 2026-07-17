"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Search, Truck, PackageOpen } from "lucide-react";
import { MerchantShell } from "@/components/merchant-shell";
import { ProductThumb } from "@/components/shell";
import { getDataService } from "@/lib/services";
import type { Product } from "@/lib/types";

const PAGE_SIZE = 24;

export default function ProductCatalog() {
  const [products, setProducts] = useState<Product[]>([]);
  const [queryText, setQueryText] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => getDataService().watchProducts(false, setProducts), []);

  // Reset paging whenever the filter changes.
  useEffect(() => setVisibleCount(PAGE_SIZE), [queryText, category]);

  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category).filter(Boolean))) as string[],
    [products]
  );

  const filtered = useMemo(() => {
    const q = queryText.trim().toLowerCase();
    return products.filter(
      (p) =>
        (!category || p.category === category) &&
        (!q ||
          p.name.toLowerCase().includes(q) ||
          (p.supplier || "").toLowerCase().includes(q) ||
          (p.sku || "").toLowerCase().includes(q))
    );
  }, [products, queryText, category]);

  return (
    <MerchantShell
      title="Products"
      subtitle="Browse the catalog and source any product over WhatsApp."
      actions={
        <div className="hidden w-[260px] max-w-[32vw] items-center gap-2 rounded-xl border border-line bg-white px-3.5 py-[9px] text-[13.5px] md:flex">
          <Search size={16} className="text-gray-400" />
          <input
            placeholder="Search products, suppliers…"
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            className="w-full bg-transparent outline-none placeholder:text-gray-400"
          />
        </div>
      }
    >
      {/* Mobile search */}
      <div className="flex items-center gap-2 rounded-xl border border-line bg-white px-3.5 py-[9px] text-[13.5px] md:hidden">
        <Search size={16} className="text-gray-400" />
        <input
          placeholder="Search products, suppliers…"
          value={queryText}
          onChange={(e) => setQueryText(e.target.value)}
          className="w-full bg-transparent outline-none placeholder:text-gray-400"
        />
      </div>

      {/* Category chips */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setCategory(null)}
            className={`rounded-full px-4 py-2 text-[13px] font-semibold transition ${
              !category ? "bg-ink text-white" : "border border-line bg-white text-[#374151] hover:border-gray-300"
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(category === c ? null : c)}
              className={`rounded-full px-4 py-2 text-[13px] font-semibold transition ${
                category === c ? "bg-ink text-white" : "border border-line bg-white text-[#374151] hover:border-gray-300"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      )}

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="grid place-items-center rounded-[18px] border border-line bg-white px-6 py-20 text-center">
          <PackageOpen size={34} className="text-gray-300" />
          <p className="mt-4 font-display text-lg font-bold">No products found</p>
          <p className="mt-1 text-[13.5px] text-muted">
            {products.length === 0 ? "The catalog is empty — check back soon." : "Try a different search or category."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(255px,1fr))] gap-5">
          {filtered.slice(0, visibleCount).map((p) => (
            <Link
              key={p.id}
              href={`/dashboard/products/${p.id}`}
              className="group overflow-hidden rounded-2xl border border-line bg-white transition hover:-translate-y-1 hover:shadow-card"
            >
              <div className="relative aspect-[4/3]">
                <ProductThumb src={p.images[0]} name={p.name} className="h-full w-full" />
                {p.margin && (
                  <span className="absolute left-3 top-3 rounded-full bg-[#ECFDF3] px-2.5 py-[5px] text-xs font-bold text-[#16A34A]">
                    {p.margin} margin
                  </span>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-baseline justify-between gap-2">
                  <h3 className="truncate font-display text-[16.5px] font-bold">{p.name}</h3>
                  {p.rating && <span className="whitespace-nowrap text-[13px] font-semibold text-brand">★ {p.rating}</span>}
                </div>
                <div className="mt-2.5 flex flex-wrap gap-x-3.5 gap-y-1 text-[13px] text-muted">
                  {p.shipping && (
                    <span className="inline-flex items-center gap-1.5">
                      <Truck size={13} /> {p.shipping}
                    </span>
                  )}
                  {p.supplier && <span>{p.supplier}</span>}
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="font-display text-lg font-extrabold">${p.price.toFixed(2)}</span>
                  {p.suggestedRetail && (
                    <span className="text-[12.5px] text-muted">retail ${p.suggestedRetail.toFixed(2)}</span>
                  )}
                </div>
                <span className="mt-4 block w-full rounded-[11px] bg-ink py-3 text-center text-sm font-semibold text-white transition group-hover:bg-brand">
                  View &amp; source
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {filtered.length > visibleCount && (
        <button
          onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
          className="mx-auto rounded-xl border-[1.5px] border-ink px-8 py-3 text-[14px] font-semibold transition hover:bg-ink hover:text-white"
        >
          Show more ({filtered.length - visibleCount} remaining)
        </button>
      )}
    </MerchantShell>
  );
}
