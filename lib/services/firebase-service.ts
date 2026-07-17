// Production implementation backed by Firebase Auth + Firestore + Storage.
// Access control is enforced server-side by firestore.rules / storage.rules;
// everything here assumes the rules are deployed (see /firebase in repo root).
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
  type DocumentData,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { fbAuth, fbDb, fbStorage } from "../firebase";
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

function toSession(u: User): SessionUser {
  return {
    uid: u.uid,
    email: u.email ?? "",
    name: u.displayName ?? u.email ?? "User",
    photoURL: u.photoURL ?? undefined,
  };
}

const ts = (v: any): number =>
  typeof v === "number" ? v : v?.toMillis ? v.toMillis() : Date.now();

function toProfile(id: string, d: DocumentData): UserProfile {
  return {
    uid: id,
    name: d.name ?? "",
    email: d.email ?? "",
    role: d.role === "admin" ? "admin" : "merchant",
    status: d.status === "suspended" ? "suspended" : "active",
    createdAt: ts(d.createdAt),
    lastActiveAt: ts(d.lastActiveAt),
    photoURL: d.photoURL ?? undefined,
  };
}

function toProduct(id: string, d: DocumentData): Product {
  return {
    id,
    name: d.name ?? "",
    description: d.description ?? "",
    price: Number(d.price) || 0,
    suggestedRetail: d.suggestedRetail != null ? Number(d.suggestedRetail) : undefined,
    margin: d.margin ?? undefined,
    rating: d.rating ?? undefined,
    shipping: d.shipping ?? undefined,
    supplier: d.supplier ?? undefined,
    category: d.category ?? undefined,
    sku: d.sku ?? undefined,
    stock: d.stock != null ? Number(d.stock) : undefined,
    images: Array.isArray(d.images) ? d.images : [],
    active: d.active !== false,
    createdAt: ts(d.createdAt),
  };
}

function toRequest(id: string, d: DocumentData): SourcingRequest {
  return {
    id,
    productId: d.productId ?? "",
    productName: d.productName ?? "",
    productSku: d.productSku ?? undefined,
    merchantId: d.merchantId ?? "",
    merchantName: d.merchantName ?? "",
    merchantEmail: d.merchantEmail ?? "",
    note: d.note ?? undefined,
    status: (d.status as RequestStatus) ?? "new",
    createdAt: ts(d.createdAt),
  };
}

/** Strip undefined values — Firestore rejects them. */
function clean<T extends Record<string, any>>(obj: T): Record<string, any> {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined));
}

export class FirebaseDataService implements DataService {
  readonly mode = "firebase" as const;

  // ---------- auth ----------
  onAuthChange(cb: (user: SessionUser | null) => void): Unsubscribe {
    return onAuthStateChanged(fbAuth(), (u) => cb(u ? toSession(u) : null));
  }

  async signUp(name: string, email: string, password: string): Promise<SessionUser> {
    const cred = await createUserWithEmailAndPassword(fbAuth(), email.trim(), password);
    await updateProfile(cred.user, { displayName: name.trim() });
    // New accounts are always merchants; promotion to admin happens only
    // via the Firebase console or an existing admin (enforced by rules).
    await setDoc(doc(fbDb(), "users", cred.user.uid), {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role: "merchant",
      status: "active",
      createdAt: serverTimestamp(),
      lastActiveAt: serverTimestamp(),
    });
    return toSession(cred.user);
  }

  async signIn(email: string, password: string): Promise<SessionUser> {
    const cred = await signInWithEmailAndPassword(fbAuth(), email.trim(), password);
    return toSession(cred.user);
  }

  async signInWithGoogle(): Promise<SessionUser> {
    const cred = await signInWithPopup(fbAuth(), new GoogleAuthProvider());
    const userRef = doc(fbDb(), "users", cred.user.uid);
    const snap = await getDoc(userRef);
    if (!snap.exists()) {
      await setDoc(userRef, {
        name: cred.user.displayName ?? cred.user.email ?? "User",
        email: (cred.user.email ?? "").toLowerCase(),
        role: "merchant",
        status: "active",
        createdAt: serverTimestamp(),
        lastActiveAt: serverTimestamp(),
        photoURL: cred.user.photoURL ?? undefined,
      });
    }
    return toSession(cred.user);
  }

  async signOutUser(): Promise<void> {
    await signOut(fbAuth());
  }

  // ---------- profiles ----------
  watchProfile(uid: string, cb: (p: UserProfile | null) => void): Unsubscribe {
    return onSnapshot(
      doc(fbDb(), "users", uid),
      (snap) => cb(snap.exists() ? toProfile(snap.id, snap.data()) : null),
      () => cb(null)
    );
  }

  async touchLastActive(uid: string): Promise<void> {
    await updateDoc(doc(fbDb(), "users", uid), { lastActiveAt: serverTimestamp() }).catch(() => {});
  }

  // ---------- products ----------
  watchProducts(includeInactive: boolean, cb: (products: Product[]) => void): Unsubscribe {
    // Merchants may only query active products (rules enforce this).
    const base = collection(fbDb(), "products");
    const q = includeInactive
      ? query(base, orderBy("createdAt", "desc"))
      : query(base, where("active", "==", true), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) => cb(snap.docs.map((d) => toProduct(d.id, d.data()))));
  }

  async getProduct(id: string): Promise<Product | null> {
    try {
      const snap = await getDoc(doc(fbDb(), "products", id));
      return snap.exists() ? toProduct(snap.id, snap.data()) : null;
    } catch {
      return null; // permission denied (e.g. inactive product for a merchant)
    }
  }

  async createProduct(data: ProductInput): Promise<string> {
    const refDoc = await addDoc(collection(fbDb(), "products"), {
      ...clean(data),
      createdAt: serverTimestamp(),
    });
    return refDoc.id;
  }

  async updateProduct(id: string, data: Partial<ProductInput>): Promise<void> {
    await updateDoc(doc(fbDb(), "products", id), clean(data));
  }

  async deleteProduct(id: string): Promise<void> {
    await deleteDoc(doc(fbDb(), "products", id));
  }

  async importProducts(rows: ProductInput[]): Promise<number> {
    // Firestore batches cap at 500 writes.
    let count = 0;
    for (let i = 0; i < rows.length; i += 450) {
      const batch = writeBatch(fbDb());
      for (const row of rows.slice(i, i + 450)) {
        batch.set(doc(collection(fbDb(), "products")), { ...clean(row), createdAt: serverTimestamp() });
        count++;
      }
      await batch.commit();
    }
    return count;
  }

  async uploadImage(file: File): Promise<string> {
    if (file.size > 5 * 1024 * 1024) throw new Error("Images must be under 5 MB.");
    if (!file.type.startsWith("image/")) throw new Error("Only image files are allowed.");
    const safeName = file.name.replace(/[^\w.\-]/g, "_");
    const storageRef = ref(fbStorage(), `products/${Date.now()}-${safeName}`);
    const snap = await uploadBytes(storageRef, file, { contentType: file.type });
    return getDownloadURL(snap.ref);
  }

  // ---------- sourcing requests ----------
  async createSourcingRequest(req: Omit<SourcingRequest, "id" | "createdAt" | "status">): Promise<void> {
    await addDoc(collection(fbDb(), "sourcingRequests"), {
      ...clean(req),
      status: "new",
      createdAt: serverTimestamp(),
    });
  }

  watchMyRequests(uid: string, cb: (reqs: SourcingRequest[]) => void): Unsubscribe {
    const q = query(
      collection(fbDb(), "sourcingRequests"),
      where("merchantId", "==", uid),
      orderBy("createdAt", "desc")
    );
    return onSnapshot(q, (snap) => cb(snap.docs.map((d) => toRequest(d.id, d.data()))));
  }

  watchAllRequests(cb: (reqs: SourcingRequest[]) => void): Unsubscribe {
    const q = query(collection(fbDb(), "sourcingRequests"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) => cb(snap.docs.map((d) => toRequest(d.id, d.data()))));
  }

  async updateRequestStatus(id: string, status: RequestStatus): Promise<void> {
    await updateDoc(doc(fbDb(), "sourcingRequests", id), { status });
  }

  // ---------- users (admin) ----------
  watchUsers(cb: (users: UserProfile[]) => void): Unsubscribe {
    const q = query(collection(fbDb(), "users"), orderBy("createdAt", "desc"));
    return onSnapshot(q, (snap) => cb(snap.docs.map((d) => toProfile(d.id, d.data()))));
  }

  async setUserRole(uid: string, role: Role): Promise<void> {
    await updateDoc(doc(fbDb(), "users", uid), { role });
  }

  async setUserStatus(uid: string, status: UserStatus): Promise<void> {
    await updateDoc(doc(fbDb(), "users", uid), { status });
  }

  // ---------- settings ----------
  watchSettings(cb: (s: AppSettings) => void): Unsubscribe {
    return onSnapshot(
      doc(fbDb(), "settings", "global"),
      (snap) => cb(snap.exists() ? ({ ...DEFAULT_SETTINGS, ...snap.data() } as AppSettings) : DEFAULT_SETTINGS),
      () => cb(DEFAULT_SETTINGS)
    );
  }

  async updateSettings(s: Partial<AppSettings>): Promise<void> {
    await setDoc(doc(fbDb(), "settings", "global"), clean(s), { merge: true });
  }
}
