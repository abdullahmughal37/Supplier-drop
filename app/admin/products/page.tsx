"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Papa from "papaparse";
import {
  Plus, Upload, Download, Pencil, Trash2, X, Search, ImagePlus, Loader2, AlertCircle, CheckCircle2,
} from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { ProductThumb } from "@/components/shell";
import { getDataService } from "@/lib/services";
import type { Product, ProductInput } from "@/lib/types";

const inputCls =
  "w-full rounded-xl border-[1.5px] border-line px-[13px] py-[10px] text-[14px] outline-none transition focus:border-brand focus:shadow-[0_0_0_3px_rgba(255,106,61,0.15)]";
const labelCls = "flex flex-col gap-[6px] text-[13px] font-semibold";

const EMPTY: ProductInput = {
  name: "",
  description: "",
  price: 0,
  suggestedRetail: undefined,
  margin: undefined,
  rating: undefined,
  shipping: undefined,
  supplier: undefined,
  category: undefined,
  sku: undefined,
  stock: undefined,
  images: [],
  active: true,
};

const CSV_COLUMNS = [
  "name", "description", "price", "suggestedRetail", "margin", "rating",
  "shipping", "supplier", "category", "sku", "stock", "images", "active",
] as const;

/** Parse one CSV row into a ProductInput; returns an error string when invalid. */
function rowToProduct(row: Record<string, string>): ProductInput | string {
  const name = (row.name || "").trim();
  const price = parseFloat(row.price);
  if (!name) return "missing name";
  if (!isFinite(price) || price < 0) return `"${name}": invalid price`;
  const num = (v?: string) => {
    const n = parseFloat(v || "");
    return isFinite(n) ? n : undefined;
  };
  const str = (v?: string) => {
    const s = (v || "").trim();
    return s || undefined;
  };
  return {
    name: name.slice(0, 200),
    description: (row.description || "").trim().slice(0, 5000),
    price,
    suggestedRetail: num(row.suggestedRetail),
    margin: str(row.margin),
    rating: str(row.rating),
    shipping: str(row.shipping),
    supplier: str(row.supplier),
    category: str(row.category),
    sku: str(row.sku),
    stock: num(row.stock),
    images: (row.images || "")
      .split(";")
      .map((s) => s.trim())
      .filter((s) => /^https?:\/\//.test(s)),
    active: (row.active || "true").trim().toLowerCase() !== "false",
  };
}

const PAGE_SIZE = 25;

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [queryText, setQueryText] = useState("");
  const [editing, setEditing] = useState<Product | "new" | null>(null);
  const [toast, setToast] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const [importing, setImporting] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const csvInput = useRef<HTMLInputElement>(null);

  useEffect(() => getDataService().watchProducts(true, setProducts), []);

  // Reset paging whenever the search changes.
  useEffect(() => setVisibleCount(PAGE_SIZE), [queryText]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 6000);
    return () => clearTimeout(t);
  }, [toast]);

  const filtered = useMemo(() => {
    const q = queryText.trim().toLowerCase();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.sku || "").toLowerCase().includes(q) ||
        (p.supplier || "").toLowerCase().includes(q) ||
        (p.category || "").toLowerCase().includes(q)
    );
  }, [products, queryText]);

  const downloadTemplate = () => {
    const sample = [
      CSV_COLUMNS.join(","),
      `"Aura Desk Lamp","Minimal aluminum desk lamp",14.20,44.99,68%,4.9,"4–6 days","Lumina Co.","Home & Office",SD-1001,860,"https://example.com/lamp.jpg;https://example.com/lamp2.jpg",true`,
    ].join("\n");
    const url = URL.createObjectURL(new Blob([sample], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "supplierdrop-products-template.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const onCsvFile = (file: File) => {
    setImporting(true);
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (result) => {
        try {
          const goods: ProductInput[] = [];
          const errors: string[] = [];
          for (const row of result.data) {
            const parsed = rowToProduct(row);
            if (typeof parsed === "string") errors.push(parsed);
            else goods.push(parsed);
          }
          if (goods.length === 0) {
            setToast({ kind: "err", text: `No valid rows found. ${errors[0] ? `First problem: ${errors[0]}` : "Check the template format."}` });
          } else {
            const n = await getDataService().importProducts(goods);
            setToast({
              kind: "ok",
              text: `Imported ${n} product${n === 1 ? "" : "s"}${errors.length ? ` · ${errors.length} row(s) skipped (${errors[0]}…)` : ""}`,
            });
          }
        } catch (e: any) {
          setToast({ kind: "err", text: e?.message || "Import failed." });
        } finally {
          setImporting(false);
          if (csvInput.current) csvInput.current.value = "";
        }
      },
      error: () => {
        setToast({ kind: "err", text: "Could not parse that CSV file." });
        setImporting(false);
      },
    });
  };

  const remove = async (p: Product) => {
    if (!window.confirm(`Delete "${p.name}" permanently? Merchants will no longer see it.`)) return;
    await getDataService().deleteProduct(p.id);
    setToast({ kind: "ok", text: `Deleted "${p.name}".` });
  };

  const toggleActive = async (p: Product) => {
    await getDataService().updateProduct(p.id, { active: !p.active });
  };

  return (
    <AdminShell
      title="Products"
      subtitle={`${products.length} products · ${products.filter((p) => p.active).length} visible to merchants`}
      actions={
        <div className="hidden w-[220px] max-w-[26vw] items-center gap-2 rounded-xl border border-line bg-white px-3.5 py-[9px] text-[13.5px] md:flex">
          <Search size={16} className="text-gray-400" />
          <input
            placeholder="Search products…"
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            className="w-full bg-transparent outline-none placeholder:text-gray-400"
          />
        </div>
      }
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={() => setEditing("new")}
          className="inline-flex items-center gap-2 rounded-xl bg-brand px-5 py-2.5 text-[13.5px] font-semibold text-white shadow-brand transition hover:bg-brand-hover"
        >
          <Plus size={15} /> Add product
        </button>
        <button
          onClick={() => csvInput.current?.click()}
          disabled={importing}
          className="inline-flex items-center gap-2 rounded-xl border-[1.5px] border-ink px-5 py-2.5 text-[13.5px] font-semibold transition hover:bg-ink hover:text-white disabled:opacity-60"
        >
          {importing ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
          {importing ? "Importing…" : "Import CSV"}
        </button>
        <button
          onClick={downloadTemplate}
          className="inline-flex items-center gap-2 rounded-xl border border-line bg-white px-5 py-2.5 text-[13.5px] font-semibold text-[#374151] transition hover:border-gray-300"
        >
          <Download size={15} /> CSV template
        </button>
        <input
          ref={csvInput}
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && onCsvFile(e.target.files[0])}
        />
      </div>

      {toast && (
        <div
          role={toast.kind === "err" ? "alert" : "status"}
          className={`flex items-start gap-2.5 rounded-xl border px-4 py-3 text-[13.5px] font-medium ${
            toast.kind === "ok"
              ? "border-[#BBF7D0] bg-[#F0FDF4] text-[#15803D]"
              : "border-[#FECACA] bg-[#FEF2F2] text-[#B91C1C]"
          }`}
        >
          {toast.kind === "ok" ? <CheckCircle2 size={16} className="mt-0.5 flex-none" /> : <AlertCircle size={16} className="mt-0.5 flex-none" />}
          <span>{toast.text}</span>
        </div>
      )}

      {/* Table */}
      <section className="overflow-hidden rounded-[18px] border border-line bg-white">
        <div className="overflow-x-auto">
          <div className="min-w-[820px]">
            <div className="grid grid-cols-[56px_1.8fr_1fr_1fr_0.7fr_0.6fr_0.9fr_0.8fr] items-center gap-3 bg-[#FBFBFC] px-6 py-3 text-[11.5px] font-semibold uppercase tracking-[0.05em] text-gray-400">
              <span />
              <span>Product</span>
              <span>Category</span>
              <span>Supplier</span>
              <span>Price</span>
              <span>Stock</span>
              <span>Visible</span>
              <span className="text-right">Actions</span>
            </div>
            {filtered.slice(0, visibleCount).map((p) => (
              <div
                key={p.id}
                className="grid grid-cols-[56px_1.8fr_1fr_1fr_0.7fr_0.6fr_0.9fr_0.8fr] items-center gap-3 border-t border-[#F0F1F3] px-6 py-3 text-[13.5px]"
              >
                <ProductThumb src={p.images[0]} name={p.name} className="h-11 w-11 rounded-[10px] border border-line" />
                <span className="min-w-0">
                  <span className="block truncate font-semibold">{p.name}</span>
                  <span className="block text-[12px] text-muted">{p.sku || "no SKU"}</span>
                </span>
                <span className="truncate text-muted">{p.category || "—"}</span>
                <span className="truncate text-muted">{p.supplier || "—"}</span>
                <span className="font-semibold">${p.price.toFixed(2)}</span>
                <span className="text-muted">{p.stock ?? "—"}</span>
                <span>
                  <button
                    onClick={() => toggleActive(p)}
                    role="switch"
                    aria-checked={p.active}
                    aria-label={`${p.active ? "Hide" : "Show"} ${p.name}`}
                    className={`relative h-6 w-11 rounded-full transition ${p.active ? "bg-success" : "bg-gray-200"}`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${p.active ? "left-[22px]" : "left-0.5"}`}
                    />
                  </button>
                </span>
                <span className="flex justify-end gap-1.5">
                  <button
                    onClick={() => setEditing(p)}
                    aria-label={`Edit ${p.name}`}
                    className="grid h-9 w-9 place-items-center rounded-[10px] border border-line text-[#374151] transition hover:border-brand hover:text-brand"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => remove(p)}
                    aria-label={`Delete ${p.name}`}
                    className="grid h-9 w-9 place-items-center rounded-[10px] border border-line text-[#374151] transition hover:border-[#DC2626] hover:text-[#DC2626]"
                  >
                    <Trash2 size={15} />
                  </button>
                </span>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="px-6 py-14 text-center text-[13.5px] text-muted">
                {products.length === 0 ? "No products yet — add one or import a CSV." : "No products match your search."}
              </div>
            )}
            {filtered.length > visibleCount && (
              <div className="border-t border-[#F0F1F3] px-6 py-4 text-center">
                <button
                  onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
                  className="rounded-xl border border-line px-6 py-2.5 text-[13px] font-semibold text-[#374151] transition hover:border-gray-300"
                >
                  Show more ({filtered.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {editing && (
        <ProductFormModal
          product={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={(msg) => {
            setEditing(null);
            setToast({ kind: "ok", text: msg });
          }}
        />
      )}
    </AdminShell>
  );
}

function ProductFormModal({
  product,
  onClose,
  onSaved,
}: {
  product: Product | null;
  onClose: () => void;
  onSaved: (msg: string) => void;
}) {
  const [form, setForm] = useState<ProductInput>(
    product
      ? { ...EMPTY, ...product }
      : EMPTY
  );
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [urlDraft, setUrlDraft] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  const set = <K extends keyof ProductInput>(key: K, value: ProductInput[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const uploadFiles = async (files: FileList) => {
    setError(null);
    setUploading(true);
    try {
      const svc = getDataService();
      const urls: string[] = [];
      for (const file of Array.from(files).slice(0, 6)) {
        urls.push(await svc.uploadImage(file));
      }
      set("images", [...form.images, ...urls].slice(0, 8));
    } catch (e: any) {
      setError(e?.message || "Image upload failed.");
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  };

  const addUrl = () => {
    const url = urlDraft.trim();
    if (!/^https?:\/\/.+/.test(url)) {
      setError("Image URLs must start with http:// or https://");
      return;
    }
    setError(null);
    set("images", [...form.images, url].slice(0, 8));
    setUrlDraft("");
  };

  const save = async () => {
    setError(null);
    if (form.name.trim().length < 2) {
      setError("Product name is required.");
      return;
    }
    if (!isFinite(form.price) || form.price < 0) {
      setError("Price must be a positive number.");
      return;
    }
    setBusy(true);
    try {
      const svc = getDataService();
      const payload: ProductInput = { ...form, name: form.name.trim(), description: form.description.trim() };
      if (product) {
        await svc.updateProduct(product.id, payload);
        onSaved(`Updated "${payload.name}".`);
      } else {
        await svc.createProduct(payload);
        onSaved(`Added "${payload.name}" to the catalog.`);
      }
    } catch (e: any) {
      setError(e?.message || "Could not save the product.");
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-ink/45 p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={product ? "Edit product" : "Add product"}
        className="w-full max-w-[640px] animate-fadeUp rounded-2xl bg-white p-6 shadow-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-extrabold">{product ? "Edit product" : "Add product"}</h2>
          <button onClick={onClose} aria-label="Close" className="grid h-9 w-9 place-items-center rounded-[10px] border border-line text-[#374151] hover:border-gray-300">
            <X size={16} />
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className={`${labelCls} sm:col-span-2`}>
            Name *
            <input className={inputCls} value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Aura Desk Lamp" />
          </label>
          <label className={`${labelCls} sm:col-span-2`}>
            Description
            <textarea
              className={`${inputCls} resize-none`}
              rows={4}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
              placeholder="What is it, why does it sell, what's in the box…"
            />
          </label>
          <label className={labelCls}>
            Supplier cost (USD) *
            <input
              className={inputCls}
              type="number"
              min={0}
              step="0.01"
              value={form.price === 0 && !product ? "" : form.price}
              onChange={(e) => set("price", parseFloat(e.target.value) || 0)}
              placeholder="14.20"
            />
          </label>
          <label className={labelCls}>
            Suggested retail (USD)
            <input
              className={inputCls}
              type="number"
              min={0}
              step="0.01"
              value={form.suggestedRetail ?? ""}
              onChange={(e) => set("suggestedRetail", e.target.value === "" ? undefined : parseFloat(e.target.value) || 0)}
              placeholder="44.99"
            />
          </label>
          <label className={labelCls}>
            Category
            <input className={inputCls} value={form.category ?? ""} onChange={(e) => set("category", e.target.value || undefined)} placeholder="Home & Office" />
          </label>
          <label className={labelCls}>
            Supplier
            <input className={inputCls} value={form.supplier ?? ""} onChange={(e) => set("supplier", e.target.value || undefined)} placeholder="Lumina Co." />
          </label>
          <label className={labelCls}>
            SKU
            <input className={inputCls} value={form.sku ?? ""} onChange={(e) => set("sku", e.target.value || undefined)} placeholder="SD-1001" />
          </label>
          <label className={labelCls}>
            Stock
            <input
              className={inputCls}
              type="number"
              min={0}
              value={form.stock ?? ""}
              onChange={(e) => set("stock", e.target.value === "" ? undefined : parseInt(e.target.value) || 0)}
              placeholder="860"
            />
          </label>
          <label className={labelCls}>
            Shipping time
            <input className={inputCls} value={form.shipping ?? ""} onChange={(e) => set("shipping", e.target.value || undefined)} placeholder="4–6 days" />
          </label>
          <label className={labelCls}>
            Margin badge
            <input className={inputCls} value={form.margin ?? ""} onChange={(e) => set("margin", e.target.value || undefined)} placeholder="68%" />
          </label>
          <label className={labelCls}>
            Rating
            <input className={inputCls} value={form.rating ?? ""} onChange={(e) => set("rating", e.target.value || undefined)} placeholder="4.9" />
          </label>
          <label className="flex items-center gap-2.5 self-end pb-2 text-[13.5px] font-semibold">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) => set("active", e.target.checked)}
              className="h-4 w-4 cursor-pointer accent-brand"
            />
            Visible to merchants
          </label>

          {/* Images */}
          <div className="sm:col-span-2">
            <span className="text-[13px] font-semibold">Photos (max 8)</span>
            <div className="mt-2 flex flex-wrap gap-2.5">
              {form.images.map((src, i) => (
                <div key={i} className="relative">
                  <ProductThumb src={src} name={`photo ${i + 1}`} className="h-16 w-16 rounded-xl border border-line" />
                  <button
                    onClick={() => set("images", form.images.filter((_, j) => j !== i))}
                    aria-label="Remove photo"
                    className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-ink text-white hover:bg-[#DC2626]"
                  >
                    <X size={11} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => fileInput.current?.click()}
                disabled={uploading || form.images.length >= 8}
                className="grid h-16 w-16 place-items-center rounded-xl border-[1.5px] border-dashed border-line text-gray-400 transition hover:border-brand hover:text-brand disabled:opacity-50"
                aria-label="Upload photos"
              >
                {uploading ? <Loader2 size={18} className="animate-spin" /> : <ImagePlus size={18} />}
              </button>
              <input
                ref={fileInput}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => e.target.files?.length && uploadFiles(e.target.files)}
              />
            </div>
            <div className="mt-2.5 flex gap-2">
              <input
                className={inputCls}
                value={urlDraft}
                onChange={(e) => setUrlDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addUrl())}
                placeholder="…or paste an image URL and press Add"
              />
              <button
                onClick={addUrl}
                className="flex-none rounded-xl border border-line px-4 text-[13px] font-semibold text-[#374151] hover:border-gray-300"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div role="alert" className="mt-4 flex items-start gap-2.5 rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-[13px] font-medium text-[#B91C1C]">
            <AlertCircle size={15} className="mt-0.5 flex-none" /> <span>{error}</span>
          </div>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-xl border border-line px-5 py-2.5 text-[13.5px] font-semibold text-[#374151] hover:border-gray-300">
            Cancel
          </button>
          <button
            onClick={save}
            disabled={busy || uploading}
            className="rounded-xl bg-brand px-6 py-2.5 text-[13.5px] font-semibold text-white shadow-brand transition hover:bg-brand-hover disabled:opacity-60"
          >
            {busy ? "Saving…" : product ? "Save changes" : "Add product"}
          </button>
        </div>
      </div>
    </div>
  );
}
