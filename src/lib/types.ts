import type { Document } from "@contentful/rich-text-types";

// A linked Contentful entry. `sys.contentType.sys.id` tells us which content type it is.
export type Ref<T> = {
  sys: { id: string; contentType?: { sys: { id: string } } };
  fields: T;
};

export type CfAsset = {
  fields: {
    title?: string;
    file?: { url: string; details?: { image?: { width: number; height: number } } };
  };
};

// ---- fields of each content type (mirror scripts/content-model.mjs) ----
export type LinkFields = { label: string; url: string };
export type CategoryFields = { name: string; slug: string; description?: string };

export type ArticleFields = {
  title: string;
  slug: string;
  summary: string;
  body: Document;
  coverImage?: CfAsset;
  category?: Ref<CategoryFields>;
  publishedDate?: string;
};

export type FeatureFields = { title: string; description?: string; icon?: string };
export type HeroFields = {
  heading: string;
  subheading?: string;
  image?: CfAsset;
  ctaLabel?: string;
  ctaUrl?: string;
};
export type FeatureGridFields = { title: string; intro?: string; features?: Ref<FeatureFields>[] };
export type ArticleListFields = { title: string; intro?: string; count?: number };
export type CtaBannerFields = { heading: string; text?: string; buttonLabel?: string; buttonUrl?: string };

export type PageFields = {
  title: string;
  slug: string;
  description?: string;
  sections?: Ref<Record<string, unknown>>[];
};

export type SiteSettingsFields = {
  siteName: string;
  tagline?: string;
  navigation?: Ref<LinkFields>[];
  footerText?: string;
  footerLinks?: Ref<LinkFields>[];
};

// ---- simplified shapes the UI uses ----
export type ArticleSummary = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  coverImage?: CfAsset;
  categoryName?: string;
  categorySlug?: string;
  publishedDate?: string;
};

export type SearchResult = {
  id: string;
  type: "article" | "page";
  title: string;
  summary?: string;
  url: string;
};
