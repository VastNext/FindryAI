import { createHash } from "node:crypto";
import { appendFileSync, readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { credentials, reviewedCoverBytes } from "./sanity-content.mjs";

const manifestPath = "content/maintenance/20261110-official-covers.json";
const site = "https://findryai.com";
function report(value) {
  const line = typeof value === "string" ? value : JSON.stringify(value);
  console.log(line);
  if (process.env.GITHUB_STEP_SUMMARY)
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${line}\n`);
}
export function validate(input) {
  if (
    Object.keys(input).some(
      (k) => !["version", "from", "until", "replacements"].includes(k),
    ) ||
    input.version !== 1 ||
    input.from !== "2026-10-31T16:00:00Z" ||
    input.until !== "2026-11-10T16:00:00Z" ||
    !Array.isArray(input.replacements) ||
    input.replacements.length > 100
  )
    throw new Error("Invalid bounded repair manifest.");
  const seen = new Set();
  for (const task of input.replacements) {
    if (
      Object.keys(task).some(
        (k) =>
          ![
            "id",
            "slug",
            "expectedLink",
            "expectedRevision",
            "expectedAsset",
            "cover",
          ].includes(k),
      ) ||
      !/^[a-zA-Z0-9_.-]{1,160}$/.test(task.id || "") ||
      task.id.startsWith("drafts.") ||
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(task.slug || "") ||
      !/^[a-zA-Z0-9_-]{1,160}$/.test(task.expectedRevision || "") ||
      !/^image-[a-f0-9]+-\d+x\d+-[a-z]+$/.test(task.expectedAsset || "") ||
      seen.has(task.id)
    )
      throw new Error("Invalid repair identity or duplicate.");
    seen.add(task.id);
    const link = new URL(task.expectedLink);
    const source = new URL(task.cover.sourceUrl);
    if (
      link.protocol !== "https:" ||
      link.username ||
      link.password ||
      source.protocol !== "https:" ||
      ["github.com", "www.github.com"].includes(source.hostname)
    )
      throw new Error("Replacement must use a reviewed official website.");
    reviewedCoverBytes(task.cover);
  }
  return input;
}
export function guard(doc, task, newAsset) {
  if (
    !doc ||
    doc._type !== "item" ||
    doc._id !== task.id ||
    doc.slug !== task.slug ||
    doc.link !== task.expectedLink ||
    !doc.publishDate ||
    doc.publishDate < "2026-10-31T16:00:00Z" ||
    doc.publishDate >= "2026-11-10T16:00:00Z"
  )
    throw new Error("Item identity or date changed.");
  if (doc.asset === newAsset && doc.alt === task.cover.alt) return "done";
  if (doc._rev !== task.expectedRevision || doc.asset !== task.expectedAsset)
    throw new Error("Item changed since review; refusing overwrite.");
  return "patch";
}
export function imagePatch(doc, cover, assetId) {
  return {
    id: doc._id,
    ifRevisionID: doc._rev,
    set: {
      image: {
        _type: "image",
        asset: { _type: "reference", _ref: assetId },
        alt: cover.alt,
      },
    },
  };
}
async function main() {
  const manifest = validate(JSON.parse(readFileSync(manifestPath, "utf8")));
  const c = await credentials();
  const root = `https://${c.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2024-08-01`;
  const dataset = encodeURIComponent(c.NEXT_PUBLIC_SANITY_DATASET);
  const auth = { Authorization: `Bearer ${c.SANITY_API_TOKEN}` };
  async function request(url, options = {}) {
    let r;
    try {
      r = await fetch(url, {
        ...options,
        redirect: "error",
        signal: AbortSignal.timeout(30000),
      });
    } catch {
      throw new Error("Remote request failed; URL and credentials omitted.");
    }
    if (!r.ok) throw new Error(`Remote HTTP ${r.status}; response omitted.`);
    return r;
  }
  async function query(q, params = {}) {
    const url = new URL(`${root}/data/query/${dataset}`);
    url.searchParams.set("query", q);
    for (const [key, value] of Object.entries(params))
      url.searchParams.set(`$${key}`, JSON.stringify(value));
    return (await (await request(url, { headers: auth })).json()).result;
  }
  const projection =
    '{_id,_type,_rev,name,"slug":slug.current,link,publishDate,"asset":image.asset._ref,"alt":image.alt,"imageUrl":image.asset->url,"categories":categories[]->slug.current,"tags":tags[]->slug.current}';
  const filter =
    '_type == "item" && !(_id in path("drafts.**")) && publishDate >= $from && publishDate < $until && forceHidden != true';
  const params = { from: manifest.from, until: manifest.until };
  const count = await query(`count(*[${filter}])`, params);
  if (count > 100)
    throw new Error(
      "Audit exceeds 100 public items; narrow before proceeding.",
    );
  const recent = await query(
    `*[${filter}] | order(publishDate asc) ${projection}`,
    params,
  );
  report({
    auditWindow: "2026-11-01 through 2026-11-10 Asia/Shanghai",
    count,
    items: recent,
  });
  if (!manifest.replacements.length) {
    report("Read-only cover audit complete; no mutations.");
    return;
  }
  const getTarget = (id) => query(`*[_id == $id][0]${projection}`, { id });
  const prepared = [];
  // Validate all identities and bytes before uploading or modifying any item.
  for (const task of manifest.replacements) {
    const bytes = reviewedCoverBytes(task.cover);
    const asset = `image-${createHash("sha1").update(bytes).digest("hex")}-2560x1600-png`;
    const doc = await getTarget(task.id);
    prepared.push({ task, bytes, asset, doc, state: guard(doc, task, asset) });
  }
  const secret = c.REVALIDATE_SECRET || c.AUTH_SECRET || c.SANITY_API_TOKEN;
  async function refresh(path) {
    const url = new URL("/api/revalidate", site);
    url.searchParams.set("secret", secret);
    url.searchParams.set("path", path);
    const result = await (await request(url, { method: "POST" })).json();
    if (result.revalidated !== true)
      throw new Error("Cache refresh not confirmed.");
  }
  await refresh("/");
  const paths = new Set(["/"]);
  for (const entry of prepared) {
    const { task, bytes, asset, state } = entry;
    if (state !== "done") {
      const uploaded = (
        await (
          await request(
            `${root}/assets/images/${dataset}?filename=${task.slug}-official-20261110.png`,
            {
              method: "POST",
              headers: { ...auth, "Content-Type": "image/png" },
              body: bytes,
            },
          )
        ).json()
      ).document;
      if (uploaded?._id !== asset)
        throw new Error("Uploaded asset differs from reviewed bytes.");
      const current = await getTarget(task.id);
      if (guard(current, task, asset) !== "done")
        await request(`${root}/data/mutate/${dataset}`, {
          method: "POST",
          headers: { ...auth, "Content-Type": "application/json" },
          body: JSON.stringify({
            mutations: [{ patch: imagePatch(current, task.cover, asset) }],
          }),
        });
    }
    const verify = await getTarget(task.id);
    if (guard(verify, task, asset) !== "done")
      throw new Error("CMS cover verification failed.");
    report({
      repaired: task.slug,
      id: task.id,
      asset,
      source: task.cover.sourceUrl,
      sha256: task.cover.sha256,
      state,
    });
    paths.add(`/item/${task.slug}`);
    for (const slug of verify.categories || []) paths.add(`/category/${slug}`);
    for (const slug of verify.tags || []) paths.add(`/tag/${slug}`);
  }
  for (const path of paths) await refresh(path);
  let incomplete = false;
  for (const { task, asset } of prepared) {
    const hash = asset.split("-")[1];
    let visible = false;
    for (let n = 0; n < 5; n++) {
      const page = await request(`${site}/item/${task.slug}`);
      const html = await page.text();
      const og =
        html.match(/<meta[^>]*(?:property|name)="og:image"[^>]*>/g) || [];
      visible = html.includes(hash) && og.some((x) => x.includes(hash));
      report({ page: task.slug, attempt: n + 1, bodyAndOg: visible });
      if (visible) break;
      if (n < 4) await new Promise((r) => setTimeout(r, 5000));
    }
    const doc = await getTarget(task.id);
    const img = await request(doc.imageUrl);
    const uploadedBytes = Buffer.from(await img.arrayBuffer());
    if (
      createHash("sha256").update(uploadedBytes).digest("hex") !==
      task.cover.sha256
    )
      throw new Error("CDN bytes differ from reviewed screenshot.");
    if (!visible) incomplete = true;
  }
  if (incomplete)
    throw new Error(
      "CMS covers updated; some canonical page/OG checks pending. Rerun safely.",
    );
  report(
    "Official website covers verified in CMS, canonical pages, OG and CDN. No site deployment or tag.",
  );
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href)
  main().catch(() => {
    // Keep unexpected API/parser errors from echoing authenticated URLs or bodies.
    report(
      "Cover maintenance failed. Inspect the preceding bounded audit/verification output; credentials and remote bodies omitted.",
    );
    process.exitCode = 1;
  });
