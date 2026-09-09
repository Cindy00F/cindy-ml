"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { CINDY_PREFS_EVENT, type CindyPrefs } from "@/lib/client-prefs";
import { messages, type Locale, type MessageKey } from "@/lib/messages";

type I18nContextValue = {
  locale: Locale;
  t: (key: MessageKey) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const [current, setCurrent] = useState(locale);

  useEffect(() => {
    setCurrent(locale);
  }, [locale]);

  useEffect(() => {
    const onPrefs = (event: Event) => {
      const next = (event as CustomEvent<CindyPrefs>).detail?.locale;
      if (next) setCurrent(next);
    };
    window.addEventListener(CINDY_PREFS_EVENT, onPrefs);
    return () => window.removeEventListener(CINDY_PREFS_EVENT, onPrefs);
  }, []);

  const value = useMemo(
    () => ({
      locale: current,
      t: (key: MessageKey) => messages[current][key],
    }),
    [current],
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

export { messages };
export type { Locale, MessageKey };
