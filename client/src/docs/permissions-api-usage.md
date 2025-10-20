# Quản Lý Quyền (Permission Management)

Tài liệu này mô tả cách triển khai và sử dụng các API quản lý quyền trong ứng dụng ShopSifu.

## Mô Hình Dữ Liệu

### Permission Object

```typescript
interface Permission {
  id: number;
  name: string;        // Tên quyền
  description: string; // Mô tả quyền
  module: string;      // Module/phần của ứng dụng
  path: string;        // API path
  method: string;      // HTTP method (GET, POST, PUT, DELETE, etc.)
  createdById: string;
  updatedById: string;
  deletedById: string;
  deletedAt: string;
  createdAt: string;
  updatedAt: string;
}
```

## API Endpoints

### Lấy Danh Sách Quyền (Phân Trang)

```typescript
// Tham số
interface PaginationRequest {
  page: number;
  limit: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Gọi API
const response = await permissionService.getAll(paginationParams, abortSignal);
```

### Tạo Quyền Mới

```typescript
interface PerCreateRequest {
  name: string;
  module: string;
  path: string;
  method: string;
  description?: string;
}

// Gọi API
const response = await permissionService.create(permissionData, abortSignal);
```

### Cập Nhật Quyền

```typescript
interface PerUpdateRequest {
  name: string;
  module: string;
  path: string;
  method: string;
  description?: string;
}

// Gọi API
const response = await permissionService.update(permissionId, updateData, abortSignal);
```

### Xóa Quyền

```typescript
// Gọi API
const response = await permissionService.delete(permissionId, abortSignal);
```

## Hook Quản Lý Quyền

Chúng tôi đã tạo một custom hook `usePermissions` để quản lý trạng thái và tương tác với API:

```typescript
const {
  permissions,          // Danh sách quyền hiện tại
  loading,              // Trạng thái loading
  pagination,           // Thông tin phân trang
  handleSearch,         // Xử lý tìm kiếm
  handlePageChange,     // Xử lý chuyển trang
  handleLimitChange,    // Xử lý thay đổi số lượng item/trang
  isModalOpen,          // Trạng thái modal
  selectedPermission,   // Quyền được chọn để sửa
  handleCreate,         // Tạo quyền mới
  handleUpdate,         // Cập nhật quyền
  handleDelete,         // Xóa quyền
  handleOpenModal,      // Mở modal
  handleCloseModal,     // Đóng modal
} = usePermissions();
```

## Quản Lý Lỗi và Tối Ưu Hiệu Suất

1. **AbortSignal và Timeout**:
   - Tất cả các API calls đều sử dụng AbortSignal để có thể hủy khi cần
   - Có timeout 8 giây để tránh chờ đợi vô thời hạn

2. **Debounced Search**:
   - Tìm kiếm có debounce 500ms để giảm số lượng API calls

3. **Memoization**:
   - Tất cả các callback functions đều được memoized để tránh re-render không cần thiết

## Ví Dụ Sử Dụng

### Tạo Quyền Mới

```typescript
const handleCreatePermission = async (data) => {
  try {
    await handleCreate({
      name: data.name,
      module: data.module,
      path: data.path,
      method: data.method,
      description: data.description
    });
    showToast("Permission created successfully", "success");
  } catch (error) {
    showToast("Failed to create permission", "error");
  }
};
```

### Cập Nhật Quyền

```typescript
const handleUpdatePermission = async (id, data) => {
  try {
    await handleUpdate(id, {
      name: data.name,
      module: data.module,
      path: data.path,
      method: data.method,
      description: data.description
    });
    showToast("Permission updated successfully", "success");
  } catch (error) {
    showToast("Failed to update permission", "error");
  }
};
```

## Best Practices

1. **Luôn Xử Lý Lỗi**:
   - Bọc các API calls trong try/catch
   - Sử dụng AbortSignal để hủy các request không cần thiết

2. **Quản Lý Trạng Thái Tốt**:
   - Sử dụng memoized callbacks để tránh re-render không cần thiết
   - Dùng useServerDataTable cho logic phân trang và tìm kiếm

3. **UX**:
   - Hiển thị trạng thái loading khi đang gọi API
   - Hiển thị thông báo toast cho các tác vụ thành công/thất bại

## Các Vấn Đề Phổ Biến và Cách Xử Lý

1. **API Chậm**:
   - Đã triển khai timeout 8 giây
   - Sử dụng AbortController để hủy yêu cầu khi component unmount
   
2. **Cache và Tối Ưu**:
   - Có thể triển khai thêm cache cho các yêu cầu lặp lại
   - Xem xét sử dụng React Query hoặc SWR cho quản lý dữ liệu nâng cao

3. **Xử Lý Lỗi**:
   - Đã triển khai error handling cơ bản
   - Xem xét thêm retry logic cho các lỗi mạng tạm thời
