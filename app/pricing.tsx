"use client";
import { useState } from "react";
import Link from "next/link";

const plans = {
  starter: { monthly: "$29", annual: "$23" },
  pro: { monthly: "$79", annual: "$63" },
};

export default function Pricing() {
  const [annual, setAnnual] = useState(false);
  const tab = (active: boolean) =>
    `cursor-pointer rounded-full px-[18px] py-[9px] text-[13.5px] font-semibold transition ${active ? "bg-ink text-white shadow" : "text-muted"}`;

  return (
    <section id="pricing" className="bg-white px-8 py-[110px]">
      <div className="mx-auto max-w-[1100px]">
        <div className="mx-auto mb-6 max-w-[560px] text-center">
          <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-brand">Pricing</p>
          <h2 className="mt-3.5 font-display text-[clamp(30px,4vw,46px)] font-extrabold leading-[1.1] tracking-[-0.02em]">Simple pricing that scales with you</h2>
        </div>
        <div className="mb-12 flex justify-center">
          <div className="inline-flex gap-0.5 rounded-full border border-line bg-surface p-1">
            <button aria-pressed={!annual} onClick={() => setAnnual(false)} className={tab(!annual)}>Monthly</button>
            <button aria-pressed={annual} onClick={() => setAnnual(true)} className={tab(annual)}>Annual · save 20%</button>
          </div>
        </div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] items-stretch gap-5">
          {/* Starter */}
          <div className="flex flex-col rounded-3xl border border-line bg-white p-9 transition hover:-translate-y-1 hover:shadow-card">
            <h3 className="font-display text-xl font-bold">Starter</h3>
            <p className="mt-2 text-sm text-muted">For your first store</p>
            <div className="mt-6"><span className="font-display text-[44px] font-extrabold tracking-[-0.02em]">{annual ? plans.starter.annual : plans.starter.monthly}</span><span className="text-[15px] text-muted"> /mo</span></div>
            <ul className="mt-[26px] flex flex-col gap-3 text-[14.5px] text-[#374151]">
              {["25 product imports", "1 Shopify store", "Daily inventory sync", "Email support"].map((f) => <li key={f} className="flex items-center gap-2.5"><span className="font-bold text-success">✓</span>{f}</li>)}
            </ul>
            <Link href="/signup" className="mt-auto rounded-xl border-[1.5px] border-ink pt-8 text-center text-[15px] font-semibold transition hover:bg-ink hover:text-white [padding-block:14px]">Start Free</Link>
          </div>
          {/* Professional */}
          <div className="relative flex flex-col rounded-3xl bg-ink p-9 text-white shadow-[0_30px_60px_rgba(17,17,17,0.25)] transition hover:-translate-y-1">
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-b from-brand to-brand-light px-4 py-1.5 text-xs font-bold">Most popular</span>
            <h3 className="font-display text-xl font-bold">Professional</h3>
            <p className="mt-2 text-sm text-gray-400">For growing brands</p>
            <div className="mt-6"><span className="font-display text-[44px] font-extrabold tracking-[-0.02em]">{annual ? plans.pro.annual : plans.pro.monthly}</span><span className="text-[15px] text-gray-400"> /mo</span></div>
            <ul className="mt-[26px] flex flex-col gap-3 text-[14.5px] text-gray-300">
              {["Unlimited product imports", "3 Shopify stores", "Real-time sync & auto-fulfillment", "AI product research", "Priority support"].map((f) => <li key={f} className="flex items-center gap-2.5"><span className="font-bold text-brand-light">✓</span>{f}</li>)}
            </ul>
            <Link href="/signup" className="mt-auto rounded-xl bg-brand text-center text-[15px] font-semibold shadow-brand transition hover:bg-brand-hover [margin-top:32px] [padding-block:14px]">Start 14-day trial</Link>
          </div>
          {/* Enterprise */}
          <div className="flex flex-col rounded-3xl border border-line bg-white p-9 transition hover:-translate-y-1 hover:shadow-card">
            <h3 className="font-display text-xl font-bold">Enterprise</h3>
            <p className="mt-2 text-sm text-muted">For high-volume operations</p>
            <div className="mt-6"><span className="font-display text-[44px] font-extrabold tracking-[-0.02em]">Custom</span></div>
            <ul className="mt-[26px] flex flex-col gap-3 text-[14.5px] text-[#374151]">
              {["Everything in Professional", "Private label & custom packaging", "Dedicated account manager", "SLA & API access"].map((f) => <li key={f} className="flex items-center gap-2.5"><span className="font-bold text-success">✓</span>{f}</li>)}
            </ul>
            <Link href="/signup" className="mt-auto rounded-xl border-[1.5px] border-ink text-center text-[15px] font-semibold transition hover:bg-ink hover:text-white [margin-top:32px] [padding-block:14px]">Talk to Sales</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
