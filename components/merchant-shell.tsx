"use client";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { LayoutGrid, Box, MessageCircle, Settings } from "lucide-react";
import { RequireAuth } from "./guard";
import { Shell, type NavItem } from "./shell";
import { useAuth } from "@/lib/auth-context";
import { getDataService } from "@/lib/services";

function MerchantShellInner({
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
  const { user } = useAuth();
  const [newCount, setNewCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    return getDataService().watchMyRequests(user.uid, (reqs) =>
      setNewCount(reqs.filter((r) => r.status === "new").length)
    );
  }, [user]);

  const nav: NavItem[] = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutGrid },
    { label: "Products", href: "/dashboard/products", icon: Box },
    { label: "My Requests", href: "/dashboard/requests", icon: MessageCircle, badge: newCount || null },
    { label: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const footerCard = (
    <div className="rounded-2xl border border-line bg-[linear-gradient(160deg,#FFF6F1,#FFFFFF)] p-4">
      <div className="font-display text-sm font-bold">Need a custom product?</div>
      <p className="my-1.5 mb-3 text-[12.5px] leading-[1.5] text-muted">
        Browse the catalog and source any product straight over WhatsApp.
      </p>
      <Link
        href="/dashboard/products"
        className="block rounded-[10px] bg-brand py-2.5 text-center text-[13px] font-semibold text-white transition hover:bg-brand-hover"
      >
        Browse products
      </Link>
    </div>
  );

  return (
    <Shell nav={nav} title={title} subtitle={subtitle} actions={actions} footerCard={footerCard}>
      {children}
    </Shell>
  );
}

export function MerchantShell(props: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
}) {
  return (
    <RequireAuth>
      <MerchantShellInner {...props} />
    </RequireAuth>
  );
}
