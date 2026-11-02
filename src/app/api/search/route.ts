import { searchContent } from "@/lib/contentful";

// The header search box calls this. Doing the Contentful query here keeps the token on the server.
export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) return Response.json({ results: [] });
  return Response.json({ results: await searchContent(q) });
}
