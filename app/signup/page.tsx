"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo, GoogleIcon, AuthBrandPanel } from "@/components/ui";
import { Check, AlertCircle } from "lucide-react";
import { getDataService } from "@/lib/services";
import { useAuth } from "@/lib/auth-context";
import { friendlyError, routeAfterAuth } from "@/lib/auth-helpers";

const inputCls =
  "rounded-xl border-[1.5px] border-line px-[15px] py-[13px] text-[14.5px] outline-none transition focus:border-brand focus:shadow-[0_0_0_3px_rgba(255,106,61,0.15)]";

const perks = [
  "50,000+ vetted products with real margins",
  "One-click Shopify import & real-time sync",
  "Automated fulfillment with live tracking",
  "3–8 day worldwide shipping",
];

export default function SignUp() {
  const router = useRouter();
  const { isDemo } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [strength, setStrength] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onPass = (v: string) => {
    setPassword(v);
    let n = 0;
    if (v.length >= 8) n++;
    if (/[A-Z]/.test(v) && /[a-z]/.test(v)) n++;
    if (/[0-9]/.test(v) || /[^A-Za-z0-9]/.test(v)) n++;
    setStrength(n);
  };
  const colors = ["#FFB27A", "#FF8B5E", "#22C55E"];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (name.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (strength < 2) {
      setError("Please use a stronger password — mix upper/lowercase and add a number or symbol.");
      return;
    }
    setBusy(true);
    try {
      const user = await getDataService().signUp(name, email, password);
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
      const user = await getDataService().signInWithGoogle();
      routeAfterAuth(user.uid, router.replace);
    } catch (err: any) {
      setError(friendlyError(err));
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* FORM SIDE */}
      <div className="flex flex-col px-6 py-9 sm:px-12">
        <Logo className="self-start" />
        <div className="mx-auto flex w-full max-w-[400px] flex-1 animate-fadeUp flex-col justify-center py-6">
          <h1 className="font-display text-[34px] font-extrabold tracking-[-0.02em]">Create your account</h1>
          <p className="mt-2.5 text-[15.5px] text-muted">Start free — no credit card required.</p>

          {isDemo && (
            <div className="mt-5 rounded-xl border border-[#FDE68A] bg-[#FFFBEB] px-4 py-3 text-[12.5px] leading-relaxed text-[#92400E]">
              <b>Demo mode</b> — accounts are stored in this browser only.
            </div>
          )}

          <button
            onClick={google}
            disabled={busy}
            className="mt-[30px] flex w-full items-center justify-center gap-2.5 rounded-[13px] border-[1.5px] border-line bg-white py-[13px] text-[14.5px] font-semibold transition hover:border-gray-300 hover:bg-surface disabled:opacity-60"
          >
            <GoogleIcon /> Sign up with Google
          </button>
          <div className="my-[22px] flex items-center gap-3.5 text-[12.5px] text-gray-400">
            <span className="h-px flex-1 bg-line" />or with email<span className="h-px flex-1 bg-line" />
          </div>

          {error && (
            <div role="alert" className="mb-4 flex items-start gap-2.5 rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-[13.5px] font-medium text-[#B91C1C]">
              <AlertCircle size={16} className="mt-0.5 flex-none" /> <span>{error}</span>
            </div>
          )}

          <form className="flex flex-col gap-4" onSubmit={submit}>
            <label className="flex flex-col gap-[7px]">
              <span className="text-[13.5px] font-semibold">Full name</span>
              <input
                type="text"
                required
                placeholder="Maya Rodriguez"
                autoComplete="name"
                className={inputCls}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label className="flex flex-col gap-[7px]">
              <span className="text-[13.5px] font-semibold">Work email</span>
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
              <span className="text-[13.5px] font-semibold">Password</span>
              <input
                type="password"
                required
                placeholder="At least 8 characters"
                autoComplete="new-password"
                className={inputCls}
                value={password}
                onChange={(e) => onPass(e.target.value)}
              />
              <span className="mt-0.5 flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="h-1 flex-1 rounded-full transition-colors" style={{ background: strength > i ? colors[i] : "#E9E9E9" }} />
                ))}
              </span>
            </label>
            <label className="flex cursor-pointer items-start gap-2.5 text-[13px] leading-[1.5] text-[#374151]">
              <input type="checkbox" required className="mt-0.5 h-4 w-4 flex-none cursor-pointer accent-brand" />
              <span>
                I agree to the <a href="/terms" target="_blank" className="text-brand hover:text-brand-hover">Terms</a> and{" "}
                <a href="/privacy" target="_blank" className="text-brand hover:text-brand-hover">Privacy Policy</a>
              </span>
            </label>
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-[13px] bg-brand py-3.5 text-center text-[15.5px] font-semibold text-white shadow-brand transition hover:-translate-y-px hover:bg-brand-hover disabled:opacity-60"
            >
              {busy ? "Creating account…" : "Create free account"}
            </button>
          </form>
          <p className="mt-[22px] text-center text-sm text-muted">
            Already have an account?{" "}
            <Link href="/signin" className="font-semibold text-brand hover:text-brand-hover">
              Sign in
            </Link>
          </p>
        </div>
        <p className="text-center text-[12.5px] text-gray-400">© 2026 SupplierDrop, Inc.</p>
      </div>

      {/* BRAND SIDE */}
      <AuthBrandPanel>
        <h2 className="font-display text-[38px] font-extrabold leading-[1.12] tracking-[-0.02em] text-balance">
          Everything you need to launch a winning store
        </h2>
        <ul className="mt-8 flex flex-col gap-[18px]">
          {perks.map((p) => (
            <li key={p} className="flex items-center gap-3.5">
              <span className="grid h-[30px] w-[30px] flex-none place-items-center rounded-[9px] bg-brand/20 text-brand-light">
                <Check size={16} strokeWidth={2.6} />
              </span>
              <span className="text-base font-medium">{p}</span>
            </li>
          ))}
        </ul>
        <div className="mt-10 animate-floatA rounded-[18px] border border-white/[0.14] bg-white/[0.08] p-6 backdrop-blur-md">
          <span className="text-sm tracking-[2px] text-brand-light" aria-label="5 out of 5 stars">★★★★★</span>
          <p className="my-3 text-[15px] leading-[1.65] text-white/90">
            &ldquo;We replaced three tools with SupplierDrop. Setup took ten minutes and our oversell rate went to zero.&rdquo;
          </p>
          <div className="flex items-center gap-3">
            <span className="grid h-[38px] w-[38px] place-items-center rounded-full bg-brand/25 text-[13px] font-bold text-brand-light">MR</span>
            <span>
              <span className="block text-sm font-bold">Maya Rodriguez</span>
              <span className="block text-[12.5px] text-white/60">Founder, Veloura</span>
            </span>
          </div>
        </div>
      </AuthBrandPanel>
    </div>
  );
}
