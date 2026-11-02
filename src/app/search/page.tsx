import type { Metadata } from "next";
import Link from "next/link";
import { searchContent } from "@/lib/contentful";

export const metadata: Metadata = { title: "Search" };

// Full results page: /search?q=word. Rendered on the server for every request.
export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const q = ((await searchParams).q ?? "").trim();
  const results = q.length >= 2 ? await searchContent(q) : [];

  return (
    <div className="container section">
      <h1>Search</h1>
      <form action="/search" className="search-page__form" role="search">
        <input type="search" name="q" defaultValue={q} placeholder="Search articles and pages..." aria-label="Search" />
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
          <li key={r.id}>
            <Link href={r.url}>
              <strong>{r.title}</strong>
              <span className="badge">{r.type}</span>
            </Link>
            {r.summary && <p>{r.summary}</p>}
          </li>
        ))}
      </ul>
    </div>
  );
}
