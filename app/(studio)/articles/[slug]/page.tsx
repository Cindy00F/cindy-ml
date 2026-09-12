import { notFound } from "next/navigation";
import { NativeEssay } from "@/components/native-essay";
import { OriginalEssay } from "@/components/original-essay";
import { getArticle, articles } from "@/lib/articles";
import { originalEssayFolder } from "@/lib/original-essays";
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
  const article = getArticle(slug);
  if (!article) notFound();

  const folder = originalEssayFolder(article.slug);
  if (folder) {
    return <OriginalEssay folder={folder} slug={article.slug} locale={locale} theme={theme} />;
  }

  return <NativeEssay article={article} />;
}
