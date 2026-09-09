"use client";

import { createContext, useContext, useMemo } from "react";
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
  const value = useMemo(
    () => ({
      locale,
      t: (key: MessageKey) => messages[locale][key],
    }),
    [locale],
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
