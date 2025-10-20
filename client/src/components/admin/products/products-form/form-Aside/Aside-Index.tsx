"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, ChevronsUpDown, Loader2, Calendar as CalendarIcon } from "lucide-react";
import { BrandCbb } from "@/components/ui/combobox/BrandCbb";
import { CategoryModal } from "./form-ModalCategory";
import { ProductCreateRequest } from "@/types/products.interface";
import { categoryService } from "@/services/admin/categoryService";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";

interface ProductAsideFormProps {
  brandId: string | null;
  categories: string[];
  publishedAt?: string | null; 
  handleInputChange: (field: keyof ProductCreateRequest, value: any) => void;
  handleSubmit: (options?: { stayOnPage?: boolean }) => Promise<void>;
  handleSaveAndAddNew: () => Promise<void>;
  isSubmitting: boolean;
  isEditMode: boolean;
}

export function ProductAsideForm({
  brandId,
  categories,
  handleInputChange,
  handleSubmit,
  handleSaveAndAddNew,
  isSubmitting,
  isEditMode,
  publishedAt,
}: ProductAsideFormProps) {
  // State for publishing date/time
  const [isPublished, setIsPublished] = useState(false);
  const [publishDate, setPublishDate] = useState<Date | undefined>(undefined);
  
  // State for category modal
  const [isCategoryModalOpen, setCategoryModalOpen] = useState(false);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [selectedCategoryPath, setSelectedCategoryPath] = useState<string>('');
  const [isLoadingCategory, setIsLoadingCategory] = useState<boolean>(false);

  // Update states when publishedAt changes (from API)
  useEffect(() => {
    if (publishedAt) {
      try {
        const date = new Date(publishedAt);
        if (!isNaN(date.getTime())) {
          setIsPublished(true);
          setPublishDate(date);
          console.log('Publish date parsed:', date.toLocaleString());
        } else {
          console.error('Invalid date from server:', publishedAt);
          setIsPublished(false);
          setPublishDate(undefined);
        }
      } catch (error) {
        console.error('Error parsing publishedAt date:', error);
        setIsPublished(false);
        setPublishDate(undefined);
      }
    } else {
      setIsPublished(false);
      setPublishDate(undefined);
    }
  }, [publishedAt]);

  // Simplified category processing
  useEffect(() => {
    if (categories && categories.length > 0 && selectedCategoryPath === '') {
      const fetchCategoryData = async () => {
        setIsLoadingCategory(true);
        try {
          // Fetch tất cả categories một lần
          const response = await categoryService.getAll();
          const allCategories = response.data || response;
          
          // Tạo Map để dễ tìm kiếm
          const categoryMap = new Map();
          allCategories.forEach(cat => {
            if (cat.id) {
              categoryMap.set(cat.id.toString(), cat);
            }
          });
          
          // Array để lưu các path duy nhất
          const categoryPaths: string[] = [];
          const processedCategories = new Set<string>();
          
          // Debug log
          console.log('Original categories:', categories);
          console.log('All fetched categories:', allCategories);
          
          // Xử lý từng category ID và tránh duplicate
          for (const categoryId of categories) {
            // Bỏ qua nếu đã xử lý category này rồi
            if (processedCategories.has(categoryId)) {
              console.log(`Skipping duplicate category: ${categoryId}`);
              continue;
            }
            
            const category = categoryMap.get(categoryId);
            
            if (category) {
              let displayPath = '';
              
              if (category.parentCategoryId) {
                // Có parent category
                const parentCategory = categoryMap.get(category.parentCategoryId.toString());
                if (parentCategory) {
                  displayPath = `${parentCategory.name} > ${category.name}`;
                } else {
                  displayPath = category.name;
                }
              } else {
                // Category gốc
                displayPath = category.name;
              }
              
              // Chỉ thêm nếu chưa có path này
              if (!categoryPaths.includes(displayPath)) {
                categoryPaths.push(displayPath);
                console.log(`Added path: ${displayPath}`);
              } else {
                console.log(`Duplicate path detected: ${displayPath}`);
              }
              processedCategories.add(categoryId);
            } else {
              // Fallback: fetch riêng nếu không tìm thấy
              try {
                const categoryDetail = await categoryService.getById(categoryId.toString());
                if (categoryDetail?.data) {
                  const categoryData = categoryDetail.data;
                  let displayPath = categoryData.name;
                  
                  if (categoryData.parentCategoryId) {
                    const parentDetail = await categoryService.getById(categoryData.parentCategoryId.toString());
                    if (parentDetail?.data) {
                      displayPath = `${parentDetail.data.name} > ${categoryData.name}`;
                    }
                  }
                  
                  // Chỉ thêm nếu chưa có path này
                  if (!categoryPaths.includes(displayPath)) {
                    categoryPaths.push(displayPath);
                  }
                  processedCategories.add(categoryId);
                }
              } catch (detailError) {
                console.error(`Failed to fetch category ${categoryId}:`, detailError);
                if (!categoryPaths.includes('Danh mục không xác định')) {
                  categoryPaths.push('Danh mục không xác định');
                }
                processedCategories.add(categoryId);
              }
            }
          }
          
          // Join các path thành chuỗi cuối cùng
          const finalPath = categoryPaths.join(', ');
          
          setSelectedCategoryIds(categories);
          setSelectedCategoryPath(finalPath);
          
        } catch (error) {
          console.error("Failed to fetch category data:", error);
          setSelectedCategoryPath('Không thể tải thông tin danh mục');
        } finally {
          setIsLoadingCategory(false);
        }
      };
      
      fetchCategoryData();
    }
  }, [categories, selectedCategoryPath]);

  // Handle publish status change
  const handlePublishToggle = (checked: boolean) => {
    setIsPublished(checked);
    
    if (checked) {
      const dateToUse = publishDate || new Date();
      
      if (!publishDate) {
        console.log('Setting publishedAt to current date/time:', dateToUse.toISOString());
      } else {
        console.log('Keeping existing publish date/time:', dateToUse.toISOString());
      }
      
      setPublishDate(dateToUse);
      handleInputChange('publishedAt', dateToUse.toISOString());
    } else {
      console.log('Clearing publishedAt due to publish toggle off');
      handleInputChange('publishedAt', null);
    }
  };
  
  // Handle publish date change
  const handlePublishDateChange = (date: Date | undefined) => {
    if (!date) {
      setPublishDate(undefined);
      if (isPublished) {
        console.log('Clearing publishedAt due to date being cleared');
        handleInputChange('publishedAt', null);
      }
      return;
    }
    
    if (isNaN(date.getTime())) {
      console.error('Invalid date in handlePublishDateChange:', date);
      return;
    }
    
    setPublishDate(date);
    
    if (isPublished) {
      console.log('Updating publishedAt to:', date.toISOString());
      handleInputChange('publishedAt', date.toISOString());
    }
  };

  // Handle brand change
  const handleBrandChange = (id: string | null) => {
    handleInputChange('brandId', id);
  };

  // Handle category selection from modal
  const handleCategoryConfirm = (categoryIds: string[], selectionPath: string) => {
    // Sử dụng nguyên ID gốc, không thay đổi hoặc chuyển đổi định dạng
    console.log('Selected category IDs (unchanged):', categoryIds);
    
    setSelectedCategoryIds(categoryIds);
    setSelectedCategoryPath(selectionPath);
    handleInputChange('categories', categoryIds);
  };

  return (
    <div className="sticky top-4 grid auto-rows-max items-start gap-4 md:gap-8">
      {/* Action Buttons */}
      <div className="flex flex-col gap-2">
        {!isEditMode && (
          <Button
            type="button"
            onClick={handleSaveAndAddNew}
            disabled={isSubmitting}
            variant="secondary"
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Lưu và Thêm mới
          </Button>
        )}
        {isEditMode && (
          <Button variant="outline" className="flex-1 flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Xem sản phẩm
          </Button>
        )}
        <Button 
          onClick={() => handleSubmit()} 
          disabled={isSubmitting} 
          className="flex-1 flex items-center gap-2"
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditMode ? 'Cập nhật sản phẩm' : 'Thêm mới'}
        </Button>
      </div>

      {/* Card 1: Product Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Hiển thị</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Công khai toggle */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="publish-toggle">Công khai</Label>
              <p className="text-sm text-muted-foreground">
                {isPublished ? 'Sản phẩm sẽ hiển thị công khai' : 'Sản phẩm ở chế độ nháp'}
              </p>
            </div>
            <Switch
              id="publish-toggle"
              checked={isPublished}
              onCheckedChange={handlePublishToggle}
            />
          </div>
          
          {/* Ngày công khai (chỉ hiển thị khi bật công khai) */}
          {isPublished && (
            <div className="grid gap-2">
              <Label htmlFor="publish-date">Ngày công khai</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="publish-date"
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !publishDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {publishDate ? (
                      format(publishDate, "PPpp", { locale: vi })
                    ) : (
                      "Chọn ngày và giờ công khai"
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={publishDate}
                    onSelect={handlePublishDateChange}
                    initialFocus
                  />
                  <div className="p-3 border-t border-border">
                    <div className="flex justify-between items-center">
                      <div className="grid gap-1">
                        <p className="text-sm font-medium">Chọn giờ</p>
                        <div className="flex items-center space-x-2">
                          <select
                            id="publish-hour-select"
                            aria-label="Select hour"
                            className="w-16 rounded-md border border-input bg-background px-2 py-1 text-sm"
                            value={publishDate ? new Date(publishDate).getHours() : 0}
                            onChange={(e) => {
                              if (!publishDate) return;
                              const newDate = new Date(publishDate);
                              newDate.setHours(parseInt(e.target.value));
                              handlePublishDateChange(newDate);
                            }}
                          >
                            {Array.from({ length: 24 }, (_, i) => (
                              <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>
                            ))}
                          </select>
                          <span aria-hidden="true">:</span>
                          <select
                            id="publish-minute-select"
                            aria-label="Select minute"
                            className="w-16 rounded-md border border-input bg-background px-2 py-1 text-sm"
                            value={publishDate ? new Date(publishDate).getMinutes() : 0}
                            onChange={(e) => {
                              if (!publishDate) return;
                              const newDate = new Date(publishDate);
                              newDate.setMinutes(parseInt(e.target.value));
                              handlePublishDateChange(newDate);
                            }}
                          >
                            {Array.from({ length: 60 }, (_, i) => (
                              <option key={i} value={i}>{i.toString().padStart(2, '0')}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            const now = new Date();
                            console.log('Setting to current time:', now.toISOString());
                            handlePublishDateChange(now);
                          }}
                        >
                          Đặt thời gian hiện tại
                        </Button>
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-muted-foreground text-center">
                      {publishDate && (
                        <p>Sản phẩm sẽ được công khai vào: {format(publishDate, 'PPpp', { locale: vi })}</p>
                      )}
                      Đã chọn: {publishDate ? format(publishDate, "PPpp", { locale: vi }) : "Chưa chọn ngày"}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              <p className="text-xs text-muted-foreground">
                {publishedAt ? (
                  <span>Đã công khai lúc: {format(new Date(publishedAt), "PPpp", { locale: vi })}</span>
                ) : isPublished ? (
                  <span>Sản phẩm sẽ được công khai ngay khi lưu</span>
                ) : null}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Card 2: Product Details */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-6">
            {/* Vendor/Brand */}
            <div className="grid gap-3">
              <Label htmlFor="vendor">Thương hiệu</Label>
              <BrandCbb value={brandId} onChange={handleBrandChange} />
            </div>

            {/* Category */}
            <div className="grid gap-3">
              <Label htmlFor="category">Danh mục</Label>
              <Button 
                type="button"
                variant="outline" 
                className="w-full justify-between font-normal text-left h-auto min-h-[2.5rem] py-2" 
                onClick={() => setCategoryModalOpen(true)}
                disabled={isLoadingCategory}
              >
                <div className="flex-1 text-left overflow-hidden">
                  {isLoadingCategory ? (
                    <span className="flex items-center">
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Đang tải...
                    </span>
                  ) : (
                    <div className="space-y-1">
                      <span 
                        className="block text-sm leading-tight line-clamp-2"
                        title={selectedCategoryPath || 'Chọn danh mục'}
                      >
                        {selectedCategoryPath || 'Chọn danh mục'}
                      </span>
                      {selectedCategoryPath && selectedCategoryIds.length > 0 && (
                        <span className="text-xs text-muted-foreground">
                          {selectedCategoryIds.length} danh mục
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 self-start mt-1" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Modal */}
      <CategoryModal 
        open={isCategoryModalOpen}
        onOpenChange={setCategoryModalOpen}
        onConfirm={handleCategoryConfirm}
        initialSelectedIds={selectedCategoryIds}
      />
    </div>
  );
}