import Link from "next/link";
import type { LinkFields } from "@/lib/types";

export default function Footer({
  siteName,
  text,
  links,
}: {
  siteName: string;
  text?: string;
  links: LinkFields[];
}) {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div>
          <strong>{siteName}</strong>
          {text && <p>{text}</p>}
        </div>
        <ul>
          {links.map((l) => (
            <li key={l.url}>
              <Link href={l.url}>{l.label}</Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
