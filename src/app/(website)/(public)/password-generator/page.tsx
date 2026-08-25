import Container from "@/components/container";
import { PasswordGenerator } from "@/components/password-generator/password-generator";
import { JsonLd } from "@/components/shared/json-ld";
import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/metadata";
import { KeyRoundIcon, LockKeyholeIcon, ShieldCheckIcon } from "lucide-react";

const canonicalUrl = `${siteConfig.url}/password-generator`;

export const metadata = constructMetadata({
  title: "Password Generator",
  description:
    "Generate strong random passwords, memorable passphrases, and PIN codes privately in your browser.",
  canonicalUrl,
});

const passwordGeneratorJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "FindryAI Password Generator",
  url: canonicalUrl,
  applicationCategory: "SecurityApplication",
  operatingSystem: "Any",
  browserRequirements: "Requires JavaScript and Web Crypto API support",
  description:
    "A private, browser-based generator for random passwords, memorable passphrases, and PIN codes.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  featureList: [
    "Cryptographically secure random passwords",
    "Memorable passphrases",
    "PIN code generation",
    "Local browser-only processing",
  ],
};

export default function PasswordGeneratorPage() {
  return (
    <>
      <JsonLd data={passwordGeneratorJsonLd} />
      <Container className="py-10 sm:py-14 lg:py-16">
        <div className="mx-auto max-w-4xl">
          <header className="mb-8 text-center sm:mb-10">
            <div className="mb-5 inline-flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <KeyRoundIcon className="size-7" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Free Password Generator
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Generate strong random passwords, memorable passphrases, and PIN
              codes. Everything happens locally in your browser.
            </p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheckIcon className="size-4 text-primary" /> No tracking
              </span>
              <span className="inline-flex items-center gap-1.5">
                <LockKeyholeIcon className="size-4 text-primary" /> No password
                storage
              </span>
            </div>
          </header>

          <PasswordGenerator />
        </div>
      </Container>
    </>
  );
}
