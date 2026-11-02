import Link from "next/link";

// Home / About / Concepts. The last item is the current page and is not a link.
export default function Breadcrumbs({ items }: { items: { title: string; url: string }[] }) {
  if (items.length < 2) return null; // nothing to show on the homepage

  return (
    <nav className="crumbs" aria-label="Breadcrumb">
      <ol className="container">
        {items.map((item, i) => (
          <li key={item.url}>
            {i < items.length - 1 ? <Link href={item.url}>{item.title}</Link> : <span aria-current="page">{item.title}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
