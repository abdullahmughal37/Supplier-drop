"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Logo, GoogleIcon, AuthBrandPanel } from "@/components/ui";
import { Check, AlertCircle } from "lucide-react";
import { getDataService } from "@/lib/services";
import { useAuth } from "@/lib/auth-context";
import { friendlyError, routeAfterAuth } from "@/lib/auth-helpers";

const inputCls =
  "rounded-xl border-[1.5px] border-line px-[15px] py-[13px] text-[14.5px] outline-none transition focus:border-brand focus:shadow-[0_0_0_3px_rgba(255,106,61,0.15)]";

export default function SignIn() {
  const router = useRouter();
  const { isDemo } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const svc = getDataService();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const user = await svc.signIn(email, password);
      routeAfterAuth(user.uid, router.replace);
    } catch (err: any) {
      setError(friendlyError(err));
      setBusy(false);
    }
  };

  const google = async () => {
    setError(null);
    setBusy(true);
    try {
      const user = await svc.signInWithGoogle();
      routeAfterAuth(user.uid, router.replace);
    } catch (err: any) {
      setError(friendlyError(err));
      setBusy(false);
    }
  };

  const forgot = async () => {
    setError(null);
    setInfo(null);
    if (svc.mode === "demo") {
      setInfo("Demo mode: password reset emails aren't sent. Use the demo credentials shown above.");
      return;
    }
    if (!email) {
      setError("Enter your email above first, then click Forgot.");
      return;
    }
    try {
      const { sendPasswordResetEmail } = await import("firebase/auth");
      const { fbAuth } = await import("@/lib/firebase");
      await sendPasswordResetEmail(fbAuth(), email.trim());
      setInfo("Password reset email sent — check your inbox.");
    } catch (err: any) {
      setError(friendlyError(err));
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* FORM SIDE */}
      <div className="flex flex-col px-6 py-9 sm:px-12">
        <Logo className="self-start" />
        <div className="mx-auto flex w-full max-w-[400px] flex-1 animate-fadeUp flex-col justify-center">
          <h1 className="font-display text-[34px] font-extrabold tracking-[-0.02em]">Welcome back</h1>
          <p className="mt-2.5 text-[15.5px] text-muted">Sign in to manage your store and suppliers.</p>

          {isDemo && (
            <div className="mt-6 rounded-xl border border-[#FDE68A] bg-[#FFFBEB] px-4 py-3 text-[12.5px] leading-relaxed text-[#92400E]">
              <b>Demo mode</b> — try <b>admin@demo.supplierdrop.com</b> / <b>Admin123!</b> or{" "}
              <b>merchant@demo.supplierdrop.com</b> / <b>Merchant123!</b>
            </div>
          )}

          <button
            onClick={google}
            disabled={busy}
            className="mt-8 flex w-full items-center justify-center gap-2.5 rounded-[13px] border-[1.5px] border-line bg-white py-[13px] text-[14.5px] font-semibold transition hover:border-gray-300 hover:bg-surface disabled:opacity-60"
          >
            <GoogleIcon /> Continue with Google
          </button>
          <div className="my-6 flex items-center gap-3.5 text-[12.5px] text-gray-400">
            <span className="h-px flex-1 bg-line" />or sign in with email<span className="h-px flex-1 bg-line" />
          </div>

          {error && (
            <div role="alert" className="mb-4 flex items-start gap-2.5 rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-[13.5px] font-medium text-[#B91C1C]">
              <AlertCircle size={16} className="mt-0.5 flex-none" /> <span>{error}</span>
            </div>
          )}
          {info && (
            <div role="status" className="mb-4 flex items-start gap-2.5 rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] px-4 py-3 text-[13.5px] font-medium text-[#15803D]">
              <Check size={16} className="mt-0.5 flex-none" /> <span>{info}</span>
            </div>
          )}

          <form className="flex flex-col gap-[18px]" onSubmit={submit}>
            <label className="flex flex-col gap-[7px]">
              <span className="text-[13.5px] font-semibold">Email</span>
              <input
                type="email"
                required
                placeholder="you@store.com"
                autoComplete="email"
                className={inputCls}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label className="flex flex-col gap-[7px]">
              <span className="flex items-center justify-between text-[13.5px] font-semibold">
                Password{" "}
                <button type="button" onClick={forgot} className="text-[12.5px] font-medium text-brand hover:text-brand-hover">
                  Forgot?
                </button>
              </span>
              <input
                type="password"
                required
                placeholder="••••••••"
                autoComplete="current-password"
                className={inputCls}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-[13px] bg-brand py-3.5 text-center text-[15.5px] font-semibold text-white shadow-brand transition hover:-translate-y-px hover:bg-brand-hover disabled:opacity-60"
            >
              {busy ? "Signing in…" : "Sign in"}
            </button>
          </form>
          <p className="mt-[26px] text-center text-sm text-muted">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="font-semibold text-brand hover:text-brand-hover">
              Create one free
            </Link>
          </p>
        </div>
        <p className="text-center text-[12.5px] text-gray-400">© 2026 SupplierDrop, Inc.</p>
      </div>

      {/* BRAND SIDE */}
      <AuthBrandPanel>
        <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-[15px] py-[7px] text-[12.5px] font-semibold">
          <span className="h-[7px] w-[7px] rounded-full bg-success" />
          Trusted by 12,000+ merchants
        </div>
        <h2 className="mt-6 font-display text-[38px] font-extrabold leading-[1.12] tracking-[-0.02em] text-balance">
          Source smarter. Scale faster.
        </h2>
        <p className="mt-4 text-base leading-[1.65] text-white/70">
          Everything you need to discover, import, and automate winning products — in one calm, fast dashboard.
        </p>
        <div className="relative mt-11 h-[220px]">
          <div className="absolute left-0 right-10 top-0 animate-floatA rounded-[18px] border border-white/[0.14] bg-white/[0.08] p-5 backdrop-blur-md">
            <div className="flex justify-between text-[13px] text-white/70">
              <span>Revenue this month</span>
              <span className="font-semibold text-success">↑ 18%</span>
            </div>
            <div className="mt-2 font-display text-3xl font-extrabold">$48,290</div>
            <div className="mt-3.5 flex h-11 items-end gap-1.5">
              {[40, 58, 50, 72, 64, 90].map((h, i) => (
                <span key={i} className="flex-1 rounded-sm" style={{ height: `${h}%`, background: i === 5 ? "#FF6A3D" : "rgba(255,106,61,0.6)" }} />
              ))}
            </div>
          </div>
          <div className="absolute bottom-0 left-[120px] right-0 flex animate-floatB items-center gap-3 rounded-2xl bg-white/95 p-4 text-ink shadow-[0_20px_50px_rgba(0,0,0,0.4)]">
            <span className="grid h-[38px] w-[38px] place-items-center rounded-[10px] bg-[#ECFDF3] text-success">
              <Check size={18} strokeWidth={2.6} />
            </span>
            <span>
              <span className="block text-[13px] font-bold">Product imported</span>
              <span className="block text-xs text-muted">Synced to Shopify · 0.8s</span>
            </span>
          </div>
        </div>
      </AuthBrandPanel>
    </div>
  );
}
