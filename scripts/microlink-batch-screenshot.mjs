// Batch website screenshots via the Microlink cloud API (no local browser needed,
// survives CF challenges that block headless local crawls), then downloads the PNGs.
// Usage:
//   node scripts/microlink-batch-screenshot.mjs name1=url1 name2=url2 ...
//   node scripts/microlink-batch-screenshot.mjs                # runs the 20261010 batch
// Output: tmp-shots/seo-images/<name>.png  (+ size log for blank-page detection)
// Verify visually afterwards: >10KB only rules out blank pages, not challenge pages.
import fs from "node:fs";
import path from "node:path";
import mql from "@microlink/mql";
import dotenv from "dotenv";

dotenv.config();

const OUT_DIR = "tmp-shots/seo-images";

const TARGETS_20261010 = [
  { name: "photocraft-item", url: "https://getartcraft.com/apps/photocraft" },
  { name: "vidu-item", url: "https://www.vidu.com/vidu-q4" },
  { name: "qwen-item", url: "https://github.com/QwenLM/Qwen-Image-2.1" },
  { name: "photocraft-blog", url: "https://github.com/storytold/photocraft" },
  { name: "vidu-blog", url: "https://www.vidu.com" },
  { name: "qwen-blog", url: "https://huggingface.co/Qwen/Qwen-Image-2.1" },
];

const TARGETS = process.argv.slice(2).length
  ? process.argv.slice(2).map((arg) => {
      const eq = arg.indexOf("=");
      if (eq <= 0) throw new Error(`bad target (want name=url): ${arg}`);
      return { name: arg.slice(0, eq), url: arg.slice(eq + 1) };
    })
  : TARGETS_20261010;

async function shoot(name, url) {
  const out = path.join(OUT_DIR, `${name}.png`);
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const { data } = await mql(url, {
        screenshot: true,
        meta: false,
        force: attempt > 1, // bypass Microlink cache on retries
      });
      const shotUrl = data?.screenshot?.url;
      if (!shotUrl) throw new Error("no screenshot url in response");
      const res = await fetch(shotUrl);
      if (!res.ok) throw new Error(`download HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(out, buf);
      const ok = buf.length > 10240;
      console.log(
        `[${ok ? "ok" : "TOO-SMALL"}] ${name} <- ${url} (${buf.length} bytes)`,
      );
      return ok;
    } catch (err) {
      console.log(`[retry ${attempt}] ${name}: ${err.message}`);
      await new Promise((r) => setTimeout(r, 3000 * attempt));
    }
  }
  console.log(`[FAILED] ${name} <- ${url}`);
  return false;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const only = process.argv.slice(2);
  let failed = 0;
  for (const t of TARGETS) {
    if (only.length && !only.includes(t.name)) continue;
    const ok = await shoot(t.name, t.url);
    if (!ok) failed++;
  }
  console.log(failed ? `DONE with ${failed} failures` : "DONE all ok");
  process.exit(failed ? 1 : 0);
}

main();
