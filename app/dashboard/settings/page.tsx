"use client";
import { useState } from "react";
import { ShieldCheck, Database } from "lucide-react";
import { MerchantShell } from "@/components/merchant-shell";
import { fmtDate, initials } from "@/components/shell";
import { useAuth } from "@/lib/auth-context";
import { getDataService } from "@/lib/services";

export default function MerchantSettings() {
  const { user, profile, isDemo } = useAuth();
  const [resetSent, setResetSent] = useState(false);
  const [resetErr, setResetErr] = useState<string | null>(null);

  const sendReset = async () => {
    setResetErr(null);
    if (isDemo) {
      setResetErr("Demo mode: password reset emails aren't sent.");
      return;
    }
    try {
      const { sendPasswordResetEmail } = await import("firebase/auth");
      const { fbAuth } = await import("@/lib/firebase");
      await sendPasswordResetEmail(fbAuth(), user!.email);
      setResetSent(true);
    } catch (e: any) {
      setResetErr(e?.message || "Could not send the reset email.");
    }
  };

  if (!profile || !user) return null;

  return (
    <MerchantShell title="Settings" subtitle="Your account details.">
      <div className="grid max-w-[720px] grid-cols-1 gap-4">
        <section className="rounded-[18px] border border-line bg-white p-6">
          <div className="flex items-center gap-4">
            <span className="grid h-14 w-14 place-items-center rounded-2xl bg-brand-tint text-lg font-bold text-brand">
              {initials(profile.name)}
            </span>
            <div>
              <h2 className="font-display text-lg font-extrabold">{profile.name}</h2>
              <p className="text-[13.5px] text-muted">{profile.email}</p>
            </div>
            <span className="ml-auto rounded-full bg-brand-tint px-3 py-1 text-xs font-bold capitalize text-brand">
              {profile.role}
            </span>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-4 border-t border-line pt-5 text-[13.5px]">
            <div>
              <span className="block text-muted">Member since</span>
              <span className="mt-0.5 block font-semibold">{fmtDate(profile.createdAt)}</span>
            </div>
            <div>
              <span className="block text-muted">Status</span>
              <span className="mt-0.5 block font-semibold capitalize text-[#16A34A]">{profile.status}</span>
            </div>
          </div>
        </section>

        <section className="rounded-[18px] border border-line bg-white p-6">
          <h3 className="flex items-center gap-2 font-display text-base font-bold">
            <ShieldCheck size={17} className="text-brand" /> Security
          </h3>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">
            Change your password via a secure reset email sent to {profile.email}.
          </p>
          {resetErr && <p className="mt-3 text-[13px] font-medium text-[#B91C1C]">{resetErr}</p>}
          {resetSent && <p className="mt-3 text-[13px] font-medium text-[#15803D]">Reset email sent — check your inbox.</p>}
          <button
            onClick={sendReset}
            className="mt-4 rounded-xl border-[1.5px] border-ink px-5 py-2.5 text-[13.5px] font-semibold transition hover:bg-ink hover:text-white"
          >
            Send password reset email
          </button>
        </section>

        <section className="rounded-[18px] border border-line bg-white p-6">
          <h3 className="flex items-center gap-2 font-display text-base font-bold">
            <Database size={17} className="text-brand" /> Data mode
          </h3>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">
            {isDemo
              ? "Running in demo mode — all data lives in this browser's local storage. Configure Firebase in .env.local to go live."
              : "Connected to Firebase — your data is stored securely in the cloud."}
          </p>
        </section>
      </div>
    </MerchantShell>
  );
}
