import { useQuery } from '@tanstack/react-query';
import { categoryService } from '@/services/admin/categoryService';
import { showToast } from '@/components/ui/toastify';
import { parseApiError } from '@/utils/error';
import { PaginationRequest } from '@/types/base.interface';

interface CategoryOption {
  value: string;
  label: string;
  icon?: string | null;
  parentCategoryId?: string | null;
}

interface CategoryParams extends PaginationRequest {
  parentCategoryId?: string | null;
}

const fetchCategories = async (parentCategoryId: string | null) => {
  try {
    const params: CategoryParams = { page: 1, limit: 100 };
    if (parentCategoryId) {
      params.parentCategoryId = parentCategoryId;
    }

    const response = await categoryService.getAll(params);

    if (response.data) {
      return response.data.map((category) => ({
        value: category.id,
        label: category.name,
        icon: category.logo,
        parentCategoryId: category.parentCategoryId
      }));
    }
    return [];
  } catch (error) {
    showToast(parseApiError(error), 'error');
    // In case of an error, re-throw it so React Query can handle it
    throw error;
  }
};

export const useCbbCategory = (parentCategoryId: string | null) => {
  const queryResult = useQuery<CategoryOption[], Error>({
    queryKey: ['categories', parentCategoryId],
    queryFn: () => fetchCategories(parentCategoryId),
    staleTime: 1000 * 60 * 60, // 1 hour
    placeholderData: (previousData) => previousData,
  });

  return {
    categories: queryResult.data ?? [],
    loading: queryResult.isLoading,
  };
};
