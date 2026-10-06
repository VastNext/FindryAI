import { checkBadge } from "@/lib/badge-verification";
import { resend } from "@/lib/mail";
import { sanityClient } from "@/sanity/lib/client";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type MonitoredItem = {
  _id: string;
  _rev: string;
  name: string;
  link?: string;
  slug?: { current?: string };
  categorySlugs?: string[];
  tagSlugs?: string[];
  collectionSlugs?: string[];
  badgeSiteUnavailableSince?: string;
  badgeUnavailableNotifiedAt?: string;
  badgeMissingSince?: string;
};

export async function GET(request: Request) {
  if (
    !process.env.CRON_SECRET ||
    request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ message: "未授权" }, { status: 401 });
  }

  try {
    const counts = { verified: 0, missing: 0, unavailable: 0, failed: 0 };
    const removedSlugs: string[] = [];
    const affectedPaths = new Set<string>();
    const items = await sanityClient.fetch<MonitoredItem[]>(
      `*[_type == "item" && pricePlan == "free" && freePlanStatus == "approved" && badgeReviewPriority == true && defined(publishDate)]{_id, _rev, name, link, slug, "categorySlugs": categories[]->slug.current, "tagSlugs": tags[]->slug.current, "collectionSlugs": collections[]->slug.current, badgeSiteUnavailableSince, badgeUnavailableNotifiedAt, badgeMissingSince}`,
      {},
      { useCdn: false },
    );
    for (const item of items) {
      try {
        const result = await checkBadge(item.link || "");
        if (result.status === "missing") {
          if (!item.badgeMissingSince) {
            await sanityClient
              .patch(item._id)
              .ifRevisionId(item._rev)
              .set({ badgeMissingSince: new Date().toISOString() })
              .commit();
            counts.missing++;
            continue;
          }
          if (
            Date.now() - new Date(item.badgeMissingSince).getTime() <
            20 * 60 * 60 * 1000
          ) {
            counts.missing++;
            continue;
          }
          const confirmation = await checkBadge(item.link || "");
          if (confirmation.status !== "missing") {
            if (confirmation.status === "unavailable") {
              console.warn("复核站点异常，保留已发布状态", item._id);
            } else {
              await sanityClient
                .patch(item._id)
                .ifRevisionId(item._rev)
                .unset([
                  "badgeMissingSince",
                  "badgeSiteUnavailableSince",
                  "badgeUnavailableNotifiedAt",
                ])
                .commit();
            }
            counts.unavailable++;
            continue;
          }
          await sanityClient
            .patch(item._id)
            .ifRevisionId(item._rev)
            .set({ freePlanStatus: "pending", badgeReviewPriority: false })
            .unset([
              "publishDate",
              "badgeVerifiedAt",
              "badgeSiteUnavailableSince",
              "badgeUnavailableNotifiedAt",
              "badgeMissingSince",
            ])
            .commit();
          revalidatePath("/");
          revalidatePath("/sitemap.xml");
          revalidatePath("/sitemap/items.xml");
          revalidatePath("/sitemap/alternatives.xml");
          revalidatePath("/search");
          for (const slug of item.categorySlugs || [])
            affectedPaths.add(`/category/${slug}`);
          for (const slug of item.tagSlugs || [])
            affectedPaths.add(`/tag/${slug}`);
          for (const slug of item.collectionSlugs || [])
            affectedPaths.add(`/collection/${slug}`);
          for (const path of Array.from(affectedPaths)) revalidatePath(path);
          if (item.slug?.current) {
            revalidatePath(`/item/${item.slug.current}`);
            revalidatePath(`/item/${item.slug.current}/alternatives`);
          }
          counts.missing++;
          if (item.slug?.current) removedSlugs.push(item.slug.current);
        } else if (result.status === "verified") {
          if (
            item.badgeSiteUnavailableSince ||
            item.badgeUnavailableNotifiedAt ||
            item.badgeMissingSince
          ) {
            await sanityClient
              .patch(item._id)
              .ifRevisionId(item._rev)
              .unset([
                "badgeSiteUnavailableSince",
                "badgeUnavailableNotifiedAt",
                "badgeMissingSince",
              ])
              .commit();
            if (item.slug?.current)
              revalidatePath(`/item/${item.slug.current}`);
          }
          counts.verified++;
        } else {
          console.warn(
            "徽章站点访问异常，保留发布状态",
            item._id,
            result.message,
          );
          const since = item.badgeSiteUnavailableSince;
          if (item.badgeMissingSince && since) {
            const updated = await sanityClient
              .patch(item._id)
              .ifRevisionId(item._rev)
              .unset(["badgeMissingSince"])
              .commit();
            item._rev = updated._rev;
            item.badgeMissingSince = undefined;
          }
          if (!since) {
            await sanityClient
              .patch(item._id)
              .ifRevisionId(item._rev)
              .set({ badgeSiteUnavailableSince: new Date().toISOString() })
              .unset(item.badgeMissingSince ? ["badgeMissingSince"] : [])
              .commit();
          } else if (
            !item.badgeUnavailableNotifiedAt &&
            Date.now() - new Date(since).getTime() >= 30 * 24 * 60 * 60 * 1000
          ) {
            if (
              !process.env.RESEND_EMAIL_FROM ||
              !process.env.RESEND_EMAIL_ADMIN
            ) {
              throw new Error("未配置管理员邮件收发地址");
            }
            // 先原子标记通知，避免并发巡检重复发送；邮件失败时撤销标记，下次重试。
            const notification = await sanityClient
              .patch(item._id)
              .ifRevisionId(item._rev)
              .set({ badgeUnavailableNotifiedAt: new Date().toISOString() })
              .commit();
            const { error } = await resend.emails.send({
              from: process.env.RESEND_EMAIL_FROM,
              to: process.env.RESEND_EMAIL_ADMIN,
              subject: "Findry AI 徽章站点连续 30 天不可用",
              text: `条目「${item.name}」的站点连续 30 天无法核验徽章，请人工检查：https://findryai.com/item/${item.slug?.current || ""}\n站点：${item.link || "未提供"}`,
            });
            if (error) {
              try {
                await sanityClient
                  .patch(item._id)
                  .ifRevisionId(notification._rev)
                  .unset(["badgeUnavailableNotifiedAt"])
                  .commit();
              } catch (rollbackError) {
                console.error(
                  "通知失败后清除标记失败",
                  item._id,
                  rollbackError,
                );
              }
              throw error;
            }
            if (item.slug?.current)
              revalidatePath(`/item/${item.slug.current}`);
          }
          counts.unavailable++;
        }
      } catch (error) {
        console.error("徽章巡检处理失败", item._id, error);
        counts.failed++;
      }
    }
    if (removedSlugs.length > 0) {
      // 与现有审核发布脚本一致：等 Sanity CDN 的旧快照过期后再次失效。
      await new Promise((resolve) => setTimeout(resolve, 65_000));
      for (const path of [
        "/",
        "/search",
        "/sitemap.xml",
        "/sitemap/items.xml",
        "/sitemap/alternatives.xml",
      ]) {
        revalidatePath(path);
      }
      for (const slug of removedSlugs) {
        revalidatePath(`/item/${slug}`);
        revalidatePath(`/item/${slug}/alternatives`);
      }
      for (const path of Array.from(affectedPaths)) {
        revalidatePath(path);
      }
    }
    return NextResponse.json(counts, { status: counts.failed > 0 ? 500 : 200 });
  } catch (error) {
    console.error("徽章巡检查询失败", error);
    return NextResponse.json({ message: "徽章巡检失败" }, { status: 500 });
  }
}
