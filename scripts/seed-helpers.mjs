// Small building blocks shared by the seed scripts:
// create-or-update + publish for entries and assets, and a few rich-text builders.
import sharp from "sharp";
import { cma, scope, spaceId, isNotFound } from "./client.mjs";

const LOCALE = "en-US";

// Contentful stores every field per locale: { "en-US": value }. These helpers hide that noise.
export const L = (value) => ({ [LOCALE]: value });
export const fields = (obj) =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined).map(([k, v]) => [k, L(v)]));
export const entryRef = (id) => ({ sys: { type: "Link", linkType: "Entry", id } });
export const assetRef = (id) => ({ sys: { type: "Link", linkType: "Asset", id } });

// Create the entry with a fixed ID (or update it if it exists), then publish it.
// Fixed IDs are what make the seed scripts safe to run many times.
export async function upsertEntry(contentTypeId, entryId, data) {
  const params = { ...scope, entryId };
  let entry;
  try {
    const existing = await cma.entry.get(params);
    entry = await cma.entry.update(params, { ...existing, fields: data });
  } catch (err) {
    if (!isNotFound(err)) throw err;
    entry = await cma.entry.createWithId({ ...scope, contentTypeId, entryId }, { fields: data });
  }
  await cma.entry.publish(params, entry);
  console.log(`  entry  ${contentTypeId}/${entryId}`);
  return entryId;
}

// Upload a JPEG buffer as an asset, wait for Contentful to process it, then publish it.
export async function upsertAsset(assetId, title, buffer) {
  const params = { ...scope, assetId };
  try {
    const existing = await cma.asset.get(params);
    if (existing.sys.publishedVersion) return assetId; // already there and live
  } catch (err) {
    if (!isNotFound(err)) throw err;
    const upload = await cma.upload.create({ spaceId }, { file: buffer });
    await cma.asset.createWithId(params, {
      fields: {
        title: L(title),
        description: L(title),
        file: L({
          fileName: `${assetId}.jpg`,
          contentType: "image/jpeg",
          uploadFrom: { sys: { type: "Link", linkType: "Upload", id: upload.sys.id } },
        }),
      },
    });
  }
  const created = await cma.asset.get(params);
  const processed = await cma.asset.processForAllLocales(scope, created, { processingCheckWait: 1000 });
  await cma.asset.publish(params, processed);
  console.log(`  asset  ${assetId}`);
  return assetId;
}

// Turn SVG text into a JPEG and upload it.
export async function uploadSvg(assetId, title, svg) {
  const jpg = await sharp(Buffer.from(svg)).jpeg({ quality: 85 }).toBuffer();
  return upsertAsset(assetId, title, jpg);
}

// ---------- rich text builders ----------
// Rich text in Contentful is a JSON tree. These functions build small pieces of it.
export const t = (value, marks = []) => ({ nodeType: "text", value, marks: marks.map((type) => ({ type })), data: {} });
export const p = (...children) => ({
  nodeType: "paragraph",
  data: {},
  content: children.map((c) => (typeof c === "string" ? t(c) : c)),
});
export const h2 = (value) => ({ nodeType: "heading-2", data: {}, content: [t(value)] });
export const h3 = (value) => ({ nodeType: "heading-3", data: {}, content: [t(value)] });
export const ul = (...items) => ({
  nodeType: "unordered-list",
  data: {},
  content: items.map((item) => ({ nodeType: "list-item", data: {}, content: [p(item)] })),
});
export const quote = (value) => ({ nodeType: "blockquote", data: {}, content: [p(value)] });
export const doc = (...content) => ({ nodeType: "document", data: {}, content });
