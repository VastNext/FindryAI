import { BannerAd } from "@/components/layout/banner-ad";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { marketingConfig } from "@/config/marketing";
import { homeHrefForHost } from "@/lib/landing-hosts";
import { headers } from "next/headers";

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default async function MarketingLayout({
  children,
}: MarketingLayoutProps) {
  // on landing domains, home links must go back to the main site
  const homeHref = homeHrefForHost(headers().get("host"));

  return (
    <div className="flex flex-col min-h-screen">
      {/* <div className="sticky top-0 z-50">
        <BannerAd />
        <Navbar scroll={true} config={marketingConfig} />
      </div> */}
      <Navbar scroll={true} config={marketingConfig} homeHref={homeHref} />
      <main className="flex-1">{children}</main>
      <Footer homeHref={homeHref} />
    </div>
  );
}
