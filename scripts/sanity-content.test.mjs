import assert from "node:assert/strict";
import test from "node:test";
import { credentials, publish, validateManifest } from "./sanity-content.mjs";

const config = {
  NEXT_PUBLIC_SANITY_PROJECT_ID: "example1",
  NEXT_PUBLIC_SANITY_DATASET: "production",
  SANITY_API_TOKEN: "test-secret",
  REVALIDATE_SECRET: "refresh-secret",
};
const item = {
  _type: "item",
  name: "Example",
  slug: { current: "example-tool" },
  link: "https://example.com",
  description: "Description",
  introduction: "Verified content.",
  categories: [{ _type: "reference", _ref: "category-dev" }],
  tags: [{ _type: "reference", _ref: "tag-ai" }],
  image: {
    _type: "image",
    asset: { _type: "reference", _ref: "image-hash-2560x1600-png" },
    alt: "Example screenshot",
  },
};
const manifest = (documents) => ({ version: 1, documents });
const json = (data) => new Response(JSON.stringify(data), { status: 200 });

test("validates before publishing and rejects unrelated document types and privileged fields", () => {
  assert.equal(
    validateManifest(manifest([item]))[0]._id,
    "keyword.item.example-tool",
  );
  for (const doc of [
    { ...item, _type: "user" },
    { ...item, paid: true },
    { ...item, link: "javascript:alert(1)" },
  ]) {
    assert.throws(() => validateManifest(manifest([doc])));
  }
  assert.throws(() => validateManifest(manifest([item, item])));
  assert.throws(() =>
    validateManifest(
      manifest([
        { _type: "blogPost", title: "Post", slug: { current: "post" } },
      ]),
    ),
  );
});

test("credential absence produces variable names without secret values", async () => {
  await assert.rejects(
    credentials({ SANITY_API_TOKEN: "hidden-value" }),
    (error) => {
      assert.match(error.message, /NEXT_PUBLIC_SANITY_PROJECT_ID/);
      assert.ok(!error.message.includes("hidden-value"));
      return true;
    },
  );
});

test("preflight reads only; refresh rejection prevents all Sanity writes", async () => {
  const original = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push(String(url));
    if (String(url).includes("/query/")) return json({ result: 0 });
    return new Response("{}", { status: 401 });
  };
  try {
    await publish(config, []);
    assert.equal(calls.length, 1);
    await assert.rejects(
      publish(config, validateManifest(manifest([item]))),
      /HTTP 401/,
    );
    assert.ok(!calls.some((url) => url.includes("/mutate/")));
  } finally {
    globalThis.fetch = original;
  }
});

test("reruns do not overwrite existing content; retry refresh after partial success", async () => {
  const original = globalThis.fetch;
  const calls = [];
  let created = false;
  globalThis.fetch = async (url, options = {}) => {
    calls.push([String(url), options]);
    const u = new URL(url);
    if (u.pathname.includes("/mutate/")) {
      assert.equal(
        JSON.parse(options.body).mutations[0].createIfNotExists._id,
        "keyword.item.example-tool",
      );
      created = true;
      return json({ results: [{ id: "keyword.item.example-tool" }] });
    }
    if (u.pathname.includes("/query/")) {
      const query = u.searchParams.get("query");
      if (query.startsWith("count"))
        return json({ result: query.includes("_id == $id") ? 1 : 0 });
      if (query.includes("publishDate"))
        return json({
          result: {
            _id: "keyword.item.example-tool",
            name: "Example",
            publishDate: "2026-10-20T14:00:00Z",
            categories: ["developer-tools"],
            tags: ["ai"],
            assetId: "image-hash-2560x1600-png",
            imageUrl: "https://cdn.sanity.io/example.png",
            alt: "Example screenshot",
          },
        });
      return json({
        result: created ? [{ _id: "keyword.item.example-tool" }] : [],
      });
    }
    if (u.pathname.startsWith("/item/"))
      return new Response(
        '<h1>Example</h1><img src="hash"/><meta property="og:image" content="hash"/>',
      );
    if (u.pathname.startsWith("/category/"))
      return new Response('<a href="/item/example-tool">Example</a>');
    return json({ revalidated: true });
  };
  try {
    const docs = validateManifest(manifest([item]));
    await publish(config, docs);
    await publish(config, docs);
    assert.equal(calls.filter(([url]) => url.includes("/mutate/")).length, 1);
    assert.ok(
      calls.some(([url]) => url === "https://findryai.com/item/example-tool"),
    );
  } finally {
    globalThis.fetch = original;
  }
});

test("Vercel lookup reads only allowlisted production variables and skips Sensitive values", async () => {
  const original = globalThis.fetch;
  const calls = [];
  globalThis.fetch = async (url) => {
    calls.push(String(url));
    if (String(url).includes("decrypt=false"))
      return json({
        envs: [
          {
            key: "NEXT_PUBLIC_SANITY_PROJECT_ID",
            id: "project",
            target: ["production"],
            type: "plain",
          },
          {
            key: "NEXT_PUBLIC_SANITY_DATASET",
            id: "dataset",
            target: ["production"],
            type: "plain",
          },
          {
            key: "SANITY_API_TOKEN",
            id: "token",
            target: ["production"],
            type: "sensitive",
          },
          {
            key: "STRIPE_API_KEY",
            id: "unrelated",
            target: ["production"],
            type: "encrypted",
          },
        ],
      });
    return json({
      value: String(url).includes("/project?") ? "example1" : "production",
    });
  };
  try {
    await assert.rejects(
      credentials({
        VERCEL_TOKEN: "vercel-test",
        VERCEL_PROJECT_ID: "test",
        VERCEL_ORG_ID: "test-team",
      }),
      /SANITY_API_TOKEN/,
    );
    assert.ok(!calls.some((url) => /\/token\?|\/unrelated\?/.test(url)));
    assert.equal(calls.length, 3);
  } finally {
    globalThis.fetch = original;
  }
});

test("reviewed screenshot gate rejects checksum/path/size bypass before remote writes", () => {
  const cover = {
    path: "content/assets/vane-item.png",
    sha256: "fd7d3ddaa2b6d4d5253939239f37ff0cf39d4cc450254abac945d43d3a77e51f",
    alt: "Vane official repository",
    sourceUrl: "https://github.com/ItzCrazyKns/Vane",
  };
  const doc = { ...item, image: undefined, reviewedCover: cover };
  doc.image = undefined;
  assert.equal(
    validateManifest(manifest([doc]))[0].reviewedCover.sha256,
    cover.sha256,
  );
  for (const invalid of [
    { ...cover, sha256: "0".repeat(64) },
    { ...cover, path: "../vane-item.png" },
    { ...cover, sourceUrl: "http://example.com" },
    { ...cover, alt: "" },
  ]) {
    assert.throws(() =>
      validateManifest(manifest([{ ...doc, reviewedCover: invalid }])),
    );
  }
});

test("authenticated taxonomy failure and duplicate coverage prevent uploads and document writes", async () => {
  const original = globalThis.fetch;
  for (const duplicate of [true, false]) {
    const writes = [];
    globalThis.fetch = async (url, options = {}) => {
      const u = new URL(url);
      if (u.pathname.includes("/query/")) {
        const q = u.searchParams.get("query");
        if (q.startsWith("count")) return json({ result: 0 });
        if (q.includes("$names"))
          return json({
            result: duplicate ? [{ _id: "existing-manual-id" }] : [],
          });
        return json({ result: [] });
      }
      if (u.pathname.includes("/assets/") || u.pathname.includes("/mutate/"))
        writes.push(u.pathname);
      return json({ revalidated: true });
    };
    try {
      const docs = validateManifest(
        manifest([
          {
            ...item,
            taxonomy: { categories: ["developer-tools"], tags: ["ai"] },
          },
        ]),
      );
      if (duplicate) await publish(config, docs);
      else await assert.rejects(publish(config, docs), /Taxonomy missing/);
      assert.equal(writes.length, 0);
    } finally {
      globalThis.fetch = original;
    }
  }
});

test("reviewed PNG upload is bound and transport-only fields never reach CMS", async () => {
  const original = globalThis.fetch;
  let uploads = 0;
  let written;
  globalThis.fetch = async (url, options = {}) => {
    const u = new URL(url);
    if (u.pathname.includes("/query/")) {
      const q = u.searchParams.get("query");
      if (q.startsWith("count")) return json({ result: 1 });
      if (q.includes("publishDate"))
        return json({
          result: {
            name: "Example",
            publishDate: "2026-10-22",
            categories: ["developer-tools"],
            tags: ["ai"],
            assetId: "image-hash-2560x1600-png",
            imageUrl: "https://cdn.sanity.io/example.png",
            alt: "Reviewed repository",
          },
        });
      if (q.includes("$names")) return json({ result: [] });
      const type = JSON.parse(u.searchParams.get("$type"));
      return json({
        result: [
          {
            _id: type === "category" ? "category-dev" : "tag-ai",
            slug: type === "category" ? "developer-tools" : "ai",
          },
        ],
      });
    }
    if (u.pathname.includes("/assets/")) {
      uploads++;
      assert.equal(options.headers["Content-Type"], "image/png");
      assert.ok(options.body.length > 10240);
      return json({ document: { _id: "image-hash-2560x1600-png" } });
    }
    if (u.pathname.includes("/mutate/")) {
      written = JSON.parse(options.body).mutations[0].createIfNotExists;
      return json({ results: [{ id: written._id }] });
    }
    if (u.pathname.startsWith("/item/"))
      return new Response(
        'Example hash <meta property="og:image" content="hash"/>',
      );
    if (u.pathname.startsWith("/category/"))
      return new Response('<a href="/item/example-tool">Example</a>');
    return json({ revalidated: true });
  };
  try {
    const doc = {
      ...item,
      taxonomy: { categories: ["developer-tools"], tags: ["ai"] },
      coverageAliases: ["old-example"],
      reviewedCover: {
        path: "content/assets/vane-item.png",
        sha256:
          "fd7d3ddaa2b6d4d5253939239f37ff0cf39d4cc450254abac945d43d3a77e51f",
        alt: "Reviewed repository",
        sourceUrl: "https://github.com/ItzCrazyKns/Vane",
      },
    };
    doc.image = undefined;
    await publish(config, validateManifest(manifest([doc])));
    assert.equal(uploads, 1);
    assert.equal(written.image.asset._ref, "image-hash-2560x1600-png");
    for (const key of ["reviewedCover", "coverageAliases", "taxonomy"])
      assert.ok(!(key in written));
  } finally {
    globalThis.fetch = original;
  }
});
