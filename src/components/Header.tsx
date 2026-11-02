"use client";

import { useState } from "react";
import Link from "next/link";
import SearchBox from "./SearchBox";
import type { LinkFields } from "@/lib/types";

// Client component only because of the mobile menu button (open/closed state).
// The links themselves come from the "Site settings" entry in Contentful.
export default function Header({ siteName, links }: { siteName: string; links: LinkFields[] }) {
  const [open, setOpen] = useState(false);

  return (
    <header className="header">
      <div className="header__inner container">
        <Link href="/" className="header__logo">
          {siteName}
        </Link>

        <button
          className="header__toggle"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "✕" : "☰"}
        </button>

        <nav className={`header__nav ${open ? "is-open" : ""}`}>
          <ul>
            {links.map((l) => (
              <li key={l.url}>
                <Link href={l.url} onClick={() => setOpen(false)}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
          <SearchBox />
        </nav>
      </div>
    </header>
  );
}
