import Container from "@/components/container";
import { Gpt6AstraLanding } from "@/components/gpt-6-astra/gpt-6-astra-landing";
import { siteConfig } from "@/config/site";
import { gpt6Astra } from "@/data/gpt-6-astra";
import { constructMetadata } from "@/lib/metadata";

const baseMetadata = constructMetadata({
  title: "GPT-6 Astra: The Future Is Here",
  description: gpt6Astra.description,
  canonicalUrl: `${siteConfig.url}/gpt-6-astra`,
});

export const revalidate = 172800; // 48 hours ISR cache

export const metadata = {
  ...baseMetadata,
  openGraph: {
    ...baseMetadata.openGraph,
    url: `${siteConfig.url}/gpt-6-astra`,
  },
};

export default function Gpt6AstraPage() {
  return (
    <Container className="mt-0 pb-0">
      <Gpt6AstraLanding />
    </Container>
  );
}
