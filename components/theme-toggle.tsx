"use client";

import { Moon, Sun } from "lucide-react";
import { setThemeAction } from "@/app/actions";
import type { ThemeName } from "@/lib/messages";

export function ThemeToggle({ theme }: { theme: ThemeName }) {
  const next = theme === "dark" ? "light" : "dark";
  return (
    <form action={setThemeAction}>
      <input type="hidden" name="theme" value={next} />
      <button
        type="submit"
        aria-label={theme === "dark" ? "Switch to light" : "切换到暗色"}
        className="inline-flex items-center gap-1 px-1.5 py-1 text-xs text-muted-foreground hover:text-foreground"
      >
        {theme === "dark" ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
        <span className={theme === "light" ? "text-foreground" : "opacity-50"}>亮</span>
        <span className="opacity-30">/</span>
        <span className={theme === "dark" ? "text-foreground" : "opacity-50"}>暗</span>
      </button>
    </form>
  );
}
