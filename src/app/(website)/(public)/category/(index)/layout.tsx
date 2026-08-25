import { CategoryHomeCategoryList } from "@/components/category-home/category-home-category-list";
import CategoryHomeHero from "@/components/category-home/category-home-hero";
import { CategoryHomeSearchFilter } from "@/components/category-home/category-home-search-filter";
import Container from "@/components/container";

export default function CategoryIndexLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <Container className="mt-12 mb-16 flex max-w-[1400px] flex-col gap-12">
      <CategoryHomeHero />

      <div className="flex flex-col gap-6 md:flex-row">
        <div className="hidden w-[200px] flex-shrink-0 md:block">
          <div className="sticky top-24">
            <CategoryHomeCategoryList urlPrefix="/category" />
          </div>
        </div>

        <div className="flex-1">
          <div className="flex flex-col gap-8">
            <CategoryHomeSearchFilter urlPrefix="/category" />
            {children}
          </div>
        </div>
      </div>
    </Container>
  );
}
