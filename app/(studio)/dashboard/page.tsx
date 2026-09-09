import Link from "next/link";
import { ArticleThumb } from "@/components/article-thumb";
import { DeskDoodle } from "@/components/desk-doodle";
import { articles, categories, type Category } from "@/lib/articles";
import { messages } from "@/lib/messages";
import { getLocale } from "@/lib/session";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; cat?: string }>;
}) {
  const locale = await getLocale();
  const t = messages[locale];
  const params = await searchParams;
  const q = (params.q ?? "").trim();
  const cat = (params.cat ?? "all") as Category | "all";

  const filtered = articles.filter((a) => {
    if (cat !== "all" && a.category !== cat) return false;
    if (!q) return true;
    const hay = `${a.title.zh} ${a.title.en} ${a.summary.zh} ${a.summary.en}`.toLowerCase();
    return hay.includes(q.toLowerCase());
  });

  return (
    <div>
      <section className="grid items-center gap-10 py-10 md:grid-cols-[1.2fr_0.8fr]">
        <div>
          <h1 className="font-heading text-4xl leading-tight sm:text-5xl">
            {t.welcomeBack}
          </h1>
          <p className="mt-5 max-w-xl text-sm leading-7 text-muted-foreground">
            {t.dashboardLead}
          </p>
        </div>
        <DeskDoodle className="mx-auto max-w-xs text-foreground" />
      </section>

      <section id="gallery" className="scroll-mt-8">
        <div className="flex flex-wrap items-end justify-between gap-4 border-y py-6">
          <h2 className="font-heading text-3xl">{t.articles}</h2>
          <form>
            {cat !== "all" ? <input type="hidden" name="cat" value={cat} /> : null}
            <input
              name="q"
              defaultValue={q}
              placeholder={t.search}
              className="h-9 w-48 border-b border-foreground/30 bg-transparent text-sm outline-none max-[700px]:w-full max-[700px]:max-w-[11rem]"
            />
          </form>
        </div>
        <div className="flex flex-wrap gap-5 py-6 text-xs tracking-wide">
          {categories.map((c) => {
            const href =
              c.id === "all"
                ? q
                  ? `/dashboard?q=${encodeURIComponent(q)}`
                  : "/dashboard"
                : `/dashboard?cat=${c.id}${q ? `&q=${encodeURIComponent(q)}` : ""}`;
            return (
              <Link
                key={c.id}
                href={href}
                className={
                  cat === c.id ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                }
              >
                {c.label[locale]}
              </Link>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <p className="py-20 text-sm text-muted-foreground">{t.emptySearch}</p>
        ) : (
          <div>
            {filtered.map((article, i) => {
              const href = `/articles/${article.slug}`;
              const playable = article.slug === "train-test-validation";
              return (
                <div
                  key={article.slug}
                  className={`grid items-center gap-8 border-t py-12 md:grid-cols-2 ${
                    i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
                  }`}
                >
                  <Link href={href}>
                    <p className="text-xs text-muted-foreground">
                      {categories.find((c) => c.id === article.category)?.label[locale]}
                      {" · "}
                      {article.minutes} {t.minutes}
                    </p>
                    <h3 className="font-heading mt-2 text-3xl max-[700px]:text-2xl max-[700px]:leading-tight">
                      {article.title[locale]}
                    </h3>
                    <p className="mt-4 text-sm leading-7 text-muted-foreground">
                      {article.summary[locale]}
                    </p>
                    <span className="mt-6 inline-block text-sm underline underline-offset-4">
                      {t.diveIn}
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

      <section className="mt-10 grid grid-cols-3 gap-2 border-t pt-10 sm:grid-cols-4 md:grid-cols-7">
        {articles.map((article) => (
          <Link key={article.slug} href={`/articles/${article.slug}`} title={article.title[locale]}>
            <ArticleThumb slug={article.slug} className="h-auto w-full border border-foreground/10" />
          </Link>
        ))}
      </section>
    </div>
  );
}
