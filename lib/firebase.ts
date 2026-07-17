// Firebase initialization. All values come from NEXT_PUBLIC_* env vars —
// when they're absent the app runs in local demo mode instead (see services/).
import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import { getStorage, type FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId
);

let app: FirebaseApp | null = null;

export function getFirebaseApp(): FirebaseApp {
  if (!isFirebaseConfigured) throw new Error("Firebase is not configured");
  if (!app) {
    app = getApps()[0] ?? initializeApp(firebaseConfig);
    initAppCheck(app);
  }
  return app;
}

// Optional hardening: when a reCAPTCHA v3 site key is provided, enable
// Firebase App Check so only genuine browser traffic reaches your backend.
// Also enable "Enforce" for Firestore/Storage in the Firebase console.
function initAppCheck(a: FirebaseApp) {
  const siteKey = process.env.NEXT_PUBLIC_FIREBASE_APPCHECK_SITE_KEY;
  if (!siteKey || typeof window === "undefined") return;
  import("firebase/app-check")
    .then(({ initializeAppCheck, ReCaptchaV3Provider }) => {
      initializeAppCheck(a, {
        provider: new ReCaptchaV3Provider(siteKey),
        isTokenAutoRefreshEnabled: true,
      });
    })
    .catch((e) => console.warn("App Check init failed:", e));
}

export function fbAuth(): Auth {
  return getAuth(getFirebaseApp());
}
export function fbDb(): Firestore {
  return getFirestore(getFirebaseApp());
}
export function fbStorage(): FirebaseStorage {
  return getStorage(getFirebaseApp());
}
