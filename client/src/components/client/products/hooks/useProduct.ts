'use client';

import { useState, useEffect } from 'react';
import { clientProductsService } from '@/services/clientProductsService';
import { ClientProductDetail } from '@/types/client.products.interface';

export function useProduct(slug: string, initialData?: ClientProductDetail) {
  const [product, setProduct] = useState<ClientProductDetail | null>(initialData || null);
  const [isLoading, setIsLoading] = useState(!initialData);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    // Nếu không có initialData hoặc chuyển sang slug mới, fetch lại data
    if (!initialData || !product) {
      setIsLoading(true);
      setError(null);
      
      clientProductsService.getProductDetail(slug)
        .then((data: ClientProductDetail) => {
          console.log('✅ [useProduct] Fetched product data:', data.id);
          setProduct(data);
        })
        .catch(err => {
          console.error('❌ [useProduct] Error fetching product:', err);
          setError(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [slug, initialData]);

  // Nếu đổi slug, reset về initialData hoặc null
  useEffect(() => {
    if (initialData) {
      setProduct(initialData);
      setIsLoading(false);
      setError(null);
    }
  }, [slug, initialData]);

  return {
    product,
    isLoading,
    error,
  };
}
