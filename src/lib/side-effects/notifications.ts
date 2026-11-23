import { PaymentNotifyAdminEmail } from "@/emails/payment-notify-admin";
import { PaymentSuccessEmail } from "@/emails/payment-success";
import { ProDigestEmail } from "@/emails/pro-digest";
import { resend } from "@/lib/mail";
import type { ReactElement } from "react";
import { classifySendResult } from "./pure";
import type { SendOutcome } from "./types";

type EmailPayload = {
  from: string;
  to: string;
  subject: string;
  react: ReactElement;
  idempotencyKey?: string;
};

const SINK_TIMEOUT_MS = 10_000;

async function sendViaSink(payload: EmailPayload): Promise<SendOutcome> {
  const url = process.env.MAIL_SINK_URL;
  if (!url) {
    return {
      status: "unknown",
      errorCode: "MAIL_SINK_MISSING",
      errorMessage: "MAIL_TRANSPORT=sink but MAIL_SINK_URL is empty",
    };
  }
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(payload.idempotencyKey
          ? { "idempotency-key": payload.idempotencyKey }
          : {}),
      },
      body: JSON.stringify({
        from: payload.from,
        to: payload.to,
        subject: payload.subject,
      }),
      signal: AbortSignal.timeout(SINK_TIMEOUT_MS),
    });
    if (!response.ok) {
      return classifySendResult({
        ok: false,
        httpStatus: response.status,
        errorCode: "NOTIFY_REJECTED",
        errorMessage: (await response.text()).slice(0, 300),
      });
    }
    const body = (await response.json().catch(() => ({}))) as { id?: string };
    return classifySendResult({
      ok: true,
      httpStatus: response.status,
      messageId: body.id,
    });
  } catch (error) {
    return {
      status: "unknown",
      errorCode: "NOTIFY_TIMEOUT",
      errorMessage:
        error instanceof Error ? error.message.slice(0, 300) : "sink failure",
    };
  }
}

/**
 * Resend 发送结果三分：sent / failed（明确 4xx）/ unknown（超时、5xx、网络中断）。
 * 必须检查 { error }；仅 try/catch 会把确定失败误记为成功。
 */
export async function sendEmailTracked(
  payload: EmailPayload,
): Promise<SendOutcome> {
  if (process.env.MAIL_TRANSPORT === "sink") return sendViaSink(payload);
  try {
    const result = await resend.emails.send({
      from: payload.from,
      to: payload.to,
      subject: payload.subject,
      react: payload.react,
      ...(payload.idempotencyKey
        ? { headers: { "Idempotency-Key": payload.idempotencyKey } }
        : {}),
    });
    if (result.error) {
      const rawError = result.error as unknown as { statusCode?: number };
      const statusCode =
        typeof rawError.statusCode === "number"
          ? rawError.statusCode
          : undefined;
      return classifySendResult({
        ok: false,
        httpStatus: statusCode,
        errorCode:
          statusCode && statusCode < 500
            ? "NOTIFY_REJECTED"
            : "NOTIFY_UNKNOWN_RESPONSE",
        errorMessage:
          `${result.error.name ?? "error"}: ${result.error.message ?? ""}`.slice(
            0,
            300,
          ),
      });
    }
    return classifySendResult({
      ok: true,
      httpStatus: 200,
      messageId: result.data?.id,
    });
  } catch (error) {
    return {
      status: "unknown",
      errorCode: "NOTIFY_TIMEOUT",
      errorMessage:
        error instanceof Error
          ? error.message.slice(0, 300)
          : "unknown failure",
    };
  }
}

export async function sendPaymentSuccessTracked(args: {
  userName: string;
  email: string;
  itemLink: string;
  idempotencyKey: string;
}): Promise<SendOutcome> {
  const from = process.env.RESEND_EMAIL_FROM;
  if (!from) {
    return { status: "unknown", errorCode: "MAIL_FROM_MISSING" };
  }
  return sendEmailTracked({
    from,
    to: args.email,
    subject: "Thank your for your submission",
    react: PaymentSuccessEmail({
      userName: args.userName,
      itemLink: args.itemLink,
    }),
    idempotencyKey: `${args.idempotencyKey}:user`,
  });
}

export async function sendAdminPaymentTracked(args: {
  itemName: string;
  planLabel: string;
  amount: number;
  payerName?: string;
  payerEmail?: string;
  itemLink: string;
  idempotencyKey: string;
}): Promise<SendOutcome> {
  const from = process.env.RESEND_EMAIL_FROM;
  const to = process.env.RESEND_EMAIL_ADMIN;
  if (!from || !to) {
    return { status: "unknown", errorCode: "MAIL_ADMIN_MISSING" };
  }
  return sendEmailTracked({
    from,
    to,
    subject: `New payment: ${args.planLabel} - ${args.itemName} ($${args.amount.toFixed(2)})`,
    react: PaymentNotifyAdminEmail({
      itemName: args.itemName,
      planLabel: args.planLabel,
      amount: args.amount,
      payerName: args.payerName,
      payerEmail: args.payerEmail,
      itemLink: args.itemLink,
    }),
    idempotencyKey: `${args.idempotencyKey}:admin`,
  });
}

export async function sendDigestTracked(args: {
  to: string;
  subject: string;
  items: { name: string; description: string; url: string }[];
  idempotencyKey: string;
}): Promise<SendOutcome> {
  const from = process.env.RESEND_EMAIL_FROM;
  if (!from) return { status: "unknown", errorCode: "MAIL_FROM_MISSING" };
  return sendEmailTracked({
    from,
    to: args.to,
    subject: args.subject,
    react: ProDigestEmail({ items: args.items, unsubscribeEmail: args.to }),
    idempotencyKey: args.idempotencyKey,
  });
}

export async function sendDiscordTracked(args: {
  sessionId: string;
  customerId: string;
  userName: string;
  amount: number;
}): Promise<SendOutcome> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl)
    return { status: "skipped", reason: "DISCORD_NOT_CONFIGURED" };
  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        username: "Findry AI Bot",
        avatar_url: "https://findryai.com/logo.png",
        embeds: [
          {
            title: "🎉 New Purchase",
            color: 0x4caf50,
            fields: [
              { name: "Username", value: args.userName, inline: true },
              {
                name: "Amount",
                value: `$${args.amount.toFixed(2)}`,
                inline: true,
              },
              {
                name: "Customer ID",
                value: `\`${args.customerId}\``,
                inline: false,
              },
              {
                name: "Session ID",
                value: `\`${args.sessionId}\``,
                inline: false,
              },
            ],
            timestamp: new Date().toISOString(),
          },
        ],
      }),
      signal: AbortSignal.timeout(SINK_TIMEOUT_MS),
    });
    if (!response.ok) {
      return classifySendResult({
        ok: false,
        httpStatus: response.status,
        errorCode:
          response.status === 429 ? "NOTIFY_RATE_LIMITED" : "NOTIFY_REJECTED",
        errorMessage: (await response.text()).slice(0, 200),
      });
    }
    return { status: "sent", httpStatus: response.status };
  } catch (error) {
    return {
      status: "unknown",
      errorCode: "NOTIFY_TIMEOUT",
      errorMessage:
        error instanceof Error
          ? error.message.slice(0, 200)
          : "discord failure",
    };
  }
}
