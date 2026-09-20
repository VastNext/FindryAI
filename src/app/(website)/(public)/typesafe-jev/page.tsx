import Container from "@/components/container";
import { TypesafeJevLanding } from "@/components/typesafe-jev/typesafe-jev-landing";
import { siteConfig } from "@/config/site";
import { faqs, typesafeJev } from "@/data/typesafe-jev";
import { constructMetadata } from "@/lib/metadata";

const baseMetadata = constructMetadata({
  title:
    "TypeSafe Jev AI 深度全解 — System One 架构、RLCD 训练、SDK 实战与降本指南",
  description: typesafeJev.description,
  canonicalUrl: `${siteConfig.url}/typesafe-jev`,
});

export const metadata = {
  ...baseMetadata,
  openGraph: {
    ...baseMetadata.openGraph,
    url: `${siteConfig.url}/typesafe-jev`,
  },
};

export const revalidate = 172800; // 48 hours ISR cache

// FAQPage structured data for rich results in search
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default function TypesafeJevPage() {
  return (
    <Container className="mt-0 pb-0">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Valid JSON-LD schema
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <TypesafeJevLanding />
    </Container>
  );
}
