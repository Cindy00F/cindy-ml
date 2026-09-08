"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpen,
  Compass,
  Info,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { BrandMark } from "@/components/brand-mark";
import { LocaleToggle } from "@/components/locale-toggle";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();
  const { session, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const nav = [
    { href: "/dashboard", label: t("dashboard"), icon: Compass },
    { href: "/dashboard#articles", label: t("articles"), icon: BookOpen },
    { href: "/about", label: t("about"), icon: Info },
  ];

  function signOut() {
    logout();
    router.replace("/login");
  }

  return (
    <div className="min-h-svh bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r bg-sidebar p-4 md:flex">
        <Link href="/dashboard" className="mb-8 flex items-center gap-2.5">
          <BrandMark className="size-9" />
          <div>
            <div className="font-heading text-lg leading-none">{t("brand")}</div>
            <div className="text-xs tracking-[0.18em] text-muted-foreground uppercase">
              {t("brandEn")}
            </div>
          </div>
        </Link>
        <nav className="flex flex-1 flex-col gap-1">
          {nav.map((item) => {
            const studio =
              pathname === "/dashboard" || pathname.startsWith("/articles");
            const active =
              item.href === "/about" ? pathname === "/about" : studio;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-sidebar-accent",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/80",
                )}
              >
                <Icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="rounded-xl bg-sidebar-accent p-3 text-xs text-muted-foreground">
          <div>{t("signedInAs")}</div>
          <div className="mt-1 truncate text-foreground">{session?.email}</div>
        </div>
      </aside>

      <div className="md:pl-60">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-3 border-b bg-background/80 px-4 backdrop-blur">
          <div className="flex items-center gap-2 md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setOpen((v) => !v)}
              aria-label="menu"
            >
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </Button>
            <Link href="/dashboard" className="flex items-center gap-2">
              <BrandMark className="size-7" />
              <span className="font-heading">{t("brand")}</span>
            </Link>
          </div>
          <p className="hidden text-sm text-muted-foreground md:block">
            {t("tagline")}
          </p>
          <div className="flex items-center gap-1">
            <LocaleToggle />
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={signOut}>
              <LogOut className="size-4" />
              <span className="hidden sm:inline">{t("logout")}</span>
            </Button>
          </div>
        </header>
        {open && (
          <div className="border-b bg-sidebar p-3 md:hidden">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm"
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            ))}
          </div>
        )}
        <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">
          {children}
        </main>
      </div>
    </div>
  );
}
