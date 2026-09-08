import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ArticlePlayground } from "@/components/playgrounds";
import { PetClassifier } from "@/components/pet-classifier";
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
  const isSplit = article.slug === "train-test-validation";

  return (
    <article className={isSplit ? "mx-auto max-w-6xl" : "mx-auto max-w-2xl"}>
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        {t.back}
      </Link>

      <p className="mt-8 text-xs tracking-wide text-muted-foreground">
        {article.category}
        {" · "}
        {t.readingTime} {article.minutes} {t.minutes}
      </p>
      <h1 className="font-heading mt-3 text-4xl leading-tight sm:text-5xl">
        {article.title[locale]}
      </h1>
      <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">
        {article.summary[locale]}
      </p>

      {isSplit ? (
        <nav className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
          {article.sections.map((section) =>
            section.id ? (
              <a key={section.id} href={`#${section.id}`} className="hover:text-foreground">
                {section.heading[locale]}
              </a>
            ) : null,
          )}
        </nav>
      ) : null}

      {isSplit ? (
        <div className="mt-10 grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
          <div className="article-prose">
            {article.sections.map((section) => (
              <section key={section.heading.en} id={section.id} className="scroll-mt-8">
                <h2>{section.heading[locale]}</h2>
                {section.body[locale].split("\n").map((para) => (
                  <p key={para.slice(0, 40)} className="leading-8">
                    {para}
                  </p>
                ))}
              </section>
            ))}
          </div>
          <div className="lg:sticky lg:top-8">
            <PetClassifier />
            <p className="mt-3 text-xs text-muted-foreground">
              {locale === "zh"
                ? "猫狗数据与三种切分改编自 MLU-Explain（CC BY-SA 4.0）。"
                : "Pet data and the three-way split adapted from MLU-Explain (CC BY-SA 4.0)."}
            </p>
          </div>
        </div>
      ) : (
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
      )}

      <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t pt-6">
        <MarkReadButton slug={article.slug} markLabel={t.markDone} doneLabel={t.marked} />
        <p className="text-xs text-muted-foreground">
          {t.sourceNote}{" "}
          <a
            className="underline underline-offset-4"
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
