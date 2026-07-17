"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Box, Users, MessageCircle, Clock } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { StatCard, fmtDate, initials, requestStatusStyles } from "@/components/shell";
import { getDataService } from "@/lib/services";
import type { Product, SourcingRequest, UserProfile } from "@/lib/types";

export default function AdminOverview() {
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [requests, setRequests] = useState<SourcingRequest[]>([]);

  useEffect(() => {
    const svc = getDataService();
    const u1 = svc.watchProducts(true, setProducts);
    const u2 = svc.watchUsers(setUsers);
    const u3 = svc.watchAllRequests(setRequests);
    return () => {
      u1();
      u2();
      u3();
    };
  }, []);

  const newRequests = requests.filter((r) => r.status === "new").length;
  const merchants = users.filter((u) => u.role === "merchant").length;

  // Requests per week over the last 12 weeks.
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

  return (
    <AdminShell title="Overview" subtitle="Everything happening across SupplierDrop.">
      <section aria-label="Key metrics" className="grid grid-cols-[repeat(auto-fit,minmax(210px,1fr))] gap-4">
        <StatCard label="Products" value={String(products.length)} delta={`${products.filter((p) => p.active).length} active`} Icon={Box} />
        <StatCard label="Merchants" value={String(merchants)} delta={`${users.length} total users`} Icon={Users} />
        <StatCard label="Sourcing requests" value={String(requests.length)} delta="all time" Icon={MessageCircle} />
        <StatCard label="Awaiting action" value={String(newRequests)} delta="status: new" up={newRequests > 0} Icon={Clock} />
      </section>

      <section className="grid grid-cols-1 gap-4 lg:grid-cols-[1.7fr_1fr]">
        <div className="rounded-[18px] border border-line bg-white p-6">
          <div>
            <h2 className="font-display text-base font-bold">Sourcing demand</h2>
            <p className="mt-[3px] text-[12.5px] text-muted">Requests per week · last 12 weeks</p>
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
          <h2 className="font-display text-base font-bold">Newest merchants</h2>
          <div className="mt-5 flex flex-col gap-4">
            {users.slice(0, 5).map((u) => (
              <div key={u.uid} className="flex items-center gap-3">
                <span className="grid h-9 w-9 flex-none place-items-center rounded-[10px] bg-brand-tint text-xs font-bold text-brand">
                  {initials(u.name)}
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[13.5px] font-semibold">{u.name}</span>
                  <span className="block truncate text-[12.5px] text-muted">{u.email}</span>
                </span>
                <span className="ml-auto text-[12px] text-muted">{fmtDate(u.createdAt)}</span>
              </div>
            ))}
            {users.length === 0 && <p className="text-[13.5px] text-muted">No users yet.</p>}
          </div>
          <Link href="/admin/users" className="mt-auto pt-5 text-[13px] font-semibold text-brand">
            Manage all users →
          </Link>
        </div>
      </section>

      <section className="overflow-hidden rounded-[18px] border border-line bg-white">
        <div className="flex items-center justify-between gap-3 border-b border-line px-6 py-5">
          <h2 className="font-display text-base font-bold">Latest sourcing requests</h2>
          <Link href="/admin/requests" className="text-[13px] font-semibold text-brand">
            View all
          </Link>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-[640px]">
            <div className="grid grid-cols-[1.4fr_1.4fr_0.8fr_0.7fr] gap-3 bg-[#FBFBFC] px-6 py-3 text-[11.5px] font-semibold uppercase tracking-[0.05em] text-gray-400">
              <span>Merchant</span>
              <span>Product</span>
              <span>Date</span>
              <span>Status</span>
            </div>
            {requests.slice(0, 6).map((r) => (
              <div key={r.id} className="grid grid-cols-[1.4fr_1.4fr_0.8fr_0.7fr] items-center gap-3 border-t border-[#F0F1F3] px-6 py-[15px] text-[13.5px]">
                <span className="truncate font-semibold">{r.merchantName}</span>
                <span className="truncate text-[#374151]">{r.productName}</span>
                <span className="text-muted">{fmtDate(r.createdAt)}</span>
                <span>
                  <span className={`whitespace-nowrap rounded-full px-[11px] py-1 text-xs font-bold capitalize ${requestStatusStyles[r.status]}`}>
                    {r.status}
                  </span>
                </span>
              </div>
            ))}
            {requests.length === 0 && (
              <div className="px-6 py-10 text-center text-[13.5px] text-muted">No sourcing requests yet.</div>
            )}
          </div>
        </div>
      </section>
    </AdminShell>
  );
}
