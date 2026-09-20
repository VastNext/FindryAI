import { siteConfig } from "@/config/site";
import type {
  BlogCategoryListQueryForSitemapResult,
  BlogListQueryForSitemapResult,
  CategoryListQueryForSitemapResult,
  CollectionListQueryForSitemapResult,
  ItemListQueryForSitemapResult,
  PageListQueryForSitemapResult,
  TagListQueryForSitemapResult,
} from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  blogCategoryListQueryForSitemap,
  blogListQueryForSitemap,
  categoryListQueryForSitemap,
  collectionListQueryForSitemap,
  itemListQueryForSitemap,
  pageListQueryForSitemap,
  tagListQueryForSitemap,
} from "@/sanity/lib/queries";
import type { MetadataRoute } from "next";

const site_url = process.env.NEXT_PUBLIC_APP_URL || siteConfig.url;

export const SITEMAP_SEGMENTS = [
  "pages",
  "categories",
  "items",
  "alternatives",
] as const;

export type SitemapSegment = (typeof SITEMAP_SEGMENTS)[number];

export async function generateSitemaps() {
  return SITEMAP_SEGMENTS.map((segment) => ({ id: segment }));
}

/**
 * Next.js generateSitemaps provides segmented sitemaps accessible at:
 * /sitemap/[id].xml (e.g. /sitemap/pages.xml, /sitemap/categories.xml, /sitemap/items.xml, /sitemap/alternatives.xml)
 * Next.js automatically creates a Sitemap Index at /sitemap.xml pointing to all segments.
 */
export default async function sitemap({
  id,
}: {
  id: string;
}): Promise<MetadataRoute.Sitemap> {
  const segment = id as SitemapSegment;
  const sitemapList: MetadataRoute.Sitemap = [];

  switch (segment) {
    case "pages": {
      const [
        blogListQueryResult,
        collectionListQueryResult,
        pageListQueryResult,
      ] = await Promise.all([
        sanityFetch<BlogListQueryForSitemapResult>({
          query: blogListQueryForSitemap,
        }),
        sanityFetch<CollectionListQueryForSitemapResult>({
          query: collectionListQueryForSitemap,
        }),
        sanityFetch<PageListQueryForSitemapResult>({
          query: pageListQueryForSitemap,
        }),
      ]);

      const staticRoutes: MetadataRoute.Sitemap = [
        {
          url: "", // home
          lastModified: new Date(),
        },
        {
          url: "category",
          lastModified: new Date(),
        },
        {
          url: "tag",
          lastModified: new Date(),
        },
        // Only include collection index if collections exist to prevent Soft 404
        ...(collectionListQueryResult.length > 0
          ? [
              {
                url: "collection",
                lastModified: new Date(),
              },
            ]
          : []),
        // Only include blog index if blog posts exist to prevent Soft 404
        ...(blogListQueryResult.length > 0
          ? [
              {
                url: "blog",
                lastModified: new Date(),
              },
            ]
          : []),
        {
          url: "pricing",
          lastModified: new Date(),
        },
        {
          url: "translator",
          lastModified: new Date(),
        },
        {
          url: "password-generator",
          lastModified: new Date(),
        },
        {
          url: "agent-skills",
          lastModified: new Date(),
        },
        {
          url: "ai-daily-feeds",
          lastModified: new Date(),
        },
        {
          url: "gpt-6-astra",
          lastModified: new Date(),
        },
        {
          url: "typesafe-jev",
          lastModified: new Date(),
        },
        {
          url: "face-swap-gif",
          lastModified: new Date(),
        },
        {
          url: "ai-face-swap-video",
          lastModified: new Date(),
        },
      ];

      for (const route of staticRoutes) {
        const fullUrl = route.url ? `${site_url}/${route.url}` : site_url;
        sitemapList.push({
          url: fullUrl,
          lastModified: new Date(route.lastModified).toISOString(),
        });
      }

      // Add dynamic CMS pages (e.g. Terms, Privacy)
      for (const page of pageListQueryResult) {
        if (page.slug) {
          sitemapList.push({
            url: `${site_url}/${page.slug}`,
            lastModified: new Date(page._updatedAt).toISOString(),
          });
        }
      }

      // Add blog posts & blog categories if they exist
      for (const post of blogListQueryResult) {
        if (post.slug) {
          sitemapList.push({
            url: `${site_url}/blog/${post.slug}`,
            lastModified: new Date(post._updatedAt).toISOString(),
          });
        }
      }

      for (const collection of collectionListQueryResult) {
        if (collection.slug) {
          sitemapList.push({
            url: `${site_url}/collection/${collection.slug}`,
            lastModified: new Date(collection._updatedAt).toISOString(),
          });
        }
      }
      break;
    }

    case "categories": {
      const [
        categoryListQueryResult,
        tagListQueryResult,
        blogCategoryListQueryResult,
      ] = await Promise.all([
        sanityFetch<CategoryListQueryForSitemapResult>({
          query: categoryListQueryForSitemap,
        }),
        sanityFetch<TagListQueryForSitemapResult>({
          query: tagListQueryForSitemap,
        }),
        sanityFetch<BlogCategoryListQueryForSitemapResult>({
          query: blogCategoryListQueryForSitemap,
        }),
      ]);

      for (const category of categoryListQueryResult) {
        if (category.slug && (category.count ?? 0) > 0) {
          sitemapList.push({
            url: `${site_url}/category/${category.slug}`,
            lastModified: new Date(category._updatedAt).toISOString(),
          });
        }
      }

      for (const tag of tagListQueryResult) {
        if (tag.slug && (tag.count ?? 0) > 0) {
          sitemapList.push({
            url: `${site_url}/tag/${tag.slug}`,
            lastModified: new Date(tag._updatedAt).toISOString(),
          });
        }
      }

      for (const blogCategory of blogCategoryListQueryResult) {
        if (blogCategory.slug && (blogCategory.count ?? 0) > 0) {
          sitemapList.push({
            url: `${site_url}/blog/category/${blogCategory.slug}`,
            lastModified: new Date(blogCategory._updatedAt).toISOString(),
          });
        }
      }
      break;
    }

    case "items": {
      const itemListQueryResult =
        await sanityFetch<ItemListQueryForSitemapResult>({
          query: itemListQueryForSitemap,
        });

      for (const item of itemListQueryResult) {
        if (item.slug) {
          sitemapList.push({
            url: `${site_url}/item/${item.slug}`,
            lastModified: new Date(item._updatedAt).toISOString(),
          });
        }
      }
      break;
    }

    case "alternatives": {
      const itemListQueryResult =
        await sanityFetch<ItemListQueryForSitemapResult>({
          query: itemListQueryForSitemap,
        });

      for (const item of itemListQueryResult) {
        if (item.slug) {
          sitemapList.push({
            url: `${site_url}/item/${item.slug}/alternatives`,
            lastModified: new Date(item._updatedAt).toISOString(),
          });
        }
      }
      break;
    }
  }

  return sitemapList;
}
