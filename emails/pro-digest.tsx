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
  hr,
  main,
  paragraph,
} from "./email-formats";

type DigestItem = {
  name: string;
  description: string;
  url: string;
};

export const ProDigestEmail = ({
  items,
  unsubscribeEmail,
}: {
  items: DigestItem[];
  unsubscribeEmail?: string;
}) => {
  const baseUrl = getBaseUrl();
  const unsubscribeUrl = unsubscribeEmail
    ? `${baseUrl}/unsubscribe?email=${encodeURIComponent(unsubscribeEmail)}`
    : `${baseUrl}/newsletter`;

  return (
    <Html>
      <Head />
      <Preview>New Pro tools just went live on Findry AI</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={box}>
            <Img
              src={`${baseUrl}/logo.png`}
              width="32"
              height="32"
              alt="Findry AI"
            />
            <Text style={{ ...paragraph, marginTop: "16px" }}>
              Fresh from the Pro queue — the newest featured tools on{" "}
              {siteConfig.name}:
            </Text>

            {items.map((item) => (
              <Section
                key={item.url}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  padding: "16px",
                  marginTop: "12px",
                }}
              >
                <Text style={{ ...paragraph, fontWeight: 600, margin: 0 }}>
                  {item.name}
                </Text>
                {item.description && (
                  <Text style={{ ...paragraph, marginTop: "8px" }}>
                    {item.description}
                  </Text>
                )}
                <Link href={item.url} style={{ ...anchor, fontSize: "14px" }}>
                  View listing →
                </Link>
              </Section>
            ))}

            <Section style={{ marginTop: "24px", textAlign: "center" }}>
              <Button
                href={`${baseUrl}/?utm_source=findryai.com&utm_medium=email&utm_campaign=pro-digest`}
                style={button}
              >
                Browse the directory
              </Button>
            </Section>

            <Hr style={hr} />
            <Text style={paragraph}>
              You are receiving this because you subscribed to the{" "}
              {siteConfig.name} newsletter.{" "}
              <Link href={unsubscribeUrl} style={anchor}>
                Unsubscribe
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default ProDigestEmail;
