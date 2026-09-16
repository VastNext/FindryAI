import { SITEMAP_SEGMENTS } from "@/app/sitemap";
import { siteConfig } from "@/config/site";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || siteConfig.url;
  const now = new Date().toISOString();

  const sitemapIndexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${SITEMAP_SEGMENTS.map(
  (segment) => `  <sitemap>
    <loc>${siteUrl}/sitemap/${segment}.xml</loc>
    <lastmod>${now}</lastmod>
  </sitemap>`,
).join("\n")}
</sitemapindex>`;

  return new NextResponse(sitemapIndexXml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control":
        "public, max-age=86400, s-maxage=86400, stale-while-revalidate=43200",
    },
  });
}
