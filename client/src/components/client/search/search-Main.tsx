"use client";

import { useCheckDevice } from "@/hooks/useCheckDevices";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load các component để tối ưu performance
const SearchDesktopIndex = dynamic(() => import("@/components/client/search/desktop/search-Index"), {
  loading: () => <Skeleton className="w-full h-full" />,
  ssr: false,
});
const SearchMobileIndex = dynamic(() => import("@/components/client/search/mobile/search-IndexMobile"), {
  loading: () => <Skeleton className="w-full h-full" />,
  ssr: false,
});

interface SearchContentProps {
  categoryIds?: string[];
  currentCategoryId?: string | null;
}

export function SearchContent({ categoryIds = [], currentCategoryId }: SearchContentProps) {
  const deviceType = useCheckDevice();
  const isMobileView = deviceType === "mobile";

  return (
    <div className="w-full h-full">
      {isMobileView ? (
        <SearchMobileIndex categoryIds={categoryIds} currentCategoryId={currentCategoryId} /> 
      ) : (
        <SearchDesktopIndex categoryIds={categoryIds} currentCategoryId={currentCategoryId} />
      )}
    </div>
  );
}