import Link from "next/link";
import ArticleCard from "./ArticleCard";
import { assetUrl, getArticles } from "@/lib/contentful";
import type {
  ArticleListFields,
  CtaBannerFields,
  FeatureGridFields,
  HeroFields,
  PageFields,
} from "@/lib/types";

// One small component per Contentful section type, plus a renderer that picks the right one.

function Hero({ heading, subheading, image, ctaLabel, ctaUrl }: HeroFields) {
  const bg = assetUrl(image);
  return (
    <section className="hero" style={bg ? { backgroundImage: `url(${bg})` } : undefined}>
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

// Server component with its own data fetch: the articles are queried, not referenced.
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
          default:
            return null; // unknown section type: ignore instead of crashing
        }
      })}
    </>
  );
}
