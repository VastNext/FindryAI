import dotenv from "dotenv";

dotenv.config();

const AUTH_SECRET = process.env.AUTH_SECRET;
const CF_TOKEN_ZONE = process.env.CF_TOKEN_ZONE;
const ZONE_ID = "5e0c772488ccf9c33acdeb64252d99be";

const PATHS = [
  "/",
  "/item/9router",
  "/item/opencode-go",
  "/item/addyosmani-agent-skills",
  "/item/superpowers",
  "/category/developer-tools",
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
  const { HttpsProxyAgent } = await import("https-proxy-agent");
  const agent = new HttpsProxyAgent("http://127.0.0.1:7890");
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/zones/${ZONE_ID}/purge_cache`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${CF_TOKEN_ZONE}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ files: FULL_URLS }),
      agent,
    },
  );
  console.log("[cf purge]:", JSON.stringify(await res.json()));
}

main();
