"use client";
import { useEffect, useMemo, useState } from "react";
import { MessageCircle } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { fmtDate, requestStatusStyles } from "@/components/shell";
import { getDataService } from "@/lib/services";
import type { RequestStatus, SourcingRequest } from "@/lib/types";

const STATUSES: RequestStatus[] = ["new", "contacted", "quoted", "closed"];
const PAGE_SIZE = 25;

export default function AdminRequests() {
  const [requests, setRequests] = useState<SourcingRequest[]>([]);
  const [filter, setFilter] = useState<RequestStatus | "all">("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => getDataService().watchAllRequests(setRequests), []);

  // Reset paging whenever the status filter changes.
  useEffect(() => setVisibleCount(PAGE_SIZE), [filter]);

  const filtered = useMemo(
    () => (filter === "all" ? requests : requests.filter((r) => r.status === filter)),
    [requests, filter]
  );

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: requests.length };
    for (const s of STATUSES) c[s] = requests.filter((r) => r.status === s).length;
    return c;
  }, [requests]);

  return (
    <AdminShell title="Sourcing Requests" subtitle="Every WhatsApp sourcing request from your merchants.">
      <div className="flex flex-wrap gap-2">
        {(["all", ...STATUSES] as const).map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-4 py-2 text-[13px] font-semibold capitalize transition ${
              filter === s ? "bg-ink text-white" : "border border-line bg-white text-[#374151] hover:border-gray-300"
            }`}
          >
            {s} <span className="opacity-60">({counts[s] || 0})</span>
          </button>
        ))}
      </div>

      <section className="overflow-hidden rounded-[18px] border border-line bg-white">
        <div className="overflow-x-auto">
          <div className="min-w-[820px]">
            <div className="grid grid-cols-[1.4fr_1.4fr_1.4fr_0.8fr_1fr] items-center gap-3 bg-[#FBFBFC] px-6 py-3 text-[11.5px] font-semibold uppercase tracking-[0.05em] text-gray-400">
              <span>Merchant</span>
              <span>Product</span>
              <span>Note</span>
              <span>Date</span>
              <span>Status</span>
            </div>
            {filtered.slice(0, visibleCount).map((r) => (
              <div
                key={r.id}
                className="grid grid-cols-[1.4fr_1.4fr_1.4fr_0.8fr_1fr] items-center gap-3 border-t border-[#F0F1F3] px-6 py-3 text-[13.5px]"
              >
                <span className="min-w-0">
                  <span className="block truncate font-semibold">{r.merchantName}</span>
                  <span className="block truncate text-[12px] text-muted">{r.merchantEmail}</span>
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[#374151]">{r.productName}</span>
                  <span className="block text-[12px] text-muted">{r.productSku || "no SKU"}</span>
                </span>
                <span className="truncate text-muted" title={r.note}>{r.note || "—"}</span>
                <span className="text-muted">{fmtDate(r.createdAt)}</span>
                <span>
                  <select
                    value={r.status}
                    onChange={(e) => getDataService().updateRequestStatus(r.id, e.target.value as RequestStatus)}
                    aria-label={`Status for ${r.productName} request from ${r.merchantName}`}
                    className={`cursor-pointer rounded-full border-0 px-[11px] py-1.5 text-xs font-bold capitalize outline-none ${requestStatusStyles[r.status]}`}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </span>
              </div>
            ))}
            {filtered.length === 0 && (
              <div className="grid place-items-center px-6 py-16 text-center">
                <MessageCircle size={30} className="text-gray-300" />
                <p className="mt-3 text-[13.5px] text-muted">
                  {requests.length === 0 ? "No sourcing requests yet." : "No requests with this status."}
                </p>
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
    </AdminShell>
  );
}
