import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CfImage from "@/components/CfImage";
import RichText from "@/components/RichText";
import { formatDate } from "@/components/ArticleCard";
import { getArticle } from "@/lib/contentful";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const article = await getArticle((await params).slug);
  return { title: article?.title, description: article?.summary };
}

// Detail page. /articles/<slug> looks the article up by its slug field.
export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const article = await getArticle((await params).slug);
  if (!article) notFound();

  return (
    <article className="container article">
      <Link href="/articles" className="back">
        ← All articles
      </Link>
      {article.category && <span className="badge">{article.category.fields.name}</span>}
      <h1>{article.title}</h1>
      <p className="article__meta">{formatDate(article.publishedDate)}</p>
      <CfImage asset={article.coverImage} className="article__cover" sizes="(max-width: 900px) 100vw, 800px" priority />
      <RichText document={article.body} />
    </article>
  );
}
