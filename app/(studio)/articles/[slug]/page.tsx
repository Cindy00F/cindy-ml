import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NativeEssay } from "@/components/native-essay";
import { OriginalEssay } from "@/components/original-essay";
import { getArticle, articles } from "@/lib/articles";
import { articleThumbnails } from "@/lib/article-thumbnails";
import { originalEssayFolder } from "@/lib/original-essays";
import { getLocale, getTheme } from "@/lib/session";

const SITE_ORIGIN = "https://cindy00f.github.io";
const BASE_PATH = "/cindy-ml";

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};

  const title = article.title.zh;
  const description = article.summary.zh.split("\n")[0];
  const thumbnail = articleThumbnails[slug];
  const image = thumbnail ? `${SITE_ORIGIN}${BASE_PATH}${thumbnail}` : undefined;

  return {
    title,
    description,
    alternates: {
      canonical: `${SITE_ORIGIN}${BASE_PATH}/articles/${encodeURIComponent(slug)}/`,
    },
    openGraph: {
      type: "article",
      title,
      description,
      url: `${SITE_ORIGIN}${BASE_PATH}/articles/${encodeURIComponent(slug)}/`,
      ...(image ? { images: [{ url: image, alt: title }] } : {}),
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      ...(image ? { images: [image] } : {}),
    },
  };
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
