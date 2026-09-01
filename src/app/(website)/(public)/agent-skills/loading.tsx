import Container from "@/components/container";
import { Skeleton } from "@/components/ui/skeleton";

const SKELETON_SIDEBAR_ITEMS = [
  "sb-1",
  "sb-2",
  "sb-3",
  "sb-4",
  "sb-5",
  "sb-6",
  "sb-7",
  "sb-8",
  "sb-9",
  "sb-10",
  "sb-11",
  "sb-12",
];

const SKELETON_GROUPS = ["group-1", "group-2", "group-3"];
const SKELETON_CARDS = [
  "card-1",
  "card-2",
  "card-3",
  "card-4",
  "card-5",
  "card-6",
];

export default function AgentSkillsLoading() {
  return (
    <Container className="mt-8 pb-20">
      <div className="flex w-full flex-col gap-8">
        {/* Header Skeleton */}
        <div className="flex flex-col items-center text-center gap-3">
          <Skeleton className="h-4 w-28 rounded-full" />
          <Skeleton className="h-9 w-80 md:w-96 rounded-lg" />
          <Skeleton className="h-5 w-72 md:w-[480px] rounded-lg" />
        </div>

        {/* Search bar skeleton */}
        <div className="mx-auto w-full max-w-2xl flex flex-col items-center gap-3">
          <Skeleton className="h-11 w-full rounded-full" />
          <Skeleton className="h-4 w-64 rounded-full" />
        </div>

        {/* Main layout skeleton */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[240px_1fr] lg:grid-cols-[260px_1fr]">
          {/* Sidebar Skeleton */}
          <aside className="hidden md:block space-y-2">
            <Skeleton className="h-4 w-20 mb-3" />
            {SKELETON_SIDEBAR_ITEMS.map((id) => (
              <Skeleton key={id} className="h-8 w-full rounded-lg" />
            ))}
          </aside>

          {/* Grid Skeleton */}
          <div className="space-y-10">
            {SKELETON_GROUPS.map((groupId) => (
              <div key={groupId} className="space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center gap-2.5">
                    <Skeleton className="size-7 rounded-md" />
                    <Skeleton className="h-6 w-36 rounded-md" />
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
            <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3 2xl:grid-cols-4">
                  {SKELETON_CARDS.map((cardId) => (
                    <Skeleton
                      key={`${groupId}-${cardId}`}
                      className="h-28 rounded-xl"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Container>
  );
}
