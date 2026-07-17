import type {
  AppSettings,
  Product,
  ProductInput,
  RequestStatus,
  Role,
  SessionUser,
  SourcingRequest,
  UserProfile,
  UserStatus,
} from "../types";

export type Unsubscribe = () => void;

/**
 * Single seam between the UI and persistence. Two implementations:
 *  - FirebaseDataService (production: Auth + Firestore + Storage)
 *  - DemoDataService (localStorage, used when Firebase env vars are absent)
 */
export interface DataService {
  readonly mode: "firebase" | "demo";

  // ---- auth ----
  onAuthChange(cb: (user: SessionUser | null) => void): Unsubscribe;
  signUp(name: string, email: string, password: string): Promise<SessionUser>;
  signIn(email: string, password: string): Promise<SessionUser>;
  signInWithGoogle(): Promise<SessionUser>;
  signOutUser(): Promise<void>;

  // ---- profiles ----
  watchProfile(uid: string, cb: (p: UserProfile | null) => void): Unsubscribe;
  touchLastActive(uid: string): Promise<void>;

  // ---- products ----
  watchProducts(includeInactive: boolean, cb: (products: Product[]) => void): Unsubscribe;
  getProduct(id: string): Promise<Product | null>;
  createProduct(data: ProductInput): Promise<string>;
  updateProduct(id: string, data: Partial<ProductInput>): Promise<void>;
  deleteProduct(id: string): Promise<void>;
  importProducts(rows: ProductInput[]): Promise<number>;
  uploadImage(file: File): Promise<string>;

  // ---- sourcing requests ----
  createSourcingRequest(
    req: Omit<SourcingRequest, "id" | "createdAt" | "status">
  ): Promise<void>;
  watchMyRequests(uid: string, cb: (reqs: SourcingRequest[]) => void): Unsubscribe;
  watchAllRequests(cb: (reqs: SourcingRequest[]) => void): Unsubscribe;
  updateRequestStatus(id: string, status: RequestStatus): Promise<void>;

  // ---- users (admin) ----
  watchUsers(cb: (users: UserProfile[]) => void): Unsubscribe;
  setUserRole(uid: string, role: Role): Promise<void>;
  setUserStatus(uid: string, status: UserStatus): Promise<void>;

  // ---- settings ----
  watchSettings(cb: (s: AppSettings) => void): Unsubscribe;
  updateSettings(s: Partial<AppSettings>): Promise<void>;
}
