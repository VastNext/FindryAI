import { writeFile } from "node:fs/promises";
import path from "node:path";

const SOURCE_URL = "https://moge.ai/agent-skills";
const OUTPUT_PATH = path.resolve("src/data/agent-skills.ts");

const categories = [
  "Agent Harness",
  "Vibe Coding",
  "Agent Boost",
  "Skill Workshop",
  "PPT & Presentations",
  "Design & UI",
  "Video & Animation",
  "Writing & Copy",
  "Documents & Sheets",
  "Diagrams & Charts",
  "Marketing & Growth",
  "Product & Business",
  "Research & Learning",
  "Web & Automation",
  "Code Review & Security",
  "Memory & Knowledge",
  "Official Skills",
] as const;

const cardPattern =
  /<a href="(https?:\/\/[^\"]+)" target="_blank" rel="noopener nofollow" class="group flex flex-col gap-4 p-4">[\s\S]*?<img src="[^"]+" alt="([^"]+)"[\s\S]*?<p class="line-clamp-2[^"]*">([\s\S]*?)<\/p>/g;

const categorySlugs: Record<string, string> = {
  "Agent Harness": "agent-harness",
  "Vibe Coding": "vibe-coding",
  "Agent Boost": "agent-boost",
  "Skill Workshop": "skill-workshop",
  "PPT & Presentations": "ppt-presentations",
  "Design & UI": "design-ui",
  "Video & Animation": "video-animation",
  "Writing & Copy": "writing-copy",
  "Documents & Sheets": "documents-sheets",
  "Diagrams & Charts": "diagrams-charts",
  "Marketing & Growth": "marketing-growth",
  "Product & Business": "product-business",
  "Research & Learning": "research-learning",
  "Web & Automation": "web-automation",
  "Code Review & Security": "code-review-security",
  "Memory & Knowledge": "memory-knowledge",
  "Official Skills": "official-skills",
};

function decodeHtml(value: string) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#x27;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function cleanUrl(value: string) {
  const url = new URL(decodeHtml(value));
  for (const key of Array.from(url.searchParams.keys())) {
    if (key.toLowerCase().startsWith("utm_")) {
      url.searchParams.delete(key);
    }
  }
  return url.toString();
}

function serialize(value: unknown) {
  return JSON.stringify(value, null, 2)
    .replaceAll("\u2028", "\\u2028")
    .replaceAll("\u2029", "\\u2029");
}

// 同步校验门禁：任何一项不满足都拒绝写入静态数据
function validateGroups(groups: { mainCategory: string; slug: string; items: { name: string; link: string; shortDescriptions: string[] }[] }[]) {
  const errors: string[] = [];

  if (groups.length !== categories.length) {
    errors.push(`Expected ${categories.length} categories, received ${groups.length}`);
  }

  const allLinks = groups.flatMap((group) => group.items.map((item) => item.link));
  const duplicates = allLinks.filter((link, index) => allLinks.indexOf(link) !== index);
  if (duplicates.length > 0) {
    errors.push(`Duplicate URLs across categories: ${duplicates.slice(0, 5).join(", ")}`);
  }

  for (const group of groups) {
    if (group.items.length < 5) {
      errors.push(`Category has too few items (possible parse failure): ${group.mainCategory} (${group.items.length})`);
    }
    for (const item of group.items) {
      if (!item.name || !item.link || item.shortDescriptions.length === 0 || !item.shortDescriptions[0]) {
        errors.push(`Incomplete item: ${item.link || item.name || "(unnamed)"}`);
      }
      const text = `${item.name} ${item.shortDescriptions.join(" ")}`;
      if (/[\u4e00-\u9fff]/.test(text)) {
        errors.push(`Non-English text in item: ${item.name}`);
      }
      if (/utm_/i.test(item.link)) {
        errors.push(`UTM parameter not stripped: ${item.link}`);
      }
      if (item.shortDescriptions[0] && item.shortDescriptions[0].length > 200) {
        errors.push(`Description too long for item: ${item.name}`);
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(`Sync validation failed:\n${errors.slice(0, 20).join("\n")}`);
  }
}

async function fetchSourceHtml() {
  const response = await fetch(SOURCE_URL, {
    signal: AbortSignal.timeout(30000),
  } as never);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${SOURCE_URL}: ${response.status}`);
  }
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("text/html")) {
    throw new Error(`Unexpected content type from ${SOURCE_URL}: ${contentType}`);
  }
  const html = await response.text();
  if (html.length > 5_000_000) {
    throw new Error(`Response too large from ${SOURCE_URL}: ${html.length} bytes`);
  }
  return html;
}

async function main() {
  const html = await fetchSourceHtml();
  const categoryPositions = categories.map((name) => {
    const encodedName = name.replaceAll("&", "&amp;");
    const marker = `>${encodedName}</div></div><div class="grid w-full`;
    const index = html.indexOf(marker);
    if (index < 0) throw new Error(`Category section not found: ${name}`);
    return { name, index };
  });

  const groups = categoryPositions.map(({ name, index }, categoryIndex) => {
    const blockEnd = categoryPositions[categoryIndex + 1]?.index ?? html.length;
    const block = html.slice(index, blockEnd);
    const seen = new Set<string>();
    const items = Array.from(block.matchAll(cardPattern))
      .map((card) => ({
        name: decodeHtml(card[2]),
        link: cleanUrl(card[1]),
        shortDescriptions: [decodeHtml(card[3])],
      }))
      .filter((item) => {
        if (seen.has(item.link)) return false;
        seen.add(item.link);
        return true;
      });

    return {
      mainCategory: name,
      slug: categorySlugs[name],
      items,
    };
  });

  validateGroups(groups);

  const output = `export interface AgentSkill {
  name: string;
  link: string;
  shortDescriptions: string[];
}

export interface AgentSkillGroup {
  mainCategory: string;
  slug: string;
  items: AgentSkill[];
}

export const agentSkillGroups: AgentSkillGroup[] = ${serialize(groups)};
`;

  await writeFile(OUTPUT_PATH, output, "utf8");
  const itemCount = groups.reduce((total, group) => total + group.items.length, 0);
  console.log(`Synced ${itemCount} English Agent Skills across ${groups.length} categories.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
