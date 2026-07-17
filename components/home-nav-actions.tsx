"use client";
// Session-aware CTA block for the marketing nav: guests see Login/Get Started,
// signed-in users get a direct link to their dashboard.
import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export function HomeNavActions() {
  const { user, profile, loading } = useAuth();

  if (!loading && user) {
    const href = profile?.role === "admin" ? "/admin" : "/dashboard";
    return (
      <div className="flex items-center gap-4">
        <Link
          href={href}
          className="inline-flex items-center gap-2 rounded-xl bg-brand px-[22px] py-[11px] text-[14.5px] font-semibold text-white shadow-brand transition hover:-translate-y-px hover:bg-brand-hover"
        >
          <LayoutGrid size={16} /> Open dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Link href="/signin" className="text-[14.5px] font-semibold hover:text-brand">
        Login
      </Link>
      <Link
        href="/signup"
        className="inline-flex items-center gap-2 rounded-xl bg-brand px-[22px] py-[11px] text-[14.5px] font-semibold text-white shadow-brand transition hover:-translate-y-px hover:bg-brand-hover"
      >
        Get Started
      </Link>
    </div>
  );
}
