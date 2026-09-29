"use server";

import { getItemTargetLinkInWebsite } from "@/lib/utils";
import { sanityClient } from "@/sanity/lib/client";
import { sponsorItemListQuery } from "@/sanity/lib/queries";

export type BannerAdData = {
  content: string;
  url: string;
};

export type ServerActionResponse = {
  status: "success" | "error";
  message?: string;
  data?: BannerAdData;
};

export async function getBannerAd(): Promise<ServerActionResponse> {
  try {
    // Banner 是全站每页展示的客户端轮询 action，不经过页面级 ISR；
    // 这里不能用 sanityFetch 的 48h 缓存（revalidatePath 清不到 action 内的 fetch），
    // 改用 60s 短缓存：新 Sponsor 发布后 banner 最长 60 秒内可见，同时走 CDN 控制成本
    const result = await sanityClient.fetch(
      sponsorItemListQuery,
      {},
      {
        useCdn: true,
        next: { revalidate: 60 },
      },
    );

    // console.log("getBannerAd, result", result);

    // we only show the first sponsor item as banner ad
    if (result && result.length > 0) {
      return {
        status: "success",
        message: "Banner ad fetched successfully!",
        data: {
          content: `🎉 ${result[0].name}: ${result[0].description}`,
          url: getItemTargetLinkInWebsite(result[0]),
        },
      };
    }

    return {
      status: "error",
      message: "no banner ad!",
      data: null,
    };
  } catch (error) {
    console.log("getBannerAd, error", error);
    return {
      status: "error",
      message: "Failed to fetch banner ad!",
      data: null,
    };
  }
}
