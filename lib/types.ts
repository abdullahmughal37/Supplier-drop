// Shared domain types for SupplierDrop.

export type Role = "merchant" | "admin";
export type UserStatus = "active" | "suspended";

export type UserProfile = {
  uid: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  createdAt: number; // epoch ms
  lastActiveAt: number;
  photoURL?: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number; // supplier cost (USD)
  suggestedRetail?: number;
  margin?: string; // e.g. "68%"
  rating?: string; // e.g. "4.9"
  shipping?: string; // e.g. "4–6 days"
  supplier?: string;
  category?: string;
  sku?: string;
  stock?: number;
  images: string[];
  active: boolean;
  createdAt: number;
};

export type ProductInput = Omit<Product, "id" | "createdAt">;

export type RequestStatus = "new" | "contacted" | "quoted" | "closed";

export type SourcingRequest = {
  id: string;
  productId: string;
  productName: string;
  productSku?: string;
  merchantId: string;
  merchantName: string;
  merchantEmail: string;
  note?: string;
  status: RequestStatus;
  createdAt: number;
};

export type AppSettings = {
  whatsappNumber: string; // digits only, international format e.g. 15551234567
  messageTemplate: string; // supports {product} {sku} {price} {merchant} {note}
  notifyEmails: string; // comma-separated; used by the Cloud Function email scaffold
};

export const DEFAULT_SETTINGS: AppSettings = {
  whatsappNumber: "",
  messageTemplate:
    "Hi SupplierDrop! I'm {merchant} and I'd like to source \"{product}\" (SKU: {sku}, listed at ${price}). {note}",
  notifyEmails: "",
};

export type SessionUser = {
  uid: string;
  email: string;
  name: string;
  photoURL?: string;
};

/** Build the wa.me deep link for a sourcing request. */
export function buildWhatsAppLink(
  settings: AppSettings,
  p: { product: string; sku?: string; price?: number; merchant: string; note?: string }
): string {
  const text = settings.messageTemplate
    .replaceAll("{product}", p.product)
    .replaceAll("{sku}", p.sku || "n/a")
    .replaceAll("{price}", p.price != null ? p.price.toFixed(2) : "n/a")
    .replaceAll("{merchant}", p.merchant)
    .replaceAll("{note}", p.note || "");
  const number = settings.whatsappNumber.replace(/[^\d]/g, "");
  return `https://wa.me/${number}?text=${encodeURIComponent(text.trim())}`;
}
