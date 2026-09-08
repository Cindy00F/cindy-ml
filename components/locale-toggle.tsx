"use client";

import { buttonVariants } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function LocaleToggle() {
  const { locale, setLocale } = useI18n();
  return (
    <button
      type="button"
      className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "font-medium")}
      onClick={() => setLocale(locale === "zh" ? "en" : "zh")}
    >
      {locale === "zh" ? "EN" : "中文"}
    </button>
  );
}
