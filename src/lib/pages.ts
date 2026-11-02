// The page tree.
//
// In Contentful the pages are a flat list. Each page only knows its own slug and its parent.
// Here we load all pages once and work out the full URL of each one by walking up the parents:
//
//   About            (slug: about)                    -> /about
//   |- Concepts      (slug: concepts,  parent: About) -> /about/concepts
//      |- REST vs GraphQL (parent: Concepts)          -> /about/concepts/rest-vs-graphql
//
// So an author only picks a parent in Contentful. Nobody types a URL.
import { cache } from "react";
import { createClient } from "contentful";

const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
  environment: process.env.CONTENTFUL_ENVIRONMENT || "master",
});

export type PageNode = {
  id: string;
  title: string;
  slug: string;
  parentId?: string;
  menuLabel?: string;
  showInMenu: boolean;
  menuOrder: number;
};

const HOME_SLUG = "home";
const MAX_DEPTH = 10; // protects against two pages accidentally pointing at each other

// Load every page (only the few fields needed for the tree). `cache` = once per request.
export const getPageTree = cache(async () => {
  const nodes = new Map<string, PageNode>();

  try {
    const res = await client.getEntries({
      content_type: "page",
      limit: 1000,
      include: 0, // we only need the parent's ID, not the whole parent entry
      select: ["sys.id", "fields.title", "fields.slug", "fields.parent", "fields.menuLabel", "fields.showInMenu", "fields.menuOrder"],
    });
    for (const item of res.items) {
      const f = item.fields as Record<string, unknown>;
      nodes.set(item.sys.id, {
        id: item.sys.id,
        title: String(f.title ?? ""),
        slug: String(f.slug ?? ""),
        parentId: (f.parent as { sys?: { id: string } } | undefined)?.sys?.id,
        menuLabel: f.menuLabel as string | undefined,
        showInMenu: f.showInMenu === true,
        menuOrder: typeof f.menuOrder === "number" ? f.menuOrder : 1000,
      });
    }
  } catch (err) {
    console.error("Contentful: page tree failed:", err);
  }

  return buildTree(nodes);
});

export type PageTree = ReturnType<typeof buildTree>;

function buildTree(nodes: Map<string, PageNode>) {
  // The pages from the top of the tree down to this one. Home is never part of a URL.
  function chain(id: string): PageNode[] {
    const result: PageNode[] = [];
    let current = nodes.get(id);
    while (current && result.length < MAX_DEPTH) {
      result.unshift(current);
      current = current.parentId ? nodes.get(current.parentId) : undefined;
    }
    return result.filter((n) => n.slug !== HOME_SLUG);
  }

  // "/about/concepts" for a page, "/" for home.
  function pathOf(id: string) {
    const parts = chain(id).map((n) => n.slug);
    return parts.length ? `/${parts.join("/")}` : "/";
  }

  // Reverse lookup used by the route: URL -> page ID.
  const idByPath = new Map<string, string>();
  for (const id of nodes.keys()) idByPath.set(pathOf(id), id);

  return {
    all: () => [...nodes.values()],
    node: (id: string) => nodes.get(id),
    pathOf,
    idForPath: (path: string) => idByPath.get(path),

    // Home > About > Concepts, for the breadcrumb bar.
    breadcrumbs: (id: string) => {
      const home = [...nodes.values()].find((n) => n.slug === HOME_SLUG);
      const trail = chain(id).map((n) => ({ title: n.title, url: pathOf(n.id) }));
      return home ? [{ title: home.title, url: "/" }, ...trail] : trail;
    },

    // Pages directly below this one that should appear in its dropdown.
    menuChildren: (id: string) =>
      [...nodes.values()]
        .filter((n) => n.parentId === id && n.showInMenu)
        .sort((a, b) => a.menuOrder - b.menuOrder || a.title.localeCompare(b.title))
        .map((n) => ({ label: n.menuLabel || n.title, url: pathOf(n.id) })),
  };
}
