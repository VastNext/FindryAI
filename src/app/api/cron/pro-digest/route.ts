import { ProDigestEmail } from "@/emails/pro-digest";
import { resend } from "@/lib/mail";
import { siteConfig } from "@/config/site";
import { sanityClient } from "@/sanity/lib/client";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type ProItem = {
  name: string;
  description?: string;
  slug: { current?: string };
};

type AudienceContact = {
  id: string;
  email: string;
  unsubscribed: boolean;
};

const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

/**
 * Weekly Pro digest: emails newsletter subscribers about Pro items published
 * in the last `weeks` (default 1). Fully automated — no manual ops.
 * GET /api/cron/pro-digest?weeks=1[&dryRun=1]  (Authorization: Bearer CRON_SECRET)
 */
export async function GET(request: Request) {
  if (
    !process.env.CRON_SECRET ||
    request.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ message: "未授权" }, { status: 401 });
  }

  const url = new URL(request.url);
  const weeks = Math.min(
    Math.max(Number(url.searchParams.get("weeks") ?? 1), 1),
    12,
  );
  const dryRun = url.searchParams.get("dryRun") === "1";
  const cutoff = new Date(Date.now() - weeks * MS_PER_WEEK).toISOString();

  const items = await sanityClient.fetch<ProItem[]>(
    `*[_type == "item" && pricePlan == "pro" && proPlanStatus == "success"
      && defined(publishDate) && defined(slug.current) && defined(description)
      && publishDate >= $cutoff && forceHidden != true]
     | order(publishDate desc) {
       name, description, "slug": slug.current
     }`,
    { cutoff },
  );

  if (items.length === 0) {
    return NextResponse.json({
      message: "no new Pro items in the window; nothing to send",
      cutoff,
    });
  }

  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || siteConfig.url;
  const digest = items.map((item) => ({
    name: item.name,
    description: item.description ?? "",
    url: `${siteUrl}/item/${item.slug.current}?utm_source=findryai.com&utm_medium=email&utm_campaign=pro-digest`,
  }));
  const subject = `${items.length} new Pro ${items.length === 1 ? "tool" : "tools"} on ${siteConfig.name}`;

  if (dryRun) {
    return NextResponse.json({
      dryRun: true,
      subject,
      cutoff,
      items: digest.map((d) => d.name),
    });
  }

  const audienceId = process.env.RESEND_AUDIENCE_ID;
  const from = process.env.RESEND_EMAIL_FROM;
  if (!audienceId || !from) {
    return NextResponse.json(
      { message: "RESEND_AUDIENCE_ID / RESEND_EMAIL_FROM not configured" },
      { status: 500 },
    );
  }

  // SDK 3.5 contacts.list has no pagination params and wraps the array one
  // level deep (data.data).
  const page = await resend.contacts.list({ audienceId });
  if (page.error || !page.data) {
    return NextResponse.json(
      { message: "contacts.list failed", error: page.error },
      { status: 500 },
    );
  }
  const contacts: AudienceContact[] = page.data.data;

  const recipients = contacts
    .filter((c) => !c.unsubscribed)
    .map((c) => c.email);
  if (recipients.length === 0) {
    return NextResponse.json({ message: "no subscribed contacts" });
  }

  let sent = 0;
  for (let i = 0; i < recipients.length; i += 100) {
    const chunk = recipients.slice(i, i + 100);
    const result = await resend.batch.send(
      chunk.map((to) => ({
        from,
        to,
        subject,
        react: ProDigestEmail({ items: digest, unsubscribeEmail: to }),
      })),
    );
    if (result.error) {
      return NextResponse.json(
        { message: `batch send failed at offset ${i}`, error: result.error },
        { status: 500 },
      );
    }
    sent += chunk.length;
  }

  return NextResponse.json({
    message: "pro digest sent",
    recipients: sent,
    items: digest.map((d) => d.name),
  });
}
