"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { neighbors } from "@/lib/articles";
import { useI18n } from "@/lib/i18n";

export function EssayNeighbors({ slug }: { slug: string }) {
  const { locale, t } = useI18n();
  const { prev, next } = neighbors(slug);
  if (!prev && !next) return null;

  return (
    <nav
      className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-end justify-between gap-3 p-3 min-[701px]:right-[9.25rem] max-[700px]:pb-[max(0.75rem,env(safe-area-inset-bottom))]"
      aria-label={locale === "zh" ? "上下篇" : "Nearby essays"}
    >
      {prev ? (
        <Link
          href={`/articles/${prev.slug}`}
          className="pointer-events-auto max-w-[46%] truncate bg-background/85 px-2.5 py-1.5 text-xs backdrop-blur-sm hover:bg-background"
        >
          <span className="flex items-center gap-1 text-muted-foreground">
            <ArrowLeft className="size-3 shrink-0" />
            {t("prev")}
          </span>
          <span className="mt-0.5 block truncate">{prev.title[locale]}</span>
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link
          href={`/articles/${next.slug}`}
          className="pointer-events-auto max-w-[46%] truncate bg-background/85 px-2.5 py-1.5 text-right text-xs backdrop-blur-sm hover:bg-background"
        >
          <span className="flex items-center justify-end gap-1 text-muted-foreground">
            {t("next")}
            <ArrowRight className="size-3 shrink-0" />
          </span>
          <span className="mt-0.5 block truncate">{next.title[locale]}</span>
        </Link>
      ) : null}
    </nav>
  );
}
