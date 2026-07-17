"use client";
// Shared dashboard shell (sidebar + topbar) for merchant and admin areas,
// visually matching the design handoff's dashboard.
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { LogOut, Menu, X, type LucideIcon } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { getDataService } from "@/lib/services";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number | null;
};

export function DemoBanner() {
  const { isDemo } = useAuth();
  if (!isDemo) return null;
  return (
    <div className="border-b border-[#FDE68A] bg-[#FFFBEB] px-4 py-2 text-center text-[12.5px] font-medium text-[#92400E]">
      Demo mode — data is stored in this browser only. Add your Firebase keys in{" "}
      <code className="rounded bg-[#FEF3C7] px-1.5 py-0.5 font-mono text-[11.5px]">.env.local</code>{" "}
      to go live. Demo logins: <b>admin@demo.supplierdrop.com / Admin123!</b> ·{" "}
      <b>merchant@demo.supplierdrop.com / Merchant123!</b>
    </div>
  );
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("") || "U";
}

export function Shell({
  nav,
  title,
  subtitle,
  actions,
  children,
  footerCard,
}: {
  nav: NavItem[];
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  children: ReactNode;
  footerCard?: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, profile } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const displayName = profile?.name || user?.name || "User";

  const signOut = async () => {
    await getDataService().signOutUser();
    router.replace("/signin");
  };

  const sidebar = (
    <>
      <div className="px-2.5 pb-[22px] pt-1">
        <Link href="/" aria-label="SupplierDrop home">
          <Image src="/logo.png" alt="SupplierDrop" width={130} height={24} className="h-6 w-auto" />
        </Link>
      </div>
      <nav aria-label="Primary" className="flex flex-col gap-[3px]">
        {nav.map((n) => {
          const cur = pathname === n.href || (n.href !== "/dashboard" && n.href !== "/admin" && pathname.startsWith(n.href));
          return (
            <Link
              key={n.href}
              href={n.href}
              aria-current={cur ? "page" : undefined}
              onClick={() => setMobileOpen(false)}
              className={`flex w-full items-center justify-between gap-2.5 rounded-[11px] px-3 py-[11px] text-left text-sm transition ${
                cur ? "bg-brand-tint font-semibold text-brand" : "font-medium text-[#374151] hover:bg-surface"
              }`}
            >
              <span className="flex items-center gap-3">
                <n.icon size={17} className={cur ? "text-brand" : "text-gray-400"} />
                {n.label}
              </span>
              {n.badge != null && n.badge !== 0 && (
                <span className="rounded-full bg-brand px-2 py-0.5 text-[11px] font-bold text-white">{n.badge}</span>
              )}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto flex flex-col gap-3">
        {footerCard}
        <button
          onClick={signOut}
          className="flex items-center gap-3 rounded-[11px] px-3 py-[11px] text-sm font-medium text-[#374151] transition hover:bg-surface"
        >
          <LogOut size={17} className="text-gray-400" /> Sign out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-surface">
      <DemoBanner />
      <div className="grid min-h-screen lg:grid-cols-[248px_1fr]">
        {/* Desktop sidebar */}
        <aside className="sticky top-0 hidden h-screen flex-col border-r border-line bg-white p-4 py-[22px] lg:flex">
          {sidebar}
        </aside>

        {/* Mobile drawer */}
        {mobileOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div className="absolute inset-0 bg-ink/40" onClick={() => setMobileOpen(false)} />
            <aside className="absolute left-0 top-0 flex h-full w-[270px] flex-col border-r border-line bg-white p-4 py-[22px]">
              {sidebar}
            </aside>
          </div>
        )}

        {/* MAIN */}
        <main className="flex min-w-0 flex-col">
          <header className="sticky top-0 z-20 flex items-center justify-between gap-5 border-b border-line bg-surface/85 px-5 py-4 backdrop-blur-md sm:px-8">
            <div className="flex min-w-0 items-center gap-3">
              <button
                aria-label="Open menu"
                onClick={() => setMobileOpen((v) => !v)}
                className="grid h-10 w-10 flex-none place-items-center rounded-xl border border-line bg-white text-[#374151] lg:hidden"
              >
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
              <div className="min-w-0">
                <h1 className="truncate font-display text-[22px] font-extrabold tracking-[-0.02em]">{title}</h1>
                {subtitle && <p className="mt-0.5 truncate text-[13px] text-muted">{subtitle}</p>}
              </div>
            </div>
            <div className="flex items-center gap-3.5">
              {actions}
              <div className="flex items-center gap-2.5 rounded-xl border border-line bg-white p-1.5 pr-3">
                <span className="grid h-[30px] w-[30px] place-items-center rounded-[9px] bg-brand-tint text-xs font-bold text-brand">
                  {initials(displayName)}
                </span>
                <span className="hidden text-[13px] font-semibold sm:block">{displayName}</span>
              </div>
            </div>
          </header>
          <div className="flex animate-fadeUp flex-col gap-[22px] px-5 pb-12 pt-7 sm:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}

export function StatCard({
  label,
  value,
  delta,
  up,
  Icon,
}: {
  label: string;
  value: string;
  delta?: string;
  up?: boolean;
  Icon: LucideIcon;
}) {
  return (
    <div className="rounded-[18px] border border-line bg-white p-5 transition hover:-translate-y-[3px] hover:shadow-[0_16px_34px_rgba(17,17,17,0.07)]">
      <div className="flex items-center justify-between">
        <span className="text-[13px] font-medium text-muted">{label}</span>
        <span className="grid h-[34px] w-[34px] place-items-center rounded-[10px] bg-brand-tint text-brand">
          <Icon size={17} />
        </span>
      </div>
      <div className="mt-3.5 font-display text-[28px] font-extrabold tracking-[-0.02em]">{value}</div>
      {delta && (
        <div className={`mt-1 text-[12.5px] font-semibold ${up ? "text-[#16A34A]" : "text-muted"}`}>{delta}</div>
      )}
    </div>
  );
}

export const requestStatusStyles: Record<string, string> = {
  new: "bg-[#FFF7E6] text-[#B45309]",
  contacted: "bg-[#EFF6FF] text-[#2563EB]",
  quoted: "bg-[#F5F3FF] text-[#7C3AED]",
  closed: "bg-[#ECFDF3] text-[#16A34A]",
};

export function fmtDate(ms: number): string {
  return new Date(ms).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export function ProductThumb({ src, name, className = "" }: { src?: string; name: string; className?: string }) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={name} className={`object-cover ${className}`} />;
  }
  return (
    <div className={`grid place-items-center bg-[repeating-linear-gradient(45deg,#F3F4F6_0_12px,#EDEFF2_12px_24px)] ${className}`}>
      <span className="font-mono text-[10px] text-gray-400">no photo</span>
    </div>
  );
}
