import Container from "@/components/container";
import { Gpt6AstraLanding } from "@/components/gpt-6-astra/gpt-6-astra-landing";
import { siteConfig } from "@/config/site";
import { faqs, gpt6Astra } from "@/data/gpt-6-astra";
import { constructMetadata } from "@/lib/metadata";

const baseMetadata = constructMetadata({
  title: "Try GPT-6 Astra — Access, Pricing & Token-Saving Tips",
  description: gpt6Astra.description,
  canonicalUrl: `${siteConfig.url}/gpt-6-astra`,
});

export const metadata = {
  ...baseMetadata,
  openGraph: {
    ...baseMetadata.openGraph,
    url: `${siteConfig.url}/gpt-6-astra`,
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

export default function Gpt6AstraPage() {
  return (
    <Container className="mt-0 pb-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Gpt6AstraLanding />
    </Container>
  );
}
