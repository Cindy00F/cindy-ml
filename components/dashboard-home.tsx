"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArticleSummary } from "@/components/article-summary";
import { ArticleThumb } from "@/components/article-thumb";
import { DeskDoodle } from "@/components/desk-doodle";
import { EssayScale } from "@/components/essay-scale";
import { track } from "@/lib/analytics";
import { articles, categories, type Category } from "@/lib/articles";
import { useI18n } from "@/lib/i18n";

const SHORT: Record<string, { zh: string; en: string }> = {
  "train-test-validation": { zh: "小猫小狗", en: "Cats & dogs" },
  "neural-networks": { zh: "神经网络", en: "Networks" },
  "equality-of-odds": { zh: "几率均等", en: "Odds" },
  "logistic-regression": { zh: "逻辑回归", en: "Logistic" },
  "linear-regression": { zh: "线性回归", en: "Linear" },
  "reinforcement-learning": { zh: "强化学习", en: "RL" },
  "roc-auc": { zh: "ROC", en: "ROC" },
  "cross-validation": { zh: "交叉验证", en: "CV" },
  "precision-recall": { zh: "精确 / 召回", en: "P / R" },
  "random-forest": { zh: "随机森林", en: "Forest" },
  "decision-tree": { zh: "决策树", en: "Trees" },
  "bias-variance": { zh: "偏差 · 方差", en: "Bias" },
  "double-descent": { zh: "双重下降", en: "Descent" },
  "double-descent-2": { zh: "插值点", en: "Interpolate" },
};

export function DashboardHome({
  q,
  cat,
}: {
  q: string;
  cat: Category | "all";
}) {
  const { locale, t } = useI18n();
  const [query, setQuery] = useState(q);
  const [activeId, setActiveId] = useState(articles[0]?.slug ?? null);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return articles.filter((a) => {
      if (cat !== "all" && a.category !== cat) return false;
      if (!needle) return true;
      const short = SHORT[a.slug];
      const topic = categories.find((c) => c.id === a.category)?.label;
      const hay = [
        a.slug,
        a.title.zh,
        a.title.en,
        a.summary.zh,
        a.summary.en,
        short?.zh,
        short?.en,
        topic?.zh,
        topic?.en,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(needle);
    });
  }, [cat, query]);

  const ticks = useMemo(
    () =>
      filtered.map((article) => ({
        id: article.slug,
        en: SHORT[article.slug]?.en ?? article.title.en,
        zh: SHORT[article.slug]?.zh ?? article.title.zh,
      })),
    [filtered],
  );

  useEffect(() => {
    const needle = query.trim();
    if (!needle) return;
    const timer = window.setTimeout(() => {
      track({ name: "search", q: needle });
    }, 600);
    return () => window.clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (!filtered.some((article) => article.slug === activeId)) {
      setActiveId(filtered[0]?.slug ?? null);
    }
  }, [filtered, activeId]);

  useEffect(() => {
    const nodes = filtered
      .map((article) => document.getElementById(`card-${article.slug}`))
      .filter((node): node is HTMLElement => Boolean(node));
    if (!nodes.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        const id = visible?.target.id.replace(/^card-/, "");
        if (id) setActiveId(id);
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0.15, 0.4, 0.7] },
    );
    for (const node of nodes) io.observe(node);
    return () => io.disconnect();
  }, [filtered]);

  const jump = (id: string) => {
    const node = document.getElementById(`card-${id}`);
    if (!node) return;
    setActiveId(id);
    node.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="relative min-[701px]:pr-[9.25rem]">
      <section className="grid items-center gap-10 py-10 md:grid-cols-[1.2fr_0.8fr]">
        <div>
          <h1 className="font-heading text-4xl leading-tight sm:text-5xl">{t("welcomeBack")}</h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground">{t("dashboardLead")}</p>
        </div>
        <DeskDoodle className="mx-auto max-w-xs text-foreground" />
      </section>

      <section id="gallery" className="scroll-mt-8">
        <div className="flex flex-wrap items-end justify-between gap-4 border-y py-6">
          <h2 className="font-heading text-3xl">{t("articles")}</h2>
          <form
            role="search"
            onSubmit={(event) => event.preventDefault()}
          >
            <input
              name="q"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("search")}
              autoComplete="off"
              className="h-9 w-48 border-b border-foreground/30 bg-transparent text-sm outline-none max-[700px]:w-full max-[700px]:max-w-[11rem]"
            />
          </form>
        </div>
        {query.trim() ? (
          <p className="pt-4 text-xs text-muted-foreground">
            {filtered.length} / {articles.length}
          </p>
        ) : null}
        <div className="flex flex-wrap gap-5 py-6 text-xs tracking-wide">
          {categories.map((c) => {
            const href =
              c.id === "all"
                ? query.trim()
                  ? `/dashboard?q=${encodeURIComponent(query.trim())}`
                  : "/dashboard"
                : `/dashboard?cat=${c.id}${query.trim() ? `&q=${encodeURIComponent(query.trim())}` : ""}`;
            return (
              <Link
                key={c.id}
                href={href}
                className={cat === c.id ? "text-foreground" : "text-muted-foreground hover:text-foreground"}
              >
                {c.label[locale]}
              </Link>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <p className="py-20 text-sm text-muted-foreground">{t("emptySearch")}</p>
        ) : (
          <div>
            {filtered.map((article, i) => {
              const href = `/articles/${article.slug}`;
              const playable = article.slug === "train-test-validation";
              return (
                <div
                  id={`card-${article.slug}`}
                  key={article.slug}
                  className={`grid items-center gap-8 border-t py-12 md:grid-cols-2 ${
                    i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
                  }`}
                >
                  <Link href={href}>
                    <p className="text-xs text-muted-foreground">
                      {categories.find((c) => c.id === article.category)?.label[locale]}
                      {" · "}
                      {article.minutes} {t("minutes")}
                    </p>
                    <h3 className="font-heading mt-2 text-3xl max-[700px]:text-2xl max-[700px]:leading-tight">
                      {article.title[locale]}
                    </h3>
                    <ArticleSummary
                      text={article.summary[locale]}
                      className="mt-4 text-sm leading-7 text-muted-foreground"
                    />
                    <span className="mt-6 inline-block text-sm underline underline-offset-4">{t("diveIn")}</span>
                  </Link>
                  {playable ? (
                    <ArticleThumb
                      slug={article.slug}
                      playable
                      href={href}
                      className="h-auto w-full cursor-pointer border border-foreground/15"
                    />
                  ) : (
                    <Link href={href}>
                      <ArticleThumb
                        slug={article.slug}
                        className="h-auto w-full border border-foreground/15"
                      />
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {filtered.length > 0 ? (
        <section className="mt-10 grid grid-cols-3 gap-2 border-t pt-10 sm:grid-cols-4 md:grid-cols-7">
          {filtered.map((article) => (
            <Link key={article.slug} href={`/articles/${article.slug}`} title={article.title[locale]}>
              <ArticleThumb slug={article.slug} className="h-auto w-full border border-foreground/10" />
            </Link>
          ))}
        </section>
      ) : null}

      <EssayScale
        ticks={ticks}
        activeId={activeId}
        onSelect={jump}
        className="!fixed top-12 bottom-0 bg-gradient-to-l from-background from-70% to-transparent"
      />
    </div>
  );
}
