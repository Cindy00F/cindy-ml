"use client";

import { Globe } from "lucide-react";
import { track } from "@/lib/analytics";
import { persistLocale } from "@/lib/client-auth";
import { emitCindyPrefs } from "@/lib/client-prefs";
import { useI18n } from "@/lib/i18n";

export function LocaleToggle() {
  const { locale, setLocale } = useI18n();
  const next = locale === "zh" ? "en" : "zh";

  return (
    <button
      type="button"
      onClick={() => {
        setLocale(next);
        persistLocale(next);
        emitCindyPrefs({ locale: next });
        track({ name: "locale", to: next });
      }}
      className="relative z-[2] inline-flex items-center gap-1 px-1.5 py-1 text-xs tracking-wide text-muted-foreground hover:text-foreground max-[700px]:min-h-10 max-[700px]:min-w-[4.5rem] max-[700px]:px-2"
      aria-label={locale === "zh" ? "Switch to English" : "切换到中文"}
    >
      <Globe className="size-3.5" />
      <span className={locale === "zh" ? "text-foreground" : "opacity-50"}>中文</span>
      <span className="opacity-30">/</span>
      <span className={locale === "en" ? "text-foreground" : "opacity-50"}>EN</span>
    </button>
  );
}
