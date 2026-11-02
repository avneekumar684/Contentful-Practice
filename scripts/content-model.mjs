// The whole Contentful content model, written as plain data.
// `create-model.mjs` reads this file and creates/updates the content types in Contentful.
// Edit here + push to GitHub = the model in Contentful follows (content model as code).
//
// Two groups of content types:
//   1) Learning blog + generic page building blocks (link, article, page, hero, ...)
//   2) Store (productCategory, product, productGrid, categoryGrid, promoBanner, newsletter)

// ---------- tiny helpers so the definitions below stay readable ----------
const text = (id, name, extra = {}) => ({ id, name, type: "Symbol", required: false, ...extra });
const longText = (id, name, extra = {}) => ({ id, name, type: "Text", required: false, ...extra });
const number = (id, name, extra = {}) => ({ id, name, type: "Number", required: false, ...extra });
const integer = (id, name, extra = {}) => ({ id, name, type: "Integer", required: false, ...extra });
const bool = (id, name) => ({ id, name, type: "Boolean", required: false });
const image = (id, name) => ({ id, name, type: "Link", linkType: "Asset", required: false });
const entryLink = (id, name, types) => ({
  id,
  name,
  type: "Link",
  linkType: "Entry",
  required: false,
  validations: [{ linkContentType: types }],
});
const entryList = (id, name, types) => ({
  id,
  name,
  type: "Array",
  required: false,
  items: { type: "Link", linkType: "Entry", validations: [{ linkContentType: types }] },
});
const slug = () => text("slug", "Slug", { required: true, validations: [{ unique: true }] });

export const contentTypes = [
  // ============ shared pieces ============
  {
    id: "link",
    name: "Link",
    description: "A label + URL. Reused by menus, footer and buttons.",
    displayField: "label",
    fields: [text("label", "Label", { required: true }), text("url", "URL", { required: true })],
  },
  {
    id: "linkGroup",
    name: "Link group",
    description: "A titled list of links. Used as a mega-menu panel in the header and as a footer column.",
    displayField: "title",
    fields: [
      text("title", "Title", { required: true }),
      text("url", "Title link (optional)"),
      entryList("links", "Links (custom links or pages)", ["link", "page"]),
      longText("blurb", "Short text (mega menu)"),
      image("image", "Featured image (mega menu)"),
    ],
  },

  // ============ learning blog ============
  {
    id: "category",
    name: "Article category",
    description: "Groups blog articles (e.g. Basics, Modeling, APIs).",
    displayField: "name",
    fields: [text("name", "Name", { required: true }), slug(), longText("description", "Description")],
  },
  {
    id: "article",
    name: "Article",
    description: "A lesson or blog post. Has its own page at /articles/<slug>.",
    displayField: "title",
    fields: [
      text("title", "Title", { required: true }),
      slug(),
      longText("summary", "Summary", { required: true }),
      {
        id: "body",
        name: "Body",
        type: "RichText",
        required: true,
        validations: [
          { enabledMarks: ["bold", "italic", "underline", "code"] },
          {
            enabledNodeTypes: [
              "heading-2",
              "heading-3",
              "ordered-list",
              "unordered-list",
              "blockquote",
              "hr",
              "hyperlink",
            ],
          },
        ],
      },
      image("coverImage", "Cover image"),
      entryLink("category", "Category", ["category"]),
      { id: "publishedDate", name: "Published date", type: "Date", required: false },
    ],
  },

  // ============ store ============
  {
    id: "productCategory",
    name: "Product category",
    description: "A shelf in the shop (Electronics, Fashion, ...). Has its own page at /category/<slug>.",
    displayField: "name",
    fields: [
      text("name", "Name", { required: true }),
      slug(),
      longText("description", "Description"),
      image("image", "Image"),
    ],
  },
  {
    id: "product",
    name: "Product",
    description: "Something you can buy. Has its own page at /product/<slug>.",
    displayField: "name",
    fields: [
      text("name", "Name", { required: true }),
      slug(),
      text("sku", "SKU"),
      text("brand", "Brand"),
      number("price", "Price (USD)", { required: true }),
      number("compareAtPrice", "Compare-at price (shows a discount)"),
      longText("shortDescription", "Short description", { required: true }),
      {
        id: "description",
        name: "Description",
        type: "RichText",
        required: false,
        validations: [
          { enabledMarks: ["bold", "italic"] },
          { enabledNodeTypes: ["heading-3", "unordered-list", "ordered-list", "hyperlink"] },
        ],
      },
      { id: "images", name: "Images", type: "Array", required: false, items: { type: "Link", linkType: "Asset" } },
      entryLink("category", "Category", ["productCategory"]),
      { id: "tags", name: "Tags", type: "Array", required: false, items: { type: "Symbol" } },
      number("rating", "Rating (0-5)", { validations: [{ range: { min: 0, max: 5 } }] }),
      integer("reviewCount", "Number of reviews"),
      bool("inStock", "In stock"),
      bool("featured", "Featured on the homepage"),
      text("badge", "Badge (e.g. New, Sale)"),
    ],
  },

  // ============ page sections ============
  {
    id: "feature",
    name: "Feature",
    description: "One small card: icon (emoji), title and description.",
    displayField: "title",
    fields: [
      text("title", "Title", { required: true }),
      longText("description", "Description"),
      text("icon", "Icon (emoji)"),
    ],
  },
  {
    id: "hero",
    name: "Hero",
    description: "Big banner at the top of a page.",
    displayField: "heading",
    fields: [
      text("heading", "Heading", { required: true }),
      longText("subheading", "Subheading"),
      image("image", "Background image"),
      text("ctaLabel", "Button label"),
      text("ctaUrl", "Button URL"),
    ],
  },
  {
    id: "featureGrid",
    name: "Feature grid",
    description: "A titled grid of Feature cards.",
    displayField: "title",
    fields: [
      text("title", "Title", { required: true }),
      longText("intro", "Intro"),
      entryList("features", "Features", ["feature"]),
    ],
  },
  {
    id: "articleList",
    name: "Article list",
    description: "Shows the latest blog articles. They come from a live query, not from references.",
    displayField: "title",
    fields: [
      text("title", "Title", { required: true }),
      longText("intro", "Intro"),
      integer("count", "How many articles"),
    ],
  },
  {
    id: "ctaBanner",
    name: "Call to action banner",
    description: "A colored strip with a message and one button.",
    displayField: "heading",
    fields: [
      text("heading", "Heading", { required: true }),
      longText("text", "Text"),
      text("buttonLabel", "Button label"),
      text("buttonUrl", "Button URL"),
    ],
  },
  {
    id: "productGrid",
    name: "Product grid",
    description: "A row of products. Loaded with the GraphQL API (featured products, or one category).",
    displayField: "title",
    fields: [
      text("title", "Title", { required: true }),
      longText("intro", "Intro"),
      entryLink("category", "Only this category (optional)", ["productCategory"]),
      bool("onlyFeatured", "Only featured products"),
      integer("count", "How many products"),
      text("linkLabel", "Link label (e.g. Shop all)"),
      text("linkUrl", "Link URL"),
    ],
  },
  {
    id: "categoryGrid",
    name: "Category grid",
    description: "Big picture tiles that link to category pages.",
    displayField: "title",
    fields: [
      text("title", "Title", { required: true }),
      longText("intro", "Intro"),
      entryList("categories", "Categories", ["productCategory"]),
    ],
  },
  {
    id: "promoBanner",
    name: "Promo banner",
    description: "A wide sale/promotion strip with an image and a button.",
    displayField: "heading",
    fields: [
      text("heading", "Heading", { required: true }),
      longText("text", "Text"),
      image("image", "Image"),
      text("buttonLabel", "Button label"),
      text("buttonUrl", "Button URL"),
      text("theme", "Theme", { validations: [{ in: ["light", "dark"] }] }),
    ],
  },
  {
    id: "newsletter",
    name: "Newsletter signup",
    description: "Email box. (Demo: it does not store emails.)",
    displayField: "heading",
    fields: [
      text("heading", "Heading", { required: true }),
      longText("text", "Text"),
      text("buttonLabel", "Button label"),
    ],
  },

  // ============ pages + global settings ============
  {
    id: "page",
    name: "Page",
    description:
      "A page made of ordered sections. Pages form a tree: choose a Parent and the URL is built automatically (e.g. /about/how-its-built). The page with slug 'home' is the homepage.",
    displayField: "title",
    fields: [
      text("title", "Title", { required: true }),
      text("slug", "Slug", {
        required: true,
        validations: [
          { unique: true },
          {
            regexp: { pattern: "^[a-z0-9]+(?:-[a-z0-9]+)*$", flags: null },
            message: "Use lowercase letters, numbers and dashes only (e.g. how-its-built).",
          },
          {
            // These URLs are real routes in the code, so a page cannot use them as its slug.
            prohibitRegexp: { pattern: "^(shop|product|category|articles|search|cart|checkout|api)$", flags: null },
            message: "This word is used by the shop. Please choose another slug.",
          },
        ],
      }),
      entryLink("parent", "Parent page", ["page"]),
      bool("showInMenu", "Show in parent's dropdown menu"),
      integer("menuOrder", "Menu order (smaller number comes first)"),
      text("menuLabel", "Menu label (optional, defaults to the title)"),
      longText("description", "Description (SEO)"),
      entryList("sections", "Sections", [
        "hero",
        "featureGrid",
        "articleList",
        "ctaBanner",
        "productGrid",
        "categoryGrid",
        "promoBanner",
        "newsletter",
      ]),
    ],
  },
  {
    id: "siteSettings",
    name: "Site settings",
    description: "Global settings: header, mega menu, footer. Create exactly one.",
    displayField: "siteName",
    fields: [
      text("siteName", "Site name", { required: true }),
      text("tagline", "Tagline"),
      text("announcement", "Announcement bar text"),
      text("supportText", "Support text (top bar, right side)"),
      entryList("navigation", "Header navigation (pages, links, groups)", ["link", "linkGroup", "page"]),
      entryList("footerColumns", "Footer columns", ["linkGroup"]),
      // Older, simpler footer from the first version of the site. Kept so existing data stays valid.
      entryList("footerLinks", "Footer links (legacy)", ["link"]),
      entryList("socialLinks", "Social links", ["link"]),
      text("footerText", "Footer text"),
    ],
  },
];

// Help texts and nicer input widgets shown to authors in the Contentful editor.
// (The slug widget fills the slug from another field while you type, e.g. the title.)
export const editorHints = {
  page: {
    title: { help: "The name of the page. Shown in the browser tab, in search results and as the default menu label." },
    slug: {
      widget: "slugEditor",
      track: "title",
      help: "Last part of the URL, built from the title. The full URL also includes the parent pages, e.g. /about/how-its-built.",
    },
    parent: { help: "Leave EMPTY for a top-level page (directly under Home). Pick a page to put this one below it." },
    showInMenu: { help: "Tick to list this page in the dropdown of its parent page when that parent is in the header menu." },
    menuOrder: { help: "Smaller numbers come first in the dropdown. Leave empty to sort by title." },
    menuLabel: { help: "Optional. A shorter name for menus. Leave empty to use the title." },
    sections: { help: "The blocks of the page, top to bottom. Drag to reorder." },
  },
  article: { slug: { widget: "slugEditor", track: "title" } },
  category: { slug: { widget: "slugEditor", track: "name" } },
  productCategory: { slug: { widget: "slugEditor", track: "name" } },
  product: { slug: { widget: "slugEditor", track: "name" } },
  siteSettings: {
    navigation: {
      help: "Add Pages here and their URL and dropdown children (child pages) appear automatically. You can also add custom links or mega-menu groups.",
    },
  },
  linkGroup: { links: { help: "Pick pages (URLs stay correct if a slug changes) or custom links (for outside URLs)." } },
};
