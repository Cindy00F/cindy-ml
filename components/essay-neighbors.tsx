"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { track } from "@/lib/analytics";
import { neighbors } from "@/lib/articles";
import { useI18n } from "@/lib/i18n";

export function EssayNeighbors({ slug }: { slug: string }) {
  const { locale, t } = useI18n();
  const { prev, next } = neighbors(slug);
  if (!prev && !next) return null;

  return (
    <nav
      className="pointer-events-none fixed bottom-0 left-0 z-40 flex items-stretch justify-between gap-3 border-t border-foreground/15 bg-[#fcf4e8]/95 px-3 py-2 dark:bg-[#1b1814]/95 min-[701px]:right-[9.25rem] max-[700px]:pb-[max(0.5rem,env(safe-area-inset-bottom))]"
      aria-label={locale === "zh" ? "上下篇" : "Nearby essays"}
    >
      {prev ? (
        <Link
          href={`/articles/${prev.slug}`}
          onClick={() => track({ name: "essay_prev", from: slug, slug: prev.slug })}
          className="pointer-events-auto min-w-0 max-w-[48%] px-1 py-1 text-left text-xs hover:opacity-70"
        >
          <span className="flex items-center gap-1 text-muted-foreground">
            <ArrowLeft className="size-3 shrink-0" />
            {t("prev")}
          </span>
          <span className="mt-0.5 block truncate">{prev.title[locale]}</span>
        </Link>
      ) : (
        <span className="px-1 py-1 text-xs text-muted-foreground/50">{t("prev")}</span>
      )}
      {next ? (
        <Link
          href={`/articles/${next.slug}`}
          onClick={() => track({ name: "essay_next", from: slug, slug: next.slug })}
          className="pointer-events-auto min-w-0 max-w-[48%] px-1 py-1 text-right text-xs hover:opacity-70"
        >
          <span className="flex items-center justify-end gap-1 text-muted-foreground">
            {t("next")}
            <ArrowRight className="size-3 shrink-0" />
          </span>
          <span className="mt-0.5 block truncate">{next.title[locale]}</span>
        </Link>
      ) : (
        <span className="px-1 py-1 text-right text-xs text-muted-foreground/50">{t("next")}</span>
      )}
    </nav>
  );
}
