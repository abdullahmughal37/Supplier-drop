"use client";
// Client-side route guards. UX only — real enforcement lives in
// firestore.rules / storage.rules, which deny by default.
import { useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { ShieldAlert } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { getDataService } from "@/lib/services";

function FullPageSpinner() {
  return (
    <div className="grid min-h-screen place-items-center bg-surface">
      <div className="flex flex-col items-center gap-4">
        <span className="h-10 w-10 animate-spin rounded-full border-[3px] border-line border-t-brand" />
        <span className="text-sm font-medium text-muted">Loading…</span>
      </div>
    </div>
  );
}

function SuspendedScreen() {
  return (
    <div className="grid min-h-screen place-items-center bg-surface px-6">
      <div className="max-w-md rounded-2xl border border-line bg-white p-10 text-center shadow-card">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#FEF2F2] text-[#DC2626]">
          <ShieldAlert size={26} />
        </span>
        <h1 className="mt-5 font-display text-2xl font-extrabold">Account suspended</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-muted">
          Your account has been suspended by an administrator. If you believe this is a
          mistake, please contact support.
        </p>
        <button
          onClick={() => getDataService().signOutUser()}
          className="mt-6 rounded-xl bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}

export function RequireAuth({
  children,
  role,
}: {
  children: ReactNode;
  role?: "admin";
}) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/signin");
    } else if (role === "admin" && profile && profile.role !== "admin") {
      router.replace("/dashboard");
    }
  }, [loading, user, profile, role, router]);

  if (loading || !user || !profile) return <FullPageSpinner />;
  if (profile.status === "suspended") return <SuspendedScreen />;
  if (role === "admin" && profile.role !== "admin") return <FullPageSpinner />;
  return <>{children}</>;
}
