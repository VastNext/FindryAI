import { HomeContent } from "@/components/home2/home2-content";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "",
  noIndex: true,
});

export default async function LandingPage() {
  return <HomeContent />;
}
