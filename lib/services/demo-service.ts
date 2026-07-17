// LocalStorage-backed implementation used when Firebase isn't configured.
// Lets the whole app run instantly for previews. NOT for production use —
// demo passwords are hashed but everything lives in the browser.
import {
  DEFAULT_SETTINGS,
  type AppSettings,
  type Product,
  type ProductInput,
  type RequestStatus,
  type Role,
  type SessionUser,
  type SourcingRequest,
  type UserProfile,
  type UserStatus,
} from "../types";
import type { DataService, Unsubscribe } from "./data-service";

const K = {
  users: "sd_users",
  passwords: "sd_passwords",
  products: "sd_products",
  requests: "sd_requests",
  settings: "sd_settings",
  session: "sd_session",
  seeded: "sd_seeded_v1",
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

async function hash(text: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const uid = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 9)}`;

const SEED_PRODUCTS: Array<Omit<Product, "id" | "createdAt">> = [
  { name: "Aura Desk Lamp", description: "Minimal aluminum desk lamp with three color temperatures, stepless dimming, and a 45-minute auto-off timer. USB-C powered, matte finish, packs flat for cheap shipping.", price: 14.2, suggestedRetail: 44.99, margin: "68%", rating: "4.9", shipping: "4–6 days", supplier: "Lumina Co.", category: "Home & Office", sku: "SD-1001", stock: 860, images: [], active: true },
  { name: "Flow Water Bottle", description: "Double-wall vacuum insulated 750ml bottle. Keeps drinks cold 24h / hot 12h. Powder-coated, leak-proof flip lid, fits car cup holders.", price: 6.8, suggestedRetail: 24.99, margin: "61%", rating: "4.8", shipping: "3–5 days", supplier: "HydraWorks", category: "Fitness & Outdoors", sku: "SD-1002", stock: 1420, images: [], active: true },
  { name: "Nomad Card Wallet", description: "Slim RFID-blocking card wallet in vegan leather. Holds 8 cards + folded cash, quick-access pull tab. Ships in gift-ready box.", price: 4.9, suggestedRetail: 21.99, margin: "72%", rating: "4.9", shipping: "5–8 days", supplier: "Craft&Co", category: "Accessories", sku: "SD-1003", stock: 2300, images: [], active: true },
  { name: "Halo Ring Light", description: "10\" bi-color LED ring light with tripod, phone clamp, and Bluetooth remote. 3200–5600K, 10 brightness steps — the creator-economy staple.", price: 11.5, suggestedRetail: 34.99, margin: "58%", rating: "4.7", shipping: "4–7 days", supplier: "Lumina Co.", category: "Electronics", sku: "SD-1004", stock: 640, images: [], active: true },
  { name: "Zen Acupressure Mat", description: "Acupressure mat + pillow set with 6,210 stimulation points. Linen cover, coconut-fiber core, carry bag included. Huge in the wellness niche.", price: 9.4, suggestedRetail: 39.99, margin: "70%", rating: "4.8", shipping: "4–6 days", supplier: "VitalGoods", category: "Health & Wellness", sku: "SD-1005", stock: 510, images: [], active: true },
  { name: "Pixel Pet Camera", description: "1080p pet camera with treat tosser, two-way audio, and night vision. App-controlled, works on 2.4GHz Wi-Fi. High AOV winner.", price: 26.0, suggestedRetail: 79.99, margin: "64%", rating: "4.6", shipping: "5–8 days", supplier: "HomeSense", category: "Pets", sku: "SD-1006", stock: 220, images: [], active: true },
  { name: "Terra Cork Yoga Mat", description: "Natural cork + TPE yoga mat, 5mm. Antimicrobial, non-slip when wet, includes carry strap. Eco angle converts extremely well.", price: 12.7, suggestedRetail: 49.99, margin: "66%", rating: "4.9", shipping: "3–6 days", supplier: "VitalGoods", category: "Fitness & Outdoors", sku: "SD-1007", stock: 730, images: [], active: true },
  { name: "Orbit Magnetic Charger", description: "3-in-1 foldable magnetic charging station for phone, earbuds, and watch. 15W fast charge, travel pouch included.", price: 8.9, suggestedRetail: 32.99, margin: "63%", rating: "4.7", shipping: "4–7 days", supplier: "VoltEdge", category: "Electronics", sku: "SD-1008", stock: 980, images: [], active: true },
];

type Listener = () => void;

export class DemoDataService implements DataService {
  readonly mode = "demo" as const;
  private listeners = new Map<string, Set<Listener>>();
  private authListeners = new Set<(u: SessionUser | null) => void>();

  constructor() {
    if (typeof window !== "undefined") this.seed();
  }

  private seed() {
    if (localStorage.getItem(K.seeded)) return;
    const now = Date.now();
    const admin: UserProfile = { uid: "demo-admin", name: "Demo Admin", email: "admin@demo.supplierdrop.com", role: "admin", status: "active", createdAt: now, lastActiveAt: now };
    const merchant: UserProfile = { uid: "demo-merchant", name: "Maya Rodriguez", email: "merchant@demo.supplierdrop.com", role: "merchant", status: "active", createdAt: now, lastActiveAt: now };
    write(K.users, [admin, merchant]);
    // Demo-only credentials, documented in the README.
    hash("Admin123!").then((a) =>
      hash("Merchant123!").then((m) => {
        write(K.passwords, { "demo-admin": a, "demo-merchant": m });
      })
    );
    write(
      K.products,
      SEED_PRODUCTS.map((p, i) => ({ ...p, id: uid(), createdAt: now - i * 86400000 }))
    );
    write(K.requests, []);
    write(K.settings, { ...DEFAULT_SETTINGS, whatsappNumber: "15551234567" });
    localStorage.setItem(K.seeded, "1");
  }

  // ---------- change notification ----------
  private notify(key: string) {
    this.listeners.get(key)?.forEach((l) => l());
  }
  private subscribe(key: string, push: Listener): Unsubscribe {
    let set = this.listeners.get(key);
    if (!set) this.listeners.set(key, (set = new Set()));
    set.add(push);
    push();
    return () => set!.delete(push);
  }

  // ---------- auth ----------
  private session(): SessionUser | null {
    return read<SessionUser | null>(K.session, null);
  }
  private emitAuth() {
    const s = this.session();
    this.authListeners.forEach((cb) => cb(s));
  }
  onAuthChange(cb: (user: SessionUser | null) => void): Unsubscribe {
    this.authListeners.add(cb);
    cb(this.session());
    return () => this.authListeners.delete(cb);
  }
  private users(): UserProfile[] {
    return read<UserProfile[]>(K.users, []);
  }
  async signUp(name: string, email: string, password: string): Promise<SessionUser> {
    email = email.trim().toLowerCase();
    if (this.users().some((u) => u.email === email)) throw new Error("An account with this email already exists.");
    const now = Date.now();
    const profile: UserProfile = { uid: uid(), name: name.trim(), email, role: "merchant", status: "active", createdAt: now, lastActiveAt: now };
    write(K.users, [...this.users(), profile]);
    write(K.passwords, { ...read<Record<string, string>>(K.passwords, {}), [profile.uid]: await hash(password) });
    const session: SessionUser = { uid: profile.uid, email, name: profile.name };
    write(K.session, session);
    this.emitAuth();
    this.notify(K.users);
    return session;
  }
  async signIn(email: string, password: string): Promise<SessionUser> {
    email = email.trim().toLowerCase();
    const user = this.users().find((u) => u.email === email);
    if (!user) throw new Error("No account found with this email.");
    const stored = read<Record<string, string>>(K.passwords, {})[user.uid];
    if (stored !== (await hash(password))) throw new Error("Incorrect password.");
    if (user.status === "suspended") throw new Error("This account has been suspended.");
    const session: SessionUser = { uid: user.uid, email, name: user.name, photoURL: user.photoURL };
    write(K.session, session);
    this.emitAuth();
    return session;
  }
  async signInWithGoogle(): Promise<SessionUser> {
    // Demo stand-in: signs in a fixed Google-style user.
    const email = "google.user@demo.supplierdrop.com";
    let user = this.users().find((u) => u.email === email);
    if (!user) {
      const now = Date.now();
      user = { uid: uid(), name: "Google Demo User", email, role: "merchant", status: "active", createdAt: now, lastActiveAt: now };
      write(K.users, [...this.users(), user]);
      this.notify(K.users);
    }
    if (user.status === "suspended") throw new Error("This account has been suspended.");
    const session: SessionUser = { uid: user.uid, email, name: user.name };
    write(K.session, session);
    this.emitAuth();
    return session;
  }
  async signOutUser(): Promise<void> {
    localStorage.removeItem(K.session);
    this.emitAuth();
  }

  // ---------- profiles ----------
  watchProfile(uidArg: string, cb: (p: UserProfile | null) => void): Unsubscribe {
    return this.subscribe(K.users, () => cb(this.users().find((u) => u.uid === uidArg) ?? null));
  }
  async touchLastActive(uidArg: string): Promise<void> {
    write(K.users, this.users().map((u) => (u.uid === uidArg ? { ...u, lastActiveAt: Date.now() } : u)));
    this.notify(K.users);
  }

  // ---------- products ----------
  private products(): Product[] {
    return read<Product[]>(K.products, []);
  }
  watchProducts(includeInactive: boolean, cb: (products: Product[]) => void): Unsubscribe {
    return this.subscribe(K.products, () => {
      const all = this.products().sort((a, b) => b.createdAt - a.createdAt);
      cb(includeInactive ? all : all.filter((p) => p.active));
    });
  }
  async getProduct(id: string): Promise<Product | null> {
    return this.products().find((p) => p.id === id) ?? null;
  }
  async createProduct(data: ProductInput): Promise<string> {
    const p: Product = { ...data, id: uid(), createdAt: Date.now() };
    write(K.products, [p, ...this.products()]);
    this.notify(K.products);
    return p.id;
  }
  async updateProduct(id: string, data: Partial<ProductInput>): Promise<void> {
    write(K.products, this.products().map((p) => (p.id === id ? { ...p, ...data } : p)));
    this.notify(K.products);
  }
  async deleteProduct(id: string): Promise<void> {
    write(K.products, this.products().filter((p) => p.id !== id));
    this.notify(K.products);
  }
  async importProducts(rows: ProductInput[]): Promise<number> {
    const now = Date.now();
    const created = rows.map((r, i) => ({ ...r, id: uid(), createdAt: now + i }));
    write(K.products, [...created, ...this.products()]);
    this.notify(K.products);
    return created.length;
  }
  async uploadImage(file: File): Promise<string> {
    if (file.size > 1_500_000) throw new Error("Demo mode: images must be under 1.5 MB (Firebase mode allows 5 MB).");
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error("Could not read image file."));
      reader.readAsDataURL(file);
    });
  }

  // ---------- sourcing requests ----------
  private requests(): SourcingRequest[] {
    return read<SourcingRequest[]>(K.requests, []);
  }
  async createSourcingRequest(req: Omit<SourcingRequest, "id" | "createdAt" | "status">): Promise<void> {
    const r: SourcingRequest = { ...req, id: uid(), status: "new", createdAt: Date.now() };
    write(K.requests, [r, ...this.requests()]);
    this.notify(K.requests);
  }
  watchMyRequests(uidArg: string, cb: (reqs: SourcingRequest[]) => void): Unsubscribe {
    return this.subscribe(K.requests, () =>
      cb(this.requests().filter((r) => r.merchantId === uidArg).sort((a, b) => b.createdAt - a.createdAt))
    );
  }
  watchAllRequests(cb: (reqs: SourcingRequest[]) => void): Unsubscribe {
    return this.subscribe(K.requests, () => cb([...this.requests()].sort((a, b) => b.createdAt - a.createdAt)));
  }
  async updateRequestStatus(id: string, status: RequestStatus): Promise<void> {
    write(K.requests, this.requests().map((r) => (r.id === id ? { ...r, status } : r)));
    this.notify(K.requests);
  }

  // ---------- users (admin) ----------
  watchUsers(cb: (users: UserProfile[]) => void): Unsubscribe {
    return this.subscribe(K.users, () => cb([...this.users()].sort((a, b) => b.createdAt - a.createdAt)));
  }
  async setUserRole(uidArg: string, role: Role): Promise<void> {
    write(K.users, this.users().map((u) => (u.uid === uidArg ? { ...u, role } : u)));
    this.notify(K.users);
  }
  async setUserStatus(uidArg: string, status: UserStatus): Promise<void> {
    write(K.users, this.users().map((u) => (u.uid === uidArg ? { ...u, status } : u)));
    this.notify(K.users);
  }

  // ---------- settings ----------
  watchSettings(cb: (s: AppSettings) => void): Unsubscribe {
    return this.subscribe(K.settings, () => cb(read<AppSettings>(K.settings, DEFAULT_SETTINGS)));
  }
  async updateSettings(s: Partial<AppSettings>): Promise<void> {
    write(K.settings, { ...read<AppSettings>(K.settings, DEFAULT_SETTINGS), ...s });
    this.notify(K.settings);
  }
}
