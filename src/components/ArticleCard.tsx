import Link from "next/link";
import CfImage from "./CfImage";
import type { ArticleSummary } from "@/lib/types";

export function formatDate(date?: string) {
  return date
    ? new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
    : "";
}

export default function ArticleCard({ article }: { article: ArticleSummary }) {
  return (
    <article className="card">
      <Link href={`/articles/${article.slug}`} className="card__image">
        <CfImage asset={article.coverImage} sizes="(max-width: 700px) 100vw, 33vw" />
      </Link>
      <div className="card__body">
        {article.categoryName && <span className="badge">{article.categoryName}</span>}
        <h3>
          <Link href={`/articles/${article.slug}`}>{article.title}</Link>
        </h3>
        <p>{article.summary}</p>
        <time>{formatDate(article.publishedDate)}</time>
      </div>
    </article>
  );
}
