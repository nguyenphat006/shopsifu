'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCbbCategory } from '@/hooks/combobox/useCbbCategory';
import { createCategorySlug } from '@/utils/slugify';

interface CategoryOption {
  value: string;
  label: string;
  icon?: string | null;
  parentCategoryId?: string | null;
}

interface UseSidebarProps {
  categoryIds?: string[];
  currentCategoryId?: string | null;
}

interface UseSidebarReturn {
  // Các state và handlers
  selectedCategoryPath: string[];
  selectedCategory: string;
  parentCategory: {value: string, label: string} | null;
  parentCategoryId: string | null;
  parentCategories: CategoryOption[];
  subcategories: CategoryOption[];
  loadingParentCategories: boolean;
  loadingSubcategories: boolean;
  selectedFilters: {[key: string]: string[]};
  setSelectedFilters: React.Dispatch<React.SetStateAction<{[key: string]: string[]}>>;
  
  // Các handlers
  handleCategorySelect: (categoryId: string, categoryName: string, isParent: boolean) => void;
  handleCheckboxChange: (filterType: string, item: string, checked: boolean) => void;
  handleClearAll: () => void;
}

export function useSidebar({ categoryIds = [], currentCategoryId }: UseSidebarProps): UseSidebarReturn {
  const router = useRouter();
  
  // State để theo dõi chuỗi danh mục đã chọn
  const [selectedCategoryPath, setSelectedCategoryPath] = useState<string[]>(categoryIds);
  const [selectedCategory, setSelectedCategory] = useState<string>(currentCategoryId || "");
  
  // Lấy parentCategoryId là phần tử đầu tiên của mảng (nếu có)
  const parentCategoryId = categoryIds.length > 0 ? categoryIds[0] : null;
  const [parentCategory, setParentCategory] = useState<{value: string, label: string} | null>(null);
  
  // State cho các bộ lọc
  const [selectedFilters, setSelectedFilters] = useState<{[key: string]: string[]}>({
    locations: [],
    brands: [],
    shipping: []
  });
  
  // Luôn lấy danh mục cha (top level categories)
  const { categories: parentCategories, loading: loadingParentCategories } = useCbbCategory(null);
  
  // Fetch subcategories dựa trên parent ID
  const { categories: subcategories, loading: loadingSubcategories } = useCbbCategory(parentCategoryId);
  
  // Xử lý logic khi có categoryIds từ URL
  useEffect(() => {
    if (parentCategoryId && parentCategories.length > 0) {
      // Tìm thông tin danh mục cha
      const parentCategoryFound = parentCategories.find(cat => cat.value === parentCategoryId);
      
      if (parentCategoryFound) {
        setParentCategory(parentCategoryFound);
      }
    }
    
    if (currentCategoryId) {
      setSelectedCategory(currentCategoryId);
    }
  }, [parentCategoryId, currentCategoryId, parentCategories]);

  // Xử lý khi người dùng chọn danh mục mới
  const handleCategorySelect = (categoryId: string, categoryName: string, isParent: boolean) => {
    if (!categoryId) return;
    
    let newPath: string[] = [];
    
    if (isParent) {
      // Nếu chọn danh mục cha, reset path chỉ còn ID cha
      newPath = [categoryId];
      setSelectedCategory(categoryId);
      
      // Cập nhật parent category
      const parentCategoryFound = parentCategories.find(cat => cat.value === categoryId);
      if (parentCategoryFound) {
        setParentCategory(parentCategoryFound);
      }
    } else {
      // Nếu chọn danh mục con, giữ ID cha và thêm ID con vào path
      if (parentCategory) {
        newPath = [parentCategory.value, categoryId];
        setSelectedCategory(categoryId);
      } else {
        // Trường hợp search không có parentCategory, tìm parent của category hiện tại
        const categoryFound = subcategories.find(cat => cat.value === categoryId);
        if (categoryFound && categoryFound.parentCategoryId) {
          newPath = [categoryFound.parentCategoryId, categoryId];
        } else {
          // Nếu không tìm được parent, chỉ sử dụng ID hiện tại
          newPath = [categoryId];
        }
        setSelectedCategory(categoryId);
      }
    }
    
    // Cập nhật path hiện tại
    setSelectedCategoryPath(newPath);
    
    // Tạo slug mới và điều hướng
    const slug = createCategorySlug(categoryName, newPath);
    router.push(slug);
  };
  
  // Xử lý thay đổi checkbox
  const handleCheckboxChange = (filterType: string, item: string, checked: boolean) => {
    setSelectedFilters(prev => {
      const currentItems = [...prev[filterType]];
      
      if (checked) {
        // Thêm item nếu chưa có
        if (!currentItems.includes(item)) {
          return { ...prev, [filterType]: [...currentItems, item] };
        }
      } else {
        // Xóa item nếu đã có
        return { ...prev, [filterType]: currentItems.filter(i => i !== item) };
      }
      
      return prev;
    });
  };
  
  // Xử lý xóa tất cả bộ lọc
  const handleClearAll = () => {
    setSelectedFilters({
      locations: [],
      brands: [],
      shipping: []
    });
  };
  
  return {
    selectedCategoryPath,
    selectedCategory,
    parentCategory,
    parentCategoryId,
    parentCategories,
    subcategories,
    loadingParentCategories,
    loadingSubcategories,
    selectedFilters,
    setSelectedFilters,
    handleCategorySelect,
    handleCheckboxChange,
    handleClearAll
  };
}
