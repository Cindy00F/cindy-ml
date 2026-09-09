"use client";

import { Globe } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { setLocaleAction } from "@/app/actions";
import { emitCindyPrefs } from "@/lib/client-prefs";
import type { Locale } from "@/lib/messages";

export function LocaleToggle({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const router = useRouter();
  const [current, setCurrent] = useState(locale);
  const [, startTransition] = useTransition();

  useEffect(() => {
    setCurrent(locale);
  }, [locale]);

  const next = current === "zh" ? "en" : "zh";

  return (
    <button
      type="button"
      onClick={() => {
        setCurrent(next);
        document.documentElement.lang = next === "zh" ? "zh-CN" : "en";
        emitCindyPrefs({ locale: next });
        startTransition(async () => {
          const data = new FormData();
          data.set("locale", next);
          data.set("next", pathname || "/dashboard");
          await setLocaleAction(data);
          router.refresh();
        });
      }}
      className="relative z-[1] inline-flex items-center gap-1 px-1.5 py-1 text-xs tracking-wide text-muted-foreground hover:text-foreground max-[700px]:min-h-9 max-[700px]:px-1"
      aria-label={current === "zh" ? "Switch to English" : "切换到中文"}
    >
      <Globe className="size-3.5" />
      <span className={`max-[700px]:hidden ${current === "zh" ? "text-foreground" : "opacity-50"}`}>中文</span>
      <span className="opacity-30 max-[700px]:hidden">/</span>
      <span className={`max-[700px]:hidden ${current === "en" ? "text-foreground" : "opacity-50"}`}>EN</span>
    </button>
  );
}
