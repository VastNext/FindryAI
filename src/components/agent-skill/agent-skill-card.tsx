import type { AgentSkill } from "@/data/agent-skills";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Github, Globe } from "lucide-react";
import React from "react";

interface AgentSkillCardProps {
  skill: AgentSkill;
  className?: string;
}

export function AgentSkillCard({ skill, className }: AgentSkillCardProps) {
  const isGithub =
    skill.link.includes("github.com") || skill.link.includes("github.io");

  const descriptionText =
    skill.shortDescriptions && skill.shortDescriptions.length > 0
      ? skill.shortDescriptions.join(" · ")
      : "";

  return (
    <a
      href={skill.link}
      target="_blank"
      rel="noopener noreferrer nofollow"
      className={cn(
        "group relative flex flex-col justify-between rounded-xl border border-border/70 bg-card p-4 text-card-foreground shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:bg-accent/20 hover:shadow-md dark:border-border/60 dark:hover:border-primary/60",
        className,
      )}
    >
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground transition-colors group-hover:bg-primary/10 group-hover:text-primary">
            {isGithub ? (
              <Github className="size-4" aria-hidden="true" />
            ) : (
              <Globe className="size-4" aria-hidden="true" />
            )}
          </div>
          <div className="flex items-center text-muted-foreground/60 transition-colors group-hover:text-primary">
            <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>

        <div className="mt-1">
          <h3
            className="font-medium text-sm leading-tight text-foreground transition-colors group-hover:text-primary line-clamp-1"
            title={skill.name}
          >
            {skill.name}
          </h3>
          {descriptionText ? (
            <p
              className="mt-1.5 text-xs leading-relaxed text-muted-foreground line-clamp-2"
              title={descriptionText}
            >
              {descriptionText}
            </p>
          ) : (
            <p className="mt-1.5 text-xs text-muted-foreground/50 italic">
              No description available
            </p>
          )}
        </div>
      </div>
    </a>
  );
}
