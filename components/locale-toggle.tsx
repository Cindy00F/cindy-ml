"use client";

import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";

export function LocaleToggle() {
  const { locale, setLocale } = useI18n();
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLocale(locale === "zh" ? "en" : "zh")}
      className="font-medium"
    >
      {locale === "zh" ? "EN" : "中文"}
    </Button>
  );
}
