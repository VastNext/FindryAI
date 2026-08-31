import { Icons } from "@/components/icons/icons";
import { buttonVariants } from "@/components/ui/button";
import { heroConfig } from "@/config/hero";
import { cn } from "@/lib/utils";
import Link from "next/link";
import CategoryHomeSearchBox from "./category-home-search-box";

export default function CategoryHomeHero() {
  const LabelIcon = Icons[heroConfig.label.icon];

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex max-w-5xl flex-col items-center gap-8 text-center">
        <Link
          href={heroConfig.label.href}
          target="_blank"
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "rounded-full px-4",
          )}
        >
          <span className="mr-2">🎉</span>
          <span>{heroConfig.label.text}</span>
          <LabelIcon className="size-4" />
        </Link>

        <h1 className="max-w-5xl text-balance font-bold text-3xl sm:text-4xl md:text-5xl">
          {heroConfig.title.first}{" "}
          <span className="text-gradient_indigo-purple font-bold">
            {heroConfig.title.second}
          </span>
        </h1>

        <p className="max-w-4xl text-balance text-muted-foreground sm:text-xl">
          {heroConfig.subtitle}
        </p>

        <div className="w-full">
          <CategoryHomeSearchBox urlPrefix="/search" />
        </div>
      </div>
    </div>
  );
}
