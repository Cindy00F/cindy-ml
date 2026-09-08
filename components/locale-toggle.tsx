"use client";

import { Globe } from "lucide-react";
import { setLocaleAction } from "@/app/actions";
import type { Locale } from "@/lib/messages";

export function LocaleToggle({ locale }: { locale: Locale }) {
  const next = locale === "zh" ? "en" : "zh";
  return (
    <form action={setLocaleAction}>
      <input type="hidden" name="locale" value={next} />
      <button
        type="submit"
        className="inline-flex items-center gap-1 px-1.5 py-1 text-xs tracking-wide text-muted-foreground hover:text-foreground"
      >
        <Globe className="size-3.5" />
        {locale === "zh" ? "en" : "中文"}
      </button>
    </form>
  );
}
