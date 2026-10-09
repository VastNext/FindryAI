import CollectionGrid from "@/components/collection/collection-grid";
import Container from "@/components/container";
import EmptyGrid from "@/components/shared/empty-grid";
import { HeaderSection } from "@/components/shared/header-section";
import CustomPagination from "@/components/shared/pagination";
import { siteConfig } from "@/config/site";
import { getCollections, getCollectionsTotalCount } from "@/data/collection";
import { COLLECTIONS_PER_PAGE } from "@/lib/constants";
import { constructMetadata, getPaginatedCanonicalUrl } from "@/lib/metadata";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const revalidate = 172800; // 48 hours ISR cache

const isOutOfRangePage = (currentPage: number, totalPages: number) =>
  !Number.isFinite(currentPage) || currentPage < 1 || currentPage > totalPages;

/**
 * An empty hub (or an out-of-range ?page=) renders an empty state at HTTP 200
 * — Google flags that as Soft 404 (see GSC coverage). The root layout's
 * Suspense boundary flushes the shell before a dynamic page's notFound() can
 * set a real 404 status, so the honest signal available is conditional
 * noindex: the URL moves to "Excluded by 'noindex' tag" instead of failing
 * Soft-404 validation. Revisit to a real 404 if the root layout ever stops
 * streaming its shell early.
 */
export async function generateMetadata({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}): Promise<Metadata> {
  const { page } = searchParams as { [key: string]: string };
  const currentPage = page ? Number(page) : 1;
  const totalCount = await getCollectionsTotalCount();
  const isDeadPage = isOutOfRangePage(
    currentPage,
    Math.ceil(totalCount / COLLECTIONS_PER_PAGE),
  );
  return constructMetadata({
    title: "Collection",
    description: "Explore by collection",
    canonicalUrl: getPaginatedCanonicalUrl(
      `${siteConfig.url}/collection`,
      searchParams?.page,
    ),
    noIndex: isDeadPage,
  });
}

/**
 * https://www.uneed.best/alternatives
 * https://bestdirectories.org/collections
 */
export default async function CollectionIndexPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const { page } = searchParams as { [key: string]: string };
  const currentPage = page ? Number(page) : 1;
  const { collections, totalCount } = await getCollections({
    currentPage,
  });
  const totalPages = Math.ceil(totalCount / COLLECTIONS_PER_PAGE);

  // generateMetadata already noindexed dead pages; this notFound keeps the
  // human-facing body honest (404-styled page instead of an empty grid).
  if (isOutOfRangePage(currentPage, totalPages)) {
    notFound();
  }

  return (
    <div className="mb-16">
      <div className="mt-8">
        <div className="w-full flex flex-col items-center justify-center gap-8">
          <HeaderSection
            labelAs="h1"
            label="Collection"
            titleAs="h2"
            title="Explore by collections"
          />
        </div>
      </div>

      <Container className="mt-8">
        <div>
          {/* when no items are found */}
          {collections?.length === 0 && <EmptyGrid />}

          {/* when items are found */}
          {collections && collections.length > 0 && (
            <section className="">
              <CollectionGrid collections={collections} />

              <div className="mt-8 flex items-center justify-center">
                <CustomPagination
                  routePrefix="/collection"
                  totalPages={totalPages}
                />
              </div>
            </section>
          )}
        </div>
      </Container>
    </div>
  );
}
