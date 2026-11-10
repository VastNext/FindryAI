import assert from "node:assert/strict";
import test from "node:test";
import { guard, imagePatch, validate } from "./repair-recent-covers.mjs";
const task = {
  id: "keyword.item.example",
  slug: "example",
  expectedLink: "https://example.com/",
  expectedRevision: "rev-old",
  expectedAsset: "image-old-2560x1600-png",
  cover: { alt: "Official website" },
};
const doc = {
  _id: task.id,
  _type: "item",
  _rev: "rev-old",
  slug: "example",
  link: task.expectedLink,
  publishDate: "2026-11-08T14:00:00Z",
  asset: task.expectedAsset,
  alt: "Old",
  introduction: "Keep manual copy",
};
test("revision and existing asset guard concurrent edits", () => {
  assert.equal(guard(doc, task, "new"), "patch");
  for (const update of [
    { _rev: "manual-edit" },
    { asset: "manual-cover" },
    { slug: "other" },
    { link: "https://elsewhere.com/" },
    { publishDate: "2026-10-01T00:00:00Z" },
  ])
    assert.throws(() => guard({ ...doc, ...update }, task, "new"));
});
test("reruns preserve a completed exact asset/alt repair", () =>
  assert.equal(
    guard(
      { ...doc, _rev: "after", asset: "new", alt: task.cover.alt },
      task,
      "new",
    ),
    "done",
  ));
test("mutation only replaces image and requires the current revision", () => {
  const patch = imagePatch(doc, task.cover, "new");
  assert.deepEqual(Object.keys(patch.set), ["image"]);
  assert.equal(patch.ifRevisionID, "rev-old");
  assert.equal(doc.introduction, "Keep manual copy");
});
test("manifest bounds reject arbitrary dates and privileged operations", () => {
  const m = {
    version: 1,
    from: "2026-10-31T16:00:00Z",
    until: "2026-11-10T16:00:00Z",
    replacements: [],
  };
  assert.equal(validate(m), m);
  assert.throws(() => validate({ ...m, from: "2020-01-01T00:00:00Z" }));
  assert.throws(() => validate({ ...m, token: "not-allowed" }));
  assert.throws(() =>
    validate({
      ...m,
      replacements: [{ ...task, link: "https://elsewhere.com" }],
    }),
  );
});
