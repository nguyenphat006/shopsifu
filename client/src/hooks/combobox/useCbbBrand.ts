import { useState, useEffect } from 'react';
import { getAllBrands } from '@/services/admin/brandsService';
import { showToast } from '@/components/ui/toastify';
import { parseApiError } from '@/utils/error';

interface BrandOption {
  value: string;
  label: string;
  image?: string | null;
}

export const useCbbBrand = () => {
  const [brands, setBrands] = useState<BrandOption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        const response = await getAllBrands({ page: 1, limit: 1000 });
        if (response.data) {
          const formattedBrands = response.data.map((brand) => ({
            value: brand.id, // Giữ nguyên id dạng string từ API
            label: brand.name,
            image: brand.logo || null
          }));
          setBrands(formattedBrands);
        }
      } catch (error) {
        showToast(parseApiError(error), 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  return { brands, loading };
};
