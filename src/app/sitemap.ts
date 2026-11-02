import type { MetadataRoute } from "next";
import { getArticles } from "@/lib/contentful";
import { getPageTree } from "@/lib/pages";
import { getProducts } from "@/lib/store";

// Next.js turns this file into /sitemap.xml. The page URLs come straight from the Contentful page tree,
// so a new page, or a moved page, is listed without any code change.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = process.env.SITE_URL ?? "http://localhost:3000";
  const [tree, articles, { products }] = await Promise.all([
    getPageTree(),
    getArticles({ limit: 100 }),
    getProducts({ pageSize: 100 }),
  ]);

  return [
    ...tree.all().map((page) => ({ url: `${site}${tree.pathOf(page.id)}` })),
    ...articles.map((a) => ({ url: `${site}/articles/${a.slug}` })),
    ...products.map((p) => ({ url: `${site}/product/${p.slug}` })),
    { url: `${site}/shop` },
  ];
}
