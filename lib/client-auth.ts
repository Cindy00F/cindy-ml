"use client";

import { DEMO_ACCOUNT, type Locale, type Session, type ThemeName } from "@/lib/messages";

function writeCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=31536000; samesite=lax`;
}

function clearCookie(name: string) {
  document.cookie = `${name}=; path=/; max-age=0; samesite=lax`;
}

export function persistSession(session: Session) {
  writeCookie("cindy-session", JSON.stringify(session));
}

export function persistGuestSession() {
  persistSession({ email: DEMO_ACCOUNT.email, name: DEMO_ACCOUNT.name });
}

export function clearSession() {
  clearCookie("cindy-session");
}

export function persistLocale(locale: Locale) {
  writeCookie("cindy-locale", locale);
  try {
    localStorage.setItem("cindy-locale", locale);
  } catch {
    /* ignore */
  }
}

export function persistTheme(theme: ThemeName) {
  writeCookie("cindy-theme", theme);
  try {
    localStorage.setItem("cindy-theme", theme);
  } catch {
    /* ignore */
  }
}
