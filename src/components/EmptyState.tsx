// Shown when Contentful has no content yet (e.g. before `npm run seed`).
export default function EmptyState({ message }: { message?: string }) {
  return (
    <div className="container empty">
      <h1>Nothing here yet</h1>
      <p>{message ?? "No content found. Run `npm run model` then `npm run seed`, or add content in Contentful and publish it."}</p>
    </div>
  );
}
