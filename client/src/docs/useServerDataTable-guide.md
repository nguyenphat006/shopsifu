# Hướng dẫn sử dụng useServerDataTable Hook

## Giới thiệu

Hook `useServerDataTable` là một giải pháp hoàn chỉnh để xử lý các bảng dữ liệu với phân trang phía server, tìm kiếm và sắp xếp. Hook này được thiết kế để làm việc với API cung cấp dữ liệu theo trang và metadata phân trang.

## Cấu trúc dữ liệu API yêu cầu

API phải trả về dữ liệu trong định dạng sau:

```typescript
{
  data: T[],       // Mảng các đối tượng dữ liệu
  metadata: {      // Thông tin metadata phân trang
    totalItems: number,
    page: number,
    limit: number,
    totalPages: number,
    hasNext: boolean,
    hasPrevious: boolean,
    search?: string,
    sortBy?: string,
    sortOrder?: string
  }
}
```

## Triển khai

### 1. Tạo API Adapter

Nếu API của bạn không trả về dữ liệu đúng định dạng trên, sử dụng adapter để chuyển đổi:

```typescript
import { createDataTableAdapter } from '@/utils/api-adapters';
import { yourService } from '@/services/yourService';

// Tạo adapter cho service của bạn
const adaptedFetchFunction = createDataTableAdapter(yourService.getAll);
```

### 2. Sử dụng hook trong component

```typescript
import { useServerDataTable } from '@/hooks/useServerDataTable';

function useYourEntityHook() {
  const {
    data,
    loading,
    pagination,
    handlePageChange,
    handleLimitChange,
    handleSearch,
    handleSortChange,
  } = useServerDataTable({
    fetchData: adaptedFetchFunction, // Hàm fetch dữ liệu (đã qua adapter)
    mapResponseToData: (item) => ({  // Hàm chuyển đổi dữ liệu (tùy chọn)
      // Chuyển đổi từ item gốc sang định dạng hiển thị
      id: item.id,
      name: item.name,
      // ... các trường khác
    }),
    initialSort: { sortBy: 'id', sortOrder: 'asc' }, // Sắp xếp mặc định
    defaultLimit: 10, // Số item mỗi trang mặc định
  });

  // Các hàm xử lý nghiệp vụ khác như tạo, cập nhật, xóa
  
  return {
    data,
    loading,
    pagination,
    handlePageChange,
    handleLimitChange,
    handleSearch,
    // Các hàm xử lý khác
  };
}
```

### 3. Sử dụng trong React Component

```tsx
function YourEntityTable() {
  const {
    data,
    loading,
    pagination,
    handlePageChange,
    handleLimitChange,
    handleSearch
  } = useYourEntityHook();
  
  const table = useDataTable({
    data,
    columns: yourColumns
  });
  
  return (
    <div>
      <SearchInput
        value={pagination?.search || ""}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Search..."
      />
      
      <DataTable
        table={table}
        columns={yourColumns}
        loading={loading}
        pagination={{
          metadata: pagination,
          onPageChange: handlePageChange,
          onLimitChange: handleLimitChange,
        }}
      />
    </div>
  );
}
```

## Các tính năng

1. **Phân trang phía server**: Quản lý trạng thái trang và dữ liệu trên server.
2. **Debounced Search**: Tìm kiếm với debounce để tránh quá nhiều request.
3. **Sắp xếp**: Hỗ trợ sắp xếp theo nhiều trường khác nhau.
4. **Xử lý lỗi**: Tích hợp với hệ thống hiển thị thông báo lỗi.
5. **Chuyển đổi dữ liệu**: Có thể chuyển đổi dữ liệu từ API sang định dạng hiển thị thông qua mapResponseToData.

## Các vấn đề thường gặp

1. **API không trả về đúng định dạng**: Sử dụng adapter `createDataTableAdapter` để chuyển đổi.

2. **Dữ liệu không cập nhật sau khi thêm/xóa/sửa**: Gọi hàm `handleSortChange` với giá trị hiện tại để buộc refresh dữ liệu.

3. **Không hiển thị thông tin phân trang đúng**: Đảm bảo API trả về đầy đủ các trường metadata cần thiết.

## Lưu ý triển khai

- Luôn kiểm tra cấu trúc dữ liệu trả về từ API bằng console.log trước khi triển khai.
- Sử dụng TypeScript để đảm bảo tính nhất quán của dữ liệu.
- Bọc các lệnh gọi API trong try-catch để xử lý lỗi.
- Sử dụng API adapters khi cần để duy trì tính linh hoạt khi API thay đổi.
