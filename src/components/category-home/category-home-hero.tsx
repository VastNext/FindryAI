import { heroConfig } from "@/config/hero";
import CategoryHomeSearchBox from "./category-home-search-box";

export default function CategoryHomeHero() {
  return (
    <div className="flex flex-col">
      <div className="flex max-w-5xl flex-col items-start gap-8 text-left">
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
