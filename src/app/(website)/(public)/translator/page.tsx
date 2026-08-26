import Container from "@/components/container";
import { HeaderSection } from "@/components/shared/header-section";
import { TranslatorWorkbench } from "@/components/translator/translator-workbench";
import { siteConfig } from "@/config/site";
import { constructMetadata } from "@/lib/metadata";

export const metadata = constructMetadata({
  title: "Translator",
  description:
    "Compare translations from Google, Bing, and Agnes models in one place.",
  canonicalUrl: `${siteConfig.url}/translator`,
});

export default function TranslatorPage() {
  return (
    <Container className="mt-8 pb-16">
      <div className="flex w-full flex-col gap-8">
        <HeaderSection
          labelAs="h1"
          label="Translator"
          titleAs="h2"
          title="Compare translations side by side"
          subtitle="Translate text with multiple services and compare their results in one workspace."
        />

        <TranslatorWorkbench />

        <p className="mx-auto max-w-3xl text-center text-sm leading-normal text-muted-foreground">
          Selected text is sent to third-party translation services. Google and
          Bing web interfaces may change or be rate limited.
        </p>
      </div>
    </Container>
  );
}
