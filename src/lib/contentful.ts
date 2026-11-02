import { createClient } from "contentful";
import type {
  ArticleFields,
  ArticleSummary,
  CategoryFields,
  CfAsset,
  PageFields,
  SearchResult,
  SiteSettingsFields,
} from "./types";

// Content Delivery API client. It only runs on the server, so the token never reaches the browser.
// `withoutUnresolvableLinks` drops references to unpublished entries instead of returning broken links.
const client = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
  environment: process.env.CONTENTFUL_ENVIRONMENT || "master",
}).withoutUnresolvableLinks;

// Wrap every call so a Contentful problem shows an empty state instead of crashing the site.
async function safe<T>(label: string, fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    console.error(`Contentful: ${label} failed:`, err);
    return fallback;
  }
}

// "//images.ctfassets.net/..." -> "https://images.ctfassets.net/..."
export function assetUrl(asset?: CfAsset): string | undefined {
  const url = asset?.fields?.file?.url;
  return url ? `https:${url}` : undefined;
}

export function getSiteSettings() {
  return safe(
    "site settings",
    async () => {
      const res = await client.getEntries({ content_type: "siteSettings", limit: 1, include: 2 });
      return res.items[0] ? (res.items[0].fields as unknown as SiteSettingsFields) : null;
    },
    null
  );
}

// `include: 4` resolves page -> sections -> features in a single request.
export function getPage(slug: string) {
  return safe(
    `page "${slug}"`,
    async () => {
      const res = await client.getEntries({
        content_type: "page",
        "fields.slug": slug,
        limit: 1,
        include: 4,
      });
      return res.items[0] ? (res.items[0].fields as unknown as PageFields) : null;
    },
    null
  );
}

function toSummary(item: { sys: { id: string }; fields: unknown }): ArticleSummary {
  const f = item.fields as ArticleFields;
  return {
    id: item.sys.id,
    title: f.title,
    slug: f.slug,
    summary: f.summary,
    coverImage: f.coverImage,
    categoryName: f.category?.fields?.name,
    categorySlug: f.category?.fields?.slug,
    publishedDate: f.publishedDate,
  };
}

// Newest first. Category filtering happens here in code, which is plenty for a small site.
export function getArticles(options: { limit?: number; categorySlug?: string } = {}) {
  return safe(
    "articles",
    async () => {
      const res = await client.getEntries({
        content_type: "article",
        order: ["-fields.publishedDate"],
        limit: 100,
        include: 1,
      });
      const all = res.items.map(toSummary);
      const filtered = options.categorySlug ? all.filter((a) => a.categorySlug === options.categorySlug) : all;
      return filtered.slice(0, options.limit ?? 24);
    },
    [] as ArticleSummary[]
  );
}

export function getArticle(slug: string) {
  return safe(
    `article "${slug}"`,
    async () => {
      const res = await client.getEntries({
        content_type: "article",
        "fields.slug": slug,
        limit: 1,
        include: 2,
      });
      return res.items[0] ? (res.items[0].fields as unknown as ArticleFields) : null;
    },
    null
  );
}

export function getCategories() {
  return safe(
    "categories",
    async () => {
      const res = await client.getEntries({ content_type: "category", order: ["fields.name"] });
      return res.items.map((i) => i.fields as unknown as CategoryFields);
    },
    [] as CategoryFields[]
  );
}

// Full-text search across articles and pages, using Contentful's `query` parameter.
export function searchContent(query: string) {
  return safe(
    "search",
    async () => {
      const res = await client.getEntries({
        query,
        "sys.contentType.sys.id[in]": ["article", "page"],
        limit: 12,
        include: 0,
      });
      return res.items.map((item): SearchResult => {
        const type = item.sys.contentType.sys.id as "article" | "page";
        const f = item.fields as unknown as { title: string; slug: string; summary?: string; description?: string };
        return {
          id: item.sys.id,
          type,
          title: f.title,
          summary: f.summary ?? f.description,
          url: type === "article" ? `/articles/${f.slug}` : f.slug === "home" ? "/" : `/${f.slug}`,
        };
      });
    },
    [] as SearchResult[]
  );
}
