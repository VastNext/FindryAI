import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "@radix-ui/react-icons";

interface CategoryHomeCategoryListItemProps {
  title: string;
  active: boolean;
  clickAction: () => void;
}

export default function CategoryHomeCategoryListItem({
  title,
  active,
  clickAction,
}: CategoryHomeCategoryListItemProps) {
  return (
    <li>
      <Button
        variant={active ? "default" : "ghost"}
        size="sm"
        className="w-full cursor-pointer px-3 py-3"
        onClick={clickAction}
      >
        <span className="flex w-full items-center justify-between">
          <span>{title}</span>
          <ArrowRightIcon className="size-4" />
        </span>
      </Button>
    </li>
  );
}
