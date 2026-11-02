"use client";

import { useState } from "react";
import Link from "next/link";
import SearchBox from "./SearchBox";
import { useCart } from "@/lib/cart-store";

// What the layout (server) hands to the header after reading the Contentful "Site settings" entry.
export type NavItem = {
  label: string;
  url: string;
  // Only mega-menu items (Contentful "Link group") have these:
  links?: { label: string; url: string }[];
  blurb?: string;
  imageUrl?: string;
};

type Props = {
  siteName: string;
  announcement?: string;
  supportText?: string;
  items: NavItem[];
};

// Three stacked rows: announcement bar, main row (logo, search, cart) and the menu row.
// It is a client component because of the mobile menu button and the cart count.
export default function Header({ siteName, announcement, supportText, items }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { count } = useCart();

  return (
    <header className="header">
      {(announcement || supportText) && (
        <div className="topbar">
          <div className="container topbar__inner">
            <span>{announcement}</span>
            <span className="topbar__support">{supportText}</span>
          </div>
        </div>
      )}

      <div className="container header__main">
        <button
          className="header__toggle"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        <Link href="/" className="header__logo">
          {siteName}
        </Link>

        <div className="header__search">
          <SearchBox />
        </div>

        <Link href="/cart" className="header__cart" aria-label={`Cart, ${count} items`}>
          <span aria-hidden>🛒</span>
          <span className="header__cart-label">Cart</span>
          {count > 0 && <span className="header__cart-count">{count}</span>}
        </Link>
      </div>

      <nav className={`menu ${menuOpen ? "is-open" : ""}`} aria-label="Main">
        <ul className="container menu__list">
          {items.map((item) => (
            <li key={item.label} className={`menu__item ${item.links ? "has-panel" : ""}`}>
              <Link href={item.url} onClick={() => setMenuOpen(false)}>
                {item.label}
                {item.links && <span aria-hidden> ▾</span>}
              </Link>

              {/* The "mega menu" panel: shown on hover (desktop) or inline (mobile). */}
              {item.links && (
                <div className="panel">
                  <div className="panel__inner container">
                    <ul>
                      {item.links.map((l) => (
                        <li key={l.url}>
                          <Link href={l.url} onClick={() => setMenuOpen(false)}>
                            {l.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <div className="panel__feature">
                      {item.blurb && <p>{item.blurb}</p>}
                      {item.imageUrl && (
                        // A plain <img> is fine here: it is decoration inside a hover panel.
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={`${item.imageUrl}?w=500&fm=webp&q=70`} alt="" loading="lazy" />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
