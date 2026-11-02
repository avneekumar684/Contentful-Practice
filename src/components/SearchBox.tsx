"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { SearchResult } from "@/lib/types";

// Global search box (lives in the header on every page).
// Typing -> debounced call to /api/search -> dropdown. Enter -> full results page.
export default function SearchBox() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  const trimmed = query.trim();
  const active = trimmed.length >= 2;

  useEffect(() => {
    if (!active) return;
    const controller = new AbortController();
    // Wait 300 ms after the last key press so we don't call the API on every letter.
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}`, { signal: controller.signal });
        const data = await res.json();
        setResults(data.results);
        setDone(true);
      } catch {
        // request was cancelled by a newer keystroke: ignore
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [trimmed, active]);

  // Close the dropdown when clicking outside of it.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (box.current && !box.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!active) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(trimmed)}`);
  }

  return (
    <div className="search" ref={box}>
      <form role="search" onSubmit={submit}>
        <input
          className="search__input"
          type="search"
          placeholder="Search articles..."
          aria-label="Search the site"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
        />
      </form>

      {open && active && (
        <div className="search__panel" aria-live="polite">
          {loading && <p className="search__status">Searching...</p>}
          {!loading && done && results.length === 0 && (
            <p className="search__status">No results for &quot;{trimmed}&quot;.</p>
          )}
          <ul>
            {results.slice(0, 5).map((r) => (
              <li key={r.id}>
                <a href={r.url} onClick={() => setOpen(false)}>
                  <span className="search__title">{r.title}</span>
                  <span className="search__type">{r.type}</span>
                </a>
              </li>
            ))}
          </ul>
          {results.length > 0 && (
            <a className="search__all" href={`/search?q=${encodeURIComponent(trimmed)}`}>
              See all results
            </a>
          )}
        </div>
      )}
    </div>
  );
}
