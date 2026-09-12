"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export function MobileNav() {
  const { t } = useI18n();
  return (
    <nav className="mobile-nav mx-auto flex max-w-6xl gap-6 px-6 py-2 text-sm max-[700px]:gap-5 max-[700px]:px-4 md:hidden">
      <Link href="/dashboard">{t("dashboard")}</Link>
      <Link href="/dashboard#gallery">{t("articles")}</Link>
      <Link href="/about">{t("about")}</Link>
    </nav>
  );
}
