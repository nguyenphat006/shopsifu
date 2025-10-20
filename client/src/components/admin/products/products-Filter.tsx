"use client"

import * as React from "react"
import { useTranslations } from "next-intl"
import type { Table, Column } from "@tanstack/react-table"
import { Check, PlusCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"

// Sử dụng trực tiếp categoryService để lấy dữ liệu danh mục từ API
import { categoryService } from '@/services/admin/categoryService';
import { Category } from '@/types/admin/category.interface';

interface ProductsFilterProps<TData> {
  table: Table<TData>;
  onPriceFilterChange?: (minPrice: number | null, maxPrice: number | null) => void;
  currentPriceFilter?: { minPrice: number | null; maxPrice: number | null };
  onCategoryFilterChange?: (categoryId: string | null) => void;
  currentCategoryFilter?: string | null;
}

export function ProductsFilter<TData>({ 
  table, 
  onPriceFilterChange,
  currentPriceFilter,
  onCategoryFilterChange,
  currentCategoryFilter
}: ProductsFilterProps<TData>) {
  const t = useTranslations("admin.ModuleProduct.Filter");

  // Không cần kiểm tra column tồn tại để dùng filter
  // const categoryColumn = table.getColumn("category");
  // const priceColumn = table.getColumn("price");
  // const sizeColumn = table.getColumn("size");
  
  // State để lưu danh sách danh mục
  const [categories, setCategories] = React.useState<Array<{
    value: string;
    label: string;
    icon?: string | null;
    parentCategoryId?: string | null;
  }>>([]);
  const [loadingCategories, setLoadingCategories] = React.useState(true);
  
  // Gọi API lấy danh sách danh mục khi component mount
  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await categoryService.getAll({ page: 1, limit: 100 });
        
        if (response.data) {
          const mappedCategories = response.data.map((category) => ({
            value: category.id,
            label: category.name,
            icon: category.logo,
            parentCategoryId: category.parentCategoryId
          }));
          setCategories(mappedCategories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoadingCategories(false);
      }
    };
    
    fetchCategories();
  }, []);

  // Lấy giá mặc định hoặc giá từ currentPriceFilter nếu có
  const defaultMinPrice = 1000;
  const defaultMaxPrice = 10000000;
  const [priceRange, setPriceRange] = React.useState<[number, number]>([
    (currentPriceFilter && currentPriceFilter.minPrice !== null) ? currentPriceFilter.minPrice : defaultMinPrice,
    (currentPriceFilter && currentPriceFilter.maxPrice !== null) ? currentPriceFilter.maxPrice : defaultMaxPrice
  ]);
  
  // Cập nhật priceRange khi currentPriceFilter thay đổi từ bên ngoài
  React.useEffect(() => {
    if (currentPriceFilter) {
      const newMin = currentPriceFilter.minPrice !== null ? currentPriceFilter.minPrice : defaultMinPrice;
      const newMax = currentPriceFilter.maxPrice !== null ? currentPriceFilter.maxPrice : defaultMaxPrice;
      
      // Chỉ cập nhật khi giá trị thực sự thay đổi để tránh re-render không cần thiết
      if (priceRange[0] !== newMin || priceRange[1] !== newMax) {
        setPriceRange([newMin, newMax]);
      }
    }
  }, [currentPriceFilter]);
  
  // Apply server-side filtering via API parameters
  const applyPriceFilter = () => {
    if (onPriceFilterChange) {
      // Pass min and max price to the API handler
      onPriceFilterChange(priceRange[0], priceRange[1]);
    }
  };

  const clearPriceFilter = () => {
    setPriceRange([defaultMinPrice, defaultMaxPrice]);
    if (onPriceFilterChange) {
      // Clear the price filter by passing null values
      onPriceFilterChange(null, null);
    }
  };
  
  // Xử lý khi chọn danh mục (chỉ chọn 1 danh mục)
  const handleCategoryChange = (categoryId: string) => {
    if (onCategoryFilterChange) {
      // Nếu categoryId trùng với categoryId hiện tại, xóa filter (toggle)
      if (categoryId === currentCategoryFilter) {
        onCategoryFilterChange(null);
      } else {
        // Nếu chọn danh mục khác, thay thế danh mục đang chọn
        onCategoryFilterChange(categoryId);
      }
    }
  };
  
  // Xử lý xóa filter danh mục
  const clearCategoryFilter = () => {
    if (onCategoryFilterChange) {
      onCategoryFilterChange(null);
    }
  };
  // const selectedSizes = new Set(sizeColumn?.getFilterValue() as string[]);

  return (
    <div className="flex items-center space-x-2">
      {/* --- Bộ lọc Danh mục --- */}
      {(
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className={cn(
                "h-8",
                currentCategoryFilter 
                  ? "border-primary/50 bg-primary/10" 
                  : "border-dashed"
              )}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              {t("category") || "Danh mục"}
              {currentCategoryFilter && (
                <>
                  <Separator orientation="vertical" className="mx-2 h-4" />
                  <Badge variant="secondary" className="rounded-sm px-1 font-normal truncate max-w-[120px]">
                    {categories.find(cat => cat.value === currentCategoryFilter)?.label || currentCategoryFilter}
                  </Badge>
                </>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0" align="start">
            <Command>
              <CommandInput placeholder={t("searchCategory") || "Tìm kiếm danh mục..."} />
              <CommandList>
                <CommandEmpty>{t("noResults") || "Không tìm thấy kết quả."}</CommandEmpty>
                <CommandGroup>
                  {loadingCategories ? (
                    <CommandItem disabled>
                      <span className="opacity-70">{t("loading") || "Đang tải..."}</span>
                    </CommandItem>
                  ) : (
                    categories.map((category) => {
                      const isSelected = currentCategoryFilter === category.value;
                      return (
                        <CommandItem
                          key={category.value}
                          onSelect={() => handleCategoryChange(category.value)}
                          className="flex items-center space-x-2"
                        >
                          <div
                            className={cn(
                              "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                              isSelected
                                ? "bg-primary text-primary-foreground"
                                : "opacity-50 [&_svg]:invisible"
                            )}
                          >
                            <Check className="h-4 w-4" />
                          </div>
                          <span>{category.label}</span>
                        </CommandItem>
                      );
                    })
                  )}
                </CommandGroup>
                {currentCategoryFilter && (
                  <>
                    <CommandSeparator />
                    <CommandGroup>
                      <CommandItem
                        onSelect={clearCategoryFilter}
                        className="justify-center text-center"
                      >
                        {t("clearFilters") || "Xóa bộ lọc"}
                      </CommandItem>
                    </CommandGroup>
                  </>
                )}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}

      {/* --- Bộ lọc Giá --- */}
      {(
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className={cn(
                "h-8",
                priceRange[0] !== defaultMinPrice || priceRange[1] !== defaultMaxPrice 
                  ? "border-primary/50 bg-primary/10" 
                  : "border-dashed"
              )}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              {t("price") || "Giá"}
              {(priceRange[0] !== defaultMinPrice || priceRange[1] !== defaultMaxPrice) && (
                <>
                  <Separator orientation="vertical" className="mx-2 h-4" />
                  <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                    {new Intl.NumberFormat('vi-VN', { 
                      style: 'currency', 
                      currency: 'VND',
                      notation: 'compact' 
                    }).format(priceRange[0])} - {new Intl.NumberFormat('vi-VN', { 
                      style: 'currency', 
                      currency: 'VND', 
                      notation: 'compact'
                    }).format(priceRange[1])}
                  </Badge>
                </>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64 p-4" align="start">
            <div className="space-y-4">
              <h4 className="font-medium leading-none">{t("priceRange") || "Khoảng giá"}</h4>
              <Slider
                defaultValue={[1000, 10000000]}
                value={priceRange}
                min={1000}
                max={10000000}
                step={100000}
                onValueChange={(value) => setPriceRange(value as [number, number])}
              />
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(priceRange[0])}
                </span>
                <span className="text-sm text-muted-foreground">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(priceRange[1])}
                </span>
              </div>
              <div className="flex flex-col gap-2 pt-2">
                {(currentPriceFilter?.minPrice !== null || currentPriceFilter?.maxPrice !== null) && (
                  <p className="text-sm text-muted-foreground italic">
                    {t("activeFilter") || "Bộ lọc đang áp dụng"}: {currentPriceFilter?.minPrice?.toLocaleString('vi-VN')} - {currentPriceFilter?.maxPrice?.toLocaleString('vi-VN')} VND
                  </p>
                )}
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearPriceFilter}
                    title={t("clearFilter") || "Xóa bộ lọc"}
                  >
                    {t("clear") || "Xóa"}
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={applyPriceFilter}
                    title={t("applyFilter") || "Áp dụng bộ lọc"}
                  >
                    {t("apply") || "Áp dụng"}
                  </Button>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}