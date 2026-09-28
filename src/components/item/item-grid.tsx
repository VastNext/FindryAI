import { ItemCardSkeleton } from "@/components/item/item-card";
import { ITEMS_PER_PAGE } from "@/lib/constants";
import type {
  ItemListQueryResult,
  SponsorItemListQueryResult,
} from "@/sanity.types";
import ItemGridClient from "./item-grid-client";

interface ItemGridProps {
  items: ItemListQueryResult;
  sponsorItems: SponsorItemListQueryResult;
  showSponsor?: boolean;
}

/**
 * ItemGrid Server Component
 *
 * 1. show sponsor item card when item.sponsor is true
 * 2. show item card with icon when SUPPORT_ITEM_ICON is true
 * otherwise show item card with image
 */
export default async function ItemGrid({
  items,
  sponsorItems,
  showSponsor = true,
}: ItemGridProps) {
  if (!showSponsor) {
    return <ItemGridClient items={items} />;
  }

  // show sponsor items strictly at the top (1st place)
  const validSponsors = Array.isArray(sponsorItems) ? sponsorItems : [];
  const sponsorIds = new Set(validSponsors.map((s) => s._id));
  const filteredItems = items.filter((item) => !sponsorIds.has(item._id));

  const allItems = [...validSponsors, ...filteredItems];

  return <ItemGridClient items={allItems} />;
}

export function ItemGridSkeleton({
  count = ITEMS_PER_PAGE,
}: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: ignore
        <ItemCardSkeleton key={index} />
      ))}
    </div>
  );
}
