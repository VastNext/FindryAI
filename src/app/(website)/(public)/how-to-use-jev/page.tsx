import Container from "@/components/container";
import { HowToUseJevLanding } from "@/components/how-to-use-jev/how-to-use-jev-landing";
import { siteConfig } from "@/config/site";
import { howToUseJevFaqs, howToUseJevMeta } from "@/data/how-to-use-jev";
import { constructMetadata } from "@/lib/metadata";

const canonicalUrl = `${siteConfig.url}/how-to-use-jev`;

const baseMetadata = constructMetadata({
  title: howToUseJevMeta.title,
  description: howToUseJevMeta.description,
  canonicalUrl,
});

export const metadata = {
  ...baseMetadata,
  keywords: [
    "how to use jev",
    "typesafe jev api key",
    "typesafe jev access",
    "jev sdk python",
    "typesafe jev recipes",
    "jev decision model",
    "system one ai",
  ],
  openGraph: {
    ...baseMetadata.openGraph,
    url: canonicalUrl,
    title: howToUseJevMeta.title,
    description: howToUseJevMeta.description,
  },
  twitter: {
    ...baseMetadata.twitter,
    title: howToUseJevMeta.title,
    description: howToUseJevMeta.description,
  },
};

export const revalidate = 172800; // 48 hours ISR cache

// Structured data for rich results (TechArticle, FAQPage, BreadcrumbList)
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "TechArticle",
      "@id": `${canonicalUrl}#article`,
      headline: howToUseJevMeta.title,
      description: howToUseJevMeta.description,
      url: canonicalUrl,
      datePublished: "2026-09-24T00:00:00Z",
      dateModified: `${howToUseJevMeta.lastUpdated}T00:00:00Z`,
      author: {
        "@type": "Organization",
        name: siteConfig.name,
        url: siteConfig.url,
      },
      publisher: {
        "@type": "Organization",
        name: siteConfig.name,
        url: siteConfig.url,
      },
      about: {
        "@type": "SoftwareApplication",
        name: "TypeSafe Jev",
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Cloud API",
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${canonicalUrl}#faq`,
      mainEntity: howToUseJevFaqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${canonicalUrl}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: siteConfig.url,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "TypeSafe Jev",
          item: `${siteConfig.url}/typesafe-jev`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "How to Use Jev",
          item: canonicalUrl,
        },
      ],
    },
  ],
};

export default function HowToUseJevPage() {
  return (
    <Container className="mt-0 pb-0">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Valid JSON-LD schema
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HowToUseJevLanding />
    </Container>
  );
}
