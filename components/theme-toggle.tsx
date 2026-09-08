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
        aria-label={next}
        className="inline-flex size-8 items-center justify-center text-muted-foreground hover:text-foreground"
      >
        {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
      </button>
    </form>
  );
}
