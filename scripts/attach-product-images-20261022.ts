import fs from "node:fs";
import { createClient } from "@sanity/client";
import dotenv from "dotenv";

dotenv.config();

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "",
  apiVersion: "2024-08-01",
  useCdn: false,
  token: process.env.SANITY_API_TOKEN || "",
});

interface Task {
  slug: string;
  imagePath: string;
  imageAlt: string;
  newLink?: string;
}

const TASKS: Task[] = [
  {
    slug: "graphify",
    imagePath: "tmp-shots/seo-images/graphify-product.png",
    imageAlt:
      "Graphify official website - the knowledge graph control plane for enterprise software, Y Combinator-backed open-source code intelligence platform",
  },
  {
    slug: "deepseek-harness",
    imagePath: "tmp-shots/seo-images/deepseek-harness-product.png",
    imageAlt:
      "DeepSeek Harness official website - open-source AI agent runtime in public preview with composable everything-is-a-plugin architecture",
  },
  {
    slug: "figcraft",
    imagePath: "tmp-shots/seo-images/figcraft-product.png",
    imageAlt:
      "FigCraft official page on getartcraft.com - open-source clean-room Figma alternative rebuilt in pure Rust",
  },
  {
    slug: "gridcraft",
    imagePath: "tmp-shots/seo-images/gridcraft-product.png",
    imageAlt:
      "GridCraft official page on getartcraft.com - fast native spreadsheets rebuilt in pure Rust with 500+ functions and xlsx support",
  },
  {
    slug: "minimax-h3",
    imagePath: "tmp-shots/seo-images/minimax-h3-product.png",
    imageAlt:
      "MiniMax H3 official tool page on Hailuo AI - create 2K videos with native stereo audio using the open-weight multimodal model",
    newLink: "https://hailuoai.video/en-Intl/tools/minimax-h3",
  },
  {
    slug: "opencut",
    imagePath: "tmp-shots/seo-images/opencut-product.png",
    imageAlt:
      "OpenCut official website - the open source video editor and free CapCut alternative for web, desktop and mobile",
  },
  {
    slug: "pdfcraft",
    imagePath: "tmp-shots/seo-images/pdfcraft-product.png",
    imageAlt:
      "PdfCraft official page on getartcraft.com - open-source PDF workbench and Adobe Acrobat alternative in pure Rust",
  },
  {
    slug: "taste-skill",
    imagePath: "tmp-shots/seo-images/taste-skill-product.png",
    imageAlt:
      "Taste Skill official website - anti-slop frontend design framework for Claude Code, Cursor and Codex agents",
  },
  {
    slug: "wordcraft",
    imagePath: "tmp-shots/seo-images/wordcraft-product.png",
    imageAlt:
      "WordCraft official page on getartcraft.com - fast open-source word processor rebuilt in pure Rust with docx support",
  },
];

async function main() {
  for (const t of TASKS) {
    const doc = await client.fetch<{ _id: string } | undefined>(
      '*[_type == "item" && slug.current == $slug][0]{_id}',
      { slug: t.slug },
    );
    if (!doc) {
      console.error(`[error] item not found: ${t.slug}`);
      continue;
    }
    if (!fs.existsSync(t.imagePath)) {
      console.error(`[error] file not found: ${t.imagePath}`);
      continue;
    }

    const buf = fs.readFileSync(t.imagePath);
    const asset = await client.assets.upload("image", buf, {
      filename: `${t.slug}-product.png`,
    });

    const patchData: Record<string, unknown> = {
      image: {
        _type: "image",
        asset: { _type: "reference", _ref: asset._id },
        alt: t.imageAlt,
      },
    };
    if (t.newLink) {
      patchData.link = t.newLink;
    }

    await client.patch(doc._id).set(patchData).commit();
    console.log(
      `[ok] ${t.slug} product image attached (${buf.length} bytes)${t.newLink ? " + link updated" : ""}`,
    );

    const verify = await client.fetch(
      '*[_type == "item" && slug.current == $slug][0]{"img": image.asset->url, "alt": image.alt, link}',
      { slug: t.slug },
    );
    console.log(`[verify ${t.slug}]`, JSON.stringify(verify));
  }
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
