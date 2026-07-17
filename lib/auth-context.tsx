"use client";
// Session + profile context. The profile (with role) streams from the data
// layer so role changes (e.g. admin promotion/suspension) apply live.
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getDataService } from "./services";
import type { SessionUser, UserProfile } from "./types";

type AuthState = {
  user: SessionUser | null;
  profile: UserProfile | null;
  loading: boolean;
  isDemo: boolean;
};

const AuthContext = createContext<AuthState>({
  user: null,
  profile: null,
  loading: true,
  isDemo: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    const svc = getDataService();
    setIsDemo(svc.mode === "demo");
    let unsubProfile: (() => void) | null = null;
    const unsubAuth = svc.onAuthChange((u) => {
      setUser(u);
      unsubProfile?.();
      unsubProfile = null;
      if (!u) {
        setProfile(null);
        setLoading(false);
        return;
      }
      svc.touchLastActive(u.uid);
      unsubProfile = svc.watchProfile(u.uid, (p) => {
        setProfile(p);
        setLoading(false);
      });
    });
    return () => {
      unsubAuth();
      unsubProfile?.();
    };
  }, []);

  const value = useMemo(
    () => ({ user, profile, loading, isDemo }),
    [user, profile, loading, isDemo]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
