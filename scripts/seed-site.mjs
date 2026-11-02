// Usage: node scripts/seed-site.mjs   (run by `npm run seed`, after the blog and store seeds)
// Site-level content: feature cards, promo banners, pages, header menu, footer and site settings.
import { upsertEntry, fields, entryRef, assetRef, L } from "./seed-helpers.mjs";

const refs = (ids) => L(ids.map(entryRef));

// ---------- feature cards (small icon + text blocks) ----------
console.log("Features...");
const features = [
  // "Shop with confidence" strip on the homepage
  ["feat-ship", "🚚", "Free shipping", "On every order over $50."],
  ["feat-returns", "↩️", "30-day returns", "Changed your mind? Send it back."],
  ["feat-support", "💬", "Friendly support", "Real people, quick answers."],
  ["feat-secure", "🔒", "Secure checkout", "Your details stay private."],
  // "Why a headless CMS" on the About page
  ["feat-edit", "📝", "Edit without code", "Editors change text and images in Contentful. No developer needed."],
  ["feat-reuse", "🔁", "Reuse everywhere", "Write content once, show it on the web, in an app or anywhere else."],
  ["feat-fast", "⚡", "Fast by design", "Content is delivered from a global CDN and rendered by Next.js."],
  ["feat-safe", "🛡️", "Safe publishing", "Draft, review and publish. Visitors only see what is published."],
  // Contentful concepts used in this project (great for explaining it to a team)
  ["con-types", "🧱", "Content types", "Product, Category, Page and more: blueprints made of typed fields."],
  ["con-refs", "🔗", "References", "Products point to a category. Pages point to ordered sections."],
  ["con-assets", "🖼️", "Assets + Images API", "Every picture is resized on the fly with ?w=800&fm=webp."],
  ["con-graphql", "🧬", "GraphQL API", "Shop, filters and search ask for exactly the fields they need."],
  ["con-rest", "📡", "REST Delivery API", "Pages, menus and articles are loaded with the REST API."],
  ["con-rich", "📄", "Rich text", "Product descriptions and articles are structured JSON, not HTML."],
  ["con-webhooks", "🔔", "Webhooks", "Publishing in Contentful tells the site to refresh straight away."],
  ["con-code", "🧩", "Model as code", "The content model lives in Git and syncs to Contentful."],
];
for (const [id, icon, title, description] of features) {
  await upsertEntry("feature", id, fields({ title, description, icon }));
}

// ---------- page sections ----------
console.log("Sections...");
await upsertEntry("hero", "hero-home", {
  ...fields({
    heading: "Avneesh's Contentful App",
    subheading:
      "A small online store and learning journal, built with Contentful and Next.js. Everything you see here comes from the CMS.",
    ctaLabel: "Shop the collection",
    ctaUrl: "/shop",
  }),
  image: L(assetRef("img-hero")),
});
await upsertEntry("featureGrid", "grid-usp", {
  ...fields({ title: "Shop with confidence", intro: "The basics, done right." }),
  features: refs(["feat-ship", "feat-returns", "feat-support", "feat-secure"]),
});
await upsertEntry("categoryGrid", "cats-home", {
  ...fields({ title: "Shop by category", intro: "Four shelves to start with." }),
  categories: refs(["pcat-electronics", "pcat-home", "pcat-fashion", "pcat-fitness"]),
});
await upsertEntry("productGrid", "products-featured", fields({
  title: "Featured products",
  intro: "Loaded with the GraphQL API.",
  onlyFeatured: true,
  count: 4,
  linkLabel: "Shop all products",
  linkUrl: "/shop",
}));
await upsertEntry("productGrid", "products-home-living", {
  ...fields({ title: "Home & Living picks", intro: "A second grid, filtered to one category.", count: 4, linkLabel: "See the category", linkUrl: "/category/home-living" }),
  category: L(entryRef("pcat-home")),
});
await upsertEntry("promoBanner", "promo-sale", {
  ...fields({
    heading: "Autumn sale: up to 30% off",
    text: "Headphones, sneakers, backpacks and more. While stock lasts.",
    buttonLabel: "Shop deals",
    buttonUrl: "/shop?sale=1",
    theme: "dark",
  }),
  image: L(assetRef("img-promo-sale")),
});
await upsertEntry("promoBanner", "promo-learn", {
  ...fields({
    heading: "New to Contentful?",
    text: "Our short, plain-English journal explains spaces, content models, references and APIs.",
    buttonLabel: "Read the journal",
    buttonUrl: "/articles",
    theme: "light",
  }),
  image: L(assetRef("img-promo-learn")),
});
await upsertEntry("articleList", "list-latest", fields({
  title: "From the Contentful journal",
  intro: "Pulled live from Contentful with the REST API.",
  count: 3,
}));
await upsertEntry("newsletter", "news-signup", fields({
  heading: "Join the newsletter",
  text: "New products and new lessons, once a month. (Demo: your email is not stored.)",
  buttonLabel: "Subscribe",
}));
await upsertEntry("ctaBanner", "cta-explore", fields({
  heading: "Looking for something specific?",
  text: "Use the search box in the header to find any product or article.",
  buttonLabel: "Browse the shop",
  buttonUrl: "/shop",
}));
await upsertEntry("hero", "hero-about", {
  ...fields({
    heading: "About Avneesh's Contentful App",
    subheading: "A teaching project that shows how Contentful content becomes a real online store.",
  }),
  image: L(assetRef("img-hero")),
});
await upsertEntry("featureGrid", "grid-why", {
  ...fields({ title: "Why a headless CMS?", intro: "Four ideas that explain the whole approach." }),
  features: refs(["feat-edit", "feat-reuse", "feat-fast", "feat-safe"]),
});
await upsertEntry("featureGrid", "grid-concepts", {
  ...fields({ title: "Contentful concepts used in this project", intro: "Each one is real code you can open and read." }),
  features: refs(["con-types", "con-refs", "con-assets", "con-graphql", "con-rest", "con-rich", "con-webhooks", "con-code"]),
});
await upsertEntry("hero", "hero-shipping", fields({
  heading: "Shipping & returns",
  subheading: "Free standard shipping over $50. Easy 30-day returns. (This is a demo store, so nothing is really shipped.)",
}));
await upsertEntry("hero", "hero-contact", fields({
  heading: "Contact us",
  subheading: "Questions about an order or about this project? Write to support@example.com.",
}));

// ---------- pages ----------
console.log("Pages...");
await upsertEntry("page", "page-home", {
  ...fields({ title: "Home", slug: "home", description: "A demo online store and learning journal built with Contentful and Next.js." }),
  sections: refs([
    "hero-home", "grid-usp", "cats-home", "products-featured", "promo-sale",
    "products-home-living", "list-latest", "promo-learn", "news-signup",
  ]),
});
// The page TREE. Each page only says who its parent is. The code builds the URLs:
//   Home
//   |- About                     /about
//   |  |- Contentful concepts    /about/concepts
//   |  |  '- REST vs GraphQL     /about/concepts/rest-vs-graphql
//   |  '- How it's built         /about/how-its-built
//   '- Help                      /help
//      |- Shipping & returns     /help/shipping-returns
//      '- Contact                /help/contact
const parentOf = (id) => ({ parent: L(entryRef(id)) });

await upsertEntry("hero", "hero-concepts", fields({
  heading: "Contentful concepts",
  subheading: "The building blocks of this project, one card each.",
}));
await upsertEntry("hero", "hero-how", fields({
  heading: "How it's built",
  subheading: "Content in Contentful, pages in Next.js, and a few scripts that keep them in sync.",
}));
await upsertEntry("hero", "hero-rest-graphql", fields({
  heading: "REST vs GraphQL",
  subheading: "Two ways to read the same content. This page is three levels deep in the page tree.",
}));
await upsertEntry("hero", "hero-help", fields({
  heading: "Help centre",
  subheading: "Delivery, returns and ways to reach us.",
}));
await upsertEntry("featureGrid", "grid-stack", {
  ...fields({ title: "What is inside", intro: "The pieces you can explain to your team." }),
  features: refs(["con-code", "con-rest", "con-graphql"]),
});
await upsertEntry("featureGrid", "grid-apis", {
  ...fields({ title: "Which API for what", intro: "REST for whole pages, GraphQL for lists and filters." }),
  features: refs(["con-rest", "con-graphql"]),
});

await upsertEntry("page", "page-about", {
  ...fields({ title: "About", slug: "about", showInMenu: false, description: "What this project is and which Contentful features it uses." }),
  sections: refs(["hero-about", "grid-why", "cta-explore"]),
});
await upsertEntry("page", "page-concepts", {
  ...fields({ title: "Contentful concepts", slug: "concepts", showInMenu: true, menuOrder: 1, description: "Every Contentful feature used here." }),
  ...parentOf("page-about"),
  sections: refs(["hero-concepts", "grid-concepts"]),
});
await upsertEntry("page", "page-rest-graphql", {
  ...fields({ title: "REST vs GraphQL", slug: "rest-vs-graphql", showInMenu: true, menuOrder: 1, description: "Which API this project uses where." }),
  ...parentOf("page-concepts"),
  sections: refs(["hero-rest-graphql", "grid-apis"]),
});
await upsertEntry("page", "page-how", {
  ...fields({ title: "How it's built", slug: "how-its-built", menuLabel: "How it's built", showInMenu: true, menuOrder: 2, description: "The stack in one page." }),
  ...parentOf("page-about"),
  sections: refs(["hero-how", "grid-stack"]),
});
await upsertEntry("page", "page-help", {
  ...fields({ title: "Help", slug: "help", showInMenu: false, description: "Help centre." }),
  sections: refs(["hero-help", "grid-usp"]),
});
await upsertEntry("page", "page-shipping", {
  ...fields({ title: "Shipping & returns", slug: "shipping-returns", showInMenu: true, menuOrder: 1, description: "Delivery times and the returns policy." }),
  ...parentOf("page-help"),
  sections: refs(["hero-shipping", "grid-usp"]),
});
await upsertEntry("page", "page-contact", {
  ...fields({ title: "Contact", slug: "contact", showInMenu: true, menuOrder: 2, description: "How to reach us." }),
  ...parentOf("page-help"),
  sections: refs(["hero-contact", "cta-explore"]),
});

// ---------- links, menus, footer ----------
console.log("Links and menus...");
const links = [
  ["link-all", "All products", "/shop"],
  ["link-electronics", "Electronics", "/category/electronics"],
  ["link-home-living", "Home & Living", "/category/home-living"],
  ["link-fashion", "Fashion", "/category/fashion"],
  ["link-fitness", "Fitness", "/category/fitness"],
  ["link-basics", "Basics", "/articles?category=basics"],
  ["link-modeling", "Modeling", "/articles?category=modeling"],
  ["link-apis", "APIs", "/articles?category=apis"],
  ["link-deals", "Deals", "/shop?sale=1"],
  ["link-journal", "Journal", "/articles"],
  ["link-about", "About", "/about"],
  ["link-contact", "Contact", "/contact"],
  ["link-shipping", "Shipping & returns", "/shipping-returns"],
  ["link-search", "Search", "/search"],
  ["link-github", "GitHub", "https://github.com/avneekumar684"],
  ["link-x", "X", "https://x.com"],
  ["link-linkedin", "LinkedIn", "https://www.linkedin.com"],
];
for (const [id, label, url] of links) await upsertEntry("link", id, fields({ label, url }));

// Header "mega menu" panels and footer columns are both `linkGroup` entries.
await upsertEntry("linkGroup", "group-shop", {
  ...fields({ title: "Shop", url: "/shop", blurb: "Browse everything we sell, shelf by shelf." }),
  links: refs(["link-all", "link-electronics", "link-home-living", "link-fashion", "link-fitness"]),
  image: L(assetRef("img-promo-sale")),
});
await upsertEntry("linkGroup", "group-journal", {
  ...fields({ title: "Journal", url: "/articles", blurb: "Short lessons on how Contentful works." }),
  links: refs(["link-basics", "link-modeling", "link-apis"]),
  image: L(assetRef("img-promo-learn")),
});
await upsertEntry("linkGroup", "col-shop", {
  ...fields({ title: "Shop" }),
  links: refs(["link-all", "link-electronics", "link-home-living", "link-fashion", "link-fitness"]),
});
await upsertEntry("linkGroup", "col-company", {
  ...fields({ title: "Company" }),
  // Pages and custom links can be mixed. Pages keep the right URL even if their slug changes.
  links: refs(["page-about", "link-journal", "page-contact"]),
});
await upsertEntry("linkGroup", "col-help", {
  ...fields({ title: "Help" }),
  links: refs(["page-shipping", "page-contact", "link-search"]),
});

console.log("Site settings...");
await upsertEntry("siteSettings", "site-settings", {
  ...fields({
    siteName: "Avneesh's Contentful App",
    tagline: "A demo store and journal built with Contentful",
    announcement: "Free shipping over $50  ·  Demo store: nothing is really sold",
    supportText: "Help: support@example.com",
    footerText: "A practice project built with Contentful and Next.js.",
  }),
  // "page-about" is a PAGE, so its dropdown (Contentful concepts, How it's built) is filled in automatically.
  navigation: refs(["group-shop", "link-deals", "group-journal", "page-about"]),
  footerColumns: refs(["col-shop", "col-company", "col-help"]),
  socialLinks: refs(["link-github", "link-x", "link-linkedin"]),
});

console.log("Site done.");
