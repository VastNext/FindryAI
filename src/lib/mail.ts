import { siteConfig } from "@/config/site";
import { ApprovalEmail } from "@/emails/approval-email";
import { NotifySubmissionEmail } from "@/emails/notify-submission-to-admin";
import { NotifySubmissionToUserEmail } from "@/emails/notify-submission-to-user";
import { PaymentNotifyAdminEmail } from "@/emails/payment-notify-admin";
import { PaymentSuccessEmail } from "@/emails/payment-success";
import RejectionEmail from "@/emails/rejection-email";
import { ResetPasswordEmail } from "@/emails/reset-password";
import VerifyEmail from "@/emails/verify-email";
import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);

const SITE_URL = process.env.NEXT_PUBLIC_APP_URL;

export const sendPasswordResetEmail = async (
  userName: string,
  email: string,
  token: string,
) => {
  const resetLink = `${SITE_URL}/auth/new-password?token=${token}`;

  await resend.emails.send({
    from: process.env.RESEND_EMAIL_FROM,
    to: email,
    subject: "Reset your password",
    react: ResetPasswordEmail({ userName, resetLink: resetLink }),
  });
};

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `${SITE_URL}/auth/new-verification?token=${token}`;

  await resend.emails.send({
    from: process.env.RESEND_EMAIL_FROM,
    to: email,
    subject: "Confirm your email",
    react: VerifyEmail({ confirmLink }),
  });
};

export const sendNotifySubmissionEmail = async (
  userName: string,
  userEmail: string,
  itemName: string,
  statusLink: string,
  reviewLink: string,
  priority?: boolean,
) => {
  // console.log(`sendNotifySubmissionEmail,
  //   userName: ${userName},
  //   userEmail: ${userEmail},
  //   itemName: ${itemName},
  //   reviewLink: ${reviewLink},
  //   statusLink: ${statusLink}`);

  await resend.emails.send({
    from: process.env.RESEND_EMAIL_FROM,
    to: userEmail,
    subject: "Thank you for your submission",
    react: NotifySubmissionToUserEmail({
      userName,
      itemName,
      statusLink,
      priority,
    }),
  });

  await resend.emails.send({
    from: process.env.RESEND_EMAIL_FROM,
    to: process.env.RESEND_EMAIL_ADMIN,
    subject: `New submission with ${itemName}`,
    react: NotifySubmissionEmail({ itemName, reviewLink }),
  });
};

export const sendPaymentSuccessEmail = async (
  userName: string,
  email: string,
  itemLink: string,
) => {
  // console.log(`sendPaymentSuccessEmail,
  //   email: ${email},
  //   userName: ${userName},
  //   itemLink: ${itemLink}`);

  await resend.emails.send({
    from: process.env.RESEND_EMAIL_FROM,
    to: email,
    subject: "Thank your for your submission",
    react: PaymentSuccessEmail({ userName, itemLink }),
  });
};

export const sendPaymentNotifyAdminEmail = async ({
  itemName,
  planLabel,
  amount,
  payerName,
  payerEmail,
  itemLink,
}: {
  itemName: string;
  planLabel: string;
  amount: number;
  payerName?: string;
  payerEmail?: string;
  itemLink: string;
}) => {
  await resend.emails.send({
    from: process.env.RESEND_EMAIL_FROM,
    to: process.env.RESEND_EMAIL_ADMIN,
    subject: `New payment: ${planLabel} - ${itemName} ($${amount.toFixed(2)})`,
    react: PaymentNotifyAdminEmail({
      itemName,
      planLabel,
      amount,
      payerName,
      payerEmail,
      itemLink,
    }),
  });
};

export interface SendApprovalEmailOptions {
  userName: string;
  email: string;
  itemName: string;
  itemLink?: string;
  dashboardLink?: string;
  pricingLink?: string;
  badgeLink?: string;
  isLive?: boolean;
}

export const sendApprovalEmail = async (
  optionsOrUserName: SendApprovalEmailOptions | string,
  email?: string,
  itemLink?: string,
) => {
  let opts: SendApprovalEmailOptions;
  if (typeof optionsOrUserName === "string") {
    opts = {
      userName: optionsOrUserName,
      email: email || "",
      itemName: "Your product",
      itemLink: itemLink || "",
      dashboardLink: `${siteConfig.url}/dashboard`,
      pricingLink: `${siteConfig.url}/pricing`,
      badgeLink: `${siteConfig.url}/submission-guidelines`,
      isLive: true,
    };
  } else {
    opts = optionsOrUserName;
  }

  await resend.emails.send({
    from: process.env.RESEND_EMAIL_FROM,
    to: opts.email,
    subject: `Cheers! ${opts.itemName || "Your product"} has been approved on ${siteConfig.name}`,
    react: ApprovalEmail({
      userName: opts.userName,
      itemName: opts.itemName,
      itemLink: opts.itemLink,
      dashboardLink: opts.dashboardLink,
      pricingLink: opts.pricingLink,
      badgeLink: opts.badgeLink,
      isLive: opts.isLive,
    }),
  });
};

export const sendRejectionEmail = async (
  userName: string,
  email: string,
  dashboardLink: string,
  rejectionReason?: string,
) => {
  await resend.emails.send({
    from: process.env.RESEND_EMAIL_FROM,
    to: email,
    subject: "Please check your submission",
    react: RejectionEmail({ userName, dashboardLink, rejectionReason }),
  });
};
