import Link from "next/link";
import { Logo } from "@/components/ui";
import { ArrowLeft } from "lucide-react";

// Shared chrome for the legal pages (/terms, /privacy).
export function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-50 border-b border-line bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[860px] items-center justify-between gap-8 px-6">
          <Logo />
          <Link href="/" className="inline-flex items-center gap-2 text-[14px] font-semibold text-muted transition hover:text-brand">
            <ArrowLeft size={15} /> Back to home
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-[860px] px-6 pb-24 pt-14">
        <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-brand">Legal</p>
        <h1 className="mt-3 font-display text-[clamp(30px,4vw,44px)] font-extrabold tracking-[-0.02em]">{title}</h1>
        <p className="mt-2 text-[14px] text-muted">Last updated: {updated}</p>
        <div className="legal-prose mt-10 flex flex-col gap-8 text-[15.5px] leading-[1.75] text-[#374151]">
          {children}
        </div>
      </main>
      <footer className="border-t border-line px-6 py-8 text-center text-[13px] text-gray-400">
        © 2026 SupplierDrop. All rights reserved. ·{" "}
        <Link href="/terms" className="hover:text-brand">Terms</Link> ·{" "}
        <Link href="/privacy" className="hover:text-brand">Privacy</Link>
      </footer>
    </div>
  );
}

export function LegalSection({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 font-display text-[20px] font-bold text-ink">
        {n}. {title}
      </h2>
      <div className="flex flex-col gap-3">{children}</div>
    </section>
  );
}
