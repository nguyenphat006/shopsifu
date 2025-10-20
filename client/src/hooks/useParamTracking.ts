"use client";

import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

export function useSearchTracker() {
  const params = useSearchParams();

  const searchQuery = params.get("q") || "";
  const sort = params.get("sort") || "relevance";
  const timestamp = params.get("_t") || "";

  // Key duy nhất cho request
  const dataKey = useMemo(
    () => [searchQuery, sort, timestamp || "default"].join("-"),
    [searchQuery, sort, timestamp]
  );

  return {
    searchQuery,
    sort,
    timestamp,
    dataKey,
  };
}
