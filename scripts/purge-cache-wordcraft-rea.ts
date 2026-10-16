import dotenv from "dotenv";

dotenv.config();

const AUTH_SECRET = process.env.AUTH_SECRET;
const CF_TOKEN_ZONE = process.env.CF_TOKEN_ZONE;
const ZONE_ID = "5e0c772488ccf9c33acdeb64252d99be";

const PATHS = [
  "/",
  "/blog",
  "/item/wordcraft",
  "/item/gridcraft",
  "/item/reverse-engineer-anything",
  "/blog/artcraft-open-source-adobe-alternatives",
  "/category/office-tools",
  "/category/developer-tools",
  "/category/writing-tools",
  "/category/data-tools",
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

  // Need proxy http://127.0.0.1:7890 if on Windows with DNS poisoning
  const { HttpsProxyAgent } = await import("https-proxy-agent");
  const agent = new HttpsProxyAgent("http://127.0.0.1:7890");

  const endpoint = `https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/purge_cache`;
  try {
    const fetchOptions: any = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${CF_TOKEN_ZONE}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ files: FULL_URLS }),
      agent,
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
