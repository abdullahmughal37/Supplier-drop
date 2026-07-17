"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Box, MessageCircle, Clock, CheckCircle2, ArrowRight, Plus } from "lucide-react";
import { MerchantShell } from "@/components/merchant-shell";
import { fmtDate, requestStatusStyles } from "@/components/shell";
import { useAuth } from "@/lib/auth-context";
import { getDataService } from "@/lib/services";
import type { Product, SourcingRequest } from "@/lib/types";
import { StatCard } from "@/components/shell";

export default function MerchantDashboard() {
  const { user, profile } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [requests, setRequests] = useState<SourcingRequest[]>([]);

  useEffect(() => {
    const svc = getDataService();
    const u1 = svc.watchProducts(false, setProducts);
    const u2 = user ? svc.watchMyRequests(user.uid, setRequests) : undefined;
    return () => {
      u1();
      u2?.();
    };
  }, [user]);

  const pending = requests.filter((r) => r.status === "new" || r.status === "contacted").length;
  const closed = requests.filter((r) => r.status === "closed").length;

  // Requests per week over the last 12 weeks (oldest → newest).
  const weekly = useMemo(() => {
    const now = Date.now();
    const wk = 7 * 86400000;
    const counts = Array.from({ length: 12 }, (_, i) => {
      const start = now - (12 - i) * wk;
      return requests.filter((r) => r.createdAt >= start && r.createdAt < start + wk).length;
    });
    const max = Math.max(1, ...counts);
    return counts.map((c) => ({ count: c, pct: Math.max(6, Math.round((c / max) * 100)) }));
  }, [requests]);

  const firstName = (profile?.name || "there").split(" ")[0];

  return (
    <MerchantShell
      title="Dashboard"
      subtitle={`Good to see you, ${firstName}. Here's your sourcing activity.`}
      actions={
        <Link
          href="/dashboard/products"
          className="hidden items-center gap-2 rounded-[10px] bg-brand px-[18px] py-2.5 text-[13px] font-semibold text-white shadow-brand transition hover:bg-brand-hover sm:inline-flex"
        >
          <Plus size={14} /> Source a product
        </Link>
      }
    >
      {/* STAT CARDS */}
      <section aria-label="Key metrics" className="grid grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-4">
        <StatCard label="Products available" value={String(products.length)} delta="live in catalog" Icon={Box} />
        <StatCard label="My requests" value={String(requests.length)} delta="all time" Icon={MessageCircle} />
        <StatCard label="Awaiting reply" value={String(pending)} delta="new + contacted" Icon={Clock} />
        <StatCard label="Closed" value={String(closed)} delta="completed requests" up Icon={CheckCircle2} />
      </section>

      {/* ACTIVITY + NEW ARRIVALS */}
      <section className="grid grid-cols-1 gap-4 lg:grid-cols-[1.7fr_1fr]">
        <div className="rounded-[18px] border border-line bg-white p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-base font-bold">Sourcing activity</h2>
              <p className="mt-[3px] text-[12.5px] text-muted">Requests per week · last 12 weeks</p>
            </div>
          </div>
          <div className="mt-6 flex h-[200px] items-end gap-3">
            {weekly.map((w, i) => (
              <div key={i} className="flex h-full flex-1 flex-col justify-end" title={`${w.count} request${w.count === 1 ? "" : "s"}`}>
                <div
                  className="origin-bottom animate-growBar rounded-t-[5px]"
                  style={{ height: `${w.pct}%`, background: w.count === 0 ? "#F3F4F6" : "#FF6A3D" }}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="flex flex-col rounded-[18px] border border-line bg-white p-6">
          <h2 className="font-display text-base font-bold">New arrivals</h2>
          <div className="mt-5 flex flex-col gap-4">
            {products.slice(0, 4).map((p) => (
              <Link key={p.id} href={`/dashboard/products/${p.id}`} className="group flex items-center justify-between gap-3">
                <span className="min-w-0">
                  <span className="block truncate text-[13.5px] font-semibold group-hover:text-brand">{p.name}</span>
                  <span className="block text-[12.5px] text-muted">{p.supplier || "—"} · ${p.price.toFixed(2)}</span>
                </span>
                <ArrowRight size={15} className="flex-none text-gray-300 transition group-hover:text-brand" />
              </Link>
            ))}
            {products.length === 0 && <p className="text-[13.5px] text-muted">No products in the catalog yet.</p>}
          </div>
          <Link href="/dashboard/products" className="mt-auto pt-5 text-[13px] font-semibold text-brand">
            Browse all products →
          </Link>
        </div>
      </section>

      {/* RECENT REQUESTS */}
      <section className="overflow-hidden rounded-[18px] border border-line bg-white">
        <div className="flex items-center justify-between gap-3 border-b border-line px-6 py-5">
          <h2 className="font-display text-base font-bold">Recent sourcing requests</h2>
          <Link href="/dashboard/requests" className="text-[13px] font-semibold text-brand">
            View all
          </Link>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-[560px]">
            <div className="grid grid-cols-[1.6fr_1fr_0.8fr_0.7fr] gap-3 bg-[#FBFBFC] px-6 py-3 text-[11.5px] font-semibold uppercase tracking-[0.05em] text-gray-400">
              <span>Product</span>
              <span>SKU</span>
              <span>Date</span>
              <span>Status</span>
            </div>
            {requests.slice(0, 5).map((r) => (
              <div key={r.id} className="grid grid-cols-[1.6fr_1fr_0.8fr_0.7fr] items-center gap-3 border-t border-[#F0F1F3] px-6 py-[15px] text-[13.5px]">
                <span className="truncate font-semibold">{r.productName}</span>
                <span className="text-muted">{r.productSku || "—"}</span>
                <span className="text-muted">{fmtDate(r.createdAt)}</span>
                <span>
                  <span className={`whitespace-nowrap rounded-full px-[11px] py-1 text-xs font-bold capitalize ${requestStatusStyles[r.status]}`}>
                    {r.status}
                  </span>
                </span>
              </div>
            ))}
            {requests.length === 0 && (
              <div className="px-6 py-10 text-center text-[13.5px] text-muted">
                No requests yet — open a product and tap{" "}
                <span className="font-semibold text-[#16A34A]">Source on WhatsApp</span> to start.
              </div>
            )}
          </div>
        </div>
      </section>
    </MerchantShell>
  );
}
