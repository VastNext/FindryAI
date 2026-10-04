"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useEffect, useState } from "react";

type CustomPaginationProps = {
  totalPages: number;
  routePrefix: string;
};

export default function CustomPagination({
  totalPages,
  routePrefix,
}: CustomPaginationProps) {
  // Read page/other params from window.location client-side only:
  // useSearchParams() opts routes rendering this component into the CSR
  // bailout and breaks static prerendering. Re-runs after every render so
  // client navigations stay in sync (setState with equal values is a no-op).
  // Before hydration the links render with page numbers only.
  const [currentPage, setCurrentPage] = useState(1);
  const [queryString, setQueryString] = useState("");
  const lastPage = Math.max(1, totalPages);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setCurrentPage(Number(params.get("page")) || 1);
    params.delete("page");
    setQueryString(params.toString());
  });

  const getPageHref = (page: number | string) => {
    const suffix = queryString ? `${queryString}&` : "";
    return `${routePrefix}?${suffix}page=${page}`;
  };

  const allPages = generatePagination(currentPage, lastPage);

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={getPageHref(Math.max(1, currentPage - 1))}
            aria-disabled={currentPage <= 1}
            className={
              currentPage <= 1
                ? "pointer-events-none text-gray-300 dark:text-gray-600"
                : "cursor-pointer"
            }
          />
        </PaginationItem>
        {allPages.map((page, index) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          <PaginationItem key={`${page}-${index}`}>
            {page === "..." ? (
              <PaginationEllipsis />
            ) : (
              <PaginationLink
                href={getPageHref(page)}
                isActive={currentPage === page}
                className={currentPage === page ? "" : "cursor-pointer"}
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href={getPageHref(Math.min(lastPage, currentPage + 1))}
            aria-disabled={currentPage >= lastPage}
            className={
              currentPage >= lastPage
                ? "pointer-events-none text-gray-300 dark:text-gray-600"
                : "cursor-pointer"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

/**
 * Generate an array of page numbers to display in the pagination component
 */
const generatePagination = (currentPage: number, totalPages: number) => {
  // If the total number of pages is 7 or less,
  // display all pages without any ellipsis.
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is among the first 3 pages,
  // show the first 3, an ellipsis, and the last 2 pages.
  if (currentPage <= 3) {
    return [1, 2, 3, "...", totalPages - 1, totalPages];
  }

  // If the current page is among the last 3 pages,
  // show the first 2, an ellipsis, and the last 3 pages.
  if (currentPage >= totalPages - 2) {
    return [1, 2, "...", totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is somewhere in the middle,
  // show the first page, an ellipsis, the current page and its neighbors,
  // another ellipsis, and the last page.
  return [
    1,
    "...",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "...",
    totalPages,
  ];
};
