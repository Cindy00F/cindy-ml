"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { CINDY_PREFS_EVENT, type CindyPrefs } from "@/lib/client-prefs";
import { DEFAULT_LOCALE, messages, type Locale, type MessageKey } from "@/lib/messages";

type I18nContextValue = {
  locale: Locale;
  setLocale: (next: Locale) => void;
  t: (key: MessageKey) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function readStoredLocale(fallback: Locale): Locale {
  if (typeof window === "undefined") return fallback;
  try {
    const stored = localStorage.getItem("cindy-locale");
    if (stored === "en") return "en";
    if (stored === "zh") return "zh";
  } catch {
    /* ignore */
  }
  const match = document.cookie.match(/(?:^|; )cindy-locale=([^;]+)/);
  const cookie = match ? decodeURIComponent(match[1]) : "";
  if (cookie === "en") return "en";
  if (cookie === "zh") return "zh";
  return fallback;
}

function applyLang(next: Locale) {
  document.documentElement.lang = next === "zh" ? "zh-CN" : "en";
}

export function I18nProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const [current, setCurrent] = useState<Locale>(locale);

  const setLocale = useCallback((next: Locale) => {
    setCurrent(next);
    applyLang(next);
  }, []);

  useEffect(() => {
    const stored = readStoredLocale(locale);
    setCurrent((now) => (stored === now ? now : stored));
  }, [locale]);

  useEffect(() => {
    const onPrefs = (event: Event) => {
      const next = (event as CustomEvent<CindyPrefs>).detail?.locale;
      if (next) setLocale(next);
    };
    window.addEventListener(CINDY_PREFS_EVENT, onPrefs);
    return () => window.removeEventListener(CINDY_PREFS_EVENT, onPrefs);
  }, [setLocale]);

  useEffect(() => {
    applyLang(current);
  }, [current]);

  const value = useMemo(
    () => ({
      locale: current,
      setLocale,
      t: (key: MessageKey) => messages[current][key],
    }),
    [current, setLocale],
  );
  return (
    <I18nContext.Provider value={value}>
      <div className="flex h-full min-h-full flex-1 flex-col">{children}</div>
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

export { messages, DEFAULT_LOCALE };
export type { Locale, MessageKey };
