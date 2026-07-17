"use client";
import { useEffect, useState, type ReactNode } from "react";
import { LayoutGrid, Box, Users, MessageCircle, Settings, ShieldCheck } from "lucide-react";
import { RequireAuth } from "./guard";
import { Shell, type NavItem } from "./shell";
import { getDataService } from "@/lib/services";

function AdminShellInner({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  const [newCount, setNewCount] = useState(0);

  useEffect(
    () =>
      getDataService().watchAllRequests((reqs) =>
        setNewCount(reqs.filter((r) => r.status === "new").length)
      ),
    []
  );

  const nav: NavItem[] = [
    { label: "Overview", href: "/admin", icon: LayoutGrid },
    { label: "Products", href: "/admin/products", icon: Box },
    { label: "Users", href: "/admin/users", icon: Users },
    { label: "Requests", href: "/admin/requests", icon: MessageCircle, badge: newCount || null },
    { label: "Settings", href: "/admin/settings", icon: Settings },
  ];

  const footerCard = (
    <div className="rounded-2xl border border-line bg-[linear-gradient(160deg,#FFF6F1,#FFFFFF)] p-4">
      <div className="flex items-center gap-2 font-display text-sm font-bold">
        <ShieldCheck size={15} className="text-brand" /> Admin console
      </div>
      <p className="my-1.5 text-[12.5px] leading-[1.5] text-muted">
        You have full control over products, users, and sourcing settings.
      </p>
    </div>
  );

  return (
    <Shell nav={nav} title={title} subtitle={subtitle} actions={actions} footerCard={footerCard}>
      {children}
    </Shell>
  );
}

export function AdminShell(props: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <RequireAuth role="admin">
      <AdminShellInner {...props} />
    </RequireAuth>
  );
}
