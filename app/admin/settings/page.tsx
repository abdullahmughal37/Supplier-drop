"use client";
import { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle, MessageSquareText } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { useAuth } from "@/lib/auth-context";
import { getDataService } from "@/lib/services";
import { buildWhatsAppLink, DEFAULT_SETTINGS, type AppSettings } from "@/lib/types";

const inputCls =
  "w-full rounded-xl border-[1.5px] border-line px-[15px] py-[13px] text-[14.5px] outline-none transition focus:border-brand focus:shadow-[0_0_0_3px_rgba(255,106,61,0.15)]";

export default function AdminSettings() {
  const { isDemo } = useAuth();
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [loaded, setLoaded] = useState(false);
  const [number, setNumber] = useState("");
  const [template, setTemplate] = useState("");
  const [notifyEmails, setNotifyEmails] = useState("");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(
    () =>
      getDataService().watchSettings((s) => {
        setSettings(s);
        // Only seed the form on first load so live updates don't clobber edits.
        setLoaded((was) => {
          if (!was) {
            setNumber(s.whatsappNumber);
            setTemplate(s.messageTemplate);
            setNotifyEmails(s.notifyEmails || "");
          }
          return true;
        });
      }),
    []
  );

  const digits = number.replace(/[^\d]/g, "");

  const save = async () => {
    setError(null);
    setSaved(false);
    if (digits.length > 0 && (digits.length < 8 || digits.length > 15)) {
      setError("WhatsApp number should be 8–15 digits in international format (e.g. 15551234567 — country code, no + or spaces).");
      return;
    }
    if (!template.includes("{product}")) {
      setError("The message template must include the {product} placeholder.");
      return;
    }
    const emails = notifyEmails
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    if (emails.some((e) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e))) {
      setError("Notification emails must be valid addresses, separated by commas.");
      return;
    }
    setBusy(true);
    try {
      await getDataService().updateSettings({
        whatsappNumber: digits,
        messageTemplate: template.trim(),
        notifyEmails: emails.join(", "),
      });
      setSaved(true);
    } catch (e: any) {
      setError(e?.message || "Could not save settings.");
    } finally {
      setBusy(false);
    }
  };

  const previewLink = buildWhatsAppLink(
    { whatsappNumber: digits || "15551234567", messageTemplate: template || DEFAULT_SETTINGS.messageTemplate, notifyEmails: "" },
    { product: "Aura Desk Lamp", sku: "SD-1001", price: 14.2, merchant: "Maya Rodriguez", note: "Need 200 units in black." }
  );
  const previewText = decodeURIComponent(previewLink.split("?text=")[1] || "");

  return (
    <AdminShell title="Settings" subtitle="Configure how merchants reach your sourcing team.">
      <div className="grid max-w-[860px] grid-cols-1 gap-4 lg:grid-cols-[1.2fr_1fr]">
        <section className="rounded-[18px] border border-line bg-white p-6">
          <h2 className="flex items-center gap-2 font-display text-base font-bold">
            <MessageSquareText size={17} className="text-[#25D366]" /> WhatsApp sourcing
          </h2>
          <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
            When a merchant taps <b>Source on WhatsApp</b>, this number receives the pre-filled message below.
          </p>

          <label className="mt-5 flex flex-col gap-[7px] text-[13.5px] font-semibold">
            WhatsApp number (international format, digits only)
            <input
              className={inputCls}
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              placeholder="e.g. 15551234567 or 923001234567"
              inputMode="tel"
            />
          </label>

          <label className="mt-4 flex flex-col gap-[7px] text-[13.5px] font-semibold">
            Message template
            <textarea
              className={`${inputCls} resize-none font-normal`}
              rows={5}
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
            />
          </label>
          <p className="mt-2 text-[12.5px] leading-relaxed text-muted">
            Placeholders: <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-[11.5px]">{"{product}"}</code>{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-[11.5px]">{"{sku}"}</code>{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-[11.5px]">{"{price}"}</code>{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-[11.5px]">{"{merchant}"}</code>{" "}
            <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-[11.5px]">{"{note}"}</code>
          </p>

          <label className="mt-4 flex flex-col gap-[7px] text-[13.5px] font-semibold">
            Notification emails (optional, comma-separated)
            <input
              className={inputCls}
              value={notifyEmails}
              onChange={(e) => setNotifyEmails(e.target.value)}
              placeholder="sourcing@yourcompany.com, ops@yourcompany.com"
              inputMode="email"
            />
          </label>
          <p className="mt-2 text-[12.5px] leading-relaxed text-muted">
            These addresses get an email for every new sourcing request — requires the
            notification Cloud Function + Trigger Email extension (see README). Ignored in demo mode.
          </p>

          {error && (
            <div role="alert" className="mt-4 flex items-start gap-2.5 rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-[13px] font-medium text-[#B91C1C]">
              <AlertCircle size={15} className="mt-0.5 flex-none" /> <span>{error}</span>
            </div>
          )}
          {saved && (
            <div role="status" className="mt-4 flex items-start gap-2.5 rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] px-4 py-3 text-[13px] font-medium text-[#15803D]">
              <CheckCircle2 size={15} className="mt-0.5 flex-none" /> <span>Settings saved — live for all merchants.</span>
            </div>
          )}

          <button
            onClick={save}
            disabled={busy}
            className="mt-5 rounded-xl bg-brand px-7 py-3 text-[14px] font-semibold text-white shadow-brand transition hover:bg-brand-hover disabled:opacity-60"
          >
            {busy ? "Saving…" : "Save settings"}
          </button>
        </section>

        <section className="flex flex-col rounded-[18px] border border-line bg-white p-6">
          <h3 className="font-display text-base font-bold">Live preview</h3>
          <p className="mt-1.5 text-[13px] text-muted">What the merchant&apos;s WhatsApp will open with:</p>
          <div className="mt-4 rounded-2xl bg-[#E7FCE3] p-4 text-[13.5px] leading-relaxed text-[#1F2937] shadow-sm">
            {previewText || "…"}
          </div>
          <p className="mt-3 text-[12px] text-muted">
            Sent to: <b>+{digits || "not set"}</b>
          </p>
          {isDemo && (
            <p className="mt-auto pt-4 text-[12.5px] leading-relaxed text-muted">
              Demo mode: settings persist in this browser only.
            </p>
          )}
        </section>
      </div>
    </AdminShell>
  );
}
