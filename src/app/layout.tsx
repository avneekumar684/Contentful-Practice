import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getSiteSettings } from "@/lib/contentful";
import "./globals.css";

export const revalidate = 60; // re-fetch from Contentful at most once per minute

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: { default: settings?.siteName ?? "Contentful Compass", template: `%s | ${settings?.siteName ?? "Contentful Compass"}` },
    description: settings?.tagline,
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Header and footer content come from the single "Site settings" entry.
  const settings = await getSiteSettings();
  const siteName = settings?.siteName ?? "Contentful Compass";
  const nav = (settings?.navigation ?? []).map((l) => l.fields);
  const footerLinks = (settings?.footerLinks ?? []).map((l) => l.fields);

  return (
    <html lang="en">
      <body>
        <Header siteName={siteName} links={nav} />
        <main>{children}</main>
        <Footer siteName={siteName} text={settings?.footerText} links={footerLinks} />
      </body>
    </html>
  );
}
