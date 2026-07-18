import Link from "next/link";
import {
  Zap, RefreshCw, Clock, Truck, Package, Settings, BarChart3, Users, Sparkles,
  ArrowRight, PlayCircle, Plus, Check, Star, TrendingUp,
} from "lucide-react";
import { Logo } from "@/components/ui";
import { HomeNavActions } from "@/components/home-nav-actions";
import { features, steps, products, testimonials } from "@/lib/data";
import Faq from "./faq";
import Pricing from "./pricing";

const icons: Record<string, React.ElementType> = {
  Zap, RefreshCw, Clock, Truck, Package, Settings, BarChart3, Users, Sparkles,
};

export default function Home() {
  return (
    <div id="top">
      {/* NAV */}
      <header className="sticky top-0 z-50 border-b border-line bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-[1200px] items-center justify-between gap-8 px-8">
          <Logo />
          <nav aria-label="Main" className="hidden items-center gap-8 text-[14.5px] font-medium text-[#374151] md:flex">
            <a href="#products" className="hover:text-brand">Products</a>
            <a href="#how" className="hover:text-brand">How It Works</a>
            <a href="#pricing" className="hover:text-brand">Pricing</a>
            <a href="#suppliers" className="hover:text-brand">Suppliers</a>
            <a href="#faq" className="hover:text-brand">Resources</a>
          </nav>
          <HomeNavActions />
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden bg-[radial-gradient(1200px_600px_at_50%_-200px,#FFF1EA_0%,#FFFFFF_60%)]">
        <div className="mx-auto max-w-[1200px] animate-fadeUp px-8 pb-10 pt-24 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-[7px] text-[13px] font-semibold text-muted shadow-sm">
            <span className="inline-block h-2 w-2 rounded-full bg-success" />
            The Smarter Way to Source &amp; Scale
          </div>
          <h1 className="mx-auto mt-7 max-w-[920px] font-display text-[clamp(36px,6vw,72px)] font-extrabold leading-[1.05] tracking-[-0.03em] text-balance">
            Scale Your Shopify Business with{" "}
            <span className="bg-gradient-to-b from-brand to-brand-light bg-clip-text text-transparent">One-Click</span> Product Import
          </h1>
          <p className="mx-auto mt-6 max-w-[640px] text-[clamp(16px,2vw,19px)] leading-[1.65] text-muted">
            Discover thousands of winning products, import directly into Shopify, sync inventory automatically, and fulfill orders with ease.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link href="/signup" className="inline-flex items-center gap-2.5 rounded-2xl bg-brand px-8 py-4 text-base font-semibold text-white shadow-brand transition hover:-translate-y-0.5 hover:bg-brand-hover">
              Start Free <ArrowRight size={18} />
            </Link>
            <a href="#dashboard" className="inline-flex items-center gap-2.5 rounded-2xl border-[1.5px] border-ink bg-white px-[30px] py-[15px] text-base font-semibold transition hover:-translate-y-0.5 hover:bg-ink hover:text-white">
              <PlayCircle size={18} /> Watch Demo
            </a>
          </div>
        </div>

        {/* Hero dashboard mockup */}
        <div className="relative mx-auto max-w-[1060px] px-8 pb-32 pt-14">
          <div className="animate-fadeUp overflow-hidden rounded-[20px] border border-line bg-white shadow-[0_30px_80px_rgba(17,17,17,0.12)]">
            <div className="flex items-center gap-2 border-b border-line bg-[#FBFBFC] px-5 py-3.5">
              <span className="h-[11px] w-[11px] rounded-full bg-[#FF5F57]" />
              <span className="h-[11px] w-[11px] rounded-full bg-[#FEBC2E]" />
              <span className="h-[11px] w-[11px] rounded-full bg-[#28C840]" />
              <span className="ml-4 font-mono text-xs text-gray-400">app.supplierdrop.com</span>
            </div>
            <div className="grid min-h-[420px] grid-cols-[200px_1fr]">
              <div className="flex flex-col gap-1 border-r border-line bg-[#FBFBFC] p-3.5 py-5">
                {["Dashboard", "Products", "Orders", "Inventory", "Shipping", "Analytics"].map((l, i) => (
                  <div key={l} className={`rounded-[10px] px-3 py-[9px] text-[13.5px] font-medium ${i === 0 ? "bg-brand-tint font-semibold text-brand" : "text-muted"}`}>{l}</div>
                ))}
              </div>
              <div className="flex flex-col gap-5 p-6 text-left">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="font-display text-lg font-bold">Good morning, Maya</div>
                    <div className="mt-0.5 text-[13px] text-muted">Here&apos;s what&apos;s happening with your store today.</div>
                  </div>
                  <div className="inline-flex items-center gap-2 rounded-[10px] bg-brand px-[18px] py-2.5 text-[13px] font-semibold text-white shadow-brand"><Plus size={14} /> Import Products</div>
                </div>
                <div className="grid grid-cols-3 gap-3.5">
                  {[["Revenue", "$48,290", "↑ 18.2%"], ["Orders", "1,384", "↑ 9.4%"], ["Products synced", "312", "Live on Shopify"]].map(([k, v, d]) => (
                    <div key={k} className="rounded-2xl border border-line p-4">
                      <div className="text-xs font-medium text-muted">{k}</div>
                      <div className="mt-1.5 font-display text-[22px] font-extrabold">{v}</div>
                      <div className={`mt-1 text-xs font-semibold ${d.startsWith("↑") ? "text-success" : "text-muted"}`}>{d}</div>
                    </div>
                  ))}
                </div>
                <div className="flex-1 rounded-2xl border border-line p-[18px]">
                  <div className="flex justify-between text-[13px] font-semibold"><span>Sales overview</span><span className="font-medium text-muted">Last 12 weeks</span></div>
                  <div className="mt-4 flex h-[110px] items-end gap-2.5">
                    {[34, 48, 40, 58, 52, 66, 60, 74, 70, 84, 78, 96].map((h, i) => (
                      <div key={i} className="flex-1 origin-bottom animate-growBar rounded-t-md" style={{ height: `${h}%`, background: i < 3 ? "#FFE1D4" : i < 6 ? "#FFC9B3" : i < 8 ? "#FFAD8C" : i < 10 ? "#FF8B5E" : "#FF6A3D", animationDelay: `${i * 0.05}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating cards */}
          <div aria-hidden className="absolute left-[-8px] top-10 flex animate-floatA items-center gap-3 rounded-2xl border border-line bg-white/90 px-[18px] py-3.5 shadow-[0_16px_40px_rgba(17,17,17,0.12)] backdrop-blur-md">
            <span className="grid h-[38px] w-[38px] place-items-center rounded-[10px] bg-[#ECFDF3] text-success"><Check size={18} strokeWidth={2.4} /></span>
            <span className="text-left"><span className="block text-[13px] font-bold">Product imported</span><span className="block text-xs text-muted">Synced to Shopify · 0.8s</span></span>
          </div>
          <div aria-hidden className="absolute right-[-6px] top-[180px] flex animate-floatB items-center gap-3 rounded-2xl border border-line bg-white/90 px-[18px] py-3.5 shadow-[0_16px_40px_rgba(17,17,17,0.12)] backdrop-blur-md">
            <span className="grid h-[38px] w-[38px] place-items-center rounded-[10px] bg-brand-tint text-brand"><TrendingUp size={18} /></span>
            <span className="text-left"><span className="block text-[13px] font-bold">+$1,240 today</span><span className="block text-xs text-muted">Profit margin 62%</span></span>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="border-t border-line bg-white px-8 py-14">
        <div className="mx-auto max-w-[1100px] text-center">
          <p className="mb-7 text-[13px] font-semibold uppercase tracking-[0.08em] text-gray-400">Trusted by thousands of ecommerce brands</p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 opacity-55 grayscale">
            {["nord&co", "VELOURA", "brightly", "kubo_", "ATLAS", "Fern&Fog"].map((b) => (
              <span key={b} className="font-display text-xl font-extrabold">{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="bg-surface px-8 py-[110px]">
        <div className="mx-auto max-w-[1200px]">
          <div className="mx-auto mb-16 max-w-[640px] text-center">
            <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-brand">Everything you need</p>
            <h2 className="mt-3.5 font-display text-[clamp(30px,4vw,46px)] font-extrabold leading-[1.1] tracking-[-0.02em] text-balance">One platform, from sourcing to fulfillment</h2>
            <p className="mt-[18px] text-[17px] leading-[1.65] text-muted">Stop juggling suppliers, spreadsheets, and sync tools. SupplierDrop handles the entire product lifecycle.</p>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-5">
            {features.map((f) => {
              const Icon = icons[f.icon];
              return (
                <div key={f.title} className="rounded-2xl border border-line bg-white p-[30px] transition hover:-translate-y-1 hover:shadow-card">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-tint text-brand"><Icon size={22} /></span>
                  <h3 className="mb-2 mt-5 font-display text-[19px] font-bold">{f.title}</h3>
                  <p className="text-[15px] leading-[1.6] text-muted">{f.body}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how" className="bg-white px-8 py-[110px]">
        <div className="mx-auto max-w-[1200px]">
          <div className="mx-auto mb-16 max-w-[600px] text-center">
            <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-brand">How it works</p>
            <h2 className="mt-3.5 font-display text-[clamp(30px,4vw,46px)] font-extrabold leading-[1.1] tracking-[-0.02em]">Live in minutes, not weeks</h2>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(230px,1fr))] gap-5">
            {steps.map((s) => (
              <div key={s.n} className="rounded-2xl border border-line bg-surface p-8 transition hover:-translate-y-1 hover:bg-white hover:shadow-card">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-b from-brand to-brand-light font-display text-[15px] font-extrabold text-white">{s.n}</span>
                <h3 className="mb-2 mt-[22px] font-display text-[19px] font-bold">{s.title}</h3>
                <p className="text-[14.5px] leading-[1.6] text-muted">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCT SHOWCASE */}
      <section id="products" className="bg-surface px-8 py-[110px]">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-brand">Product catalog</p>
              <h2 className="mt-3.5 font-display text-[clamp(30px,4vw,46px)] font-extrabold leading-[1.1] tracking-[-0.02em]">Winning products, verified daily</h2>
            </div>
            <Link href="/signup" className="inline-flex items-center gap-2 rounded-xl border-[1.5px] border-ink px-6 py-3 text-[15px] font-semibold transition hover:bg-ink hover:text-white">
              Browse all 50,000+ products <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(255px,1fr))] gap-5">
            {products.map((p) => (
              <div key={p.name} className="overflow-hidden rounded-2xl border border-line bg-white transition hover:-translate-y-1 hover:shadow-card">
                <div className="relative aspect-[4/3] overflow-hidden bg-[#F3F4F6]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.img} alt={p.name} loading="lazy" className="h-full w-full object-cover transition duration-300 hover:scale-105" />
                  <span className="absolute left-3 top-3 rounded-full bg-[#ECFDF3] px-2.5 py-[5px] text-xs font-bold text-[#16A34A]">{p.margin} margin</span>
                </div>
                <div className="p-5">
                  <div className="flex items-baseline justify-between gap-2">
                    <h3 className="font-display text-[16.5px] font-bold">{p.name}</h3>
                    <span className="whitespace-nowrap text-[13px] font-semibold text-brand">★ {p.rating}</span>
                  </div>
                  <div className="mt-2.5 flex gap-3.5 text-[13px] text-muted">
                    <span className="inline-flex items-center gap-1.5"><Truck size={13} /> {p.shipping}</span>
                    <span>{p.supplier}</span>
                  </div>
                  <Link href="/signup" className="mt-4 block w-full rounded-[11px] bg-ink py-3 text-center text-sm font-semibold text-white transition hover:bg-brand">Import to Shopify</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SHOPIFY INTEGRATION */}
      <section id="suppliers" className="bg-white px-8 py-[110px]">
        <div className="mx-auto grid max-w-[1200px] grid-cols-[repeat(auto-fit,minmax(340px,1fr))] items-center gap-16">
          <div>
            <div className="inline-flex items-center gap-2.5 rounded-full border border-[#DCEACB] bg-[#F0F6EA] px-4 py-2 text-[13px] font-bold text-[#5E8E3E]">
              <span className="grid h-[22px] w-[22px] place-items-center rounded-md bg-[#95BF47] font-display text-[13px] font-extrabold text-white">S</span>
              Built for Shopify
            </div>
            <h2 className="mt-[22px] font-display text-[clamp(30px,4vw,46px)] font-extrabold leading-[1.12] tracking-[-0.02em] text-balance">Your store and suppliers, perfectly in sync</h2>
            <p className="mt-[18px] text-[17px] leading-[1.65] text-muted">A deep, two-way Shopify integration — not a fragile CSV bridge. Everything stays consistent, automatically.</p>
            <ul className="mt-7 flex flex-col gap-3.5">
              {["Connect Shopify in one click", "Import products with variants & media", "Sync inventory in real time", "Sync orders both ways", "Auto-fulfillment with live tracking"].map((t) => (
                <li key={t} className="flex items-center gap-3 text-[15.5px] font-medium">
                  <span className="grid h-6 w-6 flex-none place-items-center rounded-full bg-[#ECFDF3] text-success"><Check size={13} strokeWidth={3} /></span>{t}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col items-center rounded-3xl border border-line bg-surface p-10">
            <div className="flex w-[min(320px,100%)] items-center gap-3.5 rounded-2xl border border-line bg-white px-[26px] py-[18px] shadow-sm">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-brand-tint font-display font-extrabold text-brand">SD</span>
              <span><span className="block text-[15px] font-bold">SupplierDrop</span><span className="block text-[12.5px] text-muted">312 products · 14 suppliers</span></span>
            </div>
            <div aria-hidden className="flex flex-col items-center py-1.5">
              <span className="h-4 w-0.5 bg-gray-300" />
              <span className="my-1 rounded-full border border-line bg-white px-3 py-[5px] text-[11px] font-bold text-muted">real-time sync</span>
              <span className="h-4 w-0.5 bg-gray-300" />
            </div>
            <div className="flex w-[min(320px,100%)] items-center gap-3.5 rounded-2xl border border-line bg-white px-[26px] py-[18px] shadow-sm">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#95BF47] font-display font-extrabold text-white">S</span>
              <span><span className="block text-[15px] font-bold">Shopify Store</span><span className="block text-[12.5px] text-muted">Inventory · Orders · Fulfillment</span></span>
            </div>
            <div className="mt-7 grid w-full grid-cols-2 gap-3">
              {[["0.8s", "avg import time"], ["99.99%", "sync uptime"]].map(([v, l]) => (
                <div key={l} className="rounded-2xl border border-line bg-white px-[18px] py-3.5 text-center"><span className="block font-display text-xl font-extrabold">{v}</span><span className="text-xs text-muted">{l}</span></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* DASHBOARD PREVIEW */}
      <section id="dashboard" className="bg-ink px-8 py-[110px] text-white">
        <div className="mx-auto max-w-[1200px]">
          <div className="mx-auto mb-14 max-w-[640px] text-center">
            <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-brand-light">Command center</p>
            <h2 className="mt-3.5 font-display text-[clamp(30px,4vw,46px)] font-extrabold leading-[1.1] tracking-[-0.02em]">Run your entire operation from one dashboard</h2>
            <p className="mt-[18px] text-[17px] leading-[1.65] text-gray-400">Orders, inventory, analytics, and suppliers — all in an interface fast enough to live in.</p>
          </div>
          <div className="rounded-2xl bg-white p-1 text-center">
            <Link href="/dashboard" className="inline-flex items-center gap-2 rounded-xl bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-hover m-6">
              Open the live dashboard <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* PRICING (client component) */}
      <Pricing />

      {/* TESTIMONIALS */}
      <section className="bg-surface px-8 py-[110px]">
        <div className="mx-auto max-w-[1200px]">
          <div className="mx-auto mb-14 max-w-[560px] text-center">
            <p className="text-[13px] font-bold uppercase tracking-[0.08em] text-brand">Loved by merchants</p>
            <h2 className="mt-3.5 font-display text-[clamp(30px,4vw,46px)] font-extrabold leading-[1.1] tracking-[-0.02em]">Built with sellers, for sellers</h2>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-5">
            {testimonials.map((t) => (
              <div key={t.name} className="flex flex-col gap-[18px] rounded-2xl border border-line bg-white p-8 transition hover:-translate-y-1 hover:shadow-card">
                <span className="text-[15px] tracking-[2px] text-brand" aria-label="5 out of 5 stars">★★★★★</span>
                <p className="text-[15.5px] leading-[1.7] text-[#374151]">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-auto flex items-center gap-3">
                  <span className="grid h-[42px] w-[42px] place-items-center rounded-full text-sm font-bold" style={{ background: t.tint, color: t.fg }}>{t.initials}</span>
                  <span><span className="block text-[14.5px] font-bold">{t.name}</span><span className="block text-[13px] text-muted">{t.role}</span></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ (client component) */}
      <Faq />

      {/* CTA */}
      <section id="cta" className="bg-surface px-8 pb-[110px] pt-16">
        <div className="relative mx-auto max-w-[1100px] overflow-hidden rounded-[28px] bg-gradient-to-br from-brand to-brand-light px-10 py-20 text-center text-white shadow-[0_30px_70px_rgba(255,106,61,0.35)]">
          <div aria-hidden className="absolute -right-20 -top-[120px] h-[340px] w-[340px] rounded-full bg-white/10" />
          <div aria-hidden className="absolute -bottom-[140px] -left-16 h-[300px] w-[300px] rounded-full bg-white/[0.08]" />
          <h2 className="relative m-0 font-display text-[clamp(32px,5vw,54px)] font-extrabold leading-[1.08] tracking-[-0.02em]">Ready to scale your store?</h2>
          <p className="relative mx-auto mt-[18px] max-w-[480px] text-lg leading-[1.6] text-white/90">Start free today. No credit card required, cancel anytime.</p>
          <div className="relative mt-9 flex justify-center">
            <Link href="/signup" className="inline-flex items-center gap-2.5 rounded-2xl bg-white px-[34px] py-4 text-base font-bold text-ink shadow-[0_10px_30px_rgba(0,0,0,0.15)] transition hover:-translate-y-0.5 hover:text-brand">
              Start Free Today <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-line bg-white px-8 pb-10 pt-[72px]">
        <div className="mx-auto max-w-[1200px]">
          <div className="grid grid-cols-2 gap-10 md:grid-cols-[2fr_1fr_1fr_1fr_1fr]">
            <div className="col-span-2 md:col-span-1">
              <Logo />
              <p className="mt-3 max-w-[260px] text-sm leading-[1.65] text-muted">The smarter way to source &amp; scale. Discover, import, and automate winning products for Shopify.</p>
            </div>
            {(
              [
                ["Products", [["Catalog", "#products"], ["Features", "#features"], ["Integrations", "#suppliers"], ["Dashboard", "/dashboard"]]],
                ["Company", [["How It Works", "#how"], ["Testimonials", "#top"], ["Pricing", "#pricing"], ["Get Started", "/signup"]]],
                ["Resources", [["Help Center", "#faq"], ["FAQ", "#faq"], ["Sign In", "/signin"], ["Create Account", "/signup"]]],
                ["Legal", [["Privacy", "/privacy"], ["Terms", "/terms"], ["Security", "/privacy"], ["Contact", "mailto:husnainumer07@gmail.com"]]],
              ] as [string, [string, string][]][]
            ).map(([title, links]) => (
              <nav key={title} aria-label={title}>
                <p className="mb-4 text-[13px] font-bold uppercase tracking-[0.06em]">{title}</p>
                <div className="flex flex-col gap-[11px] text-sm">
                  {links.map(([l, href]) => (
                    <a key={l} href={href} className="text-muted hover:text-brand">{l}</a>
                  ))}
                </div>
              </nav>
            ))}
          </div>
          <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-7 text-[13px] text-gray-400">
            <span>© 2026 SupplierDrop, Inc. All rights reserved.</span>
            <span className="inline-flex items-center gap-2"><span className="inline-block h-2 w-2 rounded-full bg-success" />All systems operational</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
