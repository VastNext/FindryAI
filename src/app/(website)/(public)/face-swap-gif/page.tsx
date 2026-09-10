import Container from "@/components/container";
import { FaceSwapGifLanding } from "@/components/face-swap-gif/face-swap-gif-landing";
import { siteConfig } from "@/config/site";
import { faceSwapGifConfig, faqs } from "@/data/face-swap-gif";
import { constructMetadata } from "@/lib/metadata";

const canonicalUrl = `${siteConfig.url}/face-swap-gif`;

const baseMetadata = constructMetadata({
  title: "Best AI Face Swap GIF Tools (2026) — Free, No Watermark & Online",
  description: faceSwapGifConfig.description,
  canonicalUrl,
});

export const metadata = {
  ...baseMetadata,
  keywords: [
    ...faceSwapGifConfig.secondaryKeywords,
    "face swap gif",
    "ai face swap gif free",
    "free ai face swap gif",
    "gif face swap no watermark",
    "face swap app",
    "gif face swapper online",
  ],
  openGraph: {
    ...baseMetadata.openGraph,
    url: canonicalUrl,
    title: "Best AI Face Swap GIF Tools (2026) — Free, No Watermark & Online",
    description: faceSwapGifConfig.description,
  },
};

export const revalidate = 86400; // 24 hours ISR cache

// FAQPage structured data for Google Rich Results
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

// BreadcrumbList structured data
const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
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
      name: "Guides",
      item: `${siteConfig.url}/blog`,
    },
    {
      "@type": "ListItem",
      position: 3,
      name: "Face Swap GIF",
      item: canonicalUrl,
    },
  ],
};

export default function FaceSwapGifPage() {
  return (
    <Container className="mt-0 pb-0">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Valid JSON-LD schema
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Valid JSON-LD schema
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <FaceSwapGifLanding />
    </Container>
  );
}
