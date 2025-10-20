# Hướng dẫn triển khai useServerDataTable cho module Permissions

## Tổng quan các bước chính

1. Tạo adapter cho service API
2. Cập nhật hook quản lý dữ liệu (usePermissions)
3. Cập nhật component hiển thị (PermissionsTable)

## Triển khai chi tiết

### 1. Tạo adapter cho service API

Adapter chuyển đổi cấu trúc dữ liệu API thành định dạng mà hook `useServerDataTable` có thể hiểu được.

```typescript
// src/utils/api-adapters.ts
import { BaseResponse, PaginationMetadata } from "@/types/base.interface";

export function createDataTableAdapter<T, P = any>(
  fetchFunction: (params?: P) => Promise<BaseResponse<T[]>>
) {
  return async (params?: P) => {
    const response = await fetchFunction(params);
    
    return {
      data: response.data || [],
      metadata: response.metadata || {
        page: 1,
        limit: 10,
        totalPages: 1,
        totalItems: 0,
        hasNext: false,
        hasPrevious: false
      } as PaginationMetadata
    };
  };
}
```

### 2. Cập nhật hook quản lý dữ liệu (usePermissions)

Hook quản lý nghiệp vụ, sử dụng `useServerDataTable` để xử lý dữ liệu và phân trang.

```typescript
// src/components/admin/permissions/usePermissions-with-hook.ts
import { useState, useCallback } from "react";
import { Permission } from "./permissions-Columns";
import { permissionService } from "@/services/permissionService";
import { showToast } from "@/components/ui/toastify";
import { parseApiError } from "@/utils/error";
import {
  PerCreateRequest,
  PerUpdateRequest,
  PermissionDetail,
} from "@/types/auth/permission.interface";
import { useServerDataTable } from "@/hooks/useServerDataTable";
import { createDataTableAdapter } from "@/utils/api-adapters";

export function usePermissions() {
  // Tạo adapter cho service
  const permissionAdapter = createDataTableAdapter<PermissionDetail>(permissionService.getAll);

  // Sử dụng hook useServerDataTable
  const {
    data: permissions,
    loading,
    pagination,
    handlePageChange,
    handleLimitChange,
    handleSearch,
    handleSortChange,
  } = useServerDataTable<PermissionDetail, Permission>({
    fetchData: permissionAdapter,
    mapResponseToData: (item) => ({
      id: item.id,
      code: String(item.id),
      name: item.name,
      description: item.description,
      path: item.path,
      method: item.method,
      module: item.module,
      createdById: item.createdById,
      updatedById: item.updatedById,
      deletedById: item.deletedById,
      deletedAt: item.deletedAt,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }),
    initialSort: { sortBy: "id", sortOrder: "asc" },
    defaultLimit: 10,
  });

  // Logic xử lý các thao tác CRUD
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null);

  // Xử lý thêm mới
  const handleCreate = async (data: PerCreateRequest) => {
    try {
      await permissionService.create(data);
      showToast("Permission created successfully", "success");
      // Refresh dữ liệu bằng cách thay đổi sort
      handleSortChange(pagination.sortBy || "id", (pagination.sortOrder as "asc" | "desc") || "asc");
      handleCloseModal();
    } catch (error) {
      showToast(parseApiError(error), "error");
    }
  };

  // Xử lý cập nhật
  const handleUpdate = async (id: number, data: PerUpdateRequest) => {
    try {
      await permissionService.update(String(id), data);
      showToast("Permission updated successfully", "success");
      // Refresh dữ liệu
      handleSortChange(pagination.sortBy || "id", (pagination.sortOrder as "asc" | "desc") || "asc");
      handleCloseModal();
    } catch (error) {
      showToast(parseApiError(error), "error");
    }
  };

  // Xử lý xóa
  const handleDelete = async (id: number) => {
    try {
      await permissionService.delete(String(id));
      showToast("Permission deleted successfully", "success");
      // Refresh dữ liệu
      handleSortChange(pagination.sortBy || "id", (pagination.sortOrder as "asc" | "desc") || "asc");
    } catch (error) {
      showToast(parseApiError(error), "error");
    }
  };

  // Xử lý mở modal
  const handleOpenModal = (permission: Permission | null = null) => {
    setSelectedPermission(permission);
    setIsModalOpen(true);
  };

  // Xử lý đóng modal
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedPermission(null);
  }, []);

  return {
    permissions,
    loading,
    pagination,
    isModalOpen,
    selectedPermission,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleOpenModal,
    handleCloseModal,
    handlePageChange,
    handleLimitChange,
    handleSearch,
  };
}
```

### 3. Cập nhật component hiển thị (PermissionsTable)

Component hiển thị giao diện người dùng, sử dụng hook quản lý dữ liệu đã được cập nhật.

```tsx
// src/components/admin/permissions/permissions-Table-with-hook.tsx
'use client'

import { useState } from "react"
import { PermissionsColumns, Permission } from "./permissions-Columns"
import SearchInput from "@/components/ui/data-table-component/search-input"
import PermissionsModalUpsert from "./permissions-ModalUpsert-new"
import { ConfirmDeleteModal } from "@/components/ui/confirm-delete-modal"
import { DataTable } from "@/components/ui/data-table-component/data-table"
import { usePermissions } from "./usePermissions-with-hook"
import { useTranslations } from "next-intl"
import DataTableViewOption from "@/components/ui/data-table-component/data-table-view-option"
import { useDataTable } from "@/hooks/useDataTable"

export function PermissionsTable() {
  const t = useTranslations()
  const {
    permissions,
    loading,
    pagination,
    handleSearch,
    handlePageChange,
    handleLimitChange,
    isModalOpen,
    selectedPermission,
    handleDelete,
    handleCreate,
    handleUpdate,
    handleOpenModal,
    handleCloseModal,
  } = usePermissions();

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [permissionToDelete, setPermissionToDelete] = useState<Permission | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleOpenDelete = (permission: Permission) => {
    setPermissionToDelete(permission);
    setDeleteOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteOpen(false);
    setPermissionToDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!permissionToDelete) return;
    setDeleteLoading(true);
    try {
      await handleDelete(permissionToDelete.id);
      handleCloseDeleteModal();
    } catch (error) {
      console.error("Lỗi khi xóa quyền:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleSubmit = async (formData: any) => {
    try {
      if (selectedPermission) {
        await handleUpdate(selectedPermission.id, formData);
      } else {
        await handleCreate(formData);
      }
    } catch (error) {
      console.error("Lỗi khi xử lý quyền:", error);
    }
  };

  // Tạo bảng với dữ liệu hiện tại
  const table = useDataTable({
    data: permissions,
    columns: PermissionsColumns({ onDelete: handleOpenDelete, onEdit: handleOpenModal }),
  });

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-end gap-2">
        <SearchInput
          value={pagination?.search || ""}
          onChange={(e) => handleSearch(e.target.value)}
          placeholder={t("admin.permissions.searchPlaceholder")}
          className="w-full md:max-w-sm"
        />
        <DataTableViewOption table={table} />
      </div>

      <DataTable
        table={table}
        columns={PermissionsColumns({ onDelete: handleOpenDelete, onEdit: handleOpenModal })}
        loading={loading}
        notFoundMessage={t("admin.permissions.notFound")}
        pagination={{
          metadata: pagination || {
            page: 1,
            limit: 10,
            totalPages: 1,
            totalItems: 0,
            hasNext: false,
            hasPrevious: false
          },
          onPageChange: handlePageChange,
          onLimitChange: handleLimitChange,
        }}
      />

      <PermissionsModalUpsert
        open={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        permission={selectedPermission}
      />

      <ConfirmDeleteModal
        open={deleteOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        loading={deleteLoading}
        title={t("admin.permissions.deleteTitle")}
        description={t("admin.permissions.deleteDescription")}
      />
    </div>
  )
}
```

## Triển khai cho modules khác

Để áp dụng cho các modules khác (Users, Roles, Products, v.v.), bạn cần:

1. **Tạo adapter** cho service API tương ứng
2. **Tạo hook quản lý dữ liệu** theo mẫu `usePermissions`
3. **Cập nhật component hiển thị** sử dụng hook mới

Ví dụ cho module Users:

```typescript
// useUsers.ts
import { userService } from '@/services/userService';
import { createDataTableAdapter } from '@/utils/api-adapters';
import { useServerDataTable } from '@/hooks/useServerDataTable';
// ...

export function useUsers() {
  const userAdapter = createDataTableAdapter(userService.getAll);
  
  const {
    data: users,
    loading,
    pagination,
    // ...
  } = useServerDataTable({
    fetchData: userAdapter,
    mapResponseToData: (item) => ({
      // Map user data
    })
  });
  
  // Thêm các hàm xử lý CRUD
  
  return {
    users,
    loading,
    pagination,
    // ...
  };
}
```

## Lưu ý

- Kiểm tra cấu trúc dữ liệu API trả về trước khi triển khai
- Đảm bảo API hỗ trợ phân trang với các tham số `page`, `limit`, `search`, `sortBy`, `sortOrder`
- Xử lý đúng các lỗi từ API để tăng trải nghiệm người dùng
