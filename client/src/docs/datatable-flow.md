# Luồng hoạt động của DataTable với Server-Side Pagination

## Tổng quan

Hệ thống DataTable với server-side pagination bao gồm các thành phần chính:
1. **useServerDataTable Hook**: Hook tổng quát quản lý tương tác với API để lấy dữ liệu và phân trang
2. **API Adapter (tùy chọn)**: Bộ chuyển đổi giữa API và hook
3. **Module Hook (usePermissions)**: Hook cụ thể cho từng module (Permissions, Users, Roles...)
4. **DataTable Component**: Component hiển thị dữ liệu và phân trang

## Luồng hoạt động

### 1. Khởi tạo

Khi một component sử dụng hook `usePermissions`:

```tsx
const { permissions, loading, pagination, ... } = usePermissions();
```

Hook `usePermissions` sẽ:
- Khởi tạo `useServerDataTable` với các tham số cần thiết
- Cung cấp hàm `fetchData`, `getResponseData`, và `getResponseMetadata`
- Thêm các hàm xử lý nghiệp vụ (create, update, delete...)

### 2. Fetching Data

- Khi component được render lần đầu, `useServerDataTable` sẽ gọi API thông qua `fetchData`
- Nó sẽ gửi các tham số phân trang (page, limit, search, sort...)
- Sau khi nhận response, nó sẽ:
  - Sử dụng `getResponseData` để trích xuất mảng dữ liệu
  - Sử dụng `getResponseMetadata` để trích xuất thông tin phân trang
  - Cập nhật state (`data`, `pagination`)

### 3. Tương tác người dùng

Khi người dùng tương tác với UI:
- **Chuyển trang**: `handlePageChange` được gọi → cập nhật `pagination.page` → trigger fetch data mới
- **Thay đổi số items/trang**: `handleLimitChange` được gọi → cập nhật `pagination.limit` → trigger fetch data mới
- **Tìm kiếm**: `handleSearch` được gọi → cập nhật `pagination.search` → debounce → trigger fetch data mới
- **Sắp xếp**: `handleSortChange` được gọi → cập nhật `pagination.sortBy` và `sortOrder` → trigger fetch data mới

### 4. CRUD Operations

Khi người dùng tạo/sửa/xóa:
- Gọi API tương ứng (`permissionService.create/update/delete`)
- Hiển thị thông báo thành công/thất bại
- Gọi `handleSortChange` để refresh dữ liệu mà không thay đổi UI

## Chi tiết các file

### 1. useServerDataTable.ts

Hook tổng quát cho phân trang server-side:

```typescript
const {
  data,
  loading,
  pagination,
  handlePageChange,
  handleLimitChange,
  handleSearch,
  handleSortChange
} = useServerDataTable({
  fetchData: yourApiFunction,
  getResponseData: (response) => response.data,
  getResponseMetadata: (response) => response.metadata,
  mapResponseToData: (item) => transformItem(item),
  initialSort: { sortBy: 'id', sortOrder: 'asc' },
  defaultLimit: 10
});
```

- **fetchData**: Hàm gọi API
- **getResponseData**: Hàm trích xuất dữ liệu từ response
- **getResponseMetadata**: Hàm trích xuất metadata từ response
- **mapResponseToData**: Hàm biến đổi từng item dữ liệu (tùy chọn)
- **initialSort**: Cấu hình sắp xếp ban đầu
- **defaultLimit**: Số items mặc định mỗi trang

### 2. api-adapters.ts (Không bắt buộc)

Bộ chuyển đổi giữa API và hook:

```typescript
export function createDataTableAdapter<T>(apiFunction) {
  return async (params) => {
    const response = await apiFunction(params);
    return {
      data: response.data || [],
      metadata: response.metadata || defaultMetadata
    };
  };
}
```

Adapter này đã không còn cần thiết vì bây giờ `useServerDataTable` sử dụng các hàm trích xuất `getResponseData` và `getResponseMetadata`.

### 3. usePermissions.ts

Hook cụ thể cho module Permissions:

```typescript
export function usePermissions() {
  const {
    data: permissions,
    loading,
    pagination,
    // ... các thuộc tính khác
  } = useServerDataTable<PermissionDetail, Permission>({
    fetchData: permissionService.getAll,
    getResponseData: (response) => response.data || [],
    getResponseMetadata: (response) => response.metadata,
    mapResponseToData: (item) => ({
      id: item.id,
      // ... chuyển đổi dữ liệu
    }),
    // ... các cấu hình khác
  });

  // Thêm các hàm CRUD
  const handleCreate = async (data) => { /* ... */ };
  const handleUpdate = async (id, data) => { /* ... */ };
  const handleDelete = async (id) => { /* ... */ };

  // ... các hàm khác

  return {
    permissions,
    loading,
    pagination,
    // ... trả về các thuộc tính và hàm
  };
}
```

## Lợi ích của cách tiếp cận này

1. **Tách biệt mối quan tâm**:
   - `useServerDataTable` chỉ lo về logic phân trang và fetch data
   - `usePermissions` lo về nghiệp vụ cụ thể của module

2. **Tái sử dụng code**:
   - Áp dụng logic phân trang giống nhau cho các module khác nhau
   - Dễ dàng thêm module mới chỉ với vài dòng code

3. **Dễ bảo trì**:
   - Thay đổi logic phân trang chỉ cần sửa ở một nơi
   - Mỗi module có thể tùy chỉnh cách xử lý dữ liệu riêng

4. **Linh hoạt**:
   - Hỗ trợ nhiều cấu trúc API response khác nhau
   - Có thể xử lý các trường hợp đặc biệt trong mỗi module
