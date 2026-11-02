import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container empty">
      <h1>Page not found</h1>
      <p>That page doesn&apos;t exist, or it isn&apos;t published in Contentful yet.</p>
      <Link href="/" className="button">
        Go home
      </Link>
    </div>
  );
}
