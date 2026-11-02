import type { Metadata } from "next";
import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { searchContent } from "@/lib/contentful";

export const metadata: Metadata = { title: "Search" };

// Full results page: /search?q=word. Products (GraphQL) and articles/pages (REST) in one list.
export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const q = ((await searchParams).q ?? "").trim();
  const results = q.length >= 2 ? await searchContent(q) : [];

  return (
    <div className="container section">
      <h1>Search</h1>
      <form action="/search" className="search-page__form" role="search">
        <input type="search" name="q" defaultValue={q} placeholder="Search products and articles..." aria-label="Search" />
        <button className="button" type="submit">
          Search
        </button>
      </form>

      {q.length >= 2 && (
        <p className="section__intro">
          {results.length} result{results.length === 1 ? "" : "s"} for &quot;{q}&quot;
        </p>
      )}
      {q.length > 0 && q.length < 2 && <p className="section__intro">Type at least 2 characters.</p>}

      <ul className="results">
        {results.map((r) => (
          <li key={`${r.type}-${r.id}`}>
            <Link href={r.url} className="results__link">
              {r.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img className="results__thumb" src={`${r.imageUrl}?w=120&h=120&fit=fill&fm=webp`} alt="" />
              )}
              <span className="results__text">
                <strong>{r.title}</strong>
                {r.summary && <span className="results__summary">{r.summary}</span>}
              </span>
              <span className="badge">{r.price !== undefined ? formatPrice(r.price) : r.type}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
