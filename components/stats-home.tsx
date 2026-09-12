"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { articles } from "@/lib/articles";
import {
  canSyncGithub,
  clearEvents,
  emptyEvents,
  eventsToCsv,
  githubCsvUrl,
  githubFileUrl,
  loadEvents,
  subscribeAnalytics,
  summarize,
  syncEventsToGithub,
} from "@/lib/analytics";
import { useI18n } from "@/lib/i18n";

const LABELS: Record<string, { zh: string; en: string }> = {
  page_view: { zh: "打开页面", en: "Page" },
  article_open: { zh: "打开文章", en: "Opened essay" },
  article_section: { zh: "翻到章节", en: "Section" },
  search: { zh: "搜索", en: "Search" },
  locale: { zh: "切语言", en: "Language" },
  theme: { zh: "切主题", en: "Theme" },
  mark_read: { zh: "标已读", en: "Marked read" },
  essay_next: { zh: "下一篇", en: "Next" },
  essay_prev: { zh: "上一篇", en: "Previous" },
  essay_dwell: { zh: "停留", en: "Dwell" },
};

function titleOf(slug: string | undefined, locale: "zh" | "en") {
  if (!slug) return "—";
  return articles.find((article) => article.slug === slug)?.title[locale] ?? slug;
}

function when(ts: number, locale: "zh" | "en") {
  return new Date(ts).toLocaleString(locale === "zh" ? "zh-CN" : "en");
}

function downloadCsv(events: ReturnType<typeof loadEvents>) {
  const blob = new Blob([eventsToCsv(events)], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "cindy-events.csv";
  link.click();
  URL.revokeObjectURL(url);
}

export function StatsHome() {
  const { locale, t } = useI18n();
  const events = useSyncExternalStore(subscribeAnalytics, loadEvents, emptyEvents);
  const summary = useMemo(() => summarize(events), [events]);
  const recent = [...events].reverse().slice(0, 40);
  const [repoCount, setRepoCount] = useState<number | null>(null);
  const [syncState, setSyncState] = useState<"idle" | "ok" | "err">("idle");
  const canSync = canSyncGithub();

  useEffect(() => {
    let cancelled = false;
    fetch(`${githubCsvUrl()}?t=${Date.now()}`)
      .then((res) => (res.ok ? res.text() : ""))
      .then((text) => {
        if (cancelled || !text) return;
        const rows = text.trim().split(/\r?\n/).length - 1;
        setRepoCount(Math.max(0, rows));
      })
      .catch(() => {
        if (!cancelled) setRepoCount(null);
      });
    return () => {
      cancelled = true;
    };
  }, [syncState]);

  return (
    <div className="py-10">
      <h1 className="font-heading text-4xl leading-tight">{t("statsTitle")}</h1>
      <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground">{t("statsLead")}</p>
      <p className="mt-3 text-sm text-muted-foreground">
        {canSync ? t("statsSynced") : t("statsLocalOnly")}
        {repoCount != null ? ` · ${t("statsRepo")} ${repoCount}` : null}
      </p>
      <div className="mt-5 flex flex-wrap gap-4 text-sm">
        <a href={githubFileUrl()} className="underline underline-offset-4" target="_blank" rel="noreferrer">
          data/events.csv
        </a>
        {events.length > 0 ? (
          <button type="button" className="underline underline-offset-4" onClick={() => downloadCsv(events)}>
            {t("statsDownload")}
          </button>
        ) : null}
        {canSync && events.length > 0 ? (
          <button
            type="button"
            className="underline underline-offset-4"
            onClick={async () => {
              await syncEventsToGithub();
              setSyncState("ok");
            }}
          >
            {t("statsSync")}
          </button>
        ) : null}
      </div>

      {events.length === 0 ? (
        <p className="py-20 text-sm text-muted-foreground">{t("statsEmpty")}</p>
      ) : (
        <>
          <section className="mt-10 grid grid-cols-2 gap-px border bg-border sm:grid-cols-4">
            {[
              [t("statsEvents"), summary.total],
              [t("statsEssays"), summary.essays.length],
              [t("statsSearches"), summary.searches.length],
              [t("statsReads"), summary.reads],
            ].map(([label, value]) => (
              <div key={String(label)} className="bg-background px-4 py-5">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="font-heading mt-2 text-3xl">{value}</p>
              </div>
            ))}
          </section>

          <section className="mt-12">
            <h2 className="font-heading text-2xl">{t("statsEssays")}</h2>
            {summary.essays.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">{t("noneYet")}</p>
            ) : (
              <ol className="mt-4 divide-y border-y">
                {summary.essays.map(([slug, row]) => (
                  <li key={slug} className="flex items-baseline justify-between gap-4 py-3">
                    <Link href={`/articles/${slug}`} className="min-w-0 truncate hover:opacity-60">
                      {titleOf(slug, locale)}
                    </Link>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {row.opens} · {row.dwell}
                      {locale === "zh" ? " 秒" : "s"}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </section>

          {summary.searches.length > 0 ? (
            <section className="mt-12">
              <h2 className="font-heading text-2xl">{t("statsSearches")}</h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">{summary.searches.join(" · ")}</p>
            </section>
          ) : null}

          <section className="mt-12">
            <h2 className="font-heading text-2xl">{t("statsRecent")}</h2>
            <ol className="mt-4 divide-y border-y text-sm">
              {recent.map((event) => (
                <li key={event.id} className="grid gap-1 py-3 sm:grid-cols-[7rem_1fr_auto]">
                  <span className="text-muted-foreground">
                    {LABELS[event.name]?.[locale] ?? event.name}
                  </span>
                  <span className="min-w-0 truncate">
                    {event.slug
                      ? titleOf(event.slug, locale)
                      : event.path || event.q || event.to || event.section || ""}
                    {event.section ? ` · ${event.section}` : ""}
                    {event.seconds != null ? ` · ${event.seconds}${locale === "zh" ? " 秒" : "s"}` : ""}
                  </span>
                  <span className="text-xs text-muted-foreground">{when(event.t, locale)}</span>
                </li>
              ))}
            </ol>
          </section>
        </>
      )}

      {events.length > 0 ? (
        <button
          type="button"
          onClick={() => clearEvents()}
          className="mt-10 text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
        >
          {t("statsClear")}
        </button>
      ) : null}
    </div>
  );
}
