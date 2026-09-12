"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { persistTheme } from "@/lib/client-auth";
import { emitCindyPrefs } from "@/lib/client-prefs";
import type { ThemeName } from "@/lib/messages";

export function ThemeToggle({ theme }: { theme: ThemeName }) {
  const [current, setCurrent] = useState(theme);

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
        persistTheme(next);
      }}
      aria-label={current === "dark" ? "Switch to light" : "切换到暗色"}
      className="relative z-[1] inline-flex items-center gap-1 px-1.5 py-1 text-xs text-muted-foreground hover:text-foreground max-[700px]:min-h-9 max-[700px]:px-1"
    >
      {current === "dark" ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
      <span className={`max-[700px]:hidden ${current === "light" ? "text-foreground" : "opacity-50"}`}>亮</span>
      <span className="opacity-30 max-[700px]:hidden">/</span>
      <span className={`max-[700px]:hidden ${current === "dark" ? "text-foreground" : "opacity-50"}`}>暗</span>
    </button>
  );
}
