"use client";

import { createContext, useContext, ReactNode, useMemo, useEffect, useRef } from 'react';
import { useProducts } from '../hooks/useProducts';
import { ClientProduct, ClientProductsResponse } from '@/types/client.products.interface';
import { useSearchParams } from 'next/navigation';

interface ProductsContextValue {
  products: ClientProduct[];
  metadata: ClientProductsResponse['metadata'] | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  currentPage: number;
  pageLimit: number;
  selectedSort: string;
  handlePageChange: (page: number) => void;
  setSelectedSort: (sort: string) => void;
  paginationData: {
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

const ProductsContext = createContext<ProductsContextValue | undefined>(undefined);

interface ProductsProviderProps {
  children: ReactNode;
  currentCategoryId?: string | null;
  querySearch?: string;
}

export function ProductsProvider({ children, currentCategoryId, querySearch }: ProductsProviderProps) {
  const searchParams = useSearchParams();
  const sort = searchParams.get('sort') || 'relevance';
  const searchQuery = querySearch || searchParams.get('q') || '';
  
  // Nếu có search query, bỏ qua categoryId để đảm bảo tìm kiếm trên toàn bộ sản phẩm
  const effectiveCategoryId = searchQuery ? null : currentCategoryId;
  
  // Lấy timestamp từ URL nếu có
  const timestamp = searchParams.get('_t') || '';
  
  // Sử dụng useRef để theo dõi thay đổi thực sự của searchQuery và timestamp
  const prevSearchQueryRef = useRef(searchQuery);
  const prevTimestampRef = useRef(timestamp);
  
  // Tạo key để force re-render khi search query hoặc categoryId thay đổi
  // Chỉ sử dụng timestamp khi nó thay đổi so với giá trị trước đó
  const dataKey = useMemo(() => {
    // Kiểm tra xem searchQuery hoặc timestamp có thay đổi không
    const searchChanged = searchQuery !== prevSearchQueryRef.current;
    const timestampChanged = timestamp !== prevTimestampRef.current;
    
    // Cập nhật ref nếu có thay đổi
    if (searchChanged) prevSearchQueryRef.current = searchQuery;
    if (timestampChanged) prevTimestampRef.current = timestamp;
    
    // Chỉ bao gồm timestamp trong key khi nó thay đổi
    const keyParts = [
      searchQuery || '', 
      effectiveCategoryId || '', 
      sort || ''
    ];
    
    // LUÔN thêm timestamp vào key để đảm bảo chúng ta có thể theo dõi thay đổi
    // Điều này giúp đồng bộ hóa các request và tránh request trùng lặp
    keyParts.push(timestamp || 'default');
    
    const finalKey = keyParts.join('-');
    console.log("Generated data key:", finalKey);
    return finalKey;
  }, [searchQuery, effectiveCategoryId, sort, timestamp]);
  
  // useProducts sẽ được khởi tạo lại khi dataKey thay đổi
  const productsData = useProducts({ 
    categoryId: effectiveCategoryId, 
    key: dataKey, // Truyền key để làm điểm phân biệt,
    querySearch: searchQuery})

    console.log ("check1: ", productsData)
  
  // Thêm các giá trị bổ sung cho context
  // useEffect để log khi searchQuery hoặc categoryId thay đổi
  // useEffect(() => {
  //   console.log("ProductsContext detected changes:", { 
  //     searchQuery, 
  //     currentCategoryId, 
  //     effectiveCategoryId,
  //     dataKey 
  //   });
  // }, [searchQuery, currentCategoryId, effectiveCategoryId, dataKey]);
  
  const contextValue = useMemo(() => ({
    ...productsData,
    selectedSort: sort,
    setSelectedSort: (newSort: string) => {
      // Chức năng này sẽ được triển khai trong SortBar component
      console.log('Changing sort to:', newSort);
    }
  }), [productsData, sort]);
  
  return (
    <ProductsContext.Provider value={contextValue}>
      {children}
    </ProductsContext.Provider>
  );
}

export function useProductsContext() {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProductsContext must be used within a ProductsProvider');
  }
  return context;
}
