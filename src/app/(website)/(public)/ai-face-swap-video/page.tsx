import { AiFaceSwapVideoLanding } from "@/components/ai-face-swap-video/ai-face-swap-video-landing";
import { siteConfig } from "@/config/site";
import { aiFaceSwapVideoConfig, videoFaqs } from "@/data/ai-face-swap-video";
import { constructMetadata } from "@/lib/metadata";

const canonicalUrl = `${siteConfig.url}/ai-face-swap-video`;

const baseMetadata = constructMetadata({
  title:
    "AI Face Swap Video Guide (2026): Best Free Tools & Duration Limits Compared",
  description: aiFaceSwapVideoConfig.description,
  canonicalUrl,
});

export const metadata = {
  ...baseMetadata,
  keywords: [
    ...aiFaceSwapVideoConfig.secondaryKeywords,
    "ai face swap video",
    "face swap video free",
    "video face swapper online",
    "free ai video face swap no watermark",
    "swap face in video",
    "deepfake video app",
  ],
  openGraph: {
    ...baseMetadata.openGraph,
    url: canonicalUrl,
    title:
      "AI Face Swap Video Guide (2026): Best Free Tools & Duration Limits Compared",
    description: aiFaceSwapVideoConfig.description,
  },
};

export const revalidate = 86400; // 24 hours ISR cache

// FAQPage structured data
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: videoFaqs.map((faq) => ({
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
      name: "Face Swap Video Guide",
      item: canonicalUrl,
    },
  ],
};

export default function AiFaceSwapVideoPage() {
  return (
    <>
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
      <AiFaceSwapVideoLanding />
    </>
  );
}
