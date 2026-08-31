import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fetchMogeTweetFeed } from "../src/lib/moge-tweet-feed";

const outputPath = path.resolve("src/data/tweet-feed-fallback.ts");

async function main() {
  const data = await fetchMogeTweetFeed();
  const output = `import type { TweetFeedData } from "@/lib/moge-tweet-feed";

// 通过 pnpm tweet-feed:sync 生成；上游暂时不可用时保证页面仍有内容。
export const tweetFeedFallback: TweetFeedData = ${JSON.stringify(data, null, 2)};
`;
  await writeFile(outputPath, output, "utf8");
  console.log(
    `Synced tweet fallback: all=${data.all.length}, openclaw=${data.openclaw.length}, hermes=${data.hermes.length}`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
