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

export interface ApprovalEmailProps {
  userName?: string;
  itemName?: string;
  itemLink?: string;
  dashboardLink?: string;
  pricingLink?: string;
  badgeLink?: string;
  isLive?: boolean;
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

const smallButton = {
  ...button,
  backgroundColor: "#4f46e5",
  borderRadius: "6px",
  fontSize: "14px",
  padding: "9px 18px",
  display: "inline-block",
  width: "auto",
};

const outlineButton = {
  ...button,
  backgroundColor: "#ffffff",
  border: "1px solid #d1d5db",
  color: "#374151",
  borderRadius: "6px",
  fontSize: "14px",
  padding: "8px 16px",
  display: "inline-block",
  width: "auto",
};

export const ApprovalEmail = ({
  userName = "there",
  itemName = "Your product",
  itemLink,
  dashboardLink = `${siteConfig.url}/dashboard`,
  pricingLink = `${siteConfig.url}/pricing`,
  badgeLink = `${siteConfig.url}/submission-guidelines`,
  isLive = false,
}: ApprovalEmailProps) => {
  const baseUrl = getBaseUrl();
  const previewText = `Cheers! ${itemName} has been approved on ${siteConfig.name}`;

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
            <Text style={paragraph}>
              Cheers, <b>{itemName}</b> has been approved!
            </Text>
            <Text style={paragraph}>
              Your product has passed our editorial quality review and is
              officially accepted into the{" "}
              <Link style={anchor} href={baseUrl}>
                {siteConfig.name}
              </Link>{" "}
              directory.
            </Text>

            {isLive && itemLink ? (
              <Section style={{ margin: "20px 0" }}>
                <Text style={paragraph}>
                  Your public listing is live on our directory:
                </Text>
                <Button style={smallButton} href={itemLink}>
                  View Your Live Product →
                </Button>
              </Section>
            ) : (
              <Text style={paragraph}>
                Your product is in our standard listing queue and scheduled for
                publication. Want to skip the queue or get instant featured
                visibility? Here are two ways to fast-track your launch:
              </Text>
            )}

            {/* Fast-track option 1: Free Badge */}
            <Section style={cardBox}>
              <Text style={cardHeading}>
                ⚡ 1. Fast-Track with our Official Badge (100% Free)
              </Text>
              <Text style={cardBody}>
                Add our official badge to your website. Once verified, your
                listing receives fast-track priority review (within 24-72
                hours), immediate priority publication, and an authoritative
                dofollow backlink to boost your SEO.
              </Text>
              <Button style={outlineButton} href={badgeLink}>
                Get Your Badge Code →
              </Button>
            </Section>

            {/* Fast-track option 2: Pro Featured */}
            <Section style={cardBox}>
              <Text style={cardHeading}>
                🚀 2. Pro Featured Placement (Launch Offer $19.9)
              </Text>
              <Text style={cardBody}>
                Need immediate traffic and high-authority visibility?
                <br />• Featured placement at the top of the homepage & category
                for 30 days
                <br />• 3 dedicated dofollow backlinks
                <br />• Inclusion in newsletters & daily updates
                <br />• Instant priority publishing
              </Text>
              <Button style={smallButton} href={pricingLink}>
                Upgrade to Pro ($19.9) →
              </Button>
            </Section>

            <Hr style={hr} />

            <Text style={paragraph}>
              You can track your submission status, update screenshots, or edit
              product information anytime from your dashboard:
            </Text>
            <Button style={outlineButton} href={dashboardLink}>
              Manage on Dashboard →
            </Button>

            <Hr style={hr} />

            <Text style={paragraph}>
              Kind regards,
              <br />
              The{" "}
              <Link style={anchor} href={baseUrl}>
                {siteConfig.name}
              </Link>{" "}
              team
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

ApprovalEmail.PreviewProps = {
  userName: "Alex",
  itemName: "Awesome AI Tool",
  itemLink: "https://findryai.com/item/awesome-ai",
  dashboardLink: "https://findryai.com/dashboard",
  pricingLink: "https://findryai.com/pricing",
  badgeLink: "https://findryai.com/submission-guidelines",
  isLive: false,
} as ApprovalEmailProps;

export default ApprovalEmail;
