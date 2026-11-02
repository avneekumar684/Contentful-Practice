import type { Metadata } from "next";
import Header, { type NavItem } from "@/components/Header";
import Footer from "@/components/Footer";
import { assetUrl, getSiteSettings } from "@/lib/contentful";
import { getPageTree, type PageTree } from "@/lib/pages";
import type { LinkFields, LinkGroupFields, PageFields, Ref } from "@/lib/types";
import "./globals.css";

export const revalidate = 60; // re-fetch from Contentful at most once per minute

const FALLBACK_NAME = "Avneesh's Contentful App";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  const name = settings?.siteName ?? FALLBACK_NAME;
  return {
    title: { default: name, template: `%s | ${name}` },
    description: settings?.tagline,
  };
}

// A menu or footer entry can be a custom Link or a Page. For a Page the URL comes from the page tree,
// so it is always correct, even after an author renames a slug or moves the page.
function toLink(entry: Ref<LinkFields | PageFields>, tree: PageTree): { label: string; url: string } {
  if (entry.sys.contentType?.sys.id === "page") {
    const node = tree.node(entry.sys.id);
    return { label: node?.menuLabel || node?.title || "Page", url: tree.pathOf(entry.sys.id) };
  }
  return entry.fields as LinkFields;
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Header, mega menu and footer all come from the single "Site settings" entry in Contentful.
  const [settings, tree] = await Promise.all([getSiteSettings(), getPageTree()]);
  const siteName = settings?.siteName ?? FALLBACK_NAME;

  const navItems: NavItem[] = (settings?.navigation ?? []).map((entry): NavItem => {
    const type = entry.sys.contentType?.sys.id;

    // 1) A Page: its child pages (marked "Show in parent's dropdown menu") become the dropdown.
    if (type === "page") {
      const link = toLink(entry as Ref<PageFields>, tree);
      const children = tree.menuChildren(entry.sys.id);
      return { ...link, links: children.length > 0 ? children : undefined };
    }

    // 2) A Link group: a hand-made mega menu with its own links, text and picture.
    if (type === "linkGroup") {
      const group = entry.fields as LinkGroupFields;
      return {
        label: group.title,
        url: group.url ?? "#",
        links: (group.links ?? []).map((l) => toLink(l, tree)),
        blurb: group.blurb,
        imageUrl: assetUrl(group.image),
      };
    }

    // 3) A plain custom Link.
    const link = entry.fields as LinkFields;
    return { label: link.label, url: link.url };
  });

  const columns = (settings?.footerColumns ?? []).map((column) => ({
    title: column.fields.title,
    links: (column.fields.links ?? []).map((l) => toLink(l, tree)),
  }));

  return (
    <html lang="en">
      <body>
        <Header
          siteName={siteName}
          announcement={settings?.announcement}
          supportText={settings?.supportText}
          items={navItems}
        />
        <main>{children}</main>
        <Footer
          siteName={siteName}
          tagline={settings?.tagline}
          text={settings?.footerText}
          columns={columns}
          social={(settings?.socialLinks ?? []).map((l) => l.fields)}
        />
      </body>
    </html>
  );
}
