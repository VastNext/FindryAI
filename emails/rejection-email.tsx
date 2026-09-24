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

interface RejectionEmailProps {
  userName?: string;
  dashboardLink?: string;
  rejectionReason?: string;
}

const reasonBox = {
  backgroundColor: "#f8f9fc",
  border: "1px solid #e6ebf1",
  borderRadius: "5px",
  padding: "12px 16px",
  margin: "16px 0",
};

const reasonLabel = {
  ...paragraph,
  color: "#32325d",
  fontWeight: "bold",
  marginBottom: "4px",
};

const reasonText = {
  ...paragraph,
  color: "#32325d",
  whiteSpace: "pre-wrap" as const,
  wordBreak: "break-word" as const,
};

/**
 * https://demo.react.email/preview/welcome/stripe-welcome
 */
export const RejectionEmail = ({
  userName,
  dashboardLink,
  rejectionReason,
}: RejectionEmailProps) => {
  const baseUrl = getBaseUrl();
  return (
    <Html>
      <Head />
      <Preview>Your submission has been rejected</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={box}>
            <Img
              src={`${baseUrl}/logo.png`}
              width="32"
              height="32"
              alt="Logo"
            />
            <Hr style={hr} />
            <Text style={paragraph}>Hi {userName},</Text>
            <Text style={paragraph}>
              Thanks for submitting your product to{" "}
              <Link style={anchor} href={baseUrl}>
                {siteConfig.name}
              </Link>
              . We're sorry to inform you that your product has been rejected.
            </Text>
            {rejectionReason && (
              <Section style={reasonBox}>
                <Text style={reasonLabel}>Reason:</Text>
                <Text style={reasonText}>{rejectionReason}</Text>
              </Section>
            )}
            <Text style={paragraph}>
              Please review our{" "}
              <Link style={anchor} href={`${baseUrl}/submission-guidelines`}>
                submission guidelines
              </Link>
              , update your submission, and resubmit it for review.
            </Text>
            <Button style={button} href={dashboardLink}>
              View in dashboard
            </Button>
            <Hr style={hr} />
            <Text style={paragraph}>
              Thanks, <br />
              The{" "}
              <Link style={anchor} href={baseUrl}>
                {siteConfig.name}
              </Link>{" "}
              team
            </Text>
            <Hr style={hr} />
            <Text style={footer}>
              <span style={footerLeft}>
                &copy; {new Date().getFullYear()}
                &nbsp;&nbsp; All Rights Reserved.
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

RejectionEmail.PreviewProps = {
  userName: "Javayhu",
  dashboardLink: "https://findryai.com/dashboard",
  rejectionReason:
    "The information of the item is not clear. The description is only a copy of the page title (45 characters). Please provide a detailed product description (at least 80 characters) highlighting what the tool does, key features, and use cases.",
};

export default RejectionEmail;
