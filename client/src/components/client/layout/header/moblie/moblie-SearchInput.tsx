"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Search, X, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { clientProductsService } from "@/services/clientProductsService";
import { useDebounce } from "@/hooks/useDebounce";
import { ClientSearchResultItem } from "@/types/client.products.interface";
import { createCategorySlug } from "@/utils/slugify";
import { useCbbCategory } from "@/hooks/combobox/useCbbCategory";
import { createProductSlug } from "@/components/client/products/shared/productSlug";

export function MobileSearchInput() {
  const [searchTerm, setSearchTerm] = useState("");
  const [totalItems, setTotalItems] = useState<number>(0);
  const [searchSuggestions, setSearchSuggestions] = useState<
    ClientSearchResultItem[]
  >([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const debouncedSearch = useDebounce(searchTerm, 500);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Load lịch sử từ localStorage khi mount
  useEffect(() => {
    const stored = localStorage.getItem("searchHistory");
    if (stored) {
      setSearchHistory(JSON.parse(stored));
    }
  }, []);

  // Hàm lưu lịch sử vào localStorage
  const saveSearchHistory = useCallback((term: string) => {
    if (!term.trim()) return;

    setSearchHistory((prev) => {
      // Bỏ trùng lặp, thêm term mới lên đầu
      const newHistory = [term, ...prev.filter((t) => t !== term)];
      // Giới hạn 10 từ khóa gần nhất
      const limitedHistory = newHistory.slice(0, 10);

      localStorage.setItem("searchHistory", JSON.stringify(limitedHistory));
      return limitedHistory;
    });
  }, []);

  //Sử dụng hook để lấy danh mục từ api
  const { categories } = useCbbCategory(null);

  const navigateToSearch = useCallback(
    (term: string) => {
      if (!term.trim()) return;

      saveSearchHistory(term);

      // Kiểm tra xem hiện tại có đang ở trang search không
      const isOnSearchPage = window.location.pathname === "/search";

      // Lấy thông tin search term hiện tại từ URL để so sánh
      const urlParams = new URLSearchParams(window.location.search);
      const currentSearchTerm = urlParams.get("q");

      // Nếu search term không thay đổi và đang ở trang search, thêm/cập nhật timestamp
      if (isOnSearchPage && currentSearchTerm === term) {
        // Tạo timestamp mới cho mỗi lần search để đảm bảo không bị cache
        const timestamp = new Date().getTime();
        router.push(`/search?q=${encodeURIComponent(term)}&_t=${timestamp}`);
      }
      // Nếu search term thay đổi hoặc không ở trang search
      else {
        if (isOnSearchPage) {
          // Nếu đã ở trang search và search term khác, thêm timestamp
          const timestamp = new Date().getTime();
          router.push(`/search?q=${encodeURIComponent(term)}&_t=${timestamp}`);
        } else {
          // Chuyển hướng đến route gốc /search (không thêm timestamp lần đầu)
          router.push(`/search?q=${encodeURIComponent(term)}`);
        }
      }

      setIsFocused(false);
      inputRef.current?.blur();
    },
    [router, saveSearchHistory]
  );

  // Fetch gợi ý
  const fetchSearchSuggestions = useCallback(
    async (term: string, signal: AbortSignal) => {
      if (term.length < 2) {
        setSearchSuggestions([]);
        return;
      }
      setIsLoadingSuggestions(true);
      try {
        const response = await clientProductsService.getSearchSuggestions(
          term,
          5,
          { signal }
        );
        setSearchSuggestions(response.data);
        setTotalItems(response.metadata?.totalItems || 0);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Error fetching search suggestions:", error);
          setSearchSuggestions([]);
        }
      } finally {
        setIsLoadingSuggestions(false);
      }
    },
    []
  );

  // Bỏ dấu tiếng Việt
  const removeDiacritics = (str: string) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const highlightMatch = (text: string, keyword: string) => {
    if (!keyword) return text;

    const normalizedText = removeDiacritics(text).toLowerCase();
    const normalizedKeyword = removeDiacritics(keyword).toLowerCase();

    // Tìm vị trí match trong chuỗi đã bỏ dấu
    const startIndex = normalizedText.indexOf(normalizedKeyword);
    if (startIndex === -1) return text;

    const endIndex = startIndex + normalizedKeyword.length;

    // Cắt highlight dựa trên vị trí match
    const before = text.slice(0, startIndex);
    const match = text.slice(startIndex, endIndex);
    const after = text.slice(endIndex);

    return `${before}<span class="font-bold bg-yellow-200">${match}</span>${after}`;
  };

  useEffect(() => {
    if (debouncedSearch.length < 2) {
      setSearchSuggestions([]);
      return;
    }
    const controller = new AbortController();
    fetchSearchSuggestions(debouncedSearch, controller.signal);
    return () => controller.abort();
  }, [debouncedSearch, fetchSearchSuggestions]);

  const SkeletonSuggestion = () => (
    <div className="px-4 py-2 flex items-center">
      <div className="w-5 h-5 bg-gray-200 rounded-full mr-3 animate-pulse" />
      <div className="flex-1">
        <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse mb-1" />
        <div className="h-3 bg-gray-100 rounded w-1/2 animate-pulse" />
      </div>
    </div>
  );

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black transition-all duration-300 ${
          isFocused ? "opacity-50 visible z-40" : "opacity-0 invisible"
        }`}
        onClick={() => setIsFocused(false)}
      />

      <div className="relative w-full z-50">
        {/* Input */}
        <div className="flex items-center gap-2 bg-[#f8f8f8] rounded-md border border-gray-200 h-10 px-2">
          <Search className="h-4 w-4 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onFocus={() => setIsFocused(true)}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") navigateToSearch(searchTerm);
              if (e.key === "Escape") {
                if (searchTerm) setSearchTerm("");
                else setIsFocused(false);
              }
            }}
            placeholder="Tìm kiếm sản phẩm..."
            className="flex-1 bg-transparent text-sm text-black placeholder-gray-400 focus:outline-none"
            role="combobox"
            aria-expanded={isFocused}
            aria-controls="mobile-search-suggestions"
          />
          {searchTerm && (
            <button
              className="p-1 rounded-full hover:bg-gray-200"
              onClick={() => {
                setSearchTerm("");
                inputRef.current?.focus();
              }}
            >
              <X className="h-4 w-4 text-gray-500" />
            </button>
          )}
        </div>

        {/* Dropdown */}
        <AnimatePresence>
          {isFocused && (
            <motion.div
              id="mobile-search-suggestions"
              className="absolute top-[calc(100%+8px)] bg-white rounded-lg shadow-lg border border-gray-100 w-full"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              role="listbox"
            >
              <div className="pb-3">
                {!searchTerm ? (
                  <>
                    {/* --- Lịch sử tìm kiếm --- */}
                    {searchHistory.length === 0 ? (
                      <div className="px-4 py-6 text-center text-gray-400 text-sm">
                        Chưa có lịch sử tìm kiếm
                      </div>
                    ) : (
                      <div className="px-4 pt-3">
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="text-sm font-semibold text-gray-800">
                            Lịch sử tìm kiếm
                          </h3>
                          <button
                            className="text-xs text-red-500 hover:underline"
                            onClick={() => {
                              setSearchHistory([]);
                              localStorage.removeItem("searchHistory");
                            }}
                          >
                            Xoá tất cả
                          </button>
                        </div>

                        <div className="space-y-1">
                          {searchHistory.map((term, idx) => (
                            <div
                              key={idx}
                              className="px-2 py-2 cursor-pointer hover:bg-gray-50 flex items-center justify-between rounded-md transition-colors"
                              onClick={() => navigateToSearch(term)}
                            >
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-gray-500" />
                                <span className="text-sm text-gray-800">
                                  {term}
                                </span>
                              </div>
                              <X
                                className="h-4 w-4 text-gray-400 hover:text-red-500 flex-shrink-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const newHistory = searchHistory.filter(
                                    (t) => t !== term
                                  );
                                  setSearchHistory(newHistory);
                                  localStorage.setItem(
                                    "searchHistory",
                                    JSON.stringify(newHistory)
                                  );
                                }}
                              />
                            </div>
                          ))}
                        </div>
                        <div className="border-t border-gray-100 mt-3"></div>
                      </div>
                    )}

                    {/* --- Danh mục phổ biến --- */}
                    <div className="px-4 pt-3">
                      <h3 className="text-sm font-semibold text-gray-800 mb-2">
                        Danh mục phổ biến
                      </h3>
                      {categories.slice(0, 5).map((category) => (
                        <motion.div
                          key={category.value}
                          className="cursor-pointer modal-input"
                          onClick={() => setIsFocused(false)}
                        >
                          <div className="px-2 py-2.5">
                            <Link
                              href={createCategorySlug(category.label, [
                                category.value,
                              ])}
                              className="w-full flex items-center justify-between"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="flex items-center">
                                <div className="w-9 h-9 relative overflow-hidden rounded-full border border-gray-100 mr-3">
                                  {category.icon ? (
                                    <Image
                                      src={category.icon}
                                      alt={category.label}
                                      fill
                                      sizes="36px"
                                      className="object-cover transition-transform duration-300"
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                                      {category.label.charAt(0)}
                                    </div>
                                  )}
                                </div>
                                <span className="text-sm text-gray-800">
                                  {category.label}
                                </span>
                              </div>
                            </Link>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </>
                ) : isLoadingSuggestions ? (
                  Array(5)
                    .fill(0)
                    .map((_, i) => <SkeletonSuggestion key={i} />)
                ) : searchSuggestions.length > 0 ? (
                  <>
                    {/* --- Kết quả liên quan --- */}
                    <div className="px-4 pt-3">
                      <h3 className="text-sm font-semibold text-gray-800 mb-2">
                        Kết quả liên quan
                      </h3>
                    </div>

                    {searchSuggestions.map((item) => (
                      <div
                        key={item.productId}
                        className="px-4 py-2 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
                        onClick={() => {
                          navigateToSearch(item.productName);
                          const slug = createProductSlug(
                            item.productName,
                            item.productId
                          );
                          router.push(`/products/${slug}`);
                        }}
                        role="option"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 flex-shrink-0 rounded overflow-hidden">
                            <Image
                              src={item.skuImage || "/static/no-image.png"}
                              alt={item.productName}
                              width={32}
                              height={32}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <span
                            className="text-sm font-medium text-gray-800 line-clamp-1"
                            dangerouslySetInnerHTML={{
                              __html: highlightMatch(
                                item.productName,
                                searchTerm
                              ),
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <div className="px-4 py-6 text-center text-gray-500">
                    Không tìm thấy kết quả cho "{searchTerm}"
                  </div>
                )}
              </div>

              {/* Footer CTA */}
              {searchTerm && (
                <div className="px-5 pb-5">
                  <div className="border-t border-gray-100 pt-4">
                    <div
                      className="flex items-center justify-center w-full bg-red-50 hover:bg-red-100 text-red-600 font-medium p-3 rounded-lg transition-colors duration-200 cursor-pointer"
                      onClick={() => {
                        navigateToSearch(searchTerm);
                      }}
                    >
                      <Search className="h-4 w-4 mr-2.5" />
                      <span>
                        Xem tất cả{" "}
                        <span className="font-bold text-red-600">
                          "{totalItems}"
                        </span>{" "}
                        kết quả theo từ khóa{" "}
                        <span className="font-bold text-red-600">
                          "{searchTerm}"
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
