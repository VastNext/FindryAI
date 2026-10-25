import dotenv from "dotenv";

dotenv.config();

const AUTH_SECRET = process.env.AUTH_SECRET;
const CF_TOKEN_ZONE = process.env.CF_TOKEN_ZONE;
const ZONE_ID = "5e0c772488ccf9c33acdeb64252d99be";

const PATHS = [
  "/",
  "/item/graphify",
  "/item/deepseek-harness",
  "/item/figcraft",
  "/item/gridcraft",
  "/item/minimax-h3",
  "/item/opencut",
  "/item/pdfcraft",
  "/item/taste-skill",
  "/item/wordcraft",
];

const FULL_URLS = PATHS.map((p) =>
  p === "/" ? "https://findryai.com" : `https://findryai.com${p}`,
);

async function main() {
  console.log("=== 1. Next ISR revalidate ===");
  for (const path of PATHS) {
    const res = await fetch(
      `https://findryai.com/api/revalidate?secret=${AUTH_SECRET}&path=${encodeURIComponent(path)}`,
      { method: "POST" },
    );
    console.log(`[revalidate] ${path} -> HTTP ${res.status}`);
  }
  console.log("=== 2. Cloudflare purge ===");
  // api.cloudflare.com is DNS-poisoned from this machine; native fetch ignores
  // the node-fetch-style `agent` option, so the proxy must go through undici's
  // dispatcher instead.
  const { ProxyAgent } = await import("undici");
  const dispatcher = new ProxyAgent("http://127.0.0.1:7890");
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/purge_cache`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${CF_TOKEN_ZONE}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ files: FULL_URLS }),
      dispatcher,
    } as RequestInit,
  );
  console.log("[cf purge]:", JSON.stringify(await res.json()));
}

main();
