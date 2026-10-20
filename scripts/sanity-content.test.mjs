import test from 'node:test';
import assert from 'node:assert/strict';
import { credentials, publish, validateManifest } from './sanity-content.mjs';

const config = { NEXT_PUBLIC_SANITY_PROJECT_ID: 'example1', NEXT_PUBLIC_SANITY_DATASET: 'production', SANITY_API_TOKEN: 'test-secret', REVALIDATE_SECRET: 'refresh-secret' };
const item = { _type: 'item', name: 'Example', slug: { current: 'example-tool' }, link: 'https://example.com', description: 'Description', introduction: 'Verified content.' };
const manifest = documents => ({ version: 1, documents });
const json = data => new Response(JSON.stringify(data), { status: 200 });

test('validates before publishing and rejects unrelated document types and privileged fields', () => {
  assert.equal(validateManifest(manifest([item]))[0]._id, 'keyword.item.example-tool');
  for (const doc of [{ ...item, _type: 'user' }, { ...item, paid: true }, { ...item, link: 'javascript:alert(1)' }]) {
    assert.throws(() => validateManifest(manifest([doc])));
  }
  assert.throws(() => validateManifest(manifest([item, item])));
  assert.throws(() => validateManifest(manifest([{ _type: 'blogPost', title: 'Post', slug: { current: 'post' } }])));
});

test('credential absence produces variable names without secret values', async () => {
  await assert.rejects(credentials({ SANITY_API_TOKEN: 'hidden-value' }), error => {
    assert.match(error.message, /NEXT_PUBLIC_SANITY_PROJECT_ID/);
    assert.ok(!error.message.includes('hidden-value'));
    return true;
  });
});

test('preflight reads only; refresh rejection prevents all Sanity writes', async () => {
  const original = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push(String(url));
    if (String(url).includes('/query/')) return json({ result: 0 });
    return new Response('{}', { status: 401 });
  };
  try {
    await publish(config, []);
    assert.equal(calls.length, 1);
    await assert.rejects(publish(config, validateManifest(manifest([item]))), /HTTP 401/);
    assert.ok(!calls.some(url => url.includes('/mutate/')));
  } finally { globalThis.fetch = original; }
});

test('reruns do not overwrite existing content; retry refresh after partial success', async () => {
  const original = globalThis.fetch;
  const calls = [];
  let created = false;
  globalThis.fetch = async (url, options = {}) => {
    calls.push([String(url), options]);
    const u = new URL(url);
    if (u.pathname.includes('/mutate/')) {
      assert.equal(JSON.parse(options.body).mutations[0].createIfNotExists._id, 'keyword.item.example-tool');
      created = true;
      return json({ results: [{ id: 'keyword.item.example-tool' }] });
    }
    if (u.pathname.includes('/query/')) {
      const query = u.searchParams.get('query');
      if (query.startsWith('count')) return json({ result: 0 });
      if (query.includes('publishDate')) return json({ result: { _id: 'keyword.item.example-tool', publishDate: '2026-10-20T14:00:00Z' } });
      return json({ result: created ? [{ _id: 'keyword.item.example-tool' }] : [] });
    }
    return json({ revalidated: true });
  };
  try {
    const docs = validateManifest(manifest([item]));
    await publish(config, docs);
    await publish(config, docs);
    assert.equal(calls.filter(([url]) => url.includes('/mutate/')).length, 1);
    assert.ok(calls.some(([url]) => url === 'https://findryai.com/item/example-tool'));
  } finally { globalThis.fetch = original; }
});

test('Vercel lookup reads only allowlisted production variables and skips Sensitive values', async () => {
  const original = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async url => {
    calls.push(String(url));
    if (String(url).includes('decrypt=false')) return json({ envs: [
      { key: 'NEXT_PUBLIC_SANITY_PROJECT_ID', id: 'project', target: ['production'], type: 'plain' },
      { key: 'NEXT_PUBLIC_SANITY_DATASET', id: 'dataset', target: ['production'], type: 'plain' },
      { key: 'SANITY_API_TOKEN', id: 'token', target: ['production'], type: 'sensitive' },
      { key: 'STRIPE_API_KEY', id: 'unrelated', target: ['production'], type: 'encrypted' },
    ] });
    return json({ value: String(url).includes('/project?') ? 'example1' : 'production' });
  };
  try {
    await assert.rejects(credentials({ VERCEL_TOKEN: 'vercel-test', VERCEL_PROJECT_ID: 'test', VERCEL_ORG_ID: 'test-team' }), /SANITY_API_TOKEN/);
    assert.ok(!calls.some(url => /\/token\?|\/unrelated\?/.test(url)));
    assert.equal(calls.length, 3);
  } finally { globalThis.fetch = original; }
});
