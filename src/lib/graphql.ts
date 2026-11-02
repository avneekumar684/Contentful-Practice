// A tiny helper for Contentful's GraphQL Content API.
//
// REST vs GraphQL, in one sentence each:
//   REST    -> you get the whole entry (every field), good for pages that need everything.
//   GraphQL -> you list the exact fields you want, good for product lists, filters and search.
//
// Same token as the REST API, different URL. This file only runs on the server.

const endpoint = `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}/environments/${
  process.env.CONTENTFUL_ENVIRONMENT || "master"
}`;

export async function graphql<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.CONTENTFUL_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({ query, variables }),
    // Cache for 60 seconds, and tag it so the webhook can clear it the moment someone publishes.
    next: { revalidate: 60, tags: ["contentful"] },
  });

  const json = await response.json();

  // GraphQL answers with HTTP 200 even for mistakes, so we check the `errors` list ourselves.
  if (json.errors?.length) {
    throw new Error(`Contentful GraphQL: ${json.errors.map((e: { message: string }) => e.message).join("; ")}`);
  }
  return json.data as T;
}
