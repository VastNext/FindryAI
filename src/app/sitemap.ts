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

/**
 * Google's limit is 50,000 URLs per sitemap
 *
 * https://nextjs.org/docs/app/api-reference/functions/generate-sitemaps
 * https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  console.log("sitemap start");

  const sitemapList: MetadataRoute.Sitemap = []; // final result

  const sitemapRoutes: MetadataRoute.Sitemap = [
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
    {
      url: "collection",
      lastModified: new Date(),
    },
    {
      url: "blog",
      lastModified: new Date(),
    },
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
  ];

  for (const route of sitemapRoutes) {
    const fullUrl = route.url ? `${site_url}/${route.url}` : site_url;
    sitemapList.push({
      url: fullUrl,
      lastModified: new Date(route.lastModified).toISOString(),
    });
  }

  const [
    itemListQueryResult,
    categoryListQueryResult,
    tagListQueryResult,
    collectionListQueryResult,
    blogListQueryResult,
    blogCategoryListQueryResult,
    pageListQueryResult,
  ] = await Promise.all([
    sanityFetch<ItemListQueryForSitemapResult>({
      query: itemListQueryForSitemap,
    }),
    sanityFetch<CategoryListQueryForSitemapResult>({
      query: categoryListQueryForSitemap,
    }),
    sanityFetch<TagListQueryForSitemapResult>({
      query: tagListQueryForSitemap,
    }),
    sanityFetch<CollectionListQueryForSitemapResult>({
      query: collectionListQueryForSitemap,
    }),
    sanityFetch<BlogListQueryForSitemapResult>({
      query: blogListQueryForSitemap,
    }),
    sanityFetch<BlogCategoryListQueryForSitemapResult>({
      query: blogCategoryListQueryForSitemap,
    }),
    sanityFetch<PageListQueryForSitemapResult>({
      query: pageListQueryForSitemap,
    }),
  ]);

  for (const item of itemListQueryResult) {
    if (item.slug) {
      sitemapList.push({
        url: `${site_url}/item/${item.slug}`,
        lastModified: new Date(item._updatedAt).toISOString(),
      });
      sitemapList.push({
        url: `${site_url}/item/${item.slug}/alternatives`,
        lastModified: new Date(item._updatedAt).toISOString(),
      });
    }
  }

  for (const category of categoryListQueryResult) {
    if (category.slug) {
      sitemapList.push({
        url: `${site_url}/category/${category.slug}`,
        lastModified: new Date(category._updatedAt).toISOString(),
      });
    }
  }

  for (const tag of tagListQueryResult) {
    if (tag.slug) {
      sitemapList.push({
        url: `${site_url}/tag/${tag.slug}`,
        lastModified: new Date(tag._updatedAt).toISOString(),
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

  for (const post of blogListQueryResult) {
    if (post.slug) {
      sitemapList.push({
        url: `${site_url}/blog/${post.slug}`,
        lastModified: new Date(post._updatedAt).toISOString(),
      });
    }
  }

  for (const blogCategory of blogCategoryListQueryResult) {
    if (blogCategory.slug) {
      sitemapList.push({
        url: `${site_url}/blog/category/${blogCategory.slug}`,
        lastModified: new Date(blogCategory._updatedAt).toISOString(),
      });
    }
  }

  for (const page of pageListQueryResult) {
    if (page.slug) {
      sitemapList.push({
        url: `${site_url}/${page.slug}`,
        lastModified: new Date(page._updatedAt).toISOString(),
      });
    }
  }

  console.log("sitemap end, size:", sitemapList.length);
  return sitemapList;
}
