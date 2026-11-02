// Usage: node scripts/seed-blog.mjs   (run by `npm run seed`)
// Learning blog content: article images, categories, 6 articles about Contentful, and feature cards.
import { uploadSvg, upsertEntry, fields, entryRef, assetRef, L, p, h2, ul, quote, doc, t } from "./seed-helpers.mjs";

// ---------- generated images (our own artwork, no third-party content) ----------
function artwork(c1, c2, shapes) {
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="2400" height="1000" viewBox="0 0 2400 1000">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs>
  <rect width="2400" height="1000" fill="url(#g)"/>
  <g fill="#fff">${shapes}</g></svg>`);
}
const circles = `<circle cx="1800" cy="280" r="340" fill-opacity=".08"/><circle cx="2100" cy="700" r="240" fill-opacity=".1"/>
<circle cx="1450" cy="760" r="170" fill-opacity=".07"/><circle cx="1250" cy="200" r="90" fill-opacity=".08"/>`;
const squares = `<rect x="1500" y="150" width="420" height="420" rx="40" fill-opacity=".08" transform="rotate(12 1700 360)"/>
<rect x="1900" y="480" width="300" height="300" rx="40" fill-opacity=".1" transform="rotate(-10 2050 630)"/>`;
const bars = `<rect x="1400" y="500" width="120" height="360" rx="20" fill-opacity=".1"/><rect x="1580" y="360" width="120" height="500" rx="20" fill-opacity=".14"/>
<rect x="1760" y="220" width="120" height="640" rx="20" fill-opacity=".1"/><rect x="1940" y="420" width="120" height="440" rx="20" fill-opacity=".14"/>`;

const images = {
  "img-hero": ["Hero background", artwork("#1b2a6b", "#3aa6c9", circles + squares)],
  "img-basics": ["Basics cover", artwork("#0f766e", "#5eead4", circles)],
  "img-modeling": ["Modeling cover", artwork("#6d28d9", "#c4b5fd", squares)],
  "img-apis": ["APIs cover", artwork("#b45309", "#fcd34d", bars)],
};

// ---------- sample articles ----------
const articles = [
  {
    id: "article-headless-cms",
    title: "What is a headless CMS?",
    slug: "what-is-a-headless-cms",
    category: "cat-basics",
    image: "img-basics",
    date: "2026-10-01",
    summary: "A traditional CMS builds your pages. A headless CMS only stores content and hands it to any app through an API.",
    body: doc(
      p("A traditional CMS stores your content and also decides how it looks on a website. A headless CMS does only the first job: it stores content and delivers it through an API. The \"head\" (the website) is built separately."),
      h2("Why teams like it"),
      ul(
        "One place to edit content, many places to show it: website, mobile app, kiosk.",
        "Developers choose any framework, for example Next.js.",
        "Editors work in a friendly interface and never touch code."
      ),
      h2("How it looks in this project"),
      p("Editors write articles in Contentful. This Next.js site asks the Contentful API for those articles and turns them into the pages you are reading."),
      quote("Content lives in Contentful. Design lives in code. The API connects them.")
    ),
  },
  {
    id: "article-spaces-environments",
    title: "Spaces and environments",
    slug: "spaces-and-environments",
    category: "cat-basics",
    image: "img-basics",
    date: "2026-10-05",
    summary: "A space is a project's container for all content. Environments inside it let you try changes safely.",
    body: doc(
      h2("Space"),
      p("A space is the top-level container. Content types, entries and images all live inside one space. Most projects use one space per website."),
      h2("Environment"),
      p("Every space has a ", t("master", ["code"]), " environment. You can copy it into another environment, test a content model change there, and only then apply it to master."),
      h2("IDs to remember"),
      ul("Space ID: identifies the space in every API call.", "Environment ID: usually master.")
    ),
  },
  {
    id: "article-content-models",
    title: "Content models, types and fields",
    slug: "content-models-types-and-fields",
    category: "cat-modeling",
    image: "img-modeling",
    date: "2026-10-10",
    summary: "A content type is the blueprint for a kind of content. Fields are the pieces of that blueprint.",
    body: doc(
      p("Think of a content type as a form template. This site has an Article type with fields like title, slug, summary, body and cover image. Each article is one filled-in copy of that form, called an entry."),
      h2("Common field types"),
      ul("Short text for titles and labels.", "Long text for summaries.", "Rich text for formatted bodies like this one.", "Media for images.", "Reference to link to other entries."),
      h2("Good habits"),
      ul("Use clear, stable field IDs: code depends on them.", "Mark must-have fields as required.", "Keep models small and reusable.")
    ),
  },
  {
    id: "article-references",
    title: "References: linking entries together",
    slug: "references-linking-entries",
    category: "cat-modeling",
    image: "img-modeling",
    date: "2026-10-15",
    summary: "Instead of copying content, entries can point at other entries. Change it once, it updates everywhere.",
    body: doc(
      p("A reference is a field that holds a link to another entry. The article you are reading points to a Category entry. The homepage points to Hero, Feature grid and Call to action entries."),
      h2("Why it matters"),
      ul("No copy-paste: the same Link entry can power the header and the footer.", "Pages become flexible lists of sections that editors can reorder.", "The API can return linked entries in the same response using the include parameter."),
      p("In code, a section's content type ID decides which React component renders it. That pattern is the heart of this project.")
    ),
  },
  {
    id: "article-three-apis",
    title: "Delivery, Preview and Management APIs",
    slug: "delivery-preview-management-apis",
    category: "cat-apis",
    image: "img-apis",
    date: "2026-10-20",
    summary: "Contentful has separate APIs for reading published content, previewing drafts and changing content.",
    body: doc(
      p("Contentful gives you different APIs for different jobs, each with its own token."),
      ul(
        "Content Delivery API (CDA): read published content. Used by the live website.",
        "Content Preview API (CPA): read drafts too. Used for preview environments.",
        "Content Management API (CMA): create and edit content types and entries. Used by scripts, never by the browser."
      ),
      h2("Keep tokens private"),
      p("The Management token can change everything, so it only lives in a local .env file or in GitHub secrets. This site also calls the search API from the server so even the read token never reaches the browser.")
    ),
  },
  {
    id: "article-rich-text",
    title: "Rich text and publishing",
    slug: "rich-text-and-publishing",
    category: "cat-apis",
    image: "img-apis",
    date: "2026-10-25",
    summary: "Rich text stores formatted content as structured data. Entries only appear on the site once published.",
    body: doc(
      p("Rich text in Contentful is not HTML. It is a JSON document of headings, paragraphs, lists and marks like bold. The website decides how each part looks."),
      h2("Draft, changed, published"),
      ul("Draft: new, only editors can see it.", "Changed: published, but edited since.", "Published: live for the Delivery API."),
      p("If something is missing on the site, the first thing to check is whether the entry and its image are published.")
    ),
  },
];

// ---------- run ----------
console.log("Blog images...");
for (const [id, [title, svg]] of Object.entries(images)) await uploadSvg(id, title, svg);

console.log("Article categories...");
await upsertEntry("category", "cat-basics", fields({ name: "Basics", slug: "basics", description: "Start here: the core ideas." }));
await upsertEntry("category", "cat-modeling", fields({ name: "Modeling", slug: "modeling", description: "How to structure content." }));
await upsertEntry("category", "cat-apis", fields({ name: "APIs", slug: "apis", description: "Getting content in and out." }));

console.log("Articles...");
for (const a of articles) {
  await upsertEntry("article", a.id, {
    ...fields({ title: a.title, slug: a.slug, summary: a.summary, body: a.body, publishedDate: a.date }),
    coverImage: L(assetRef(a.image)),
    category: L(entryRef(a.category)),
  });
}

console.log("Blog done.");
