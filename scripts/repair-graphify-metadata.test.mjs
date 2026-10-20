import test from 'node:test';
import assert from 'node:assert/strict';
import { chooseTaxonomy, missingFields } from './repair-graphify-metadata.mjs';
const category = { _id: 'category1', slug: 'developer-tools' };
const tag = { _id: 'tag1', slug: 'coding' };
test('uses only existing category and tag references', () => {
  assert.deepEqual(chooseTaxonomy([category], [tag]), { category, tags: [tag] });
  assert.throws(() => chooseTaxonomy([], [tag]));
  assert.throws(() => chooseTaxonomy([category], []));
});
test('fills empty metadata without touching the article or existing references', () => {
  const taxonomy = { category, tags: [tag] };
  const image = { _id: 'image-abc-900x500-png' };
  const set = missingFields({ categories: [], tags: [] }, taxonomy, image);
  assert.deepEqual(Object.keys(set), ['categories', 'tags', 'image']);
  assert.equal(set.categories[0]._ref, category._id);
  assert.equal(set.tags[0]._ref, tag._id);
  assert.equal(set.image.asset._ref, image._id);
  assert.deepEqual(missingFields({ categories: [{ _ref: 'human' }], tags: [{ _ref: 'human' }], image: { asset: { _ref: 'human' } } }, taxonomy), {});
});
