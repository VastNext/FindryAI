import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const SYNDICATION_URL = "https://cdn.syndication.twimg.com/tweet-result";
const TWEET_ID = /^\d{15,25}$/;
const FEATURES = [
  "tfw_timeline_list:",
  "tfw_follower_count_sunset:true",
  "tfw_tweet_edit_backend:on",
  "tfw_refsrc_session:on",
  "tfw_fosnr_soft_interventions_enabled:on",
  "tfw_show_birdwatch_pivots_enabled:on",
  "tfw_show_business_verified_badge:on",
  "tfw_duplicate_scribes_to_settings:on",
  "tfw_use_profile_image_shape_enabled:on",
  "tfw_show_blue_verified_badge:on",
  "tfw_legacy_timeline_sunset:true",
  "tfw_show_gov_verified_badge:on",
  "tfw_show_business_affiliate_badge:on",
  "tfw_tweet_edit_frontend:on",
].join(";");

/**
 * 与 react-tweet 官方 API 兼容的推文代理。
 * 浏览器直接请求 react-tweet.vercel.app 在部分网络不可达，改由本域代理，
 * 服务端带缓存请求 X syndication API。
 */
function syndicationToken(id: string) {
  return ((Number(id) / 1e15) * Math.PI).toString(36).replace(/(0+|\.)/g, "");
}

export async function GET(
  _request: Request,
  { params }: { params: { id: string } },
) {
  const id = params.id;
  if (!TWEET_ID.test(id)) {
    return NextResponse.json({ data: null }, { status: 400 });
  }

  const url = new URL(SYNDICATION_URL);
  url.searchParams.set("id", id);
  url.searchParams.set("lang", "en");
  url.searchParams.set("features", FEATURES);
  url.searchParams.set("token", syndicationToken(id));

  try {
    const response = await fetch(url, {
      headers: {
        accept: "application/json",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/137 Safari/537.36",
      },
      next: { revalidate: 3600 },
    });
    if (response.status === 404) {
      return NextResponse.json({ data: null });
    }
    if (!response.ok) {
      return NextResponse.json({ data: null }, { status: 502 });
    }
    const data = (await response.json()) as {
      __typename?: string;
      [key: string]: unknown;
    } | null;
    if (
      !data ||
      data.__typename === "TweetTombstone" ||
      Object.keys(data).length === 0
    ) {
      return NextResponse.json({ data: null });
    }
    return NextResponse.json(
      { data },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      },
    );
  } catch {
    return NextResponse.json({ data: null }, { status: 502 });
  }
}
