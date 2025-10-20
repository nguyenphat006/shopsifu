// hooks/useServerDataTable.ts
import { useState, useEffect, useRef } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { PaginationMetadata, PaginationRequest } from '@/types/base.interface';
import { showToast } from '@/components/ui/toastify';
import { parseApiError } from '@/utils/error';
/**
 * Cấu hình cho hook useServerDataTable
 * @template T Type của dữ liệu thô từ API
 * @template U Type của dữ liệu sau khi map (mặc định là T)
 */
interface UseServerDataTableProps<T, U> {
  /** Hàm gọi API để lấy dữ liệu */
  fetchData: (params: PaginationRequest, signal?: AbortSignal) => Promise<any>;
  /** Hàm để trích xuất data từ response */
  getResponseData: (response: any) => T[]; 
  /** Hàm để trích xuất metadata từ response */
  getResponseMetadata?: (response: any) => PaginationMetadata | undefined;
  /** Hàm để map dữ liệu thô sang dữ liệu cuối cùng */
  mapResponseToData?: (item: any) => U;
  /** Cấu hình sắp xếp ban đầu */
  initialSort?: {
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    createdById?: string;
  };
  /** Giới hạn mặc định số lượng items mỗi trang */
  defaultLimit?: number;
  /** 
   * Cấu hình để chỉ định tham số nào sẽ được gửi trong request API
   * Sử dụng khi API không hỗ trợ một số tham số
   */
  requestConfig?: {
    /** Tự động fetch dữ liệu khi có thay đổi search */
    autoFetchSearch?: boolean;
    /** Có gửi tham số search trong request không */
    includeSearch?: boolean;
    /** Có gửi các tham số sắp xếp (sortBy, sortOrder) không */
    includeSort?: boolean;
    /** Có gửi tham số createdById không */
    includeCreatedById?: boolean;
  };
}

/**
 * Hook để quản lý bảng dữ liệu với phân trang từ server
 * @template T Type của dữ liệu thô từ API
 * @template U Type của dữ liệu sau khi map (mặc định là T)
 * @example
 * // Sử dụng với API không hỗ trợ tìm kiếm và sắp xếp
 * const { data, loading } = useServerDataTable({
 *   fetchData: myApiService.getAll,
 *   getResponseData: (res) => res.data,
 *   requestConfig: {
 *     includeSearch: false,
 *     includeSort: false
 *   }
 * });
 */
export function useServerDataTable<T, U = T>({
  fetchData,
  getResponseData,
  getResponseMetadata,
  mapResponseToData,
  initialSort = { },
  defaultLimit = 10,
  requestConfig = {
    autoFetchSearch: true,
    includeSearch: true,
    includeSort: true,
    includeCreatedById: true
  },
}: UseServerDataTableProps<T, U>) {
  // Khởi tạo metadata với đầy đủ thông tin
  const [pagination, setPagination] = useState<PaginationMetadata>({
    page: 1,
    limit: defaultLimit,
    search: '',
    sortBy: initialSort.sortBy,
    sortOrder: initialSort.sortOrder,
    createdById: initialSort.createdById,
    totalPages: 1,
    totalItems: 0,
    hasNext: false,
    hasPrevious: false,
  });

  // Thêm trigger để force refresh dữ liệu
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [data, setData] = useState<U[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedSearch = useDebounce(pagination.search, 500);

  // Sử dụng useRef để lưu trữ active request
  const activeRequestRef = useRef<AbortController | null>(null);
  
  // Lưu trữ các hàm callback để không tạo lại mỗi lần render
const fetchDataRef = useRef(fetchData);
const getResponseDataRef = useRef(getResponseData);
const getResponseMetadataRef = useRef(getResponseMetadata);
const mapResponseToDataRef = useRef(mapResponseToData);

useEffect(() => { fetchDataRef.current = fetchData; }, [fetchData]);
useEffect(() => { getResponseDataRef.current = getResponseData; }, [getResponseData]);
useEffect(() => { getResponseMetadataRef.current = getResponseMetadata; }, [getResponseMetadata]);
useEffect(() => { mapResponseToDataRef.current = mapResponseToData; }, [mapResponseToData]);


  // Effect để fetch data khi pagination thay đổi
  useEffect(() => {
    const loadData = async () => {
      // Hủy request trước đó nếu có
      if (activeRequestRef.current) {
        activeRequestRef.current.abort();
      }
      
      // Tạo controller mới cho request hiện tại
      const controller = new AbortController();
      activeRequestRef.current = controller;
      
      // Thiết lập timeout để tự động hủy request nếu quá lâu
      const timeoutId = setTimeout(() => {
        if (activeRequestRef.current === controller && !controller.signal.aborted) {
          controller.abort();
          console.warn('Request timed out after 8 seconds');
          setLoading(false);
        }
      }, 8000);
      
      try {
        setLoading(true);
        // Tạo object requestParams với các trường cần thiết
        const requestParams: PaginationRequest = {
          page: pagination.page,
          limit: pagination.limit,
        };
        
        // Chỉ thêm search nếu được cấu hình và có giá trị
        if (requestConfig.includeSearch && debouncedSearch) {
          requestParams.search = debouncedSearch;
        }
        
        // Chỉ thêm sortBy và sortOrder nếu được cấu hình
        if (requestConfig.includeSort) {
          requestParams.sortBy = pagination.sortBy;
          requestParams.sortOrder = pagination.sortOrder;
        }
        
        // Chỉ thêm createdById nếu được cấu hình và có giá trị
        if (requestConfig.includeCreatedById && pagination.createdById) {
          requestParams.createdById = pagination.createdById;
        }
        
        // Gọi API và lấy response với AbortSignal
       const response = await fetchDataRef.current(requestParams, controller.signal);

let responseData: T[] = [];
responseData = getResponseDataRef.current(response);

const mappedData: U[] = mapResponseToDataRef.current
  ? responseData.map(mapResponseToDataRef.current)
  : (responseData as unknown as U[]);

// Cập nhật data state với mapped data
setData(mappedData);

if (getResponseMetadataRef.current) {
  const metadata = getResponseMetadataRef.current(response);

try {
            if (metadata) {
              setPagination(prev => ({
                ...prev,
                totalItems: metadata.totalItems ?? prev.totalItems,
                page: metadata.page || prev.page,
                limit: metadata.limit || prev.limit,
                totalPages: metadata.totalPages || prev.totalPages,
                hasNext: metadata.hasNext ?? prev.hasNext,
                // Support both hasPrevious and hasPrev to ensure compatibility
                hasPrevious: (metadata.hasPrevious !== undefined ? metadata.hasPrevious : metadata.hasPrev) ?? prev.hasPrevious,
              }));
            }
          } catch (error) {
            console.error("Error extracting metadata from response:", error);
          }
        }
      } catch (error) {
        // Xóa timeout trong trường hợp lỗi
        clearTimeout(timeoutId);
        
        // Chỉ xử lý lỗi nếu không phải do abort request
        // if (!controller.signal.aborted) {
        //   console.error("Error fetching data:", error);
        //   showToast(parseApiError(error), 'error');
        // }
      } finally {
        // Chỉ reset loading nếu đây là request mới nhất
        if (activeRequestRef.current === controller) {
          setLoading(false);
          activeRequestRef.current = null;
        }
      }
    };

    loadData();
    
    // Cleanup function
    return () => {
      if (activeRequestRef.current) {
        activeRequestRef.current.abort();
      }
    };
  }, [
    pagination.page,
    pagination.limit,
    // Chỉ thêm debouncedSearch vào dependency khi includeSearch = true
    ...(requestConfig.includeSearch ? [debouncedSearch] : []),
    // Chỉ thêm sortBy và sortOrder vào dependency khi includeSort = true
    ...(requestConfig.includeSort ? [pagination.sortBy, pagination.sortOrder] : []),
    // Chỉ thêm createdById vào dependency khi includeCreatedById = true
    ...(requestConfig.includeCreatedById ? [pagination.createdById] : []),
    ...(requestConfig.includeSearch && (requestConfig.autoFetchSearch ?? true) ? [debouncedSearch] : []),
    refreshTrigger, // Thêm trigger vào dependency để force re-fetch
    // Loại bỏ các callback ra khỏi dependency array vì đã dùng useRef để ổn định chúng
  ]);

  // Handlers
  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };

  const handleLimitChange = (limit: number) => {
    setPagination(prev => ({ ...prev, limit, page: 1 }));
  };

const handleSearch = (search: string) => {
  setPagination(prev => ({ ...prev, search, page: 1 }));
  if (requestConfig.includeSearch && (requestConfig.autoFetchSearch === false)) {
    setRefreshTrigger(prev => prev + 1); // fetch ngay khi user bấm Search
  }
};


  const handleSortChange = (sortBy: string, sortOrder: 'asc' | 'desc') => {
    setPagination(prev => ({ ...prev, sortBy, sortOrder }));
  };
  
  // Hàm để refresh dữ liệu - thực sự bắt buộc fetch lại dữ liệu mới
  const refreshData = () => {
    // Tăng giá trị refreshTrigger để kích hoạt useEffect và force re-fetch
    setRefreshTrigger(prev => prev + 1);
    console.log("🔄 Refreshing data...");
  };

  return {
    data,
    loading,
    pagination,
    handlePageChange,
    handleLimitChange,
    handleSearch,
    handleSortChange,
    refreshData,
    // Expose setPagination for external control (e.g., infinite scroll)
    setPagination,
  };
}