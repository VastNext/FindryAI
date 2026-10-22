import { credentials } from './sanity-content.mjs';
import { appendFileSync } from 'node:fs';

const targetId = 'keyword.item.graphify';
const sourceImage = 'https://raw.githubusercontent.com/Graphify-Labs/graphify/v8/docs/graph-hero.png';
const site = 'https://findryai.com';
function report(message) {
  console.log(message);
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, message + '\n');
}
async function response(url, options = {}) {
  let res;
  try { res = await fetch(url, { ...options, redirect: 'error', signal: AbortSignal.timeout(30000) }); }
  catch { throw new Error('Network request failed; credentials and URL omitted.'); }
  if (!res.ok) throw new Error('Remote HTTP ' + res.status + '; response body omitted.');
  return res;
}
export function chooseTaxonomy(categories, tags) {
  const category = categories.find(x => x.slug === 'developer-tools');
  const preferred = ['developer-tools', 'coding', 'code-assistant', 'code-assistants', 'programming', 'knowledge-graph', 'knowledge-graphs', 'open-source'];
  const chosen = preferred.map(slug => tags.find(x => x.slug === slug)).filter(Boolean).slice(0, 3);
  if (!category) throw new Error('developer-tools category not found; inspect taxonomy summary.');
  if (!chosen.length) throw new Error('No matching existing developer tags; inspect taxonomy summary.');
  return { category, tags: chosen };
}
export function missingFields(doc, taxonomy, image) {
  const set = {};
  const reference = (ref, key) => ({ _type: 'reference', _ref: ref, _key: key });
  if (!doc.categories?.length) set.categories = [reference(taxonomy.category._id, 'graphify-developer-tools')];
  if (!doc.tags?.length) set.tags = taxonomy.tags.map((tag, i) => reference(tag._id, 'graphify-tag-' + i));
  if (!doc.image?.asset?._ref) {
    if (!image?._id) throw new Error('Missing image asset.');
    set.image = { _type: 'image', asset: { _type: 'reference', _ref: image._id },
      alt: 'Official Graphify visualization of the FastAPI codebase knowledge graph' };
  }
  return set;
}
async function main() {
  const c = await credentials();
  const root = 'https://' + c.NEXT_PUBLIC_SANITY_PROJECT_ID + '.api.sanity.io/v2024-08-01';
  const dataset = encodeURIComponent(c.NEXT_PUBLIC_SANITY_DATASET);
  const auth = { Authorization: 'Bearer ' + c.SANITY_API_TOKEN };
  async function query(q) {
    const url = new URL(root + '/data/query/' + dataset);
    url.searchParams.set('query', q);
    return (await (await response(url, { headers: auth })).json()).result;
  }
  async function getTarget() {
    return query('*[_id == "keyword.item.graphify" && _type == "item"][0]{_id,_rev,name,link,slug,categories,tags,image}');
  }
  const doc = await getTarget();
  if (!doc || doc.slug?.current !== 'graphify' || new URL(doc.link).hostname !== 'graphify.com') throw new Error('Target identity verification failed.');
  const categories = await query('*[_type == "category" && !(_id in path("drafts.**"))]{_id,name,"slug":slug.current}');
  const tags = await query('*[_type == "tag" && !(_id in path("drafts.**"))]{_id,name,"slug":slug.current}');
  report('Existing public categories: ' + JSON.stringify(categories.map(x => ({ name: x.name, slug: x.slug }))));
  report('Existing public tags: ' + JSON.stringify(tags.map(x => ({ name: x.name, slug: x.slug }))));
  const taxonomy = chooseTaxonomy(categories, tags);
  const secret = c.REVALIDATE_SECRET || c.AUTH_SECRET || c.SANITY_API_TOKEN;
  async function refresh(path) {
    const url = new URL('/api/revalidate', site);
    url.searchParams.set('secret', secret);
    url.searchParams.set('path', path);
    const result = await (await response(url, { method: 'POST' })).json();
    if (result.revalidated !== true) throw new Error('Cache refresh not confirmed.');
  }
  await refresh('/');
  let image;
  if (!doc.image?.asset?._ref) {
    const file = await response(sourceImage);
    const bytes = Buffer.from(await file.arrayBuffer());
    if (bytes.length > 10000000 || !bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) throw new Error('Official image is not a supported bounded PNG.');
    const upload = await (await response(root + '/assets/images/' + dataset + '?filename=graphify-official-codebase-graph.png', {
      method: 'POST', headers: { ...auth, 'Content-Type': 'image/png' }, body: bytes
    })).json();
    image = upload.document;
    if (!image?._id?.startsWith('image-')) throw new Error('Sanity image upload was not confirmed.');
    report('Official screenshot uploaded to Sanity: ' + image._id);
  }
  const set = missingFields(doc, taxonomy, image);
  if (Object.keys(set).length) {
    await response(root + '/data/mutate/' + dataset, { method: 'POST', headers: { ...auth, 'Content-Type': 'application/json' },
      body: JSON.stringify({ mutations: [{ patch: { id: targetId, ifRevisionID: doc._rev, set } }] }) });
    report('Filled missing Graphify fields: ' + Object.keys(set).join(', '));
  } else report('Graphify already complete; no CMS fields overwritten.');
  const verified = await query('*[_id == "keyword.item.graphify"][0]{_id,"categories":categories[]->{name,"slug":slug.current},"tags":tags[]->{name,"slug":slug.current},"imageAlt":image.alt}');
  const asset = await query('*[_id == "keyword.item.graphify"][0].image.asset->{_id,url,metadata{dimensions}}');
  if (!verified?.categories?.length || !verified?.tags?.length || !asset?.url) throw new Error('CMS verification failed.');
  report('Verified category: ' + verified.categories.map(x => x.slug).join(', '));
  report('Verified tags: ' + verified.tags.map(x => x.slug).join(', '));
  report('Verified cover dimensions: ' + JSON.stringify(asset.metadata?.dimensions));
  const paths = ['/', '/item/graphify', ...verified.categories.map(x => '/category/' + x.slug), ...verified.tags.map(x => '/tag/' + x.slug)];
  for (const path of paths) await refresh(path);
  const hash = asset._id.split('-')[1];
  let html = '';
  for (let attempt = 0; attempt < 4; attempt++) {
    const page = await response(site + '/item/graphify', { headers: { 'Cache-Control': 'no-cache' } });
    html = await page.text();
    report('Live detail check ' + (attempt + 1) + ': ' + JSON.stringify({
      title: html.match(/<title>([^<]*)<\/title>/)?.[1],
      hasName: html.includes('Graphify'), hasCover: html.includes(hash),
      cfCache: page.headers.get('cf-cache-status'), vercelCache: page.headers.get('x-vercel-cache'),
      imageMeta: (html.match(/<meta[^>]*(?:property|name)="og:image"[^>]*>/g) || []).slice(0, 2)
    }));
    if (html.includes('Graphify') && html.includes(hash)) break;
    if (attempt < 3) await new Promise(resolve => setTimeout(resolve, 5000));
  }
  if (!html.includes('Graphify') || !html.includes(hash)) throw new Error('Live detail page does not contain the expected image.');
  const og = html.match(/<meta[^>]*(?:property|name)="og:image"[^>]*>/g) || [];
  if (!og.some(meta => meta.includes(hash))) throw new Error('Live Open Graph image does not point to the uploaded cover.');
  const imgUrl = asset.url;
  await response(imgUrl);
  report('Live detail image and og:image verified; Sanity CDN image HTTP 200.');
  const categoryPath = '/category/' + taxonomy.category.slug;
  const categoryHtml = await (await response(site + categoryPath)).text();
  if (!categoryHtml.includes('/item/graphify')) throw new Error('Graphify is not visible in the category list response.');
  report('Live category list includes /item/graphify: ' + categoryPath);
  report('Graphify metadata repair completed without a release tag or site deployment.');
}
if (process.argv[1]?.endsWith('/repair-graphify-metadata.mjs')) main().catch(error => { report('FAILED: ' + error.message); process.exitCode = 1; });
