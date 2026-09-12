import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ArticlePlayground } from "@/components/playgrounds";
import { OriginalEssay } from "@/components/original-essay";
import { ArticleSummary } from "@/components/article-summary";
import { MarkReadButton } from "@/components/mark-read-button";
import { getArticle, neighbors, articles } from "@/lib/articles";
import { originalEssayFolder } from "@/lib/original-essays";
import { messages } from "@/lib/messages";
import { getLocale, getTheme } from "@/lib/session";

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getLocale();
  const theme = await getTheme();
  const t = messages[locale];
  const article = getArticle(slug);
  if (!article) notFound();

  const { prev, next } = neighbors(article.slug);

  const folder = originalEssayFolder(article.slug);
  if (folder) {
    return <OriginalEssay folder={folder} locale={locale} theme={theme} />;
  }

  return (
    <article className="mlu-essay mx-auto max-w-2xl">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        {t.back}
      </Link>

      <h1 className="font-heading mt-10 text-4xl leading-tight sm:text-5xl">
        {article.title[locale]}
      </h1>
      <ArticleSummary
        text={article.summary[locale]}
        className="mt-5 text-base leading-8 text-muted-foreground"
      />

      <div className="article-prose mt-8">
        {article.sections.map((section, i) => (
          <section key={section.heading.en} id={section.id} className="scroll-mt-8">
            <h2>{section.heading[locale]}</h2>
            {section.body[locale].split("\n").map((para) => (
              <p key={para.slice(0, 40)} className="leading-8">
                {para}
              </p>
            ))}
            {section.formula ? <pre className="formula">{section.formula}</pre> : null}
            {section.playground || (section.playground === undefined && i === 1) ? (
              <ArticlePlayground slug={article.slug} />
            ) : null}
          </section>
        ))}
      </div>

      <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t pt-6">
        <MarkReadButton slug={article.slug} markLabel={t.markDone} doneLabel={t.marked} />
        <p className="text-xs text-muted-foreground">{t.credit}</p>
      </div>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {prev ? (
          <Link href={`/articles/${prev.slug}`} className="border border-foreground/15 p-4 hover:bg-muted/40">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <ArrowLeft className="size-3" />
              {t.prev}
            </div>
            <div className="font-heading mt-1">{prev.title[locale]}</div>
          </Link>
        ) : (
          <div />
        )}
        {next ? (
          <Link
            href={`/articles/${next.slug}`}
            className="border border-foreground/15 p-4 text-right hover:bg-muted/40"
          >
            <div className="flex items-center justify-end gap-1 text-xs text-muted-foreground">
              {t.next}
              <ArrowRight className="size-3" />
            </div>
            <div className="font-heading mt-1">{next.title[locale]}</div>
          </Link>
        ) : null}
      </div>
    </article>
  );
}
