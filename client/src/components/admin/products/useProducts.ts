import { vi } from 'date-fns/locale';
import { useState, useCallback, useEffect, useRef } from 'react';
import { productsService } from '@/services/productsService';
import { useServerDataTable } from '@/hooks/useServerDataTable';
import { Product, ProductCreateRequest, ProductUpdateRequest } from '@/types/products.interface';
import { PaginationMetadata } from '@/types/base.interface';
import { showToast } from '@/components/ui/toastify';
import { parseApiError } from '@/utils/error';
import { useUserData } from '@/hooks/useGetData-UserLogin'

interface PopulatedProduct extends Omit<Product, 'brandId' | 'categories'> {
  brand: { id: number; name: string };
  categories: { id: number; name: string }[];
}

export type ProductColumn = {
  id: string;
  name: string;
  image: string;
  price: number;
  virtualPrice: number;
  status: 'active' | 'inactive';
  category: string;
  brand: string;
  createdAt: string;
  updatedAt: string;
  original: PopulatedProduct;
};

export function useProducts() {
  const user = useUserData();
  const [upsertOpen, setUpsertOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [productToEdit, setProductToEdit] = useState<ProductColumn | null>(null);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<ProductColumn | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  
  // State for price filtering
  const [priceFilter, setPriceFilter] = useState<{minPrice: number | null, maxPrice: number | null}>({
    minPrice: null,
    maxPrice: null
  });
  
  // State for category filtering (single selection)
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  
  // State for search query
  const [searchQuery, setSearchQuery] = useState<string>('');
  const searchQueryRef = useRef<string>(searchQuery);
  
  // Create refs to track the current filter values
  const priceFilterRef = useRef<{minPrice: number | null, maxPrice: number | null}>(priceFilter);
  const categoryFilterRef = useRef<string | null>(categoryFilter);
  
  // Load saved filter values from sessionStorage on initial mount
  useEffect(() => {
    // Load price filter
    const savedPriceFilter = sessionStorage.getItem('productPriceFilter');
    if (savedPriceFilter) {
      try {
        const parsedFilter = JSON.parse(savedPriceFilter);
        setPriceFilter(parsedFilter);
        priceFilterRef.current = parsedFilter;
        console.log('Restored price filter from session storage:', parsedFilter);
      } catch (error) {
        console.error('Error parsing saved price filter:', error);
        // If there's an error, remove the invalid data
        sessionStorage.removeItem('productPriceFilter');
      }
    }

    // Load category filter (single ID)
    const savedCategoryFilter = sessionStorage.getItem('productCategoryFilter');
    if (savedCategoryFilter) {
      try {
        const parsedCategoryId = JSON.parse(savedCategoryFilter);
        setCategoryFilter(parsedCategoryId);
        categoryFilterRef.current = parsedCategoryId;
        console.log('Restored category filter from session storage:', parsedCategoryId);
      } catch (error) {
        console.error('Error parsing saved category filter:', error);
        sessionStorage.removeItem('productCategoryFilter');
      }
    }
    
    // Load search query
    const savedSearchQuery = sessionStorage.getItem('productSearchQuery');
    if (savedSearchQuery) {
      try {
        const parsedSearchQuery = JSON.parse(savedSearchQuery);
        setSearchQuery(parsedSearchQuery);
        searchQueryRef.current = parsedSearchQuery;
        console.log('Restored search query from session storage:', parsedSearchQuery);
      } catch (error) {
        console.error('Error parsing saved search query:', error);
        sessionStorage.removeItem('productSearchQuery');
      }
    }
  }, []);
  
  // Update the refs whenever state changes
  useEffect(() => {
    priceFilterRef.current = priceFilter;
    console.log('Price filter state updated:', priceFilter);
  }, [priceFilter]);

  useEffect(() => {
    categoryFilterRef.current = categoryFilter;
    console.log('Category filter state updated:', categoryFilter);
  }, [categoryFilter]);
  
  useEffect(() => {
    searchQueryRef.current = searchQuery;
    console.log('Search query state updated:', searchQuery);
  }, [searchQuery]);

  const getResponseData = useCallback((response: any) => response.data || [], []);

  const getResponseMetadata = useCallback((response: any): PaginationMetadata => {
    const metadata = response.metadata || {};
    return {
      totalItems: metadata.totalItems || 0,
      page: metadata.page || 1,
      totalPages: metadata.totalPages || 1,
      limit: metadata.limit || 10,
      hasNext: metadata.hasNext || false,
      hasPrevious: metadata.hasPrev || false,
    };
  }, []);

  const mapResponseToData = useCallback((product: PopulatedProduct): ProductColumn => ({
    id: product.id,
    name: product.name,
    image: product.images?.[0] || '',
    price: product.basePrice,
    virtualPrice: product.virtualPrice,
    status: product.publishedAt ? 'active' : 'inactive',
    category: product.categories?.[0]?.name || 'N/A',
    brand: product.brand?.name || 'N/A',
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    original: product,
  }), []);

  // Custom fetchData function to include filter parameters (price, category, search, etc.)
  const fetchDataWithFilters = useCallback((params: any, signal?: AbortSignal) => {
    // Create a new params object to avoid mutation issues
    const enhancedParams = { ...params };
    
    // Use the refs to get the current filter values to avoid closure issues
    const currentPriceFilter = priceFilterRef.current;
    const currentCategoryFilter = categoryFilterRef.current;
    const currentSearchQuery = searchQueryRef.current;
    
    // Add price filter parameters if they exist
    if (currentPriceFilter.minPrice !== null) {
      enhancedParams.minPrice = currentPriceFilter.minPrice;
    }
    if (currentPriceFilter.maxPrice !== null) {
      enhancedParams.maxPrice = currentPriceFilter.maxPrice;
    }
    
    // Add category filter parameter if it exists (single value)
    if (currentCategoryFilter !== null) {
      enhancedParams.categories = currentCategoryFilter;
    }
    
    // Add search query parameter if it exists
    if (currentSearchQuery && currentSearchQuery.trim() !== '') {
      enhancedParams.name = currentSearchQuery.trim();
    }
    
    console.log('Fetching with params:', enhancedParams);
    
    // Now the productsService.getAll accepts a signal parameter
    return productsService.getAll(enhancedParams, signal);
  }, [/* No dependencies on filter state values */]);

  const serverDataTable = useServerDataTable<PopulatedProduct, ProductColumn>({
    fetchData: fetchDataWithFilters,
    getResponseData,
    getResponseMetadata,
    mapResponseToData,
    initialSort: { sortBy: 'createdAt', sortOrder: 'desc', createdById: user?.id },
    defaultLimit: 10,
  });

  const handleOpenUpsertModal = (mode: 'add' | 'edit', product: ProductColumn | null = null) => {
    setModalMode(mode);
    setProductToEdit(product);
    setUpsertOpen(true);
  };

  const handleCloseUpsertModal = () => {
    setUpsertOpen(false);
    setProductToEdit(null);
  };

  const handleOpenDelete = (product: ProductColumn) => {
    setProductToDelete(product);
    setDeleteOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteOpen(false);
    setProductToDelete(null);
  };
  
  // Handler for price filter changes
  const handlePriceFilterChange = useCallback((minPrice: number | null, maxPrice: number | null) => {
    console.log(`Price filter changed: min=${minPrice}, max=${maxPrice}`);
    
    // Update both the state and ref simultaneously
    const newPriceFilter = { minPrice, maxPrice };
    setPriceFilter(newPriceFilter);
    priceFilterRef.current = newPriceFilter;
    
    // Reset pagination to first page when filter changes
    serverDataTable.handlePageChange(1);
    
    // No need for timeout now since we're using the ref
    console.log('Refreshing with price filter:', newPriceFilter);
    
    // Store filter values in sessionStorage to persist across page refreshes
    if (minPrice === null && maxPrice === null) {
      // Clear the filter from storage if reset
      sessionStorage.removeItem('productPriceFilter');
    } else {
      // Store filter in session storage
      sessionStorage.setItem('productPriceFilter', JSON.stringify(newPriceFilter));
    }
    
    // Refresh the data table
    serverDataTable.refreshData();
  }, [serverDataTable]);
  
  // Handler for category filter changes (single selection)
  const handleCategoryFilterChange = useCallback((categoryId: string | null) => {
    console.log(`Category filter changed: categoryId=${categoryId}`);
    
    // Update both the state and ref simultaneously
    setCategoryFilter(categoryId);
    categoryFilterRef.current = categoryId;
    
    // Reset pagination to first page when filter changes
    serverDataTable.handlePageChange(1);
    
    console.log('Refreshing with category filter:', categoryId);
    
    // Store filter value in sessionStorage to persist across page refreshes
    if (categoryId === null) {
      // Clear the filter from storage if reset
      sessionStorage.removeItem('productCategoryFilter');
    } else {
      // Store filter in session storage
      sessionStorage.setItem('productCategoryFilter', JSON.stringify(categoryId));
    }
    
    // Refresh the data table
    serverDataTable.refreshData();
  }, [serverDataTable]);
  
  // Create debounce function for search - tối ưu hơn
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Optimized debounced search handler
  const debouncedSearch = useCallback((query: string) => {
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    
    // Set timer để delay API call
    debounceTimerRef.current = setTimeout(() => {
      // Update search state
      setSearchQuery(query);
      searchQueryRef.current = query;
      
      // Reset pagination to first page
      serverDataTable.handlePageChange(1);
      
      // Store in session storage
      if (!query || query.trim() === '') {
        sessionStorage.removeItem('productSearchQuery');
      } else {
        sessionStorage.setItem('productSearchQuery', JSON.stringify(query));
      }
      
      // Refresh data
      serverDataTable.refreshData();
    }, 300); // Giảm delay xuống 300ms cho responsive hơn
  }, [serverDataTable]);
  
  // Handle search input changes - tách riêng visual update và API call
  const handleSearch = useCallback((query: string) => {
    console.log(`Search query changed: ${query}`);
    
    // Update visual state ngay lập tức để typing mượt
    setSearchQuery(query); 
    
    // Debounce API call
    debouncedSearch(query);
  }, [debouncedSearch]);

  const addProduct = async (data: ProductCreateRequest) => {
    try {
      const response = await productsService.create(data);
      showToast(response.message, 'success');
      serverDataTable.refreshData();
      handleCloseUpsertModal();
      return response;
    } catch (error) {
      showToast(parseApiError(error), 'error');
      return null;
    }
  };

  const editProduct = async (id: number, data: ProductUpdateRequest) => {
    try {
      const response = await productsService.update(String(id), data);
      showToast(response.message, 'success');
      serverDataTable.refreshData();
      handleCloseUpsertModal();
      return response;
    } catch (error) {
      showToast(parseApiError(error), 'error');
      return null;
    }
  };

  const handleConfirmDelete = async (): Promise<void> => {
    if (productToDelete) {
      setDeleteLoading(true);
      try {
        const response = await productsService.delete(String(productToDelete.id));
        showToast(response.message, 'success');
        serverDataTable.refreshData();
        handleCloseDeleteModal();
      } catch (error) {
        showToast(parseApiError(error), 'error');
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  return {
    ...serverDataTable,
    upsertOpen,
    modalMode,
    productToEdit,
    handleOpenUpsertModal,
    handleCloseUpsertModal,
    deleteOpen,
    productToDelete,
    deleteLoading,
    handleOpenDelete,
    handleConfirmDelete,
    handleCloseDeleteModal,
    addProduct,
    editProduct,
    handlePriceFilterChange,
    priceFilter,
    handleCategoryFilterChange,
    categoryFilter,
    handleSearch, // Add the new debounced search handler
    searchQuery,
  };
}