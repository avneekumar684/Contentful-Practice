import type { Metadata } from "next";
import Link from "next/link";
import ArticleCard from "@/components/ArticleCard";
import EmptyState from "@/components/EmptyState";
import { getArticles, getCategories } from "@/lib/contentful";

export const metadata: Metadata = { title: "Articles", description: "All articles" };

// Listing page. The category filter is just a query string: /articles?category=basics
export default async function ArticlesPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const [articles, categories] = await Promise.all([
    getArticles({ categorySlug: category }),
    getCategories(),
  ]);

  return (
    <div className="container section">
      <h1>Articles</h1>

      <nav className="chips" aria-label="Filter by category">
        <Link href="/articles" className={`chip ${!category ? "is-active" : ""}`}>
          All
        </Link>
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/articles?category=${c.slug}`}
            className={`chip ${category === c.slug ? "is-active" : ""}`}
          >
            {c.name}
          </Link>
        ))}
      </nav>

      {articles.length === 0 ? (
        <EmptyState message="No articles in this category yet." />
      ) : (
        <div className="grid grid--3">
          {articles.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      )}
    </div>
  );
}
