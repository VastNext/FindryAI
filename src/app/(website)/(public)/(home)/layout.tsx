import Container from "@/components/container";
import HomeHeroSponsor from "@/components/home/home-hero-sponsor";
import { HomeSearchFilter } from "@/components/home/home-search-filter";

export default function HomeLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <Container className="mt-12 mb-16 flex flex-col gap-12">
      <HomeHeroSponsor />

      <div className="flex flex-col gap-8">
        <HomeSearchFilter urlPrefix="/" />

        {children}
      </div>
    </Container>
  );
}
