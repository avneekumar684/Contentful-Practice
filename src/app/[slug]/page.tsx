import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Sections from "@/components/sections";
import { getPage } from "@/lib/contentful";

export const revalidate = 60;

// Any Contentful "page" entry becomes a URL: slug "about" -> /about. No new code needed per page.
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const page = await getPage((await params).slug);
  return { title: page?.title, description: page?.description };
}

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const page = await getPage((await params).slug);
  if (!page) notFound();
  return <Sections sections={page.sections} />;
}
