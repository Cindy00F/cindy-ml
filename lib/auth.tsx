"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";

const STORAGE_KEY = "wangchen-session";

export const DEMO_ACCOUNT = {
  email: "guest@wangchen.dev",
  password: "explain",
  name: "Guest",
};

type Session = {
  email: string;
  name: string;
};

type AuthContextValue = {
  session: Session | null;
  ready: boolean;
  login: (email: string, password: string) => boolean;
  loginAsGuest: () => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const listeners = new Set<() => void>();
let memory: Session | null | undefined;

function emit() {
  listeners.forEach((fn) => fn());
}

function readSession(): Session | null {
  if (typeof window === "undefined") return null;
  if (memory !== undefined) return memory;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    memory = raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    memory = null;
  }
  return memory;
}

function writeSession(next: Session | null) {
  memory = next;
  if (next) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  else window.localStorage.removeItem(STORAGE_KEY);
  emit();
}

function subscribe(fn: () => void) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const session = useSyncExternalStore(subscribe, readSession, () => null);
  const ready = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );

  const login = useCallback((email: string, password: string) => {
    const normalized = email.trim().toLowerCase();
    if (
      normalized === DEMO_ACCOUNT.email &&
      password === DEMO_ACCOUNT.password
    ) {
      writeSession({ email: DEMO_ACCOUNT.email, name: DEMO_ACCOUNT.name });
      return true;
    }
    return false;
  }, []);

  const loginAsGuest = useCallback(() => {
    writeSession({ email: DEMO_ACCOUNT.email, name: DEMO_ACCOUNT.name });
  }, []);

  const logout = useCallback(() => writeSession(null), []);

  const value = useMemo(
    () => ({ session, ready, login, loginAsGuest, logout }),
    [session, ready, login, loginAsGuest, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
