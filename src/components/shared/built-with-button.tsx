import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "../ui/button";

export default function BuiltWithButton() {
  return (
    <Link
      target="_blank"
      rel="noopener noreferrer"
      href="https://vastnext.com"
      className={cn(
        buttonVariants({ variant: "outline", size: "sm" }),
        "px-4 rounded-md",
      )}
    >
      <span>Built by</span>
      <span>
        <LogoVastNext className="size-4 rounded-full" />
      </span>
      <span className="font-bold">VastNext</span>
    </Link>
  );
}

function LogoVastNext({ className }: { className?: string }) {
  return (
    <Image
      src="/brand/vastnext-mark.svg"
      alt="VastNext"
      title="VastNext"
      width={96}
      height={96}
      className={cn("size-8 rounded-md", className)}
    />
  );
}
