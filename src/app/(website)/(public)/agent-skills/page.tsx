import { AgentSkillDirectory } from "@/components/agent-skill/agent-skill-directory";
import Container from "@/components/container";
import { HeaderSection } from "@/components/shared/header-section";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { agentSkillGroups } from "@/data/agent-skills";
import { constructMetadata } from "@/lib/metadata";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const canonicalUrl = `${siteConfig.url}/agent-skills`;

const baseMetadata = constructMetadata({
  title: "280+ Best AI Agent Skills, Frameworks & GitHub Tools (2026)",
  description:
    "Explore 280+ battle-tested open-source AI agent skills, MCP servers, harnesses, frameworks, and autonomous workflows with direct GitHub repositories.",
  canonicalUrl,
});

export const revalidate = 172800; // 48 hours ISR cache

export const metadata = {
  ...baseMetadata,
  keywords: [
    "agent skills",
    "ai agent skills",
    "open source agent tools",
    "mcp servers",
    "agent harnesses",
    "ai agent directory",
    "github agent skills",
  ],
  openGraph: {
    ...baseMetadata.openGraph,
    url: canonicalUrl,
    title: "280+ Best AI Agent Skills, Frameworks & GitHub Tools (2026)",
    description:
      "Explore 280+ battle-tested open-source AI agent skills, MCP servers, harnesses, frameworks, and autonomous workflows with direct GitHub repositories.",
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

        <div className="flex flex-col items-center gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-6 text-center md:flex-row md:justify-between md:text-left">
          <div>
            <p className="font-bricolage text-lg font-semibold">
              Running agents on GPT-6 Astra?
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Read our best practices for access, pricing, and saving tokens on
              OpenAI's flagship model.
            </p>
          </div>
          <Link
            href="/gpt-6-astra"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "shrink-0 rounded-full",
            )}
          >
            GPT-6 Astra best practices
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </Container>
  );
}
