# Cải tiến DataTable với Server-side Pagination

## Các thay đổi đã thực hiện

### 1. Tối ưu hóa useServerDataTable hook

- **Giải quyết vòng lặp vô hạn**: Sử dụng `useRef` để lưu trữ các hàm callback ổn định, không thay đổi mỗi khi render
- **Tối ưu hóa request**: Thêm AbortController để hủy request cũ khi request mới được tạo
- **Tối ưu re-render**: Loại bỏ các hàm callback khỏi dependency array của useEffect

### 2. Tăng cường service API

- Cập nhật API service để hỗ trợ AbortSignal cho phép hủy request
- Định dạng hóa response để đảm bảo tương thích với hook

### 3. Sử dụng memoization trong usePermissions

- Các hàm callback được memoized với `useCallback` để tránh tạo mới mỗi lần render
- Loại bỏ các dependencies không cần thiết

## Hướng dẫn sử dụng

### 1. Khai báo các hàm xử lý dữ liệu

```typescript
// Tạo các callbacks memoized để tránh tạo lại mỗi lần render
const getResponseData = useCallback((response: any) => {
  return response.data || [];
}, []);

const getResponseMetadata = useCallback((response: any) => {
  return response.metadata;
}, []);

const mapResponseToData = useCallback((item: ApiItemType): UiItemType => ({
  id: item.id,
  // ... map các trường khác
}), []);
```

### 2. Sử dụng hook useServerDataTable

```typescript
const {
  data: items,
  loading,
  pagination,
  handlePageChange,
  handleLimitChange,
  handleSearch,
  handleSortChange,
} = useServerDataTable<ApiItemType, UiItemType>({
  fetchData: yourService.getAll,
  getResponseData,
  getResponseMetadata,
  mapResponseToData,
  initialSort: { sortBy: "id", sortOrder: "asc" },
  defaultLimit: 10,
});
```

### 3. Cập nhật dữ liệu sau CRUD

```typescript
const handleCreate = async (data) => {
  try {
    await yourService.create(data);
    // Re-fetch data bằng cách kích hoạt thay đổi sort
    handleSortChange(pagination.sortBy || "id", (pagination.sortOrder as "asc" | "desc") || "asc");
  } catch (error) {
    // Xử lý lỗi
  }
};
```

## Cách hoạt động

1. **Khởi tạo**:
   - Hook khởi tạo state và useRef để theo dõi request hiện tại
   - Các hàm callback được lưu trữ ổn định trong useRef

2. **Fetching Data**:
   - Khi dependency thay đổi (page, limit, search, sort), useEffect chạy
   - Request cũ bị hủy thông qua AbortController
   - Request mới được tạo và lưu vào activeRequestRef
   - Dữ liệu được trích xuất và mapped thông qua các hàm callback

3. **Tránh Race Condition**:
   - Kiểm tra signal.aborted trước khi xử lý response
   - Chỉ cập nhật state nếu request hiện tại là request mới nhất
   - Cleanup function hủy request khi component unmount hoặc dependency thay đổi

## Xử lý vấn đề NextJS stack frames

Khi API load lâu, NextJS original stackframes chạy liên tục là do:

1. **React Strict Mode**: NextJS mặc định chạy useEffect hai lần trong development
2. **Waterfall requests**: Các stack frames là yêu cầu tài nguyên từ NextJS
3. **Server Components & Suspense**: NextJS tải lại các Server Components

### Giải pháp:

1. **AbortController**: Đã triển khai để hủy request cũ, tránh race condition
2. **Giảm re-render**: Sử dụng memoization để tránh tạo lại các hàm
3. **Tối ưu dependency array**: Chỉ re-fetch khi thực sự cần thiết

## Các Best practices

1. Luôn memoize các hàm xử lý dữ liệu để tránh re-render không cần thiết
2. Sử dụng AbortController để tránh race condition
3. Kiểm tra response trước khi cập nhật state
4. Sử dụng cleanup function trong useEffect
