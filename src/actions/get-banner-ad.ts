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
    // 用 cache tag（sponsor-banner）做事件驱动失效：publish/webhook 里 revalidateTag
    // 统一刷新一次，平时零轮询；revalidate 仅作兜底（管理员在 Studio 手动改 sponsor
    // 状态时没有 code 事件可挂，最长 1 小时内自愈），数据走 Sanity CDN 控制成本
    const result = await sanityClient.fetch(
      sponsorItemListQuery,
      {},
      {
        useCdn: true,
        next: { tags: ["sponsor-banner"], revalidate: 3600 },
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
