import Container from "@/components/container";
import { Gemini4ArgonLanding } from "@/components/gemini-4-argon/gemini-4-argon-landing";
import { siteConfig } from "@/config/site";
import { faqs, gemini4Argon } from "@/data/gemini-4-argon";
import { constructMetadata } from "@/lib/metadata";

const baseMetadata = constructMetadata({
  title:
    "Gemini 4 Argon AI Deep Dive — 1M Output Tokens, vs GPT-6 & Claude, Pricing & Benchmarks",
  description: gemini4Argon.description,
  canonicalUrl: `${siteConfig.url}/gemini-4-argon`,
});

export const metadata = {
  ...baseMetadata,
  openGraph: {
    ...baseMetadata.openGraph,
    url: `${siteConfig.url}/gemini-4-argon`,
  },
};

export const revalidate = 172800; // 48 hours ISR cache

// FAQPage structured data for rich search results
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

export default function Gemini4ArgonPage() {
  return (
    <Container className="mt-0 pb-0">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Valid JSON-LD schema
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <Gemini4ArgonLanding />
    </Container>
  );
}
