// Usage: npm run model
// Creates (or updates) every content type from content-model.mjs, publishes it,
// then applies the author-friendly help texts and widgets (editorHints).
// Safe to run again: existing types are updated instead of duplicated.
import { cma, scope, spaceId, isNotFound } from "./client.mjs";
import { contentTypes, editorHints } from "./content-model.mjs";

console.log(`Syncing ${contentTypes.length} content types to space ${spaceId}...`);

for (const { id, ...definition } of contentTypes) {
  const params = { ...scope, contentTypeId: id };
  let existing = null;
  try {
    existing = await cma.contentType.get(params);
  } catch (err) {
    if (!isNotFound(err)) throw err;
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

// The "editor interface" decides how each field looks in the Contentful editor.
console.log("Applying editor help texts and widgets...");
for (const [contentTypeId, fieldHints] of Object.entries(editorHints)) {
  const params = { ...scope, contentTypeId };
  const editorInterface = await cma.editorInterface.get(params);

  editorInterface.controls = editorInterface.controls.map((control) => {
    const hint = fieldHints[control.fieldId];
    if (!hint) return control;
    return {
      ...control,
      ...(hint.widget ? { widgetNamespace: "builtin", widgetId: hint.widget } : {}),
      settings: {
        ...control.settings,
        ...(hint.help ? { helpText: hint.help } : {}),
        ...(hint.track ? { trackingFieldId: hint.track } : {}),
      },
    };
  });

  await cma.editorInterface.update(params, editorInterface);
  console.log(`  hints   ${contentTypeId}`);
}

console.log("Done.");
