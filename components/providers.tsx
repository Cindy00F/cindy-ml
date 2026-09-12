"use client";

import { PageViewTracker } from "@/components/page-view-tracker";
import { I18nProvider } from "@/lib/i18n";
import type { Locale } from "@/lib/messages";

export function Providers({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  return (
    <I18nProvider locale={locale}>
      <PageViewTracker />
      {children}
    </I18nProvider>
  );
}
