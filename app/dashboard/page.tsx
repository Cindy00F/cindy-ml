"use client";

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import { AppShell } from "@/components/app-shell";
import { ArticleThumb } from "@/components/article-thumb";
import { AuthGuard } from "@/components/auth-guard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { articles, categories, type Category } from "@/lib/articles";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";
import { emptyProgress, loadProgress, markOpened, subscribeProgress } from "@/lib/progress";

export default function DashboardPage() {
  return (
    <AuthGuard>
      <AppShell>
        <DashboardInner />
      </AppShell>
    </AuthGuard>
  );
}

function DashboardInner() {
  const { t, locale } = useI18n();
  const { session } = useAuth();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<Category | "all">("all");
  const progress = useSyncExternalStore(
    subscribeProgress,
    loadProgress,
    emptyProgress,
  );

  const started = Object.keys(progress).length;
  const completed = Object.values(progress).filter((p) => p.completed).length;
  const minutes = articles.reduce((s, a) => s + a.minutes, 0);
  const lastSlug = Object.entries(progress).sort(
    (a, b) => b[1].openedAt - a[1].openedAt,
  )[0]?.[0];
  const last = articles.find((a) => a.slug === lastSlug);

  const filtered = useMemo(() => {
    return articles.filter((a) => {
      if (cat !== "all" && a.category !== cat) return false;
      if (!q.trim()) return true;
      const hay = `${a.title.zh} ${a.title.en} ${a.summary.zh} ${a.summary.en}`.toLowerCase();
      return hay.includes(q.trim().toLowerCase());
    });
  }, [q, cat]);

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-muted-foreground">
          {t("welcomeBack")}
          {session?.name ? ` · ${session.name}` : ""}
        </p>
        <h1 className="font-heading mt-1 text-3xl sm:text-4xl">{t("dashboard")}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          {t("dashboardLead")}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label={t("articlesCount")} value={String(articles.length)} />
        <Kpi label={t("started")} value={String(started)} />
        <Kpi label={t("completed")} value={String(completed)} />
        <Kpi label={t("minutes")} value={String(minutes)} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">{t("lastVisited")}</CardTitle>
          <CardDescription>
            {last ? last.title[locale] : t("noneYet")}
          </CardDescription>
        </CardHeader>
        {last ? (
          <CardContent>
            <Link
              href={`/articles/${last.slug}`}
              onClick={() => markOpened(last.slug)}
              className="inline-flex h-8 items-center rounded-lg bg-primary px-3 text-sm text-primary-foreground hover:bg-primary/80"
            >
              {t("continueReading")}
            </Link>
          </CardContent>
        ) : null}
      </Card>

      <div id="articles" className="space-y-4 scroll-mt-20">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-heading text-2xl">{t("articles")}</h2>
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={t("search")}
            className="h-9 sm:max-w-xs"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <Button
              key={c.id}
              size="sm"
              variant={cat === c.id ? "default" : "outline"}
              onClick={() => setCat(c.id)}
            >
              {c.label[locale]}
            </Button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">
            {t("emptySearch")}
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((article) => {
              const st = progress[article.slug];
              return (
                <Link
                  key={article.slug}
                  href={`/articles/${article.slug}`}
                  onClick={() => markOpened(article.slug)}
                  className="group overflow-hidden rounded-2xl border bg-card ring-1 ring-foreground/10 transition hover:-translate-y-0.5 hover:shadow-md"
                >
                  <ArticleThumb slug={article.slug} className="h-36 w-full" />
                  <div className="space-y-2 p-4">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {categories.find((c) => c.id === article.category)?.label[locale]}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {article.minutes} {t("minutes")}
                      </span>
                      {st?.completed ? (
                        <Badge>{t("marked")}</Badge>
                      ) : st ? (
                        <Badge variant="outline">{t("started")}</Badge>
                      ) : null}
                    </div>
                    <h3 className="font-heading text-xl leading-snug group-hover:text-primary">
                      {article.title[locale]}
                    </h3>
                    <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
                      {article.summary[locale]}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border bg-card p-4 ring-1 ring-foreground/10">
      <div className="text-xs tracking-wide text-muted-foreground uppercase">
        {label}
      </div>
      <div className="font-heading mt-1 text-3xl">{value}</div>
    </div>
  );
}
