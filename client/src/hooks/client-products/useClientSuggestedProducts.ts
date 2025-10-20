// hooks/useClientSuggestedProducts.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { clientProductsService } from '@/services/clientProductsService';
import { ClientProduct } from '@/types/client.products.interface';

interface UseSuggestedProductsOptions {
  initialLimit?: number;
  incrementAmount?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  categoryId?: string;
}

export function useClientSuggestedProducts({
  initialLimit = 12,
  incrementAmount = 12,
  sortBy = 'createdAt',
  sortOrder = 'desc',
  categoryId,
}: UseSuggestedProductsOptions = {}) {
  // State để lưu trữ dữ liệu và trạng thái
  const [products, setProducts] = useState<ClientProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [limit, setLimit] = useState(initialLimit);
  
  // Sử dụng useRef để theo dõi nếu component đã unmount
  const isMounted = useRef(true);
  
  // Hàm fetch dữ liệu
  const fetchProducts = useCallback(async (currentLimit: number) => {
    try {
      setLoading(true);
      
      const response = await clientProductsService.getProducts({
        page: 1,
        limit: currentLimit,
        sortBy,
        sortOrder,
        categoryId,
      });
      
      // Chỉ cập nhật state nếu component vẫn mounted
      if (isMounted.current) {
        setProducts(response.data || []);
        setHasMore((response.data?.length || 0) >= currentLimit);
        setError(null);
      }
    } catch (err) {
      if (isMounted.current) {
        setError(err instanceof Error ? err : new Error('Failed to fetch products'));
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
        setInitialLoading(false);
      }
    }
  }, [sortBy, sortOrder, categoryId]);
  
  // Xử lý "Xem thêm"
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      const newLimit = limit + incrementAmount;
      setLimit(newLimit);
      fetchProducts(newLimit);
    }
  }, [loading, hasMore, limit, incrementAmount, fetchProducts]);
  
  // Fetch dữ liệu ban đầu
  useEffect(() => {
    // Reset state khi các tham số thay đổi
    setInitialLoading(true);
    setLimit(initialLimit);
    setHasMore(true);
    
    fetchProducts(initialLimit);
    
    // Cleanup function
    return () => {
      isMounted.current = false;
    };
  }, [fetchProducts, initialLimit]);
  
  return {
    products,
    loading,
    initialLoading,
    error,
    hasMore,
    loadMore,
  };
}