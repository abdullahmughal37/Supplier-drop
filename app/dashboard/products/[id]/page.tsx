"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft, Truck, Star, Package, Layers, Tag, CheckCircle2, AlertCircle,
} from "lucide-react";
import { MerchantShell } from "@/components/merchant-shell";
import { ProductThumb } from "@/components/shell";
import { useAuth } from "@/lib/auth-context";
import { getDataService } from "@/lib/services";
import { buildWhatsAppLink, DEFAULT_SETTINGS, type AppSettings, type Product } from "@/lib/types";

function WhatsAppIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.371-.025-.52-.074-.149-.668-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

export default function ProductDetail() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user, profile } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [imageIdx, setImageIdx] = useState(0);
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const svc = getDataService();
    svc.getProduct(params.id).then((p) => {
      if (p && p.active) setProduct(p);
      else setNotFound(true);
    });
    return svc.watchSettings(setSettings);
  }, [params.id]);

  const whatsappReady = settings.whatsappNumber.replace(/[^\d]/g, "").length >= 8;

  const source = async () => {
    if (!product || !user || !profile) return;
    setError(null);
    setBusy(true);
    try {
      const link = buildWhatsAppLink(settings, {
        product: product.name,
        sku: product.sku,
        price: product.price,
        merchant: profile.name || user.email,
        note: note.trim(),
      });
      await getDataService().createSourcingRequest({
        productId: product.id,
        productName: product.name,
        productSku: product.sku,
        merchantId: user.uid,
        merchantName: profile.name || user.email,
        merchantEmail: user.email,
        note: note.trim() || undefined,
      });
      setSent(true);
      window.open(link, "_blank", "noopener,noreferrer");
    } catch (err: any) {
      setError(err?.message || "Could not create the sourcing request. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  if (notFound) {
    return (
      <MerchantShell title="Product not found">
        <div className="grid place-items-center rounded-[18px] border border-line bg-white px-6 py-20 text-center">
          <p className="font-display text-lg font-bold">This product isn&apos;t available</p>
          <p className="mt-1 text-[13.5px] text-muted">It may have been removed or deactivated.</p>
          <button
            onClick={() => router.push("/dashboard/products")}
            className="mt-6 rounded-xl bg-ink px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand"
          >
            Back to catalog
          </button>
        </div>
      </MerchantShell>
    );
  }

  if (!product) {
    return (
      <MerchantShell title="Loading…">
        <div className="grid place-items-center rounded-[18px] border border-line bg-white px-6 py-24">
          <span className="h-9 w-9 animate-spin rounded-full border-[3px] border-line border-t-brand" />
        </div>
      </MerchantShell>
    );
  }

  const images = product.images.length > 0 ? product.images : [undefined];

  return (
    <MerchantShell title={product.name} subtitle={product.category || "Product detail"}>
      <Link
        href="/dashboard/products"
        className="inline-flex w-fit items-center gap-2 text-[13.5px] font-semibold text-muted transition hover:text-brand"
      >
        <ArrowLeft size={15} /> Back to catalog
      </Link>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1.1fr_1fr]">
        {/* GALLERY */}
        <div className="flex flex-col gap-3">
          <div className="overflow-hidden rounded-[18px] border border-line bg-white">
            <ProductThumb src={images[imageIdx] as string | undefined} name={product.name} className="aspect-[4/3] w-full" />
          </div>
          {product.images.length > 1 && (
            <div className="flex gap-2.5">
              {product.images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setImageIdx(i)}
                  className={`h-16 w-16 overflow-hidden rounded-xl border-2 transition ${
                    i === imageIdx ? "border-brand" : "border-line hover:border-gray-300"
                  }`}
                >
                  <ProductThumb src={src} name={`${product.name} ${i + 1}`} className="h-full w-full" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* INFO + SOURCE */}
        <div className="flex flex-col gap-4">
          <div className="rounded-[18px] border border-line bg-white p-6">
            <div className="flex flex-wrap items-center gap-2">
              {product.category && (
                <span className="rounded-full bg-brand-tint px-3 py-1 text-xs font-bold text-brand">{product.category}</span>
              )}
              {product.margin && (
                <span className="rounded-full bg-[#ECFDF3] px-3 py-1 text-xs font-bold text-[#16A34A]">{product.margin} margin</span>
              )}
            </div>
            <h2 className="mt-3 font-display text-[26px] font-extrabold tracking-[-0.02em]">{product.name}</h2>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-[13.5px] text-muted">
              {product.rating && (
                <span className="inline-flex items-center gap-1.5 font-semibold text-brand">
                  <Star size={14} fill="currentColor" /> {product.rating}
                </span>
              )}
              {product.supplier && (
                <span className="inline-flex items-center gap-1.5">
                  <Package size={14} /> {product.supplier}
                </span>
              )}
              {product.shipping && (
                <span className="inline-flex items-center gap-1.5">
                  <Truck size={14} /> {product.shipping}
                </span>
              )}
              {product.sku && (
                <span className="inline-flex items-center gap-1.5">
                  <Tag size={14} /> {product.sku}
                </span>
              )}
              {product.stock != null && (
                <span className="inline-flex items-center gap-1.5">
                  <Layers size={14} /> {product.stock.toLocaleString()} in stock
                </span>
              )}
            </div>

            <div className="mt-5 flex items-baseline gap-3 border-t border-line pt-5">
              <span className="font-display text-[32px] font-extrabold tracking-[-0.02em]">${product.price.toFixed(2)}</span>
              <span className="text-[13px] text-muted">supplier cost</span>
              {product.suggestedRetail && (
                <span className="ml-auto text-[13.5px] text-muted">
                  suggested retail <b className="text-ink">${product.suggestedRetail.toFixed(2)}</b>
                </span>
              )}
            </div>

            <p className="mt-5 whitespace-pre-line text-[15px] leading-[1.7] text-[#374151]">{product.description}</p>
          </div>

          {/* WHATSAPP SOURCING CARD */}
          <div className="rounded-[18px] border border-line bg-white p-6">
            <h3 className="font-display text-base font-bold">Source this product</h3>
            <p className="mt-1 text-[13px] leading-relaxed text-muted">
              Sends our sourcing team a WhatsApp message pre-filled with this product&apos;s details — add any customization below.
            </p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value.slice(0, 500))}
              rows={3}
              placeholder="Optional: quantity, color, private label, target price…"
              className="mt-4 w-full resize-none rounded-xl border-[1.5px] border-line px-[15px] py-[13px] text-[14px] outline-none transition focus:border-brand focus:shadow-[0_0_0_3px_rgba(255,106,61,0.15)]"
            />
            {error && (
              <div role="alert" className="mt-3 flex items-start gap-2.5 rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-[13px] font-medium text-[#B91C1C]">
                <AlertCircle size={15} className="mt-0.5 flex-none" /> <span>{error}</span>
              </div>
            )}
            {sent && (
              <div role="status" className="mt-3 flex items-start gap-2.5 rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] px-4 py-3 text-[13px] font-medium text-[#15803D]">
                <CheckCircle2 size={15} className="mt-0.5 flex-none" />
                <span>
                  Request logged! WhatsApp should have opened in a new tab — track replies under{" "}
                  <Link href="/dashboard/requests" className="underline">My Requests</Link>.
                </span>
              </div>
            )}
            <button
              onClick={source}
              disabled={busy || !whatsappReady}
              className="mt-4 flex w-full items-center justify-center gap-2.5 rounded-[13px] bg-[#25D366] py-3.5 text-[15.5px] font-semibold text-white shadow-[0_6px_20px_rgba(37,211,102,0.35)] transition hover:-translate-y-px hover:bg-[#1FB456] disabled:translate-y-0 disabled:opacity-50"
            >
              <WhatsAppIcon /> {busy ? "Opening WhatsApp…" : "Source on WhatsApp"}
            </button>
            {!whatsappReady && (
              <p className="mt-2.5 text-center text-[12.5px] text-muted">
                The sourcing WhatsApp number hasn&apos;t been configured yet — ask your admin to set it in Admin → Settings.
              </p>
            )}
          </div>
        </div>
      </div>
    </MerchantShell>
  );
}
