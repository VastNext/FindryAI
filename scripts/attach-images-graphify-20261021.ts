import fs from "node:fs";
import { createHash } from "node:crypto";
import { createClient } from "@sanity/client";
import dotenv from "dotenv";

dotenv.config();
const reviewedSha256 = "aab04b7a9af55072230dfe7be8524748a1e6d6a4309a965221ddee09949bce7e";
const previousAsset = "image-4a7d72d5319330723714bd75d5bc8eeb89018d47-1400x692-png";
const imagePath = "tmp-shots/seo-images/graphify-item.png";
const imageAlt = "Graphify GitHub repository — open-source code knowledge graph for AI coding assistants";
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "",
  token: process.env.SANITY_API_TOKEN || "",
  apiVersion: "2024-08-01", useCdn: false,
});
async function refresh(path: string) {
  const secret = process.env.REVALIDATE_SECRET || process.env.AUTH_SECRET || process.env.SANITY_API_TOKEN;
  if (!secret) throw new Error("Missing cache authorization");
  const url = new URL("/api/revalidate", "https://findryai.com");
  url.searchParams.set("secret", secret);
  url.searchParams.set("path", path);
  const res = await fetch(url, { method: "POST", redirect: "error", signal: AbortSignal.timeout(30000) });
  if (!res.ok || (await res.json()).revalidated !== true) throw new Error("Cache refresh failed");
}
async function main() {
  const buf = fs.readFileSync(imagePath);
  if (buf.length <= 10240 || createHash("sha256").update(buf).digest("hex") !== reviewedSha256) throw new Error("Image differs from visually reviewed capture");
  if (buf.readUInt32BE(16) !== 2560 || buf.readUInt32BE(20) !== 1600) throw new Error("Unexpected screenshot dimensions");
  const doc = await client.fetch('*[_id == "keyword.item.graphify" && _type == "item"][0]{_id,_rev,slug,link,image}');
  if (!doc || doc.slug?.current !== "graphify" || new URL(doc.link).hostname !== "graphify.com") throw new Error("Target identity mismatch");
  await refresh("/item/graphify");
  const asset = await client.assets.upload("image", buf, { filename: "graphify.png" });
  console.log("[ok] reviewed Microlink screenshot uploaded:", asset._id, buf.length);
  const existingAsset = doc.image?.asset?._ref;
  if (existingAsset && ![previousAsset, asset._id].includes(existingAsset)) throw new Error("Cover was edited outside this task; refusing overwrite");
  if (existingAsset !== asset._id || doc.image?.alt !== imageAlt) {
    await client.patch(doc._id).ifRevisionId(doc._rev).set({
      image: { _type: "image", asset: { _type: "reference", _ref: asset._id }, alt: imageAlt },
    }).commit();
  }
  const verified = await client.fetch('*[_id == "keyword.item.graphify"][0]{"imageUrl":image.asset->url,"assetId":image.asset._ref,"alt":image.alt,"categories":categories[]->slug.current,"tags":tags[]->slug.current}');
  if (verified?.assetId !== asset._id || !verified.imageUrl || verified.alt !== imageAlt) throw new Error("Sanity binding verification failed");
  console.log("[verify]", JSON.stringify(verified));
  for (const path of ["/", "/item/graphify", ...verified.categories.map((slug: string) => "/category/" + slug), ...verified.tags.map((slug: string) => "/tag/" + slug)]) await refresh(path);
  let valid = false;
  const hash = asset._id.split("-")[1];
  for (let attempt = 0; attempt < 8; attempt++) {
    try {
      const res = await fetch("https://findryai.com/item/graphify", { headers: { "Cache-Control": "no-cache, no-store" }, signal: AbortSignal.timeout(30000) });
      const html = await res.text();
      const metas = html.match(/<meta[^>]*(?:property|name)="og:image"[^>]*>/g) || [];
      valid = res.ok && html.includes(hash) && metas.some((m: string) => m.includes(hash));
      console.log("[live] attempt", attempt + 1, JSON.stringify({ status: res.status, cover: html.includes(hash), og: metas, cf: res.headers.get("cf-cache-status"), age: res.headers.get("age"), vercel: res.headers.get("x-vercel-cache") }));
      if (valid) break;
      if (attempt === 0) {
        const bypass = await fetch("https://findryai.com/item/graphify?cover-check=" + hash, { signal: AbortSignal.timeout(30000) });
        const fresh = await bypass.text();
        console.log("[cache-check]", JSON.stringify({ status: bypass.status, hasCover: fresh.includes(hash), og: fresh.match(/<meta[^>]*(?:property|name)="og:image"[^>]*>/g) || [] }));
      }
    } catch {
      console.log("[live] transient HTTP or network failure; retrying bounded check");
    }
    if (attempt < 7) await new Promise(resolve => setTimeout(resolve, 15000));
  }
  if (!valid) throw new Error("Updated cover not yet visible on canonical live page");
  const imageResponse = await fetch(verified.imageUrl, { signal: AbortSignal.timeout(30000) });
  if (!imageResponse.ok) throw new Error("Sanity CDN image unavailable");
  console.log("[done] reviewed Microlink repository screenshot bound; taxonomy preserved; live image and OG verified.");
}
main().catch(() => { console.error("FAILED: Graphify screenshot binding incomplete; inspect last successful step. Credentials omitted."); process.exitCode = 1; });
