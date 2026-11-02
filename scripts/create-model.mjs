// Usage: npm run model
// Creates (or updates) every content type from content-model.mjs and publishes it.
// Safe to run again: existing types are updated instead of duplicated.
import { cma, scope, spaceId } from "./client.mjs";
import { contentTypes } from "./content-model.mjs";

console.log(`Syncing ${contentTypes.length} content types to space ${spaceId}...`);

for (const { id, ...definition } of contentTypes) {
  const params = { ...scope, contentTypeId: id };
  let existing = null;
  try {
    existing = await cma.contentType.get(params);
  } catch (err) {
    if (!String(err.message).includes("NotFound")) throw err;
  }

  // Reference validations point at other types, so every type is created first
  // and all of them are published afterwards (see below).
  const saved = existing
    ? await cma.contentType.update(params, { ...existing, ...definition })
    : await cma.contentType.createWithId(params, definition);

  console.log(`${existing ? "updated" : "created"}  ${id}`);
  contentTypes.find((t) => t.id === id).saved = saved;
}

for (const { id, saved } of contentTypes) {
  await cma.contentType.publish({ ...scope, contentTypeId: id }, saved);
  console.log(`published ${id}`);
}

console.log("Done.");
