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
  revalidate = 300,
  tags,
}: {
  query: string;
  params?: QueryParams;
  perspective?: Omit<ClientPerspective, "raw">;
  disableCache?: boolean;
  /** published 视角下的数据缓存秒数。页面级 ISR 取页面与 fetch 的最小值，默认 300。 */
  revalidate?: number;
  /** 缓存标签，配合 revalidateTag 做精准失效，替代「短 TTL + 撤回延迟」的折中。 */
  tags?: string[];
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
    // 公开列表默认 300s；详情页可传更长的 revalidate 并用 tags 精准失效，
    // 否则短 TTL 会让每个低频页面每次被爬虫抓到都重新渲染（Active CPU 大头）。
    next: {
      revalidate: disableCache ? 0 : revalidate,
      ...(tags?.length ? { tags } : {}),
    },
  });
}
