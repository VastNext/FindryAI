import { sanityClient } from "@/sanity/lib/client";
import { token } from "@/sanity/lib/token";
import type { ClientPerspective, QueryParams } from "next-sanity";

/**
 * https://www.sanity.io/plugins/next-sanity
 *
 * Used to fetch data in Server Components, it has built in support for handling Draft Mode and perspectives.
 * When using the "published" perspective then time-based revalidation is used,
 * set to match the time-to-live on Sanity's API CDN (60 seconds)
 * and will also fetch from the API CDN.
 * When using the "previewDrafts" perspective then the data is fetched from the live API and isn't cached,
 * it will also fetch draft content that isn't published yet.
 *
 * Do not call draftMode() here: it is a dynamic API, so calling it
 * unconditionally opts every route that fetches through sanityFetch into
 * dynamic rendering and defeats their ISR caches. Draft preview therefore
 * only stays enabled in development; published content in production is
 * refreshed via the /api/revalidate webhook or the revalidate window.
 */
export async function sanityFetch<QueryResponse>({
  query,
  params = {},
  perspective = process.env.NODE_ENV === "development"
    ? "previewDrafts"
    : "published",
  disableCache,
}: {
  query: string;
  params?: QueryParams;
  perspective?: Omit<ClientPerspective, "raw">;
  disableCache?: boolean;
}) {
  // console.log('sanityFetch, perspective', perspective, 'query', query);
  if (perspective === "previewDrafts") {
    return sanityClient.fetch<QueryResponse>(query, params, {
      perspective: "previewDrafts",
      // The token is required to fetch draft content
      token,
      // The `previewDrafts` perspective isn't available on the API CDN
      useCdn: false,
      // And we can't cache the responses as it would slow down the live preview experience
      next: { revalidate: 0 },
    });
  }
  return sanityClient.fetch<QueryResponse>(query, params, {
    perspective: "published",
    // The `published` perspective is available on the API CDN
    useCdn: !disableCache,
    // 公开列表缩短缓存周期，避免撤回后长时间展示旧条目。
    next: { revalidate: disableCache ? 0 : 300 },
  });
}
