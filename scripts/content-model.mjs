// The whole Contentful content model, written as plain data.
// `create-model.mjs` reads this file and creates/updates the content types in Contentful.
// Edit here + push to GitHub = the model in Contentful follows (content model as code).

const text = (id, name, extra = {}) => ({ id, name, type: "Symbol", required: false, ...extra });
const longText = (id, name, extra = {}) => ({ id, name, type: "Text", required: false, ...extra });
const entryLink = (id, name, types, extra = {}) => ({
  id,
  name,
  type: "Link",
  linkType: "Entry",
  required: false,
  validations: [{ linkContentType: types }],
  ...extra,
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
  {
    id: "link",
    name: "Link",
    description: "A label + URL. Reused by navigation, footer and buttons.",
    displayField: "label",
    fields: [text("label", "Label", { required: true }), text("url", "URL", { required: true })],
  },
  {
    id: "category",
    name: "Category",
    description: "Groups articles (e.g. Basics, Modeling, APIs).",
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
      { id: "coverImage", name: "Cover image", type: "Link", linkType: "Asset", required: false },
      entryLink("category", "Category", ["category"]),
      { id: "publishedDate", name: "Published date", type: "Date", required: false },
    ],
  },
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
      { id: "image", name: "Background image", type: "Link", linkType: "Asset", required: false },
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
    description: "Shows the latest articles. The articles come from a live query, not from references.",
    displayField: "title",
    fields: [
      text("title", "Title", { required: true }),
      longText("intro", "Intro"),
      { id: "count", name: "How many articles", type: "Integer", required: false },
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
    id: "page",
    name: "Page",
    description: "A page made of ordered sections. Lives at /<slug> (slug 'home' is the homepage).",
    displayField: "title",
    fields: [
      text("title", "Title", { required: true }),
      slug(),
      longText("description", "Description (SEO)"),
      entryList("sections", "Sections", ["hero", "featureGrid", "articleList", "ctaBanner"]),
    ],
  },
  {
    id: "siteSettings",
    name: "Site settings",
    description: "Global settings: site name, header navigation and footer. Create exactly one.",
    displayField: "siteName",
    fields: [
      text("siteName", "Site name", { required: true }),
      text("tagline", "Tagline"),
      entryList("navigation", "Header navigation", ["link"]),
      text("footerText", "Footer text"),
      entryList("footerLinks", "Footer links", ["link"]),
    ],
  },
];
