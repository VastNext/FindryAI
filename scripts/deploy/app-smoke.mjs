#!/usr/bin/env node
// 只读应用冒烟。输出单个 JSON；退出码 0=PASS / 10=FAIL / 20=BLOCKED。
// 不执行写操作，不重试有副作用请求。超时固定 30 秒。
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const TIMEOUT_MS = 30_000;
const cases = [];
const evidence = [];
let blocked = false;

function env(name, fallback) {
  const value = process.env[name];
  return value === undefined || value === "" ? fallback : value;
}

function args() {
  const parsed = {};
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i += 1) {
    if (argv[i].startsWith("--")) {
      parsed[argv[i].slice(2)] = argv[i + 1];
      i += 1;
    }
  }
  return parsed;
}

const cli = args();
const baseUrl = (cli["base-url"] || env("SMOKE_BASE_URL", "")).replace(
  /\/$/,
  "",
);
const expectedRelease = env("SMOKE_EXPECTED_RELEASE", "");
const itemSlug = env("SMOKE_ITEM_SLUG", "");
const categorySlug = env("SMOKE_CATEGORY_SLUG", "");
const unpublishedSlug = env("SMOKE_UNPUBLISHED_SLUG", "");
const expectNoindex = env("SMOKE_EXPECT_NOINDEX", "0") === "1";
const mode = env("SMOKE_MODE", "readonly");
const evidenceDir = cli["evidence-dir"] || env("SMOKE_EVIDENCE_DIR", "");

function record(id, status, assertions, extra = {}) {
  cases.push({ case_id: id, status, assertions, ...extra });
  if (status === "BLOCKED") blocked = true;
}

async function request(path, init = {}) {
  const url = `${baseUrl}${path}`;
  const startedAt = Date.now();
  const response = await fetch(url, {
    redirect: "manual",
    signal: AbortSignal.timeout(TIMEOUT_MS),
    ...init,
  });
  const body = await response.text();
  return {
    url,
    status: response.status,
    headers: Object.fromEntries(response.headers.entries()),
    body,
    elapsedMs: Date.now() - startedAt,
  };
}

function assertPage(id, path, expectedStatus, extraAssert) {
  return request(path)
    .then((res) => {
      const assertions = [
        {
          name: "status",
          ok: res.status === expectedStatus,
          actual: res.status,
        },
      ];
      if (expectedStatus === 200) {
        assertions.push({
          name: "content-type-html",
          ok: /text\/html/i.test(res.headers["content-type"] || ""),
          actual: res.headers["content-type"] || "",
        });
        assertions.push({
          name: "non-empty-body",
          ok: res.body.length > 512,
          actual: res.body.length,
        });
        assertions.push({
          name: "no-runtime-error-leak",
          ok:
            !/Missing environment variable/i.test(res.body) &&
            !/Application error|Internal Server Error/i.test(res.body) &&
            !/at\s+[\w./-]+\.js:\d+:\d+/.test(res.body),
        });
      }
      if (extraAssert) extraAssert(res, assertions);
      record(id, assertions.every((a) => a.ok) ? "PASS" : "FAIL", assertions, {
        elapsed_ms: res.elapsedMs,
      });
      return res;
    })
    .catch((error) => {
      record(id, "FAIL", [
        { name: "request", ok: false, actual: String(error?.message || error) },
      ]);
      return null;
    });
}

function assert(condition, name, actual) {
  return { name, ok: Boolean(condition), actual };
}

async function main() {
  if (!baseUrl) {
    record("config", "BLOCKED", [assert(false, "SMOKE_BASE_URL", "missing")]);
    return finish();
  }

  const health = await request("/api/health");
  const healthAssertions = [
    assert(health.status === 200, "health-status", health.status),
    assert(
      !expectedRelease || health.body.includes(expectedRelease),
      "health-release",
      expectedRelease || "not-required",
    ),
  ];
  record(
    "health",
    healthAssertions.every((a) => a.ok) ? "PASS" : "FAIL",
    healthAssertions,
    { elapsed_ms: health.elapsedMs },
  );
  try {
    const parsed = JSON.parse(health.body);
    evidence.push({ type: "health", release: parsed.release, sha: parsed.sha });
  } catch {
    // 响应不是 JSON 时由上面的断言失败体现。
  }

  const deep = await request("/api/health?deep=1");
  record(
    "health-deep",
    deep.status === 200 ? "PASS" : "FAIL",
    [assert(deep.status === 200, "deep-status", deep.status)],
    { elapsed_ms: deep.elapsedMs },
  );

  const home = await assertPage("home", "/", 200);
  if (home) {
    const staticAssets = [
      ...new Set(
        [...home.body.matchAll(/(?:src|href)="(\/_next\/static\/[^"]+)"/g)].map(
          (match) => match[1],
        ),
      ),
    ];
    if (staticAssets.length === 0) {
      record("static-assets", "FAIL", [assert(false, "static-asset-found", 0)]);
    } else {
      const results = await Promise.all(
        staticAssets.slice(0, 6).map(async (asset) => {
          const res = await request(asset);
          return { asset, status: res.status, size: res.body.length };
        }),
      );
      const ok = results.every((r) => r.status === 200 && r.size > 0);
      record(
        "static-assets",
        ok ? "PASS" : "FAIL",
        results.map((r) =>
          assert(r.status === 200 && r.size > 0, r.asset, r.status),
        ),
      );
    }

    const frameRendered = /Findry/i.test(home.body);
    record("home-content", frameRendered ? "PASS" : "FAIL", [
      assert(frameRendered, "body-contains-brand", "Findry"),
    ]);

    if (expectNoindex) {
      const robotsHeader = home.headers["x-robots-tag"] || "";
      const robotsMeta = /<meta[^>]+name="robots"[^>]*noindex/i.test(home.body);
      record(
        "noindex",
        /noindex/i.test(robotsHeader) || robotsMeta ? "PASS" : "FAIL",
        [
          assert(
            /noindex/i.test(robotsHeader) || robotsMeta,
            "candidate-noindex",
            robotsHeader || "missing",
          ),
        ],
      );
    }

    const origin = new URL(baseUrl).origin;
    const canonical = home.body.match(
      /<link[^>]+rel="canonical"[^>]+href="([^"]+)"/i,
    );
    if (canonical) {
      const canonicalUrl = new URL(canonical[1], baseUrl);
      record("canonical", canonicalUrl.origin === origin ? "PASS" : "FAIL", [
        assert(
          canonicalUrl.origin === origin,
          "canonical-origin",
          canonicalUrl.origin,
        ),
      ]);
    }
  }

  const robots = await request("/robots.txt");
  record(
    "robots",
    robots.status === 200 && /sitemap:/i.test(robots.body) ? "PASS" : "FAIL",
    [
      assert(robots.status === 200, "robots-status", robots.status),
      assert(/sitemap:/i.test(robots.body), "robots-sitemap", "present"),
      assert(
        robots.body.includes(new URL(baseUrl).host),
        "robots-host",
        new URL(baseUrl).host,
      ),
    ],
  );

  const sitemap = await request("/sitemap.xml");
  record(
    "sitemap",
    sitemap.status === 200 && /<(urlset|sitemapindex)/i.test(sitemap.body)
      ? "PASS"
      : "FAIL",
    [
      assert(sitemap.status === 200, "sitemap-status", sitemap.status),
      assert(
        /<(urlset|sitemapindex)/i.test(sitemap.body),
        "sitemap-root",
        sitemap.body.slice(0, 40),
      ),
    ],
  );

  await assertPage("search", "/search", 200);

  if (itemSlug) {
    const item = await assertPage("item", `/item/${itemSlug}`, 200);
    if (item) {
      const header = item.headers["x-nextjs-cache"] || "";
      evidence.push({ type: "isr-header", path: `/item/${itemSlug}`, header });
      if (env("SMOKE_CHECK_ISR", "0") === "1") {
        const visits = [item];
        for (let i = 0; i < 2; i += 1) {
          visits.push(await request(`/item/${itemSlug}`));
        }
        const headers = visits.map((v) => v.headers["x-nextjs-cache"] || "");
        if (!headers.some(Boolean)) {
          record("isr", "BLOCKED", [
            assert(false, "isr-observable-header", "missing"),
          ]);
        } else {
          record(
            "isr",
            headers[2] === "HIT" || headers[1] === "HIT" || headers[0] === "HIT"
              ? "PASS"
              : "FAIL",
            headers.map((value, index) =>
              assert(value !== "", `visit-${index}`, value),
            ),
            { headers },
          );
        }
      } else {
        record("isr", "BLOCKED", [
          assert(false, "isr-enabled", "SMOKE_CHECK_ISR=0"),
        ]);
      }
    }
  } else {
    record("item", "BLOCKED", [assert(false, "SMOKE_ITEM_SLUG", "missing")]);
  }

  if (categorySlug) {
    await assertPage("category", `/category/${categorySlug}`, 200);
  } else {
    record("category", "BLOCKED", [
      assert(false, "SMOKE_CATEGORY_SLUG", "missing"),
    ]);
  }

  await assertPage("not-found", "/item/__smoke_definitely_missing__", 404);

  if (unpublishedSlug) {
    const unpublished = await request(`/item/${unpublishedSlug}`);
    record("unpublished", unpublished.status === 404 ? "PASS" : "FAIL", [
      assert(
        unpublished.status === 404,
        "unpublished-status",
        unpublished.status,
      ),
    ]);
  } else if (mode === "full") {
    record("unpublished", "BLOCKED", [
      assert(false, "SMOKE_UNPUBLISHED_SLUG", "missing"),
    ]);
  }

  return finish();
}

function finish() {
  const statuses = cases.map((c) => c.status);
  let status = "PASS";
  if (statuses.includes("FAIL")) status = "FAIL";
  else if (statuses.includes("BLOCKED") || statuses.includes("NOT_RUN")) {
    status = "BLOCKED";
  }
  const result = {
    schema_version: 1,
    suite: "S02-app-smoke",
    status,
    base_url: baseUrl || null,
    generated_at: new Date().toISOString(),
    cases,
    evidence,
  };
  if (evidenceDir) {
    mkdirSync(evidenceDir, { recursive: true });
    const file = join(evidenceDir, `app-smoke-${Date.now()}.json`);
    writeFileSync(file, JSON.stringify(result, null, 2));
    result.evidence_path = file;
  }
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
  process.exitCode = status === "PASS" ? 0 : status === "FAIL" ? 10 : 20;
}

main().catch((error) => {
  record("unexpected", "FAIL", [
    assert(false, "unexpected-error", String(error?.message || error)),
  ]);
  finish();
});
