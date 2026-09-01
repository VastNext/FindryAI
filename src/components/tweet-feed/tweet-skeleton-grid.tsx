import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface TweetSkeletonGridProps {
  count?: number;
}

export function TweetSkeletonGrid({ count = 6 }: TweetSkeletonGridProps) {
  const items = Array.from({ length: count }, (_, i) => i);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 w-full">
      {items.map((idx) => {
        const heightPattern =
          idx % 3 === 0 ? "h-64" : idx % 3 === 1 ? "h-80" : "h-72";
        return (
          <Card
            key={idx}
            className={`p-5 rounded-2xl border border-border/40 bg-card/60 flex flex-col justify-between ${heightPattern}`}
          >
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-28 rounded" />
                  <Skeleton className="h-3 w-20 rounded" />
                </div>
              </div>
              <div className="space-y-2 pt-2">
                <Skeleton className="h-3.5 w-full rounded" />
                <Skeleton className="h-3.5 w-[90%] rounded" />
                <Skeleton className="h-3.5 w-[75%] rounded" />
              </div>
              {idx % 2 === 0 && (
                <Skeleton className="h-28 w-full rounded-xl mt-2" />
              )}
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-border/30">
              <Skeleton className="h-3 w-16 rounded" />
              <Skeleton className="h-3 w-12 rounded" />
            </div>
          </Card>
        );
      })}
    </div>
  );
}
