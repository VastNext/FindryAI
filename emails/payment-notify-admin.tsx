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

interface PaymentNotifyAdminEmailProps {
  itemName?: string;
  planLabel?: string;
  amount?: number;
  payerName?: string;
  payerEmail?: string;
  itemLink?: string;
}

/**
 * Admin notification for a successful payment (Pro / Sponsor).
 * Mirrors NotifySubmissionEmail structure.
 */
export const PaymentNotifyAdminEmail = ({
  itemName,
  planLabel,
  amount,
  payerName,
  payerEmail,
  itemLink,
}: PaymentNotifyAdminEmailProps) => {
  const baseUrl = getBaseUrl();
  return (
    <Html>
      <Head />
      <Preview>New payment: {planLabel}</Preview>
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
            <Text style={paragraph}>New payment received</Text>
            <Text style={paragraph}>
              A new payment was just completed on{" "}
              <Link style={anchor} href={baseUrl}>
                {siteConfig.name}
              </Link>
              :
            </Text>
            <Text style={paragraph}>
              Item: <b>{itemName}</b>
              <br />
              Plan: <b>{planLabel}</b>
              <br />
              Amount: <b>${(amount ?? 0).toFixed(2)} USD</b>
              <br />
              Paid by: {payerName} ({payerEmail})
            </Text>
            <Button style={button} href={itemLink}>
              View listing
            </Button>
            <Text style={paragraph}>
              Thanks, <br />
              The{" "}
              <Link style={anchor} href={baseUrl}>
                {siteConfig.name}
              </Link>{" "}
              bot
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

PaymentNotifyAdminEmail.PreviewProps = {
  itemName: "VastArcade",
  planLabel: "Pro Featured",
  amount: 19.9,
  payerName: "Amy",
  payerEmail: "amy@example.com",
  itemLink: "https://findryai.com/item/vastarcade",
} as PaymentNotifyAdminEmailProps;

export default PaymentNotifyAdminEmail;
