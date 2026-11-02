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
  announcement?: string;
  supportText?: string;
  // Each menu item is either a plain `link` or a `linkGroup` (mega-menu panel).
  navigation?: Ref<LinkFields | LinkGroupFields>[];
  footerColumns?: Ref<LinkGroupFields>[];
  socialLinks?: Ref<LinkFields>[];
  footerText?: string;
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
  type: "product" | "article" | "page";
  title: string;
  summary?: string;
  url: string;
  // Only products have these:
  price?: number;
  imageUrl?: string;
};

// ---- store (loaded with GraphQL) ----
export type Img = { url: string; width: number; height: number; title?: string };

export type Product = {
  id: string;
  name: string;
  slug: string;
  sku?: string;
  brand?: string;
  price: number;
  compareAtPrice?: number;
  shortDescription: string;
  description?: Document;
  images: Img[];
  categoryName?: string;
  categorySlug?: string;
  tags: string[];
  rating?: number;
  reviewCount?: number;
  inStock: boolean;
  featured: boolean;
  badge?: string;
};

export type ProductCategory = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: Img;
};

// ---- new content types used by page sections ----
export type ProductGridFields = {
  title: string;
  intro?: string;
  category?: Ref<{ slug: string }>;
  onlyFeatured?: boolean;
  count?: number;
  linkLabel?: string;
  linkUrl?: string;
};
export type CategoryGridFields = { title: string; intro?: string; categories?: Ref<CategoryImageFields>[] };
export type CategoryImageFields = { name: string; slug: string; description?: string; image?: CfAsset };
export type PromoBannerFields = {
  heading: string;
  text?: string;
  image?: CfAsset;
  buttonLabel?: string;
  buttonUrl?: string;
  theme?: "light" | "dark";
};
export type NewsletterFields = { heading: string; text?: string; buttonLabel?: string };
export type LinkGroupFields = {
  title: string;
  url?: string;
  links?: Ref<LinkFields>[];
  blurb?: string;
  image?: CfAsset;
};
