import Container from "@/components/container";
import SearchBox from "@/components/search/search-box";
import { SearchFilter } from "@/components/search/search-filter";

export default function SearchLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <div className="mb-16">
      <div className="mt-8 flex w-full flex-col items-center justify-center gap-8">
        <Container className="w-full">
          <div className="flex flex-col items-center gap-8">
            <h1 className="text-gradient_indigo-purple font-semibold uppercase tracking-wider">
              Search
            </h1>

            <SearchBox urlPrefix="/search" />
          </div>
        </Container>

        <div className="w-full">
          <SearchFilter urlPrefix="/search" />
        </div>
      </div>

      <Container className="mt-8">{children}</Container>
    </div>
  );
}
