import "@/styles/globals.css";

import {
  fontBricolageGrotesque as fontBricolage,
  fontSourceSans,
  fontSourceSerif,
  fontWorkSans,
} from "@/assets/fonts";
import { auth } from "@/auth";
import { Analytics } from "@/components/analytics/analytics";
import { JsonLd } from "@/components/shared/json-ld";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { Toaster } from "@/components/ui/sonner";
import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/metadata";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";

export const metadata: Metadata = {
  ...constructMetadata(),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
}

const websiteJsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}${siteConfig.logo}`,
    description: siteConfig.description,
    email: siteConfig.mail,
  },
];

export default async function RootLayout({ children }: RootLayoutProps) {
  // https://youtu.be/1MTyCvS05V4?t=21464
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background antialiased",
          fontBricolage.className,
          // fontSourceSans.className,
          // fontSourceSerif.className,
          // fontWorkSans.className,
          fontSourceSerif.variable,
          fontSourceSans.variable,
          fontWorkSans.variable,
          fontBricolage.variable,
        )}
      >
        <JsonLd data={websiteJsonLd} />
        <SessionProvider session={session}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}

            {/* https://sonner.emilkowal.ski/toaster */}
            <Toaster richColors position="top-right" offset={64} />

            <TailwindIndicator />

            <Analytics />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
