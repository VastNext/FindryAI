import { siteConfig } from "@/config/site";
import { getBaseUrl } from "@/lib/utils";
import {
  Body,
  Button,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import {
  anchor,
  box,
  button,
  container,
  footer,
  footerLeft,
  footerRight,
  hr,
  main,
  paragraph,
} from "./email-formats";

interface NotifySubmissionToUserEmailProps {
  userName?: string;
  itemName?: string;
  statusLink?: string;
  dashboardLink?: string;
  priority?: boolean;
}

const cardBox = {
  backgroundColor: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: "8px",
  padding: "16px 20px",
  margin: "16px 0",
};

const cardHeading = {
  color: "#111827",
  fontSize: "16px",
  fontWeight: "bold" as const,
  margin: "0 0 8px 0",
};

const cardBody = {
  ...paragraph,
  fontSize: "14px",
  lineHeight: "22px",
  margin: "0 0 14px 0",
};

const primaryButton = {
  ...button,
  backgroundColor: "#4f46e5",
  borderRadius: "6px",
  fontSize: "14px",
  padding: "10px 18px",
  display: "inline-block",
  width: "auto",
};

const secondaryButton = {
  ...button,
  backgroundColor: "#ffffff",
  border: "1px solid #d1d5db",
  color: "#374151",
  borderRadius: "6px",
  fontSize: "14px",
  padding: "9px 16px",
  display: "inline-block",
  width: "auto",
};

const listNote = {
  ...paragraph,
  fontSize: "13px",
  lineHeight: "20px",
  color: "#6b7280",
  margin: "4px 0",
};

/**
 * https://demo.react.email/preview/welcome/stripe-welcome
 */
export const NotifySubmissionToUserEmail = ({
  userName = "there",
  itemName = "Your product",
  statusLink,
  dashboardLink,
  priority = false,
}: NotifySubmissionToUserEmailProps) => {
  const baseUrl = getBaseUrl();
  const effectiveDashboardLink = dashboardLink || `${baseUrl}/dashboard`;
  const effectiveStatusLink = statusLink || `${baseUrl}/dashboard`;

  const previewText = priority
    ? `Submission received: ${itemName} joined the Priority Queue`
    : `${itemName} is waiting in a long review queue`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={box}>
            <Img
              src={`${baseUrl}/logo.png`}
              width="32"
              height="32"
              alt={siteConfig.name}
            />
            <Hr style={hr} />
            <Text style={paragraph}>Hi {userName},</Text>

            {priority ? (
              // 已验证徽章的优先入队通知
              <>
                <Text style={paragraph}>
                  Thank you for submitting <b>{itemName}</b> to {siteConfig.name}!
                </Text>
                <Text style={paragraph}>
                  Great news: because our badge was verified on your website, your
                  product has joined our <b>Fast-Track Priority Queue</b>.
                </Text>
                <Text style={paragraph}>
                  Our editorial team typically completes reviews within{" "}
                  <b>24–72 hours</b>. Once approved, your product will be published
                  with a followed listing link.
                </Text>
                <Button style={primaryButton} href={effectiveDashboardLink}>
                  View submission status
                </Button>
              </>
            ) : (
              // 未加徽章的普通队列痛点与转化邮件
              <>
                <Text style={paragraph}>
                  Thanks for submitting <b>{itemName}</b> to {siteConfig.name}. We
                  want to be completely straight with you about where your
                  submission stands right now.
                </Text>
                <Text style={paragraph}>
                  Your app is currently in our <b>standard community queue</b>, which
                  holds a large backlog of submissions and is growing much faster
                  than our editorial team can review it. At our current rate, most
                  apps in the standard queue will not be reviewed for a very long
                  time, and <b>we cannot guarantee when (or if) this listing will be reached</b>.
                </Text>
                <Text style={paragraph}>
                  If you would like to move your listing to the front of the queue, you
                  have two options:
                </Text>

                {/* Option 1: Badge (Free) */}
                <div style={cardBox}>
                  <p style={cardHeading}>
                    Option 1: Add our Verified Badge (100% Free Fast-Track)
                  </p>
                  <p style={cardBody}>
                    Add our "Featured on Findry AI" badge or backlink to your website
                    homepage or footer. Once detected, your listing automatically
                    moves to our <b>Fast-Track Priority Queue (reviewed in 24–72 hours)</b>{" "}
                    and receives a followed listing link upon publication.
                  </p>
                  <Button style={primaryButton} href={effectiveDashboardLink}>
                    Get Badge Code &amp; Verify
                  </Button>
                </div>

                {/* Option 2: Expedite Review (Paid) */}
                <div style={cardBox}>
                  <p style={cardHeading}>
                    Option 2: Expedited Review &amp; Pro Promotion (One-Time)
                  </p>
                  <p style={cardBody}>
                    Need immediate visibility? Move your listing straight to the
                    front for editorial review within <b>12–24 hours</b>. If anything
                    in your submission needs improvement, our team will guide you
                    directly instead of just declining it. Includes featured
                    placement and dofollow links.
                  </p>
                  <Button style={secondaryButton} href={effectiveStatusLink}>
                    Expedite Review with Pro
                  </Button>
                </div>

                <Hr style={hr} />
                <Text style={paragraph}>
                  <b>A few things worth knowing:</b>
                </Text>
                <Text style={listNote}>
                  • Priority options expedite review time and editorial attention; standard quality guidelines still apply to all apps.
                </Text>
                <Text style={listNote}>
                  • Not interested in fast-tracking? Nothing changes. Your app remains in the standard queue, and no action is required on your part.
                </Text>
              </>
            )}

            <Hr style={hr} />
            <Text style={paragraph}>
              Thank you for choosing{" "}
              <Link style={anchor} href={baseUrl}>
                {siteConfig.name}
              </Link>
              . We look forward to helping you reach more users!
            </Text>
            <Text style={paragraph}>
              Best regards,<br />
              The{" "}
              <Link style={anchor} href={baseUrl}>
                {siteConfig.name}
              </Link>{" "}
              Team
            </Text>
            <Hr style={hr} />
            <Text style={footer}>
              <span style={footerLeft}>
                &copy; {new Date().getFullYear()} {siteConfig.name}. All Rights
                Reserved.
              </span>
              <span style={footerRight}>
                <Link style={anchor} href={siteConfig.links.twitter}>
                  Twitter
                </Link>
                &nbsp;&nbsp;&nbsp;&nbsp;
                <Link style={anchor} href={siteConfig.links.github}>
                  GitHub
                </Link>
              </span>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

NotifySubmissionToUserEmail.PreviewProps = {
  userName: "Alex",
  itemName: "Awesome AI Tool",
  statusLink: "https://findryai.com/payment/example-id",
  dashboardLink: "https://findryai.com/dashboard",
  priority: false,
} as NotifySubmissionToUserEmailProps;

export default NotifySubmissionToUserEmail;
