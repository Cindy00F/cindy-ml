"use client";

import Link from "next/link";
import { LocaleToggle } from "@/components/locale-toggle";
import { LogoutButton } from "@/components/logout-button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useI18n } from "@/lib/i18n";
import type { ThemeName } from "@/lib/messages";
import { IS_STATIC } from "@/lib/site";

export function SiteHeader({
  theme,
  email,
}: {
  theme: ThemeName;
  email?: string;
}) {
  const { t } = useI18n();
  return (
    <header className="sticky top-0 z-[200] w-full border-b border-foreground/10 bg-background/90 pointer-events-auto backdrop-blur-md">
      <div className="mx-auto flex h-12 w-full max-w-[100rem] items-center justify-between gap-4 px-4 max-[700px]:gap-2 max-[700px]:px-3 sm:px-6">
        <Link
          href={email ? "/dashboard" : "/login"}
          className="font-heading shrink-0 text-xl leading-none"
        >
          {t("brand")}
        </Link>
        {email ? (
          <nav className="site-nav hidden items-center gap-7 text-sm md:flex">
            <Link href="/dashboard" className="hover:opacity-60">
              {t("dashboard")}
            </Link>
            <Link href="/dashboard#gallery" className="hover:opacity-60">
              {t("articles")}
            </Link>
            <Link href="/about" className="hover:opacity-60">
              {t("about")}
            </Link>
          </nav>
        ) : (
          <span className="hidden text-sm text-muted-foreground md:block">{t("brandEn")}</span>
        )}
        <div className="flex items-center gap-0.5">
          <LocaleToggle />
          <ThemeToggle theme={theme} />
          {email && !IS_STATIC ? <LogoutButton label={t("logout")} /> : null}
        </div>
      </div>
    </header>
  );
}
