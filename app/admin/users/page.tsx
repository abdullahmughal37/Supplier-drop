"use client";
import { useEffect, useMemo, useState } from "react";
import { Search, ShieldCheck, Ban, RotateCcw } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { fmtDate, initials } from "@/components/shell";
import { useAuth } from "@/lib/auth-context";
import { getDataService } from "@/lib/services";
import type { SourcingRequest, UserProfile } from "@/lib/types";

export default function AdminUsers() {
  const { user: me } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [requests, setRequests] = useState<SourcingRequest[]>([]);
  const [queryText, setQueryText] = useState("");

  useEffect(() => {
    const svc = getDataService();
    const u1 = svc.watchUsers(setUsers);
    const u2 = svc.watchAllRequests(setRequests);
    return () => {
      u1();
      u2();
    };
  }, []);

  const requestCount = useMemo(() => {
    const map = new Map<string, number>();
    for (const r of requests) map.set(r.merchantId, (map.get(r.merchantId) || 0) + 1);
    return map;
  }, [requests]);

  const filtered = useMemo(() => {
    const q = queryText.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
  }, [users, queryText]);

  const svc = getDataService();

  const toggleRole = async (u: UserProfile) => {
    const promote = u.role === "merchant";
    if (
      !window.confirm(
        promote
          ? `Make ${u.name} an ADMIN? They will get full control over products, users, and settings.`
          : `Remove admin rights from ${u.name}?`
      )
    )
      return;
    await svc.setUserRole(u.uid, promote ? "admin" : "merchant");
  };

  const toggleStatus = async (u: UserProfile) => {
    const suspend = u.status === "active";
    if (suspend && !window.confirm(`Suspend ${u.name}? They will be blocked from the dashboard immediately.`)) return;
    await svc.setUserStatus(u.uid, suspend ? "suspended" : "active");
  };

  return (
    <AdminShell
      title="Users"
      subtitle={`${users.length} accounts · ${users.filter((u) => u.status === "suspended").length} suspended`}
      actions={
        <div className="hidden w-[220px] max-w-[26vw] items-center gap-2 rounded-xl border border-line bg-white px-3.5 py-[9px] text-[13.5px] md:flex">
          <Search size={16} className="text-gray-400" />
          <input
            placeholder="Search users…"
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
            className="w-full bg-transparent outline-none placeholder:text-gray-400"
          />
        </div>
      }
    >
      <section className="overflow-hidden rounded-[18px] border border-line bg-white">
        <div className="overflow-x-auto">
          <div className="min-w-[860px]">
            <div className="grid grid-cols-[1.8fr_0.8fr_0.8fr_0.9fr_0.9fr_0.7fr_1.2fr] items-center gap-3 bg-[#FBFBFC] px-6 py-3 text-[11.5px] font-semibold uppercase tracking-[0.05em] text-gray-400">
              <span>User</span>
              <span>Role</span>
              <span>Status</span>
              <span>Joined</span>
              <span>Last active</span>
              <span>Requests</span>
              <span className="text-right">Actions</span>
            </div>
            {filtered.map((u) => {
              const isMe = u.uid === me?.uid;
              return (
                <div
                  key={u.uid}
                  className="grid grid-cols-[1.8fr_0.8fr_0.8fr_0.9fr_0.9fr_0.7fr_1.2fr] items-center gap-3 border-t border-[#F0F1F3] px-6 py-3 text-[13.5px]"
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="grid h-9 w-9 flex-none place-items-center rounded-[10px] bg-brand-tint text-xs font-bold text-brand">
                      {initials(u.name)}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-semibold">
                        {u.name} {isMe && <span className="text-[11px] font-bold text-brand">(you)</span>}
                      </span>
                      <span className="block truncate text-[12px] text-muted">{u.email}</span>
                    </span>
                  </span>
                  <span>
                    <span
                      className={`rounded-full px-[11px] py-1 text-xs font-bold capitalize ${
                        u.role === "admin" ? "bg-brand-tint text-brand" : "bg-[#F3F4F6] text-[#374151]"
                      }`}
                    >
                      {u.role}
                    </span>
                  </span>
                  <span>
                    <span
                      className={`rounded-full px-[11px] py-1 text-xs font-bold capitalize ${
                        u.status === "active" ? "bg-[#ECFDF3] text-[#16A34A]" : "bg-[#FEF2F2] text-[#DC2626]"
                      }`}
                    >
                      {u.status}
                    </span>
                  </span>
                  <span className="text-muted">{fmtDate(u.createdAt)}</span>
                  <span className="text-muted">{fmtDate(u.lastActiveAt)}</span>
                  <span className="font-semibold">{requestCount.get(u.uid) || 0}</span>
                  <span className="flex justify-end gap-1.5">
                    <button
                      onClick={() => toggleRole(u)}
                      disabled={isMe}
                      title={u.role === "merchant" ? "Promote to admin" : "Demote to merchant"}
                      className="inline-flex items-center gap-1.5 rounded-[10px] border border-line px-3 py-2 text-[12px] font-semibold text-[#374151] transition hover:border-brand hover:text-brand disabled:opacity-40"
                    >
                      <ShieldCheck size={13} /> {u.role === "merchant" ? "Make admin" : "Remove admin"}
                    </button>
                    <button
                      onClick={() => toggleStatus(u)}
                      disabled={isMe}
                      title={u.status === "active" ? "Suspend user" : "Reactivate user"}
                      className={`inline-flex items-center gap-1.5 rounded-[10px] border border-line px-3 py-2 text-[12px] font-semibold transition disabled:opacity-40 ${
                        u.status === "active"
                          ? "text-[#374151] hover:border-[#DC2626] hover:text-[#DC2626]"
                          : "text-[#16A34A] hover:border-[#16A34A]"
                      }`}
                    >
                      {u.status === "active" ? <Ban size={13} /> : <RotateCcw size={13} />}
                      {u.status === "active" ? "Suspend" : "Reactivate"}
                    </button>
                  </span>
                </div>
              );
            })}
            {filtered.length === 0 && (
              <div className="px-6 py-14 text-center text-[13.5px] text-muted">No users match your search.</div>
            )}
          </div>
        </div>
      </section>
    </AdminShell>
  );
}
