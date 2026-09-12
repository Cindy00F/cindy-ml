"use client";

import { useI18n } from "@/lib/i18n";

export function LoginCopy() {
  const { t } = useI18n();
  return (
    <>
      <h1 className="font-heading mt-3 text-4xl leading-tight sm:text-5xl">{t("welcomeBack")}</h1>
      <p className="mt-5 max-w-md text-sm leading-7 text-muted-foreground">{t("loginSubtitle")}</p>
    </>
  );
}
