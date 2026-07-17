"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { faqs } from "@/lib/data";

export default function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="bg-white px-8 py-[110px]">
      <div className="mx-auto max-w-[760px]">
        <div className="mb-12 text-center">
          <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-brand">FAQ</p>
          <h2 className="mt-3.5 font-display text-[clamp(30px,4vw,46px)] font-extrabold leading-[1.1] tracking-[-0.02em]">Questions, answered</h2>
        </div>
        <div className="flex flex-col gap-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="overflow-hidden rounded-2xl border border-line bg-white transition hover:shadow-[0_8px_24px_rgba(17,17,17,0.06)]">
                <button onClick={() => setOpen(isOpen ? -1 : i)} aria-expanded={isOpen} className="flex w-full items-center justify-between gap-4 px-6 py-[22px] text-left text-base font-semibold">
                  {f.q}
                  <span className={`grid h-7 w-7 flex-none place-items-center rounded-full transition ${isOpen ? "rotate-180 bg-brand-tint text-brand" : "bg-surface text-muted"}`}><ChevronDown size={18} /></span>
                </button>
                {isOpen && <p className="px-6 pb-[22px] text-[15px] leading-[1.7] text-muted">{f.a}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
