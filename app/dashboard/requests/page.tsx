"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { MerchantShell } from "@/components/merchant-shell";
import { fmtDate, requestStatusStyles } from "@/components/shell";
import { useAuth } from "@/lib/auth-context";
import { getDataService } from "@/lib/services";
import type { SourcingRequest } from "@/lib/types";

export default function MyRequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<SourcingRequest[]>([]);

  useEffect(() => {
    if (!user) return;
    return getDataService().watchMyRequests(user.uid, setRequests);
  }, [user]);

  return (
    <MerchantShell title="My Requests" subtitle="Every product you've sourced over WhatsApp.">
      <section className="overflow-hidden rounded-[18px] border border-line bg-white">
        <div className="overflow-x-auto">
          <div className="min-w-[680px]">
            <div className="grid grid-cols-[1.6fr_0.9fr_1.6fr_0.8fr_0.7fr] gap-3 bg-[#FBFBFC] px-6 py-3 text-[11.5px] font-semibold uppercase tracking-[0.05em] text-gray-400">
              <span>Product</span>
              <span>SKU</span>
              <span>Note</span>
              <span>Date</span>
              <span>Status</span>
            </div>
            {requests.map((r) => (
              <div
                key={r.id}
                className="grid grid-cols-[1.6fr_0.9fr_1.6fr_0.8fr_0.7fr] items-center gap-3 border-t border-[#F0F1F3] px-6 py-[15px] text-[13.5px]"
              >
                <Link href={`/dashboard/products/${r.productId}`} className="truncate font-semibold hover:text-brand">
                  {r.productName}
                </Link>
                <span className="text-muted">{r.productSku || "—"}</span>
                <span className="truncate text-muted" title={r.note}>{r.note || "—"}</span>
                <span className="text-muted">{fmtDate(r.createdAt)}</span>
                <span>
                  <span className={`whitespace-nowrap rounded-full px-[11px] py-1 text-xs font-bold capitalize ${requestStatusStyles[r.status]}`}>
                    {r.status}
                  </span>
                </span>
              </div>
            ))}
            {requests.length === 0 && (
              <div className="grid place-items-center px-6 py-16 text-center">
                <MessageCircle size={30} className="text-gray-300" />
                <p className="mt-3 font-display text-base font-bold">No sourcing requests yet</p>
                <p className="mt-1 text-[13.5px] text-muted">
                  Open any product and tap <b>Source on WhatsApp</b> — your requests will appear here.
                </p>
                <Link
                  href="/dashboard/products"
                  className="mt-5 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white shadow-brand transition hover:bg-brand-hover"
                >
                  Browse products
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </MerchantShell>
  );
}
