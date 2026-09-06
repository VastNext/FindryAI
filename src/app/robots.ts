import { siteConfig } from "@/config/site";
import type { MetadataRoute } from "next";

/**
 * https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/api/og"],
        disallow: [
          "/studio/",
          "/dashboard/",
          "/settings/",
          "/edit/",
          "/submit/",
          "/publish/",
          "/payment/",
          "/auth/",
          "/api/",
          "/search",
          "/unsubscribe/",
        ],
      },
      {
        userAgent: [
          "Bytespider",
          "GPTBot",
          "ClaudeBot",
          "CCBot",
          "SemrushBot",
          "AhrefsBot",
          "DotBot",
          "Amazonbot",
          "PetalBot",
        ],
        disallow: ["/"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
