import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ArticleThumb } from "@/components/article-thumb";
import { ArticlePlayground } from "@/components/playgrounds";
import { Badge } from "@/components/ui/badge";
import { MarkReadButton } from "@/components/mark-read-button";
import { getArticle, neighbors } from "@/lib/articles";
import { messages } from "@/lib/messages";
import { getLocale } from "@/lib/session";

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getLocale();
  const t = messages[locale];
  const article = getArticle(slug);
  if (!article) notFound();

  const { prev, next } = neighbors(article.slug);

  return (
    <article className="mx-auto max-w-3xl">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        {t.back}
      </Link>
      <div className="mt-4 overflow-hidden rounded-2xl border ring-1 ring-foreground/10">
        <ArticleThumb slug={article.slug} className="h-48 w-full sm:h-56" />
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{article.category}</Badge>
        <span className="text-xs text-muted-foreground">
          {t.readingTime} {article.minutes} {t.minutes}
        </span>
      </div>
      <h1 className="font-heading mt-3 text-4xl leading-tight">{article.title[locale]}</h1>
      <p className="mt-3 text-base leading-7 text-muted-foreground">
        {article.summary[locale]}
      </p>
      <div className="article-prose mt-8">
        {article.sections.map((section, i) => (
          <section key={section.heading.en}>
            <h2>{section.heading[locale]}</h2>
            {section.body[locale].split("\n").map((para) => (
              <p key={para.slice(0, 24)} className="leading-7">
                {para}
              </p>
            ))}
            {section.formula ? <pre className="formula">{section.formula}</pre> : null}
            {i === 1 ? <ArticlePlayground slug={article.slug} /> : null}
          </section>
        ))}
      </div>
      <div className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t pt-6">
        <MarkReadButton slug={article.slug} markLabel={t.markDone} doneLabel={t.marked} />
        <p className="text-xs text-muted-foreground">
          {t.sourceNote}{" "}
          <a
            className="underline"
            href={`https://mlu-explain.github.io/${article.sourcePath}/`}
            target="_blank"
            rel="noreferrer"
          >
            MLU-Explain
          </a>
        </p>
      </div>
      <div className="mt-8 grid gap-3 sm:grid-cols-2">
        {prev ? (
          <Link
            href={`/articles/${prev.slug}`}
            className="rounded-xl border p-4 hover:bg-muted/50"
          >
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
            className="rounded-xl border p-4 text-right hover:bg-muted/50"
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
