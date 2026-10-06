"use client";

import { submitToReview } from "@/actions/submit-to-review";
import { verifyBadge } from "@/actions/verify-badge";
import { Icons } from "@/components/icons/icons";
import { Button } from "@/components/ui/button";
import { FreePlanStatus } from "@/lib/submission";
import { cn } from "@/lib/utils";
import type { ItemInfo } from "@/types";
import {
  ArrowRightIcon,
  ArrowUpLeftIcon,
  CheckCircleIcon,
  EditIcon,
  SendIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface FreePlanButtonProps {
  item?: ItemInfo;
  className?: string;
}

/**
 * 免费方案按钮与审核提交组件
 * 支持：
 * 1. 存在 item 且待审核时，可选择检测徽章进入优先队列（Priority Queue）
 * 2. 也可选择不检测徽章直接提交普通队列（Standard Queue）
 * 3. 正常状态流转（未提交、待审核、已通过、已拒绝、已发布）
 */
export function FreePlanButton({ item, className }: FreePlanButtonProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isVerifying, setIsVerifying] = useState(false);

  // 普通队列提交审核
  const submitToReviewAction = () => {
    if (!item) return;
    startTransition(async () => {
      try {
        const data = await submitToReview(item._id);
        if (data.status === "success") {
          router.refresh();
          toast.success("Submitted to standard review queue");
        } else toast.error(data.message || "Failed to submit to review");
      } catch {
        toast.error("Failed to submit to review");
      }
    });
  };

  // 检测徽章并优先提审
  const handleVerifyBadgeAndSubmit = async () => {
    if (!item) return;
    setIsVerifying(true);
    try {
      const verifyResult = await verifyBadge(item._id);

      if (verifyResult.status === "verified") {
        // 徽章验证成功后调用 submitToReview 完成提审流转
        const submission = await submitToReview(item._id, true);
        if (submission.status === "error") toast.error(submission.message);
        else {
          toast.success(
            "Badge verified. Your submission is in the priority review queue.",
          );
          router.refresh();
        }
      } else if (verifyResult.status === "missing") {
        toast.warning(
          verifyResult.message ||
            "No badge detected on your site. You can still submit to standard review queue.",
        );
      } else if (verifyResult.status === "unavailable") {
        toast.info(
          verifyResult.message ||
            "The website could not be checked. Retry later or use the standard queue below.",
        );
      } else {
        toast.error(
          verifyResult.message ||
            "Failed to verify badge. You can still submit to standard review.",
        );
      }
    } catch (error) {
      console.error("verifyBadge error:", error);
      toast.error("Failed to verify badge");
    } finally {
      setIsVerifying(false);
    }
  };

  // 处理已有状态跳转
  const handleStatusRedirect = () => {
    if (!item) {
      router.push("/submit");
    } else if (item.publishDate) {
      router.push("/dashboard");
    } else if (item.freePlanStatus === FreePlanStatus.APPROVED) {
      router.push(`/publish/${item._id}`);
    } else if (item.freePlanStatus === FreePlanStatus.REJECTED) {
      router.push(`/edit/${item._id}`);
    } else if (item.freePlanStatus === FreePlanStatus.PENDING) {
      router.push("/dashboard");
    }
  };

  // 1. 无特定 item（Pricing 页面展示）
  if (!item) {
    return (
      <Button
        size="lg"
        variant="outline"
        className={cn(
          "overflow-hidden rounded-full group transition-transform duration-300 ease-in-out hover:scale-105",
          className,
        )}
        onClick={() => router.push("/submit")}
      >
        <div className="flex items-center justify-center gap-2 font-semibold">
          <span>Submit for Free</span>
          <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-1" />
        </div>
      </Button>
    );
  }

  // 2. 已发布状态
  if (item.publishDate) {
    return (
      <Button
        size="lg"
        variant="outline"
        className={cn("rounded-full", className)}
        onClick={handleStatusRedirect}
      >
        <div className="flex items-center justify-center">
          <ArrowUpLeftIcon className="mr-2 size-4" />
          <span>Go Dashboard</span>
        </div>
      </Button>
    );
  }

  // 3. 已通过审核但尚未发布
  if (item.freePlanStatus === FreePlanStatus.APPROVED) {
    return (
      <Button
        size="lg"
        variant="outline"
        className={cn("rounded-full", className)}
        onClick={handleStatusRedirect}
      >
        <div className="flex items-center justify-center">
          <CheckCircleIcon className="mr-2 size-4 text-emerald-500" />
          <span>Go Publish</span>
        </div>
      </Button>
    );
  }

  // 4. 被拒绝状态，去编辑
  if (item.freePlanStatus === FreePlanStatus.REJECTED) {
    return (
      <Button
        size="lg"
        variant="outline"
        className={cn("rounded-full", className)}
        onClick={handleStatusRedirect}
      >
        <div className="flex items-center justify-center">
          <EditIcon className="mr-2 size-4" />
          <span>Go Edit</span>
        </div>
      </Button>
    );
  }

  // 5. 审核中状态
  if (item.freePlanStatus === FreePlanStatus.PENDING) {
    return (
      <Button
        size="lg"
        variant="outline"
        className={cn("rounded-full", className)}
        onClick={handleStatusRedirect}
      >
        <div className="flex items-center justify-center">
          <ArrowUpLeftIcon className="mr-2 size-4" />
          <span>Go Dashboard & Wait</span>
        </div>
      </Button>
    );
  }

  // 6. 待提交审核（SUBMITTING）：支持优先徽章检测提审与普通队列提审
  if (item.freePlanStatus === FreePlanStatus.SUBMITTING) {
    return (
      <div className={cn("flex flex-col gap-2.5 w-full", className)}>
        {/* 优先队列：检测徽章并提交 */}
        <Button
          size="lg"
          variant="default"
          className="rounded-full shadow-sm bg-indigo-600 hover:bg-indigo-700 text-white font-medium flex items-center justify-center gap-2 group transition-all text-center whitespace-normal h-auto min-h-12"
          disabled={isPending || isVerifying}
          onClick={handleVerifyBadgeAndSubmit}
        >
          {isVerifying ? (
            <>
              <Icons.spinner className="size-4 animate-spin" />
              <span>Verifying Badge...</span>
            </>
          ) : (
            <>
              <ShieldCheckIcon className="size-4 text-indigo-200" />
              <span>Verify Badge & Fast Track</span>
              <SparklesIcon className="size-3.5 text-yellow-300" />
            </>
          )}
        </Button>

        {/* 普通队列：直接提审 */}
        <Button
          size="sm"
          variant="ghost"
          className="text-xs text-muted-foreground hover:text-foreground whitespace-normal h-auto min-h-8 text-center"
          disabled={isPending || isVerifying}
          onClick={submitToReviewAction}
        >
          {isPending ? (
            <div className="flex items-center justify-center gap-1.5">
              <Icons.spinner className="size-3 animate-spin" />
              <span>Submitting to standard queue...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-1">
              <SendIcon className="size-3" />
              <span>Submit to standard queue (without badge)</span>
            </div>
          )}
        </Button>
      </div>
    );
  }

  // 默认后备
  return (
    <Button
      size="lg"
      variant="outline"
      className={cn("rounded-full", className)}
      onClick={handleStatusRedirect}
    >
      <div className="flex items-center justify-center">
        <ArrowUpLeftIcon className="mr-2 size-4" />
        <span>Go Dashboard</span>
      </div>
    </Button>
  );
}
