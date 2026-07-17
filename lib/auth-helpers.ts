import { getDataService } from "./services";

/** After auth, route admins to /admin and merchants to /dashboard. */
export function routeAfterAuth(uid: string, replace: (href: string) => void) {
  const svc = getDataService();
  let settled = false;
  const unsub = svc.watchProfile(uid, (p) => {
    if (settled) return; // watcher can fire synchronously, before `unsub` exists
    settled = true;
    queueMicrotask(() => unsub());
    replace(p?.role === "admin" ? "/admin" : "/dashboard");
  });
  if (settled) unsub();
}

/** Map Firebase auth error codes to human-readable messages. */
export function friendlyError(err: any): string {
  const code: string = err?.code || "";
  const map: Record<string, string> = {
    "auth/invalid-credential": "Incorrect email or password.",
    "auth/user-not-found": "No account found with this email.",
    "auth/wrong-password": "Incorrect password.",
    "auth/email-already-in-use": "An account with this email already exists.",
    "auth/weak-password": "Password is too weak — use at least 8 characters.",
    "auth/invalid-email": "That email address doesn't look valid.",
    "auth/too-many-requests": "Too many attempts. Please wait a moment and try again.",
    "auth/popup-closed-by-user": "Google sign-in was cancelled.",
    "auth/popup-blocked": "Your browser blocked the sign-in popup. Allow popups and try again.",
    "auth/network-request-failed": "Network error — check your connection and try again.",
  };
  return map[code] || err?.message || "Something went wrong. Please try again.";
}
