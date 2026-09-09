import BlogGrid from "@/components/blog/blog-grid";
import EmptyGrid from "@/components/shared/empty-grid";
import { JsonLd } from "@/components/shared/json-ld";
import CustomPagination from "@/components/shared/pagination";
import { siteConfig } from "@/config/site";
import { getBlogs } from "@/data/blog";
import { POSTS_PER_PAGE } from "@/lib/constants";
import { constructMetadata, getPaginatedCanonicalUrl } from "@/lib/metadata";
import type { Metadata } from "next";

export const revalidate = 172800; // 48 hours ISR cache

export function generateMetadata({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}): Metadata {
  return constructMetadata({
    title: "Blog",
    description: "Read our latest blog posts",
    canonicalUrl: getPaginatedCanonicalUrl(
      `${siteConfig.url}/blog`,
      searchParams?.page,
    ),
  });
}

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  console.log("BlogIndexPage, searchParams", searchParams);
  const { page } = searchParams as { [key: string]: string };
  const currentPage = page ? Number(page) : 1;
  const { posts, totalCount } = await getBlogs({ currentPage });
  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);
  console.log(
    "BlogIndexPage, totalCount",
    totalCount,
    ", totalPages",
    totalPages,
  );

  const blogJsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: `${siteConfig.name} Blog`,
      description: "Read our latest blog posts",
      url: `${siteConfig.url}/blog`,
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
      ],
    },
  ];

  return (
    <div>
      <JsonLd data={blogJsonLd} />
      {/* when no posts are found */}
      {posts?.length === 0 && <EmptyGrid />}

      {/* when posts are found */}
      {posts && posts?.length > 0 && (
        <div>
          <BlogGrid posts={posts} />

          <div className="mt-8 flex items-center justify-center">
            <CustomPagination routePrefix="/blog" totalPages={totalPages} />
          </div>
        </div>
      )}
    </div>
  );
}
