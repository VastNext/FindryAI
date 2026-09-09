import { AgentSkillDirectory } from "@/components/agent-skill/agent-skill-directory";
import Container from "@/components/container";
import { HeaderSection } from "@/components/shared/header-section";
import { siteConfig } from "@/config/site";
import { agentSkillGroups } from "@/data/agent-skills";
import { constructMetadata } from "@/lib/metadata";

const baseMetadata = constructMetadata({
  title: "Agent Skills",
  description:
    "Explore curated open-source AI Agent skills, harnesses, tools, and workflows to supercharge your AI agents.",
  canonicalUrl: `${siteConfig.url}/agent-skills`,
});

export const revalidate = 172800; // 48 hours ISR cache

export const metadata = {
  ...baseMetadata,
  openGraph: {
    ...baseMetadata.openGraph,
    url: `${siteConfig.url}/agent-skills`,
  },
};

export default function AgentSkillsPage() {
  return (
    <Container className="mt-8 pb-20">
      <div className="flex w-full flex-col gap-8">
        <HeaderSection
          labelAs="h1"
          label="Agent Skills"
          titleAs="h2"
          title="Curated Directory of AI Agent Skills"
          subtitle="Explore top open-source tools, harnesses, frameworks, and workflows to power modern AI agents."
        />

        <AgentSkillDirectory groups={agentSkillGroups} />
      </div>
    </Container>
  );
}
