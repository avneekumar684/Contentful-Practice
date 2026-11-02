import { revalidatePath, revalidateTag } from "next/cache";

// Contentful WEBHOOK target.
// In Contentful: Settings -> Webhooks -> Add webhook
//   URL:     https://<your-site>/api/revalidate
//   Header:  x-webhook-secret = the same value as REVALIDATE_SECRET
//   Trigger: Entry + Asset publish/unpublish
// When someone publishes, Contentful calls this URL and the site refreshes right away
// instead of waiting for the 60 second timer.
export async function POST(request: Request) {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret || request.headers.get("x-webhook-secret") !== secret) {
    return Response.json({ ok: false, error: "Invalid secret" }, { status: 401 });
  }

  revalidateTag("contentful", "max"); // clears the GraphQL results
  revalidatePath("/", "layout"); // clears every page built from REST data
  return Response.json({ ok: true, revalidated: true });
}
