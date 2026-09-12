"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ArticlePlayground } from "@/components/playgrounds";
import { ArticleSummary } from "@/components/article-summary";
import { EssayNeighbors } from "@/components/essay-neighbors";
import { EssayScale } from "@/components/essay-scale";
import { MarkReadButton } from "@/components/mark-read-button";
import { track } from "@/lib/analytics";
import type { Article } from "@/lib/articles";
import { useI18n } from "@/lib/i18n";

export function NativeEssay({ article }: { article: Article }) {
  const { locale, t } = useI18n();
  const ticks = useMemo(
    () =>
      article.sections
        .filter((section) => section.id)
        .map((section) => ({
          id: section.id as string,
          en: section.heading.en,
          zh: section.heading.zh,
        })),
    [article.sections],
  );
  const [activeId, setActiveId] = useState(ticks[0]?.id ?? null);

  useEffect(() => {
    track({ name: "article_open", slug: article.slug });
  }, [article.slug]);

  useEffect(() => {
    const nodes = ticks
      .map((tick) => document.getElementById(tick.id))
      .filter((node): node is HTMLElement => Boolean(node));
    if (!nodes.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        const id = visible?.target.id;
        if (id) setActiveId(id);
      },
      { rootMargin: "-18% 0px -55% 0px", threshold: [0.15, 0.4, 0.7] },
    );
    for (const node of nodes) io.observe(node);
    return () => io.disconnect();
  }, [ticks]);

  const jump = (id: string) => {
    const node = document.getElementById(id);
    if (!node) return;
    setActiveId(id);
    node.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="relative min-[701px]:pr-[9.25rem]">
      <article className="mx-auto max-w-2xl px-4 pb-24 pt-8 sm:px-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          {t("back")}
        </Link>
        <h1 className="font-heading mt-10 text-4xl leading-tight sm:text-5xl">
          {article.title[locale]}
        </h1>
        <ArticleSummary
          text={article.summary[locale]}
          className="mt-5 text-base leading-8 text-muted-foreground"
        />
        <div className="mt-8 space-y-12">
          {article.sections.map((section) => (
            <section key={section.heading.en} id={section.id} className="scroll-mt-16">
              <h2 className="font-heading text-2xl">{section.heading[locale]}</h2>
              {section.body[locale].split("\n").map((para) => (
                <p key={para.slice(0, 48)} className="mt-4 text-[15px] leading-8">
                  {para}
                </p>
              ))}
              {section.formula ? (
                <pre className="mt-4 overflow-x-auto text-sm text-muted-foreground">{section.formula}</pre>
              ) : null}
              {section.playground ? <ArticlePlayground slug={article.slug} /> : null}
            </section>
          ))}
        </div>
        <div className="mt-12 border-t pt-6">
          <MarkReadButton slug={article.slug} markLabel={t("markDone")} doneLabel={t("marked")} />
        </div>
      </article>
      <EssayNeighbors slug={article.slug} />
      <EssayScale
        ticks={ticks}
        activeId={activeId}
        onSelect={jump}
        className="!fixed top-12 bottom-0 bg-gradient-to-l from-background from-70% to-transparent"
      />
    </div>
  );
}
