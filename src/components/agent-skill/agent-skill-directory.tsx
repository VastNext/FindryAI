"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AgentSkillGroup } from "@/data/agent-skills";
import { cn } from "@/lib/utils";
import {
  Briefcase,
  Code2,
  Database,
  FileSpreadsheet,
  Globe,
  GraduationCap,
  Layers,
  LineChart,
  Megaphone,
  Palette,
  PenTool,
  Presentation,
  Search,
  ShieldCheck,
  Sparkles,
  Terminal,
  Video,
  Wand2,
  Wrench,
  X,
} from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { AgentSkillCard } from "./agent-skill-card";

interface AgentSkillDirectoryProps {
  groups: AgentSkillGroup[];
}

function getCategoryIcon(slug: string) {
  switch (slug) {
    case "agent-harness":
      return Terminal;
    case "vibe-coding":
      return Code2;
    case "agent-boost":
      return Wand2;
    case "skill-workshop":
      return Wrench;
    case "ppt-presentation":
      return Presentation;
    case "design-ui":
      return Palette;
    case "video-animation":
      return Video;
    case "writing-copy":
      return PenTool;
    case "documents-sheets":
      return FileSpreadsheet;
    case "diagrams-illustration":
      return LineChart;
    case "marketing-growth":
      return Megaphone;
    case "product-business":
      return Briefcase;
    case "research-learning":
      return GraduationCap;
    case "web-automation":
      return Globe;
    case "code-review-security":
      return ShieldCheck;
    case "memory-knowledge":
      return Database;
    case "official-skills":
      return Sparkles;
    default:
      return Layers;
  }
}

export function AgentSkillDirectory({ groups }: AgentSkillDirectoryProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSlug, setActiveSlug] = useState<string>(groups[0]?.slug || "");
  const observerRef = useRef<IntersectionObserver | null>(null);

  // 按名称、描述和分类筛选技能
  const filteredGroups = useMemo(() => {
    const trimmed = searchQuery.trim().toLowerCase();
    if (!trimmed) return groups;

    return groups
      .map((group) => {
        const matchesCategory = group.mainCategory
          .toLowerCase()
          .includes(trimmed);

        const filteredItems = group.items.filter((item) => {
          if (matchesCategory) return true;
          const nameMatch = item.name.toLowerCase().includes(trimmed);
          const descMatch = item.shortDescriptions.some((desc) =>
            desc.toLowerCase().includes(trimmed),
          );
          return nameMatch || descMatch;
        });

        return {
          ...group,
          items: filteredItems,
        };
      })
      .filter((group) => group.items.length > 0);
  }, [groups, searchQuery]);

  const totalFilteredCount = useMemo(() => {
    return filteredGroups.reduce((acc, g) => acc + g.items.length, 0);
  }, [filteredGroups]);

  // 监听可见分组并同步当前分类
  useEffect(() => {
    if (filteredGroups.length === 0) return;

    const handleIntersect: IntersectionObserverCallback = (entries) => {
      // 取第一个进入观察区域的分组
      const visibleEntry = entries.find((entry) => entry.isIntersecting);
      if (visibleEntry) {
        setActiveSlug(visibleEntry.target.id);
      }
    };

    observerRef.current = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin: "-100px 0px -65% 0px",
      threshold: 0,
    });

    const elements = document.querySelectorAll("section[data-skill-group]");
    for (const el of Array.from(elements)) {
      observerRef.current.observe(el);
    }

    return () => {
      observerRef.current?.disconnect();
    };
  }, [filteredGroups]);

  const handleCategoryClick = (slug: string) => {
    setActiveSlug(slug);
    const element = document.getElementById(slug);
    if (element) {
      const headerOffset = 90;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* 搜索框与目录统计 */}
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-3">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skills by name, description, or category..."
            aria-label="Search Agent Skills"
            className="h-11 rounded-full pl-10 pr-10 text-sm shadow-sm transition-all focus-visible:ring-2 focus-visible:ring-primary/30"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="size-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>
            {searchQuery ? (
              <>
                Found{" "}
                <span className="font-semibold text-foreground">
                  {totalFilteredCount}
                </span>{" "}
                skills across{" "}
                <span className="font-semibold text-foreground">
                  {filteredGroups.length}
                </span>{" "}
                categories
              </>
            ) : (
              <>
                Curated directory of{" "}
                <span className="font-semibold text-foreground">
                  {totalFilteredCount}
                </span>{" "}
                open-source Agent Skills across{" "}
                <span className="font-semibold text-foreground">
                  {groups.length}
                </span>{" "}
                categories
              </>
            )}
          </span>
        </div>
      </div>

      {/* 移动端分类快捷栏 */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none md:hidden -mx-4 px-4 sticky top-16 z-30 bg-background/90 backdrop-blur-md border-b py-2.5">
        {filteredGroups.map((group) => {
          const Icon = getCategoryIcon(group.slug);
          const isActive = activeSlug === group.slug;
          return (
            <button
              key={group.slug}
              type="button"
              onClick={() => handleCategoryClick(group.slug)}
              aria-current={isActive ? "true" : undefined}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted/70 text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="size-3.5" />
              <span>{group.mainCategory}</span>
              <span
                className={cn(
                  "rounded-full px-1.5 py-0.2 text-[10px]",
                  isActive
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-background/80 text-muted-foreground",
                )}
              >
                {group.items.length}
              </span>
            </button>
          );
        })}
      </div>

      {/* 主体布局：桌面侧栏与内容区 */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[240px_1fr] lg:grid-cols-[260px_1fr]">
        {/* 桌面粘性分类导航 */}
        <aside className="hidden md:block">
          <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto pr-2 scrollbar-thin">
            <div className="space-y-1">
              <div className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground/80">
                Categories
              </div>
              <nav className="space-y-0.5" aria-label="Categories navigation">
                {filteredGroups.map((group) => {
                  const Icon = getCategoryIcon(group.slug);
                  const isActive = activeSlug === group.slug;

                  return (
                    <button
                      key={group.slug}
                      type="button"
                      onClick={() => handleCategoryClick(group.slug)}
                      aria-current={isActive ? "true" : undefined}
                      className={cn(
                        "group flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs font-medium transition-colors",
                        isActive
                          ? "bg-primary/10 font-semibold text-primary dark:bg-primary/20"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      <span className="flex items-center gap-2 truncate">
                        <Icon
                          className={cn(
                            "size-4 shrink-0 transition-colors",
                            isActive
                              ? "text-primary"
                              : "text-muted-foreground group-hover:text-foreground",
                          )}
                        />
                        <span className="truncate">{group.mainCategory}</span>
                      </span>
                      <span
                        className={cn(
                          "ml-2 shrink-0 rounded-full px-1.5 py-0.5 text-[10px]",
                          isActive
                            ? "bg-primary/20 text-primary font-semibold dark:bg-primary/30"
                            : "bg-muted text-muted-foreground group-hover:bg-background",
                        )}
                      >
                        {group.items.length}
                      </span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </aside>

        {/* 内容区 */}
        <div className="min-w-0 flex-1">
          {filteredGroups.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-16 text-center">
              <Search className="size-10 text-muted-foreground/40" />
              <h3 className="mt-4 font-semibold text-base">No skills found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                No agent skills matched &quot;{searchQuery}&quot;. Try a
                different search term.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-5 rounded-full"
                onClick={() => setSearchQuery("")}
              >
                Clear Search
              </Button>
            </div>
          ) : (
            <div className="space-y-12">
              {filteredGroups.map((group) => {
                const Icon = getCategoryIcon(group.slug);

                return (
                  <section
                    key={group.slug}
                    id={group.slug}
                    data-skill-group
                    className="scroll-mt-24 space-y-4"
                  >
                    <div className="flex items-center justify-between border-b border-border/60 pb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex size-7 items-center justify-center rounded-md bg-primary/10 text-primary">
                          <Icon className="size-4" />
                        </div>
                        <h2 className="font-semibold text-lg tracking-tight text-foreground">
                          {group.mainCategory}
                        </h2>
                      </div>
                      <span className="text-xs font-medium text-muted-foreground">
                        {group.items.length} skills
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3 2xl:grid-cols-4">
                      {group.items.map((skill) => (
                        <AgentSkillCard
                          key={`${group.slug}-${skill.name}-${skill.link}`}
                          skill={skill}
                        />
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
