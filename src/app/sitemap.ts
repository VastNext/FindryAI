import { ITEMS_PER_PAGE } from "@/lib/constants";
import type {
  CategoryListQueryForSitemapResult,
  ItemListQueryForSitemapResult,
  PageListQueryForSitemapResult,
  TagListQueryForSitemapResult,
} from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  categoryListQueryForSitemap,
  itemListQueryForSitemap,
  pageListQueryForSitemap,
  tagListQueryForSitemap,
} from "@/sanity/lib/queries";
import type { MetadataRoute } from "next";

const site_url = process.env.NEXT_PUBLIC_APP_URL;

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
      url: "search",
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
      url: "pricing",
      lastModified: new Date(),
    },
    {
      url: "auth/login",
      lastModified: new Date(),
    },
    {
      url: "auth/register",
      lastModified: new Date(),
    },
    {
      url: "about",
      lastModified: new Date(),
    },
    {
      url: "privacy",
      lastModified: new Date(),
    },
    {
      url: "terms",
      lastModified: new Date(),
    },
  ];

  for (const route of sitemapRoutes) {
    // console.log(`sitemap, url:${site_url}/${route.url}`);
    sitemapList.push({
      url: `${site_url}/${route.url}`,
      lastModified: new Date(route.lastModified).toISOString(),
    });
  }

  const [
    itemListQueryResult,
    categoryListQueryResult,
    tagListQueryResult,
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
    sanityFetch<PageListQueryForSitemapResult>({
      query: pageListQueryForSitemap,
    }),
  ]);

  console.log("sitemap, itemListQueryResult size:", itemListQueryResult.length);
  console.log(
    "sitemap, categoryListQueryResult size:",
    categoryListQueryResult.length,
  );
  console.log("sitemap, tagListQueryResult size:", tagListQueryResult.length);
  console.log("sitemap, pageListQueryResult size:", pageListQueryResult.length);

  for (const item of itemListQueryResult) {
    if (item.slug) {
      const routeUrl = `/item/${item.slug}`;
      // console.log(`sitemap, url:${site_url}${routeUrl}`);
      sitemapList.push({
        url: `${site_url}${routeUrl}`,
        lastModified: new Date(item._updatedAt).toISOString(),
      });
    } else {
      console.warn(`sitemap, item slug invalid, id:${item._id}`);
    }
  }

  for (const category of categoryListQueryResult) {
    if (category.slug) {
      const routeUrl = `/category/${category.slug}`;
      // console.log(`sitemap, url:${site_url}${routeUrl}`);
      sitemapList.push({
        url: `${site_url}${routeUrl}`,
        lastModified: new Date(category._updatedAt).toISOString(),
      });

      const pageCount = Math.ceil(category.count / ITEMS_PER_PAGE);
      console.log(
        `sitemap, category:${category.slug}, count:${category.count}, pageCount:${pageCount}`,
      );
      for (let i = 2; i <= pageCount; i++) {
        const routeUrl = `/category/${category.slug}?page=${i}`;
        sitemapList.push({
          url: `${site_url}${routeUrl}`,
          lastModified: new Date(category._updatedAt).toISOString(),
        });
      }
    } else {
      console.warn(`sitemap, category slug invalid, id:${category._id}`);
    }
  }

  for (const tag of tagListQueryResult) {
    if (tag.slug) {
      const routeUrl = `/tag/${tag.slug}`;
      // console.log(`sitemap, url:${site_url}${routeUrl}`);
      sitemapList.push({
        url: `${site_url}${routeUrl}`,
        lastModified: new Date(tag._updatedAt).toISOString(),
      });

      const pageCount = Math.ceil(tag.count / ITEMS_PER_PAGE);
      console.log(
        `sitemap, tag:${tag.slug}, count:${tag.count}, pageCount:${pageCount}`,
      );
      for (let i = 2; i <= pageCount; i++) {
        const routeUrl = `/tag/${tag.slug}?page=${i}`;
        sitemapList.push({
          url: `${site_url}${routeUrl}`,
          lastModified: new Date(tag._updatedAt).toISOString(),
        });
      }
    } else {
      console.warn(`sitemap, tag slug invalid, id:${tag._id}`);
    }
  }

  for (const page of pageListQueryResult) {
    if (page.slug) {
      const routeUrl = `/page/${page.slug}`;
      // console.log(`sitemap, url:${site_url}${routeUrl}`);
      sitemapList.push({
        url: `${site_url}${routeUrl}`,
        lastModified: new Date(page._updatedAt).toISOString(),
      });
    } else {
      console.warn(`sitemap, page slug invalid, id:${page._id}`);
    }
  }

  console.log("sitemap end, size:", sitemapList.length);
  return sitemapList;
}
