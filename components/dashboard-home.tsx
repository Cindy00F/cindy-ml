"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowDown, ArrowRight, Search, X } from "lucide-react";
import { ArticleSummary } from "@/components/article-summary";
import { ArticleThumb } from "@/components/article-thumb";
import { DeskDoodle } from "@/components/desk-doodle";
import { EssayScale } from "@/components/essay-scale";
import { track } from "@/lib/analytics";
import { articles, categories } from "@/lib/articles";
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
  "rfm-pharmacy": { zh: "药店 RFM", en: "RFM" },
  "kmeans-territory": { zh: "代表辖区", en: "Territory" },
};

const PINNED_ARTICLE_SLUG = "train-test-validation";

export function DashboardHome() {
  const { locale, t } = useI18n();
  const params = useSearchParams();
  const cat = categories.find((category) => category.id === params.get("cat"))?.id ?? "all";
  const [query, setQuery] = useState(() => (params.get("q") ?? "").trim());
  const [activeIdState, setActiveId] = useState(PINNED_ARTICLE_SLUG);

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return articles
      .filter((a) => {
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
      })
      .sort((a, b) => {
        if (a.slug === PINNED_ARTICLE_SLUG) return -1;
        if (b.slug === PINNED_ARTICLE_SLUG) return 1;
        return 0;
      });
  }, [cat, query]);
  const activeId = filtered.some((article) => article.slug === activeIdState)
    ? activeIdState
    : (filtered[0]?.slug ?? null);

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
    const timer = window.setTimeout(() => {
      const nextParams = new URLSearchParams(window.location.search);
      if (cat === "all") nextParams.delete("cat");
      else nextParams.set("cat", cat);
      if (query.trim()) nextParams.set("q", query.trim());
      else nextParams.delete("q");

      const search = nextParams.toString();
      const nextUrl = `${window.location.pathname}${search ? `?${search}` : ""}${window.location.hash}`;
      if (`${window.location.pathname}${window.location.search}${window.location.hash}` !== nextUrl) {
        window.history.replaceState(null, "", nextUrl);
      }
    }, 250);
    return () => window.clearTimeout(timer);
  }, [cat, query]);

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
    node.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
      block: "center",
    });
  };

  return (
    <div className="relative min-[701px]:pr-[9.25rem]">
      <section className="grid items-center gap-8 border-b border-foreground/10 py-12 sm:py-16 md:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground">
            {locale === "zh" ? "CINDY · 机器学习手记" : "CINDY · NOTES ON MACHINE LEARNING"}
          </p>
          <h1 className="font-heading max-w-2xl text-pretty text-4xl leading-[1.12] sm:text-6xl">
            {t("welcomeBack")}
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            {t("dashboardLead")}
          </p>
          <Link
            href="#gallery"
            className="mt-7 inline-flex min-h-11 items-center gap-2 bg-foreground px-5 text-sm font-medium text-background hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
          >
            {locale === "zh" ? "从一篇开始" : "Start with a note"}
            <ArrowDown aria-hidden="true" className="size-4" />
          </Link>
        </div>
        <DeskDoodle className="mx-auto w-full max-w-[17rem] text-foreground/80" />
      </section>

      <section id="gallery" className="scroll-mt-20">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-foreground/10 py-7">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              {locale === "zh" ? "选一个你正好好奇的问题" : "PICK A QUESTION YOU’RE CURIOUS ABOUT"}
            </p>
            <h2 className="font-heading mt-2 text-3xl">{t("articles")}</h2>
          </div>
          <form role="search" onSubmit={(event) => event.preventDefault()} className="relative w-full sm:w-64">
            <label htmlFor="article-search" className="sr-only">
              {t("search")}
            </label>
            <Search aria-hidden="true" className="pointer-events-none absolute left-0 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id="article-search"
              name="q"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("search")}
              autoComplete="off"
              className="h-11 w-full border-b border-foreground/25 bg-transparent pl-7 pr-9 text-sm outline-none placeholder:text-muted-foreground/80 focus-visible:border-foreground focus-visible:ring-2 focus-visible:ring-foreground/20"
            />
            {query ? (
              <button
                type="button"
                aria-label={locale === "zh" ? "清除搜索" : "Clear search"}
                onClick={() => setQuery("")}
                className="absolute right-0 top-1/2 inline-flex size-9 -translate-y-1/2 items-center justify-center text-muted-foreground hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
              >
                <X aria-hidden="true" className="size-4" />
              </button>
            ) : null}
          </form>
        </div>
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 py-5 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
          {categories.map((c) => {
            const href =
              c.id === "all"
                ? query.trim()
                  ? `/dashboard?q=${encodeURIComponent(query.trim())}`
                  : "/dashboard"
                : `/dashboard?cat=${c.id}${query.trim() ? `&q=${encodeURIComponent(query.trim())}` : ""}`;
            const count = c.id === "all"
              ? articles.length
              : articles.filter((article) => article.category === c.id).length;
            const selected = cat === c.id;
            return (
              <Link
                key={c.id}
                href={href}
                aria-current={selected ? "page" : undefined}
                className={`inline-flex min-h-10 shrink-0 items-center gap-2 border px-3.5 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground ${
                  selected
                    ? "border-foreground bg-foreground text-background"
                    : "border-foreground/15 text-muted-foreground hover:border-foreground/45 hover:text-foreground"
                }`}
              >
                {c.label[locale]}
                <span className={selected ? "text-background/70" : "text-muted-foreground/70"}>{count}</span>
              </Link>
            );
          })}
        </div>

        <p aria-live="polite" className="pb-3 text-xs text-muted-foreground">
          {locale === "zh"
            ? `显示 ${filtered.length} / ${articles.length} 篇`
            : `Showing ${filtered.length} of ${articles.length} notes`}
        </p>

        {filtered.length === 0 ? (
          <div className="border-y border-foreground/10 py-16 text-center">
            <p className="text-base">{t("emptySearch")}</p>
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="mt-4 inline-flex min-h-10 items-center gap-2 border-b border-foreground/40 text-sm hover:border-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
              >
                {locale === "zh" ? "清除搜索条件" : "Clear search"}
                <X aria-hidden="true" className="size-3.5" />
              </button>
            ) : null}
          </div>
        ) : (
          <div className="divide-y divide-foreground/10">
            {filtered.map((article, i) => {
              const href = `/articles/${article.slug}`;
              const playable = article.slug === "train-test-validation";
              const isFeatured = i === 0 && cat === "all" && !query.trim();
              return (
                <div
                  id={`card-${article.slug}`}
                  key={article.slug}
                  className={`grid items-center gap-6 py-9 sm:gap-8 sm:py-12 md:grid-cols-2 ${
                    isFeatured ? "my-2 border-l-2 border-foreground/70 bg-muted/45 px-4 sm:px-7" : ""
                  }`}
                >
                  <Link
                    href={href}
                    className="group min-w-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
                  >
                    <p className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      {isFeatured ? (
                        <span className="border border-foreground/20 px-2 py-1 font-medium text-foreground">
                          {locale === "zh" ? "新手推荐" : "A good place to start"}
                        </span>
                      ) : null}
                      <span>{categories.find((c) => c.id === article.category)?.label[locale]}</span>
                      <span aria-hidden="true">·</span>
                      <span>{article.minutes} {t("minutes")}</span>
                    </p>
                    <h3 className="font-heading mt-3 text-pretty text-2xl leading-tight group-hover:underline group-hover:decoration-foreground/35 group-hover:underline-offset-4 sm:text-3xl">
                      {article.title[locale]}
                    </h3>
                    <ArticleSummary
                      text={article.summary[locale]}
                      className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground"
                    />
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium">
                      {t("diveIn")}
                      <ArrowRight aria-hidden="true" className="size-4" />
                    </span>
                  </Link>
                  {playable ? (
                    <ArticleThumb
                      slug={article.slug}
                      playable
                      href={href}
                      className="h-auto w-full cursor-pointer border border-foreground/15"
                    />
                  ) : (
                    <Link
                      href={href}
                      tabIndex={-1}
                      aria-hidden="true"
                      className="focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
                    >
                      <ArticleThumb
                        slug={article.slug}
                        className="h-auto w-full border border-foreground/10"
                      />
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      <EssayScale
        ticks={ticks}
        activeId={activeId}
        onSelect={jump}
        className="!fixed top-12 bottom-0 bg-gradient-to-l from-background from-70% to-transparent"
      />
    </div>
  );
}
