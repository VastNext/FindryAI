import Container from "@/components/container";
import HomeHeroSponsor from "@/components/home/home-hero-sponsor";
import { HomeSearchFilter } from "@/components/home/home-search-filter";
import { Loader2Icon } from "lucide-react";
import { Suspense } from "react";

export default function HomeLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <Container className="mt-8 mb-16 flex flex-col gap-8">
      <HomeHeroSponsor />

      <div className="flex flex-col gap-6">
        {/* HomeSearchFilterClient reads useSearchParams; the boundary confines
            the CSR bailout so the homepage prerenders its full DOM. */}
        <Suspense
          fallback={
            <Loader2Icon className="my-24 mx-auto size-6 animate-spin" />
          }
        >
          <HomeSearchFilter urlPrefix="/" />
        </Suspense>

        {children}
      </div>
    </Container>
  );
}
