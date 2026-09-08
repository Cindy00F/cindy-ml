"use client";

import { Moon, Sun } from "lucide-react";
import { setThemeAction } from "@/app/actions";
import { buttonVariants } from "@/components/ui/button";
import type { ThemeName } from "@/lib/messages";
import { cn } from "@/lib/utils";

export function ThemeToggle({ theme }: { theme: ThemeName }) {
  const next = theme === "dark" ? "light" : "dark";
  return (
    <form action={setThemeAction}>
      <input type="hidden" name="theme" value={next} />
      <button
        type="submit"
        aria-label={next}
        className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
      >
        {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
      </button>
    </form>
  );
}
