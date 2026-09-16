import { HomeContent } from "@/components/home2/home2-content";
import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "Home",
  canonicalUrl: `${siteConfig.url}/home2`,
  noIndex: true,
});

export default async function LandingPage() {
  return <HomeContent />;
}
