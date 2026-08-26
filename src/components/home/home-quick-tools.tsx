import { KeyRoundIcon, LayoutGridIcon, SearchIcon } from "lucide-react";
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
    name: "Password Generator",
    description: "Create secure passwords",
    href: "/password-generator",
    icon: KeyRoundIcon,
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
