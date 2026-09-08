import Link from "next/link";
import { ArticleThumb } from "@/components/article-thumb";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { articles, categories, type Category } from "@/lib/articles";
import { messages } from "@/lib/messages";
import { getLocale } from "@/lib/session";
import { cn } from "@/lib/utils";

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
    <div className="space-y-8">
      <div>
        <p className="text-sm text-muted-foreground">{t.welcomeBack}</p>
        <h1 className="font-heading mt-1 text-3xl sm:text-4xl">{t.dashboard}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          {t.dashboardLead}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Kpi label={t.articlesCount} value={String(articles.length)} />
        <Kpi label={t.models} value="5" />
        <Kpi label={t.evaluation} value="4" />
        <Kpi label={t.minutes} value={String(articles.reduce((s, a) => s + a.minutes, 0))} />
      </div>

      <div id="articles" className="space-y-4 scroll-mt-20">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-heading text-2xl">{t.articles}</h2>
          <form className="sm:max-w-xs">
            {cat !== "all" ? <input type="hidden" name="cat" value={cat} /> : null}
            <Input
              name="q"
              defaultValue={q}
              placeholder={t.search}
              className="h-9"
            />
          </form>
        </div>
        <div className="flex flex-wrap gap-2">
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
                className={cn(
                  buttonVariants({
                    size: "sm",
                    variant: cat === c.id ? "default" : "outline",
                  }),
                )}
              >
                {c.label[locale]}
              </Link>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <p className="py-16 text-center text-sm text-muted-foreground">
            {t.emptySearch}
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((article) => (
              <Link
                key={article.slug}
                href={`/articles/${article.slug}`}
                className="group overflow-hidden rounded-2xl border bg-card ring-1 ring-foreground/10 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <ArticleThumb slug={article.slug} className="h-36 w-full" />
                <div className="space-y-2 p-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {categories.find((c) => c.id === article.category)?.label[locale]}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {article.minutes} {t.minutes}
                    </span>
                  </div>
                  <h3 className="font-heading text-xl leading-snug group-hover:text-primary">
                    {article.title[locale]}
                  </h3>
                  <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
                    {article.summary[locale]}
                  </p>
                </div>
              </Link>
            ))}
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
