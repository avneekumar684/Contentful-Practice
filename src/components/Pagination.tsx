import Link from "next/link";

// Previous / Next links that keep the other filters in the URL.
export default function Pagination({
  basePath,
  page,
  pageCount,
  params,
}: {
  basePath: string;
  page: number;
  pageCount: number;
  params: Record<string, string | undefined>;
}) {
  if (pageCount <= 1) return null;

  const hrefFor = (target: number) => {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(params)) if (value) query.set(key, value);
    if (target > 1) query.set("page", String(target));
    const text = query.toString();
    return text ? `${basePath}?${text}` : basePath;
  };

  return (
    <nav className="pagination" aria-label="Pages">
      {page > 1 ? <Link href={hrefFor(page - 1)}>← Previous</Link> : <span />}
      <span>
        Page {page} of {pageCount}
      </span>
      {page < pageCount ? <Link href={hrefFor(page + 1)}>Next →</Link> : <span />}
    </nav>
  );
}
