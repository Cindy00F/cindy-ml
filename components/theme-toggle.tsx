"use client";

import { Moon, Sun } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { setThemeAction } from "@/app/actions";
import { emitCindyPrefs } from "@/lib/client-prefs";
import type { ThemeName } from "@/lib/messages";

export function ThemeToggle({ theme }: { theme: ThemeName }) {
  const pathname = usePathname();
  const router = useRouter();
  const [current, setCurrent] = useState(theme);
  const [, startTransition] = useTransition();

  useEffect(() => {
    setCurrent(theme);
  }, [theme]);

  const next = current === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => {
        setCurrent(next);
        document.documentElement.classList.toggle("dark", next === "dark");
        emitCindyPrefs({ theme: next });
        startTransition(async () => {
          const data = new FormData();
          data.set("theme", next);
          data.set("next", pathname || "/dashboard");
          await setThemeAction(data);
          router.refresh();
        });
      }}
      aria-label={current === "dark" ? "Switch to light" : "切换到暗色"}
      className="relative z-[1] inline-flex items-center gap-1 px-1.5 py-1 text-xs text-muted-foreground hover:text-foreground"
    >
      {current === "dark" ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
      <span className={current === "light" ? "text-foreground" : "opacity-50"}>亮</span>
      <span className="opacity-30">/</span>
      <span className={current === "dark" ? "text-foreground" : "opacity-50"}>暗</span>
    </button>
  );
}
