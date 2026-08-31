import Container from "@/components/container";
import { TweetSkeletonGrid } from "@/components/tweet-feed/tweet-skeleton-grid";
import { Skeleton } from "@/components/ui/skeleton";

export default function AiDailyFeedsLoading() {
  return (
    <main className="min-h-screen">
      <Container className="mt-4 md:mt-8 pb-16">
        <div className="flex flex-col w-full items-center">
          {/* Hero Skeleton */}
          <div className="flex flex-col items-center text-center space-y-4 max-w-3xl mx-auto pt-6 pb-4 md:pt-10 md:pb-6 w-full">
            <Skeleton className="h-6 w-48 rounded-full" />
            <Skeleton className="h-10 md:h-12 w-72 md:w-96 rounded-xl" />
            <Skeleton className="h-4 w-full max-w-xl rounded" />
            <Skeleton className="h-4 w-3/4 max-w-md rounded" />
            <div className="pt-2">
              <Skeleton className="h-9 w-40 rounded-full" />
            </div>
          </div>

          {/* Tabs Skeleton */}
          <div className="my-6 w-full flex justify-center">
            <Skeleton className="h-12 w-80 md:w-96 rounded-2xl" />
          </div>

          {/* Cards Grid Skeleton */}
          <div className="w-full mt-4">
            <TweetSkeletonGrid count={6} />
          </div>
        </div>
      </Container>
    </main>
  );
}
