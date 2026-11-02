import type { Metadata } from "next";
import Header, { type NavItem } from "@/components/Header";
import Footer from "@/components/Footer";
import { assetUrl, getSiteSettings } from "@/lib/contentful";
import type { LinkFields, LinkGroupFields } from "@/lib/types";
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

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Header, mega menu and footer all come from the single "Site settings" entry in Contentful.
  const settings = await getSiteSettings();
  const siteName = settings?.siteName ?? FALLBACK_NAME;

  // A menu item is either a plain Link or a Link group (which becomes a mega-menu panel).
  const navItems: NavItem[] = (settings?.navigation ?? []).map((entry) => {
    const type = entry.sys.contentType?.sys.id;
    if (type === "linkGroup") {
      const group = entry.fields as LinkGroupFields;
      return {
        label: group.title,
        url: group.url ?? "#",
        links: (group.links ?? []).map((l) => l.fields),
        blurb: group.blurb,
        imageUrl: assetUrl(group.image),
      };
    }
    const link = entry.fields as LinkFields;
    return { label: link.label, url: link.url };
  });

  const columns = (settings?.footerColumns ?? []).map((c) => ({
    title: c.fields.title,
    links: (c.fields.links ?? []).map((l) => l.fields),
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
