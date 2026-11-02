import Link from "next/link";
import ArticleCard from "./ArticleCard";
import CfImage from "./CfImage";
import NewsletterForm from "./NewsletterForm";
import ProductCard from "./ProductCard";
import { assetUrl, getArticles } from "@/lib/contentful";
import { getProducts } from "@/lib/store";
import type {
  ArticleListFields,
  CategoryGridFields,
  CtaBannerFields,
  FeatureGridFields,
  HeroFields,
  NewsletterFields,
  PageFields,
  ProductGridFields,
  PromoBannerFields,
} from "@/lib/types";

// One small component per Contentful section type, plus a renderer (at the bottom) that picks the right one.

function Hero({ heading, subheading, image, ctaLabel, ctaUrl }: HeroFields) {
  const bg = assetUrl(image);
  return (
    <section className="hero" style={bg ? { backgroundImage: `url(${bg}?w=2000&fm=webp&q=75)` } : undefined}>
      <div className="container hero__content">
        <h1>{heading}</h1>
        {subheading && <p>{subheading}</p>}
        {ctaLabel && ctaUrl && (
          <Link href={ctaUrl} className="button">
            {ctaLabel}
          </Link>
        )}
      </div>
    </section>
  );
}

function FeatureGrid({ title, intro, features = [] }: FeatureGridFields) {
  return (
    <section className="section container">
      <h2>{title}</h2>
      {intro && <p className="section__intro">{intro}</p>}
      <div className="grid grid--4">
        {features.map((f) => (
          <div key={f.sys.id} className="feature">
            <span className="feature__icon" aria-hidden>
              {f.fields.icon}
            </span>
            <h3>{f.fields.title}</h3>
            <p>{f.fields.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// Server component with its own data fetch: the articles are queried (REST), not referenced.
async function ArticleList({ title, intro, count = 3 }: ArticleListFields) {
  const articles = await getArticles({ limit: count });
  return (
    <section className="section container">
      <h2>{title}</h2>
      {intro && <p className="section__intro">{intro}</p>}
      <div className="grid grid--3">
        {articles.map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </div>
    </section>
  );
}

function CtaBanner({ heading, text, buttonLabel, buttonUrl }: CtaBannerFields) {
  return (
    <section className="cta">
      <div className="container cta__inner">
        <div>
          <h2>{heading}</h2>
          {text && <p>{text}</p>}
        </div>
        {buttonLabel && buttonUrl && (
          <Link href={buttonUrl} className="button button--light">
            {buttonLabel}
          </Link>
        )}
      </div>
    </section>
  );
}

// Products come from the GraphQL API. The editor can pick "featured only" or one category.
async function ProductGrid({ title, intro, category, onlyFeatured, count = 4, linkLabel, linkUrl }: ProductGridFields) {
  const { products } = await getProducts({
    category: category?.fields.slug,
    featured: onlyFeatured,
    pageSize: count,
  });
  if (products.length === 0) return null;

  return (
    <section className="section container">
      <div className="section__head">
        <div>
          <h2>{title}</h2>
          {intro && <p className="section__intro">{intro}</p>}
        </div>
        {linkLabel && linkUrl && (
          <Link href={linkUrl} className="link-arrow">
            {linkLabel} →
          </Link>
        )}
      </div>
      <div className="grid grid--4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}

function CategoryGrid({ title, intro, categories = [] }: CategoryGridFields) {
  return (
    <section className="section container">
      <h2>{title}</h2>
      {intro && <p className="section__intro">{intro}</p>}
      <div className="grid grid--4">
        {categories.map((c) => (
          <Link key={c.sys.id} href={`/category/${c.fields.slug}`} className="category-tile">
            <CfImage asset={c.fields.image} sizes="(max-width: 700px) 50vw, 25vw" />
            <span className="category-tile__label">{c.fields.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}

function PromoBanner({ heading, text, image, buttonLabel, buttonUrl, theme = "light" }: PromoBannerFields) {
  return (
    <section className="container section--tight">
      <div className={`promo promo--${theme}`}>
        <div className="promo__text">
          <h2>{heading}</h2>
          {text && <p>{text}</p>}
          {buttonLabel && buttonUrl && (
            <Link href={buttonUrl} className="button button--light">
              {buttonLabel}
            </Link>
          )}
        </div>
        <div className="promo__image">
          <CfImage asset={image} sizes="(max-width: 800px) 100vw, 40vw" />
        </div>
      </div>
    </section>
  );
}

function Newsletter({ heading, text, buttonLabel }: NewsletterFields) {
  return (
    <section className="newsletter">
      <div className="container newsletter__inner">
        <div>
          <h2>{heading}</h2>
          {text && <p>{text}</p>}
        </div>
        <NewsletterForm buttonLabel={buttonLabel} />
      </div>
    </section>
  );
}

// The content type ID of each linked entry decides which component renders it.
export default function Sections({ sections = [] }: { sections?: PageFields["sections"] }) {
  return (
    <>
      {sections.map((s) => {
        const key = s.sys.id;
        switch (s.sys.contentType?.sys.id) {
          case "hero":
            return <Hero key={key} {...(s.fields as HeroFields)} />;
          case "featureGrid":
            return <FeatureGrid key={key} {...(s.fields as FeatureGridFields)} />;
          case "articleList":
            return <ArticleList key={key} {...(s.fields as ArticleListFields)} />;
          case "ctaBanner":
            return <CtaBanner key={key} {...(s.fields as CtaBannerFields)} />;
          case "productGrid":
            return <ProductGrid key={key} {...(s.fields as ProductGridFields)} />;
          case "categoryGrid":
            return <CategoryGrid key={key} {...(s.fields as CategoryGridFields)} />;
          case "promoBanner":
            return <PromoBanner key={key} {...(s.fields as PromoBannerFields)} />;
          case "newsletter":
            return <Newsletter key={key} {...(s.fields as NewsletterFields)} />;
          default:
            return null; // unknown section type: ignore instead of crashing
        }
      })}
    </>
  );
}
