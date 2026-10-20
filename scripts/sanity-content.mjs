import { appendFileSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';

const site = 'https://findryai.com';
const keys = ['NEXT_PUBLIC_SANITY_PROJECT_ID', 'NEXT_PUBLIC_SANITY_DATASET',
  'SANITY_API_TOKEN', 'REVALIDATE_SECRET', 'AUTH_SECRET'];
const manifestPattern = /^content\/publish\/[a-zA-Z0-9_-]+\.json$/;

function report(message) {
  console.log(message);
  if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${message}\n`);
}

function mask(value) {
  if (process.env.GITHUB_ACTIONS && value) console.log(`::add-mask::${value.replaceAll('%', '%25').replaceAll('\r', '%0D').replaceAll('\n', '%0A')}`);
}

async function request(url, options = {}) {
  let response;
  try {
    response = await fetch(url, { ...options, redirect: 'error', signal: AbortSignal.timeout(30000) });
  } catch {
    throw new Error('Remote request failed (URL and credentials omitted).');
  }
  if (!response.ok) throw new Error(`Remote request returned HTTP ${response.status} (body omitted).`);
  try { return await response.json(); } catch { throw new Error('Remote response was not valid JSON.'); }
}

export async function credentials(env = process.env) {
  const config = Object.fromEntries(keys.map(key => [key, env[key] || '']));
  for (const value of Object.values(config)) mask(value);
  if (keys.some(key => !config[key]) && env.VERCEL_TOKEN && env.VERCEL_PROJECT_ID) {
    const project = encodeURIComponent(env.VERCEL_PROJECT_ID);
    const vercel = async path => {
      const url = new URL(path, 'https://api.vercel.com');
      if (env.VERCEL_ORG_ID) url.searchParams.set('teamId', env.VERCEL_ORG_ID);
      return request(url, { headers: { Authorization: `Bearer ${env.VERCEL_TOKEN}` } });
    };
    try {
      const list = await vercel(`/v10/projects/${project}/env?decrypt=false`);
      for (const key of keys) {
        if (config[key]) continue;
        const candidates = (list.envs || []).filter(entry => entry.key === key &&
          entry.target?.includes('production') && !entry.gitBranch);
        if (candidates.length !== 1) continue;
        const entry = candidates[0];
        if (entry.type === 'sensitive') {
          report(`${key}: exists in Vercel but is Sensitive; add it to GitHub Actions Secrets to use this runner.`);
          continue;
        }
        const result = await vercel(`/v1/projects/${project}/env/${encodeURIComponent(entry.id)}`);
        if (typeof result.value === 'string' && result.value) {
          config[key] = result.value;
          mask(result.value);
        }
      }
    } catch {
      report('Vercel configuration lookup unavailable; checking GitHub-injected variables only.');
    }
  }
  const missing = keys.slice(0, 3).filter(key => !config[key]);
  if (missing.length) throw new Error(`Missing usable configuration: ${missing.join(', ')}. Configure repository Actions Secrets/Variables; never commit values.`);
  if (!/^[a-z0-9]+$/.test(config.NEXT_PUBLIC_SANITY_PROJECT_ID) ||
      !/^[a-z0-9_-]+$/.test(config.NEXT_PUBLIC_SANITY_DATASET)) throw new Error('Invalid Sanity project/dataset format.');
  report('Sanity configuration is available. Secret values are not logged.');
  return config;
}

export function validateManifest(input) {
  if (input.version !== 1 || !Array.isArray(input.documents) || input.documents.length < 1 || input.documents.length > 3) {
    throw new Error('Manifest must contain version 1 and 1–3 documents.');
  }
  const seen = new Set();
  return input.documents.map(doc => {
    const slug = doc.slug?.current;
    if (!['item', 'blogPost'].includes(doc._type) || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug || '') || slug.length > 96) throw new Error('Invalid document type or slug.');
    const id = `keyword.${doc._type}.${slug}`;
    if (seen.has(id)) throw new Error('Duplicate document in manifest.');
    seen.add(id);
    const allowed = doc._type === 'item'
      ? ['_type', 'slug', 'name', 'link', 'description', 'introduction', 'categories', 'tags', 'image', 'icon']
      : ['_type', 'slug', 'title', 'excerpt', 'body', 'categories', 'author', 'image'];
    if (Object.keys(doc).some(key => !allowed.includes(key))) throw new Error('Unsupported document fields.');
    if (doc._type === 'item') {
      if (!doc.name?.trim() || !doc.description?.trim() || !doc.introduction?.trim()) throw new Error('Item content is incomplete.');
      const url = new URL(doc.link);
      if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) throw new Error('Invalid item link.');
    } else if (!doc.title?.trim() || !doc.excerpt?.trim() || !doc.body?.length || !doc.author?._ref) throw new Error('Blog content or author is missing.');
    return { ...doc, _id: id, publishDate: new Date().toISOString(), ...(doc._type === 'item'
      ? { pricePlan: 'free', freePlanStatus: 'approved', forceHidden: false, featured: false } : { featured: false }) };
  });
}

export async function publish(config, documents) {
  const base = `https://${config.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2024-08-01/data`;
  const dataset = encodeURIComponent(config.NEXT_PUBLIC_SANITY_DATASET);
  const headers = { Authorization: `Bearer ${config.SANITY_API_TOKEN}`, 'Content-Type': 'application/json' };
  const query = async (q, params = {}) => {
    const url = new URL(`${base}/query/${dataset}`);
    url.searchParams.set('query', q);
    for (const [key, value] of Object.entries(params)) url.searchParams.set(`$${key}`, JSON.stringify(value));
    return (await request(url, { headers })).result;
  };
  await query('count(*[_type == "item"])');
  report('Sanity authenticated read succeeded.');
  if (!documents.length) return;
  // Resolve cache authorization before any mutation, using the same precedence as the site.
  const secret = config.REVALIDATE_SECRET || config.AUTH_SECRET || config.SANITY_API_TOKEN;
  async function refresh(path) {
    const url = new URL('/api/revalidate', site);
    url.searchParams.set('secret', secret);
    url.searchParams.set('path', path);
    const result = await request(url, { method: 'POST' });
    if (result.revalidated !== true) throw new Error('Cache refresh was not confirmed.');
  }
  await refresh('/');
  const published = [];
  for (const doc of documents) {
    const existing = await query('*[_type == $type && (slug.current == $slug || _id == $id || _id == $draft || (defined($link) && link == $link))]{_id}',
      { type: doc._type, slug: doc.slug.current, id: doc._id, draft: `drafts.${doc._id}`, link: doc.link || null });
    if (existing.length && !existing.some(entry => entry._id === doc._id)) {
      report(`Skipped existing coverage: ${doc._type}/${doc.slug.current}`);
      continue;
    }
    if (!existing.length) {
      await request(`${base}/mutate/${dataset}?returnIds=true`, {
        method: 'POST', headers, body: JSON.stringify({ mutations: [{ createIfNotExists: doc }] }),
      });
      report(`Created Sanity document: ${doc._id}`);
    } else report(`Already created; verifying and refreshing: ${doc._id}`);
    const verify = await query('*[_id == $id][0]{_id,publishDate}', { id: doc._id });
    if (!verify?.publishDate) throw new Error(`Published document verification failed: ${doc._id}`);
    published.push(`/${doc._type === 'item' ? 'item' : 'blog'}/${doc.slug.current}`);
  }
  for (const path of new Set(['/', '/blog', ...published])) await refresh(path);
  for (const path of published) {
    let response;
    try { response = await fetch(`${site}${path}`, { redirect: 'follow', signal: AbortSignal.timeout(30000) }); }
    catch { throw new Error('Content exists in Sanity; online visibility could not be checked.'); }
    report(`${site}${path}: HTTP ${response.status}`);
    if (!response.ok) throw new Error('Content exists in Sanity; online visibility check failed. Rerun to retry refresh.');
  }
}

async function main() {
  let paths = [];
  if (process.env.CONTENT_MANIFEST) paths = [process.env.CONTENT_MANIFEST];
  else if (process.env.BEFORE_SHA && !/^0+$/.test(process.env.BEFORE_SHA)) {
    const before = process.env.BEFORE_SHA, after = process.env.AFTER_SHA;
    if (![before, after].every(sha => /^[a-f0-9]{40}$/.test(sha || ''))) throw new Error('Invalid commit range.');
    paths = execFileSync('git', ['diff', '--name-only', '--diff-filter=AM', before, after, '--', 'content/publish/'], { encoding: 'utf8' }).trim().split('\n').filter(Boolean);
  }
  const documents = [];
  for (const path of paths) {
    if (!manifestPattern.test(path)) throw new Error('Only content/publish/*.json manifests are accepted.');
    const raw = readFileSync(path, 'utf8');
    if (raw.length > 200000) throw new Error('Manifest exceeds 200 KB.');
    documents.push(...validateManifest(JSON.parse(raw)));
    report(`Validated manifest ${path}; SHA256 ${createHash('sha256').update(raw).digest('hex')}`);
  }
  if (documents.length > 3) throw new Error('At most 3 documents may be published per run.');
  const config = await credentials();
  await publish(config, documents);
  report(documents.length ? 'Content publication run completed; no deployment or tag was requested.' : 'Read-only Sanity preflight completed; no content was written.');
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch(error => { report(`FAILED: ${error.message}`); process.exitCode = 1; });
}
