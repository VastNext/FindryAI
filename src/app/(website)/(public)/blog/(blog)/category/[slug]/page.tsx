import BlogGrid from "@/components/blog/blog-grid";
import EmptyGrid from "@/components/shared/empty-grid";
import { JsonLd } from "@/components/shared/json-ld";
import CustomPagination from "@/components/shared/pagination";
import { siteConfig } from "@/config/site";
import { getBlogs } from "@/data/blog";
import { POSTS_PER_PAGE } from "@/lib/constants";
import { constructMetadata, getPaginatedCanonicalUrl } from "@/lib/metadata";
import type { BlogCategoryMetadateQueryResult } from "@/sanity.types";
import { sanityFetch } from "@/sanity/lib/fetch";
import { blogCategoryMetadateQuery } from "@/sanity/lib/queries";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}): Promise<Metadata | undefined> {
  const category = await sanityFetch<BlogCategoryMetadateQueryResult>({
    query: blogCategoryMetadateQuery,
    params: { slug: params.slug },
  });
  if (!category) {
    console.warn(
      `generateMetadata, category not found for slug: ${params.slug}`,
    );
    return;
  }

  const ogImageUrl = new URL(`${siteConfig.url}/api/og`);
  ogImageUrl.searchParams.append("title", category.name);
  ogImageUrl.searchParams.append("description", category.description || "");
  ogImageUrl.searchParams.append("type", "Blog Category");

  return constructMetadata({
    title: `${category.name}`,
    description: category.description,
    canonicalUrl: getPaginatedCanonicalUrl(
      `${siteConfig.url}/blog/category/${params.slug}`,
      searchParams?.page,
    ),
    image: ogImageUrl.toString(),
  });
}

export default async function BlogCategoryPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const [category, { posts, totalCount }] = await Promise.all([
    sanityFetch<BlogCategoryMetadateQueryResult>({
      query: blogCategoryMetadateQuery,
      params: { slug: params.slug },
    }),
    (() => {
      const { page } = searchParams as { [key: string]: string };
      const currentPage = page ? Number(page) : 1;
      return getBlogs({
        category: params.slug,
        currentPage,
      });
    })(),
  ]);

  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);
  console.log(
    "BlogCategoryPage, totalCount",
    totalCount,
    ", totalPages",
    totalPages,
  );

  const categoryJsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: category?.name,
      ...(category?.description && { description: category.description }),
      url: `${siteConfig.url}/blog/category/${params.slug}`,
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: siteConfig.url,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Blog",
          item: `${siteConfig.url}/blog`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: category?.name || params.slug,
          item: `${siteConfig.url}/blog/category/${params.slug}`,
        },
      ],
    },
  ];

  return (
    <div>
      <JsonLd data={categoryJsonLd} />
      {/* when no posts are found */}
      {posts?.length === 0 && <EmptyGrid />}

      {/* when posts are found */}
      {posts && posts?.length > 0 && (
        <div>
          <BlogGrid posts={posts} />

          <div className="mt-8 flex items-center justify-center">
            <CustomPagination
              routePrefix={`/blog/category/${params.slug}`}
              totalPages={totalPages}
            />
          </div>
        </div>
      )}
    </div>
  );
}
