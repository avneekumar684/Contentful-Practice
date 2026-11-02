import Sections from "@/components/sections";
import { getPage } from "@/lib/contentful";
import EmptyState from "@/components/EmptyState";

export const revalidate = 60;

// Homepage = the Contentful "page" entry whose slug is "home".
export default async function Home() {
  const page = await getPage("home");
  if (!page) return <EmptyState />;
  return <Sections sections={page.sections} />;
}
