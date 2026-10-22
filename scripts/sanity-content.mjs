import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { appendFileSync, lstatSync, readFileSync, realpathSync } from "node:fs";
import { pathToFileURL } from "node:url";

const site = "https://findryai.com";
const keys = [
  "NEXT_PUBLIC_SANITY_PROJECT_ID",
  "NEXT_PUBLIC_SANITY_DATASET",
  "SANITY_API_TOKEN",
  "REVALIDATE_SECRET",
  "AUTH_SECRET",
];
const manifestPattern = /^content\/publish\/[a-zA-Z0-9_-]+\.json$/;

function report(message) {
  console.log(message);
  if (process.env.GITHUB_STEP_SUMMARY)
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${message}\n`);
}

function mask(value) {
  if (process.env.GITHUB_ACTIONS && value)
    console.log(
      `::add-mask::${value.replaceAll("%", "%25").replaceAll("\r", "%0D").replaceAll("\n", "%0A")}`,
    );
}

async function request(url, options = {}) {
  let response;
  try {
    response = await fetch(url, {
      ...options,
      redirect: "error",
      signal: AbortSignal.timeout(30000),
    });
  } catch {
    throw new Error("Remote request failed (URL and credentials omitted).");
  }
  if (!response.ok)
    throw new Error(
      `Remote request returned HTTP ${response.status} (body omitted).`,
    );
  try {
    return await response.json();
  } catch {
    throw new Error("Remote response was not valid JSON.");
  }
}

export async function credentials(env = process.env) {
  const config = Object.fromEntries(keys.map((key) => [key, env[key] || ""]));
  for (const value of Object.values(config)) mask(value);
  if (
    keys.some((key) => !config[key]) &&
    env.VERCEL_TOKEN &&
    env.VERCEL_PROJECT_ID
  ) {
    const project = encodeURIComponent(env.VERCEL_PROJECT_ID);
    const vercel = async (path) => {
      const url = new URL(path, "https://api.vercel.com");
      if (env.VERCEL_ORG_ID) url.searchParams.set("teamId", env.VERCEL_ORG_ID);
      return request(url, {
        headers: { Authorization: `Bearer ${env.VERCEL_TOKEN}` },
      });
    };
    try {
      const list = await vercel(`/v10/projects/${project}/env?decrypt=false`);
      for (const key of keys) {
        if (config[key]) continue;
        const candidates = (list.envs || []).filter(
          (entry) =>
            entry.key === key &&
            entry.target?.includes("production") &&
            !entry.gitBranch,
        );
        if (candidates.length !== 1) continue;
        const entry = candidates[0];
        if (entry.type === "sensitive") {
          report(
            `${key}: exists in Vercel but is Sensitive; add it to GitHub Actions Secrets to use this runner.`,
          );
          continue;
        }
        const result = await vercel(
          `/v1/projects/${project}/env/${encodeURIComponent(entry.id)}`,
        );
        if (typeof result.value === "string" && result.value) {
          config[key] = result.value;
          mask(result.value);
        }
      }
    } catch {
      report(
        "Vercel configuration lookup unavailable; checking GitHub-injected variables only.",
      );
    }
  }
  const missing = keys.slice(0, 3).filter((key) => !config[key]);
  if (missing.length)
    throw new Error(
      `Missing usable configuration: ${missing.join(", ")}. Configure repository Actions Secrets/Variables; never commit values.`,
    );
  if (
    !/^[a-z0-9]+$/.test(config.NEXT_PUBLIC_SANITY_PROJECT_ID) ||
    !/^[a-z0-9_-]+$/.test(config.NEXT_PUBLIC_SANITY_DATASET)
  )
    throw new Error("Invalid Sanity project/dataset format.");
  report("Sanity configuration is available. Secret values are not logged.");
  return config;
}

export function validateManifest(input) {
  if (
    input.version !== 1 ||
    !Array.isArray(input.documents) ||
    input.documents.length < 1 ||
    input.documents.length > 3
  ) {
    throw new Error("Manifest must contain version 1 and 1–3 documents.");
  }
  const seen = new Set();
  return input.documents.map((doc) => {
    const slug = doc.slug?.current;
    if (
      !["item", "blogPost"].includes(doc._type) ||
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug || "") ||
      slug.length > 96
    )
      throw new Error("Invalid document type or slug.");
    const id = `keyword.${doc._type}.${slug}`;
    if (seen.has(id)) throw new Error("Duplicate document in manifest.");
    seen.add(id);
    const allowed =
      doc._type === "item"
        ? [
            "reviewedCover",
            "taxonomy",
            "coverageAliases",
            "_type",
            "slug",
            "name",
            "link",
            "description",
            "introduction",
            "categories",
            "tags",
            "image",
            "icon",
          ]
        : [
            "_type",
            "slug",
            "title",
            "excerpt",
            "body",
            "categories",
            "author",
            "image",
          ];
    if (Object.keys(doc).some((key) => !allowed.includes(key)))
      throw new Error("Unsupported document fields.");
    if (doc._type === "item") {
      if (
        !doc.name?.trim() ||
        !doc.description?.trim() ||
        !doc.introduction?.trim()
      )
        throw new Error("Item content is incomplete.");
      const url = new URL(doc.link);
      if (
        !["https:", "http:"].includes(url.protocol) ||
        url.username ||
        url.password
      )
        throw new Error("Invalid item link.");
    } else if (
      !doc.title?.trim() ||
      !doc.excerpt?.trim() ||
      !doc.body?.length ||
      !doc.author?._ref
    )
      throw new Error("Blog content or author is missing.");
    if (doc.reviewedCover) reviewedCoverBytes(doc.reviewedCover);
    if (
      doc._type === "item" &&
      ((!doc.taxonomy?.categories?.length && !doc.categories?.length) ||
        (!doc.taxonomy?.tags?.length && !doc.tags?.length) ||
        (!doc.reviewedCover && !doc.image?.asset?._ref) ||
        !(doc.reviewedCover?.alt || doc.image?.alt)?.trim())
    )
      throw new Error(
        "Items require category, tags, reviewed cover or existing image, and alt.",
      );
    return {
      ...doc,
      _id: id,
      publishDate: new Date().toISOString(),
      ...(doc._type === "item"
        ? {
            pricePlan: "free",
            freePlanStatus: "approved",
            forceHidden: false,
            featured: false,
          }
        : { featured: false }),
    };
  });
}

// Only committed PNG bytes are read; the runner never downloads an arbitrary cover URL.
export function reviewedCoverBytes(cover) {
  if (
    !cover ||
    Object.keys(cover).some(
      (key) => !["path", "sha256", "alt", "sourceUrl"].includes(key),
    ) ||
    !/^content\/assets\/[a-z0-9-]+\.png$/.test(cover.path || "") ||
    !/^[a-f0-9]{64}$/.test(cover.sha256 || "") ||
    !cover.alt?.trim()
  )
    throw new Error("Invalid reviewed cover descriptor.");
  const source = new URL(cover.sourceUrl);
  if (source.protocol !== "https:" || source.username || source.password)
    throw new Error("Invalid cover provenance URL.");
  if (
    !lstatSync(cover.path).isFile() ||
    lstatSync(cover.path).isSymbolicLink() ||
    !realpathSync(cover.path).startsWith(`${realpathSync("content/assets")}/`)
  )
    throw new Error("Cover must be a local regular asset.");
  const bytes = readFileSync(cover.path);
  if (
    bytes.length <= 10240 ||
    bytes.length > 2000000 ||
    !bytes
      .subarray(0, 8)
      .equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) ||
    bytes.readUInt32BE(16) !== 2560 ||
    bytes.readUInt32BE(20) !== 1600 ||
    createHash("sha256").update(bytes).digest("hex") !== cover.sha256
  )
    throw new Error("Cover differs from reviewed 2560x1600 PNG.");
  return bytes;
}

export async function publish(config, documents) {
  const base = `https://${config.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2024-08-01/data`;
  const dataset = encodeURIComponent(config.NEXT_PUBLIC_SANITY_DATASET);
  const headers = {
    Authorization: `Bearer ${config.SANITY_API_TOKEN}`,
    "Content-Type": "application/json",
  };
  const query = async (q, params = {}) => {
    const url = new URL(`${base}/query/${dataset}`);
    url.searchParams.set("query", q);
    for (const [key, value] of Object.entries(params))
      url.searchParams.set(`$${key}`, JSON.stringify(value));
    return (await request(url, { headers })).result;
  };
  await query('count(*[_type == "item"])');
  report("Sanity authenticated read succeeded.");
  if (!documents.length) return;
  // Resolve cache authorization before any mutation, using the same precedence as the site.
  const secret =
    config.REVALIDATE_SECRET || config.AUTH_SECRET || config.SANITY_API_TOKEN;
  async function refresh(path) {
    const url = new URL("/api/revalidate", site);
    url.searchParams.set("secret", secret);
    url.searchParams.set("path", path);
    const result = await request(url, { method: "POST" });
    if (result.revalidated !== true)
      throw new Error("Cache refresh was not confirmed.");
  }
  await refresh("/");
  const prepared = [];
  // Validate the whole batch before uploading assets or creating documents.
  for (const input of documents) {
    const { reviewedCover, taxonomy, coverageAliases = [], ...doc } = input;
    if (
      !Array.isArray(coverageAliases) ||
      coverageAliases.length > 5 ||
      coverageAliases.some(
        (alias) =>
          typeof alias !== "string" || !/^[a-z0-9 -]{1,96}$/.test(alias),
      )
    )
      throw new Error("Invalid coverage aliases.");
    const link = doc.link ? new URL(doc.link) : null;
    const canonicalLink = link
      ? (link.origin + link.pathname).replace(/\/$/, "").toLowerCase()
      : "";
    const existing = await query(
      '*[_type in ["item", "blogPost"] && (lower(slug.current) in $names || _id in [$id,$draft] || lower(name) in $names || lower(title) in $names || lower(link) in $links)]{_id}',
      {
        slug: doc.slug.current,
        id: doc._id,
        draft: `drafts.${doc._id}`,
        names: [
          doc.slug.current,
          (doc.name || doc.title).toLowerCase(),
          ...coverageAliases,
        ],
        links: link
          ? [doc.link.toLowerCase(), canonicalLink, `${canonicalLink}/`]
          : [],
      },
    );
    if (existing.some((entry) => entry._id !== doc._id)) {
      report(
        `Skipped existing coverage or draft: ${doc._type}/${doc.slug.current}`,
      );
      continue;
    }
    if (taxonomy) {
      if (
        Object.keys(taxonomy).some(
          (key) => !["categories", "tags"].includes(key),
        )
      )
        throw new Error("Unsupported taxonomy selector.");
      for (const [field, type] of [
        ["categories", doc._type === "blogPost" ? "blogCategory" : "category"],
        ["tags", "tag"],
      ]) {
        if (!taxonomy[field]) continue;
        if (
          !Array.isArray(taxonomy[field]) ||
          taxonomy[field].length > 5 ||
          taxonomy[field].some((slug) => !/^[a-z0-9-]+$/.test(slug))
        )
          throw new Error("Invalid taxonomy slugs.");
        const matches = await query(
          '*[_type == $type && slug.current in $slugs && !(_id in path("drafts.**"))]{_id,"slug":slug.current}',
          { type, slugs: taxonomy[field] },
        );
        doc[field] = taxonomy[field].map((slug, i) => {
          const found = matches.filter((entry) => entry.slug === slug);
          if (found.length !== 1)
            throw new Error(`Taxonomy missing or ambiguous: ${type}/${slug}`);
          return {
            _type: "reference",
            _ref: found[0]._id,
            _key: `${field}-${i}`,
          };
        });
      }
    }
    for (const [field, type] of [
      ["categories", doc._type === "item" ? "category" : "blogCategory"],
      ["tags", "tag"],
      ["author", "author"],
      ["image", "sanity.imageAsset"],
      ["icon", "sanity.imageAsset"],
    ]) {
      const values = Array.isArray(doc[field]) ? doc[field] : [doc[field]];
      for (const value of values.filter(Boolean)) {
        const id = value._ref || value.asset?._ref;
        if (
          !id ||
          !(await query(
            'count(*[_id == $id && _type == $type && !(_id in path("drafts.**"))])',
            { id, type },
          ))
        )
          throw new Error(`Invalid ${field} reference.`);
      }
    }
    const bytes = reviewedCover ? reviewedCoverBytes(reviewedCover) : null;
    prepared.push({ doc, reviewedCover, bytes, exists: !!existing.length });
  }
  const published = [];
  const extraPaths = new Set();
  for (const { doc, reviewedCover, bytes, exists } of prepared) {
    if (!exists) {
      if (bytes) {
        const asset = (
          await request(
            `https://${config.NEXT_PUBLIC_SANITY_PROJECT_ID}.api.sanity.io/v2024-08-01/assets/images/${dataset}?filename=${doc.slug.current}.png`,
            {
              method: "POST",
              headers: {
                Authorization: headers.Authorization,
                "Content-Type": "image/png",
              },
              body: bytes,
            },
          )
        ).document;
        if (!asset?._id?.startsWith("image-"))
          throw new Error("Asset upload not confirmed.");
        doc.image = {
          _type: "image",
          asset: { _type: "reference", _ref: asset._id },
          alt: reviewedCover.alt,
        };
        report(
          `Reviewed cover uploaded: ${asset._id}; SHA256 ${reviewedCover.sha256}; source ${reviewedCover.sourceUrl}`,
        );
      }
      await request(`${base}/mutate/${dataset}?returnIds=true`, {
        method: "POST",
        headers,
        body: JSON.stringify({ mutations: [{ createIfNotExists: doc }] }),
      });
      report(`Created Sanity document: ${doc._id}`);
    } else
      report(
        `Already created; preserving CMS edits and refreshing: ${doc._id}`,
      );
    const verify = await query(
      '*[_id == $id][0]{_id,name,title,publishDate,introduction,"assetId":image.asset._ref,"imageUrl":image.asset->url,"alt":image.alt,"categories":categories[]->slug.current,"tags":tags[]->slug.current}',
      { id: doc._id },
    );
    if (
      !verify?.publishDate ||
      (doc._type === "item" &&
        (!verify.categories?.length ||
          !verify.tags?.length ||
          !verify.assetId ||
          !verify.imageUrl ||
          !verify.alt))
    )
      throw new Error(`Published document incomplete: ${doc._id}`);
    report(
      `Verified CMS binding: ${doc._id}; image ${verify.assetId || "none"}`,
    );
    for (const slug of verify.categories || [])
      extraPaths.add(`/category/${slug}`);
    for (const slug of verify.tags || []) extraPaths.add(`/tag/${slug}`);
    published.push({
      path: `/${doc._type === "item" ? "item" : "blog"}/${doc.slug.current}`,
      verify,
    });
  }
  for (const path of new Set([
    "/",
    "/blog",
    ...published.map((entry) => entry.path),
    ...extraPaths,
  ]))
    await refresh(path);
  for (const { path, verify } of published) {
    let visible = false;
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        const response = await fetch(`${site}${path}`, {
          redirect: "follow",
          signal: AbortSignal.timeout(30000),
        });
        const html = await response.text();
        const hash = verify.assetId?.split("-")[1];
        const metas =
          html.match(/<meta[^>]*(?:property|name)="og:image"[^>]*>/g) || [];
        visible =
          response.ok &&
          html.includes(verify.name || verify.title) &&
          (!hash ||
            (html.includes(hash) && metas.some((meta) => meta.includes(hash))));
        report(
          `${site}${path}: HTTP ${response.status}; content/cover/OG ${visible ? "verified" : "pending"} (attempt ${attempt + 1})`,
        );
        if (visible) break;
      } catch {
        report("Transient online check failure; retrying.");
      }
      if (attempt < 4)
        await new Promise((resolve) => setTimeout(resolve, 10000));
    }
    if (!visible)
      throw new Error(
        "Content exists in Sanity; canonical content/cover/OG check incomplete. Rerun to retry.",
      );
    if (verify.imageUrl) {
      const image = await fetch(verify.imageUrl, {
        signal: AbortSignal.timeout(30000),
      });
      if (!image.ok) throw new Error("Bound CDN image unavailable.");
    }
    for (const slug of verify.categories || []) {
      let found = false;
      for (let attempt = 0; attempt < 4; attempt++) {
        const response = await fetch(`${site}/category/${slug}`, {
          signal: AbortSignal.timeout(30000),
        });
        found = response.ok && (await response.text()).includes(path);
        if (found) break;
        if (attempt < 3)
          await new Promise((resolve) => setTimeout(resolve, 5000));
      }
      if (!found)
        throw new Error("Published item not yet visible in category listing.");
      report(`Category discovery verified: /category/${slug} → ${path}`);
    }
  }
}

async function main() {
  let paths = [];
  if (process.env.CONTENT_MANIFEST) paths = [process.env.CONTENT_MANIFEST];
  else if (process.env.BEFORE_SHA && !/^0+$/.test(process.env.BEFORE_SHA)) {
    const before = process.env.BEFORE_SHA;
    const after = process.env.AFTER_SHA;
    if (![before, after].every((sha) => /^[a-f0-9]{40}$/.test(sha || "")))
      throw new Error("Invalid commit range.");
    paths = execFileSync(
      "git",
      [
        "diff",
        "--name-only",
        "--diff-filter=AM",
        before,
        after,
        "--",
        "content/publish/",
      ],
      { encoding: "utf8" },
    )
      .trim()
      .split("\n")
      .filter(Boolean);
  }
  const documents = [];
  for (const path of paths) {
    if (!manifestPattern.test(path))
      throw new Error("Only content/publish/*.json manifests are accepted.");
    const raw = readFileSync(path, "utf8");
    if (raw.length > 200000) throw new Error("Manifest exceeds 200 KB.");
    documents.push(...validateManifest(JSON.parse(raw)));
    report(
      `Validated manifest ${path}; SHA256 ${createHash("sha256").update(raw).digest("hex")}`,
    );
  }
  if (documents.length > 3)
    throw new Error("At most 3 documents may be published per run.");
  const config = await credentials();
  await publish(config, documents);
  report(
    documents.length
      ? "Content publication run completed; no deployment or tag was requested."
      : "Read-only Sanity preflight completed; no content was written.",
  );
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  main().catch((error) => {
    report(`FAILED: ${error.message}`);
    process.exitCode = 1;
  });
}
