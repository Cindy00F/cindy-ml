"use client";

import { setLocaleAction } from "@/app/actions";
import { buttonVariants } from "@/components/ui/button";
import type { Locale } from "@/lib/messages";
import { cn } from "@/lib/utils";

export function LocaleToggle({ locale }: { locale: Locale }) {
  const next = locale === "zh" ? "en" : "zh";
  return (
    <form action={setLocaleAction}>
      <input type="hidden" name="locale" value={next} />
      <button
        type="submit"
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "font-medium")}
      >
        {locale === "zh" ? "EN" : "中文"}
      </button>
    </form>
  );
}
