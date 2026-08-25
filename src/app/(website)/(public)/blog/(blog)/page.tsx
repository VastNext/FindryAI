import BlogGrid from "@/components/blog/blog-grid";
import EmptyGrid from "@/components/shared/empty-grid";
import CustomPagination from "@/components/shared/pagination";
import { siteConfig } from "@/config/site";
import { getBlogs } from "@/data/blog";
import { POSTS_PER_PAGE } from "@/lib/constants";
import { constructMetadata, getPaginatedCanonicalUrl } from "@/lib/metadata";
import type { Metadata } from "next";

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

  return (
    <div>
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
