import dotenv from "dotenv";

dotenv.config();

const AUTH_SECRET = process.env.AUTH_SECRET;
const CF_TOKEN_ZONE = process.env.CF_TOKEN_ZONE;
const ZONE_ID = "5e0c772488ccf9c33acdeb64252d99be";

const PATHS = [
  "/",
  "/blog",
  "/blog/artcraft-open-source-adobe-alternatives",
  "/item/glm-5-3-flash",
  "/gemini-4-argon",
];

const FULL_URLS = PATHS.map((p) =>
  p === "/" ? "https://findryai.com" : `https://findryai.com${p}`,
);

async function purgeNextISR() {
  console.log("=== 1. Revalidating Next.js ISR caches ===");
  for (const path of PATHS) {
    try {
      const url = `https://findryai.com/api/revalidate?secret=${AUTH_SECRET}&path=${encodeURIComponent(path)}`;
      const res = await fetch(url, { method: "POST" });
      const text = await res.text();
      console.log(`[revalidate] ${path} -> HTTP ${res.status}: ${text}`);
    } catch (err) {
      console.error(`[revalidate fail] ${path}:`, err);
    }
  }
}

async function purgeCloudflare() {
  console.log("\n=== 2. Purging Cloudflare Edge Cache ===");
  if (!CF_TOKEN_ZONE) {
    console.error("CF_TOKEN_ZONE is missing in environment");
    return;
  }

  const { ProxyAgent } = await import("undici");
  const dispatcher = new ProxyAgent("http://127.0.0.1:7890");

  const endpoint = `https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/purge_cache`;
  try {
    const fetchOptions: Record<string, unknown> = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${CF_TOKEN_ZONE}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ files: FULL_URLS }),
      dispatcher,
    };
    const res = await fetch(endpoint, fetchOptions);
    const json = await res.json();
    console.log("[cloudflare purge result]:", JSON.stringify(json, null, 2));
  } catch (err) {
    console.error("[cloudflare purge fail]:", err);
  }
}

async function main() {
  await purgeNextISR();
  await purgeCloudflare();
}

main();
