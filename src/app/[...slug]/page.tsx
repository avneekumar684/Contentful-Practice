import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import Sections from "@/components/sections";
import { getPageById } from "@/lib/contentful";
import { getPageTree } from "@/lib/pages";

export const revalidate = 60;

// "[...slug]" is a catch-all route: it receives every part of the URL as a list.
//   /about                      -> ["about"]
//   /about/concepts/rest-vs-graphql -> ["about", "concepts", "rest-vs-graphql"]
// We turn the list back into a path, ask the page tree which page owns that path, then load the page.
async function findPage(slugParts: string[]) {
  const tree = await getPageTree();
  const id = tree.idForPath("/" + slugParts.join("/"));
  if (!id) return null;
  const page = await getPageById(id);
  return page ? { id, page, tree } : null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const found = await findPage((await params).slug);
  return { title: found?.page.title, description: found?.page.description };
}

export default async function DynamicPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const found = await findPage((await params).slug);
  if (!found) notFound();

  return (
    <>
      <Breadcrumbs items={found.tree.breadcrumbs(found.id)} />
      <Sections sections={found.page.sections} />
    </>
  );
}
