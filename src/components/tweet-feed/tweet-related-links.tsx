import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowRight, Bot, Grid3X3, Search } from "lucide-react";
import Link from "next/link";

export function TweetRelatedLinks() {
  const links = [
    {
      title: "Agent Skills Directory",
      description:
        "Explore curated open-source AI agent tools, harnesses, and development skills.",
      href: "/agent-skills",
      icon: Bot,
      action: "Explore Skills",
    },
    {
      title: "Browse by Category",
      description:
        "Discover AI tools classified across productivity, coding, design, and marketing.",
      href: "/category",
      icon: Grid3X3,
      action: "View Categories",
    },
    {
      title: "Search AI Directory",
      description:
        "Find the exact AI tools, models, and platforms on our curated homepage.",
      href: "/",
      icon: Search,
      action: "Explore Tools",
    },
  ];

  return (
    <section
      className="notranslate w-full mt-20 pt-10 border-t border-border/60"
      translate="no"
    >
      <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
          Explore More AI Ecosystem Resources
        </h2>
        <p className="text-sm text-muted-foreground">
          Continue discovering cutting-edge tools, foundational skills, and
          trending AI workflows.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {links.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-2xl"
            >
              <Card className="h-full p-5 rounded-2xl border border-border/70 bg-card/60 hover:bg-card/90 hover:border-primary/40 hover:shadow-md transition-all duration-200 flex flex-col justify-between">
                <div>
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-200">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                    {item.title}
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                    {item.description}
                  </CardDescription>
                </div>

                <div className="mt-5 pt-3 border-t border-border/40 flex items-center gap-1.5 text-xs font-medium text-primary">
                  <span>{item.action}</span>
                  <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
