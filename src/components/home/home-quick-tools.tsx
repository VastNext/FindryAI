import {
  BookOpenIcon,
  FolderIcon,
  LayoutGridIcon,
  SearchIcon,
  SendIcon,
  SparklesIcon,
} from "lucide-react";
import Link from "next/link";

const quickTools = [
  {
    name: "Search",
    description: "Find AI tools",
    href: "/search",
    icon: SearchIcon,
  },
  {
    name: "Categories",
    description: "Browse by task",
    href: "/category",
    icon: LayoutGridIcon,
  },
  {
    name: "Collections",
    description: "Explore curated lists",
    href: "/collection",
    icon: FolderIcon,
  },
  {
    name: "Blog",
    description: "Read practical guides",
    href: "/blog",
    icon: BookOpenIcon,
  },
  {
    name: "Submit",
    description: "Share an AI tool",
    href: "/submit",
    icon: SendIcon,
  },
  {
    name: "Pricing",
    description: "Compare plans",
    href: "/pricing",
    icon: SparklesIcon,
  },
] as const;

export default function HomeQuickTools() {
  return (
    <nav
      aria-label="Quick access"
      className="flex w-full justify-center gap-1 min-[360px]:gap-2 sm:gap-3"
    >
      {quickTools.map((tool) => {
        const Icon = tool.icon;

        return (
          <Link
            key={tool.href}
            href={tool.href}
            aria-label={`${tool.name}: ${tool.description}`}
            title={tool.name}
            className="group flex size-11 shrink-0 items-center justify-center rounded-lg border bg-card text-muted-foreground shadow-sm transition-colors duration-200 hover:border-primary/40 hover:bg-primary/5 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 motion-reduce:transition-none min-[360px]:size-12 sm:size-14"
          >
            <Icon className="size-5 sm:size-6" aria-hidden="true" />
          </Link>
        );
      })}
    </nav>
  );
}
