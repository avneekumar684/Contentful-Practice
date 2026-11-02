import Link from "next/link";
import NewsletterForm from "./NewsletterForm";
import type { LinkFields } from "@/lib/types";

export type FooterColumn = { title: string; links: LinkFields[] };

type Props = {
  siteName: string;
  tagline?: string;
  text?: string;
  columns: FooterColumn[];
  social: LinkFields[];
};

// Big footer: brand + newsletter on the left, link columns on the right, small print at the bottom.
// Every list in here is editable in Contentful (Site settings).
export default function Footer({ siteName, tagline, text, columns, social }: Props) {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <strong>{siteName}</strong>
          {tagline && <p>{tagline}</p>}
          <p className="footer__label">Get updates</p>
          <NewsletterForm />
          <ul className="footer__social">
            {social.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noreferrer">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {columns.map((column) => (
          <nav key={column.title} aria-label={column.title}>
            <h3>{column.title}</h3>
            <ul>
              {column.links.map((l) => (
                <li key={l.url}>
                  <Link href={l.url}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="footer__bottom">
        <div className="container">
          <span>
            © {new Date().getFullYear()} {siteName}
          </span>
          {text && <span>{text}</span>}
        </div>
      </div>
    </footer>
  );
}
