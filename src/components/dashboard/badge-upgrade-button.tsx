"use client";

import { verifyBadge } from "@/actions/verify-badge";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

export function BadgeUpgradeButton({ itemId }: { itemId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Button
      type="button"
      variant="outline"
      disabled={pending}
      onClick={() => {
        startTransition(async () => {
          try {
            const result = await verifyBadge(itemId);
            if (result.status === "verified") {
              router.refresh();
              toast.success("Badge verified. Priority review requested.");
            } else {
              toast.error(result.message);
            }
          } catch {
            toast.error("Verification failed. Please try again.");
          }
        });
      }}
    >
      {pending ? "Verifying..." : "Verify badge for priority review"}
    </Button>
  );
}
