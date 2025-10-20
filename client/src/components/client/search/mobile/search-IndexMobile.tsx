"use client";

import { Pagination } from "@/components/ui/pagination";
import SearchSidebar from "./search-Sidebar";
import ShopSuggestion from "./search-ShopSuggestions";
import SearchSortBar from "./search-SortBar";
import SearchProductGrid from "./search-ProductGrid";
import SearchBrand from "./search-Brand";
import { useSearchParams } from "next/navigation";
import { ProductsProvider } from "../context/ProductsContext";
// import SearchBrandInfo from './search-Brand';

interface SearchMobileIndexProps {
  categoryIds?: string[];
  currentCategoryId?: string | null;
}

export default function SearchMobileIndex({
  categoryIds = [],
  currentCategoryId,
}: SearchMobileIndexProps) {
  const searchParams = useSearchParams();
  const keyword = searchParams.get("q") || "";

  const parentCategoryId = categoryIds.length > 0 ? categoryIds[0] : null;

  return (
    <ProductsProvider currentCategoryId={currentCategoryId}>
      <div className="flex flex-col lg:flex-row gap-6 p-4 sm:p-6">
        <div className="lg:block hidden">
          <SearchSidebar
            categoryIds={categoryIds}
            currentCategoryId={currentCategoryId}
          />
        </div>

        <div className="flex-1 space-y-4">
          {/* <SearchBrandInfo /> */}
          <SearchBrand />
          <ShopSuggestion />
          {keyword && (
            <div className="text-sm text-gray-500">
              Kết quả tìm kiếm cho từ khoá '{keyword}'
            </div>
          )}
          <SearchSortBar />
          <SearchProductGrid />
          <Pagination />
        </div>
      </div>
    </ProductsProvider>
  );
}
