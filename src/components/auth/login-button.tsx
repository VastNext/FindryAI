"use client";

import { LoginForm } from "@/components/auth/login-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useMediaQuery } from "@/hooks/use-media-query";
import { authRoutes } from "@/routes";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface LoginWrapperProps {
  children: React.ReactNode;
  mode?: "modal" | "redirect";
  asChild?: boolean;
}

export const LoginWrapper = ({
  children,
  mode = "redirect",
  asChild,
}: LoginWrapperProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { isTablet, isDesktop } = useMediaQuery();

  const handleLogin = () => {
    router.push("/auth/login");
  };

  // Close the modal on route change. Deliberately keyed on pathname only:
  // useSearchParams() here would opt every route that renders the navbar
  // into the CSR bailout and break static prerendering.
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    setIsModalOpen(false);
  }, [pathname]);

  // don't open the modal if the user is already in the auth pages
  // keep isTablet or isDesktop open, if user resizes the window
  const isAuthRoute = authRoutes.includes(pathname);
  if (mode === "modal" && !isAuthRoute && (isTablet || isDesktop)) {
    return (
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild={asChild}>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[400px] p-0">
          <DialogHeader>
            {/* `DialogContent` requires a `DialogTitle` for the component to be accessible for screen reader users. */}
            <DialogTitle />
          </DialogHeader>
          <LoginForm />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
    <span onClick={handleLogin} className="cursor-pointer">
      {children}
    </span>
  );
};
