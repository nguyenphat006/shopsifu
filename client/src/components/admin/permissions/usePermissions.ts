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

export function usePermissions() {
  // Tạo các callbacks memoized để tránh tạo lại mỗi lần render
  const getResponseData = useCallback((response: any) => {
    // Trích xuất mảng dữ liệu từ response
    return response.data || [];
  }, []);

  const getResponseMetadata = useCallback((response: any) => {
    // Trích xuất metadata từ response
    return response.metadata;
  }, []);

  const mapResponseToData = useCallback((item: PermissionDetail): Permission => ({
    id: item.id,
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
  }), []);

  // Setup our data table with direct API call và các hàm đã memoized
  const {
    data: permissions,
    loading,
    pagination,
    handlePageChange,
    handleLimitChange,
    handleSearch,
    handleSortChange,
    refreshData,
  } = useServerDataTable<PermissionDetail, Permission>({
    fetchData: permissionService.getAll,
    getResponseData,
    getResponseMetadata,
    mapResponseToData,
    initialSort: { sortBy: "createdAt", sortOrder: "asc" },
    defaultLimit: 10,
     requestConfig: {
      includeSearch: false, // Không gửi tham số search trong request API
      includeSort: false,   // Không gửi các tham số sắp xếp (sortBy, sortOrder)
      includeCreatedById: true // Vẫn gửi tham số createdById nếu có
    },
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(
    null
  );

  const handleCreate = async (data: PerCreateRequest) => {
    // Tạo controller mới để có thể hủy request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // Timeout 8 giây
    
    try {
      await permissionService.create(data, controller.signal);
      showToast("Permission created successfully", "success");
      
      // Hàm refreshData() sẽ kích hoạt useEffect trong hook để gọi lại API getAll
      // và cập nhật state với dữ liệu mới nhất
      refreshData();
      handleCloseModal();
    } catch (error) {
      if (!controller.signal.aborted) {
        showToast(parseApiError(error), "error");
      }
    } finally {
      clearTimeout(timeoutId);
    }
  };

  const handleUpdate = async (id: string, data: PerUpdateRequest) => {
    // Tạo controller mới để có thể hủy request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // Timeout 8 giây
    
    try {
      await permissionService.update(String(id), data, controller.signal);
      showToast("Permission updated successfully", "success");
      
      // Hàm refreshData() sẽ kích hoạt useEffect trong hook để gọi lại API getAll
      // và cập nhật state với dữ liệu mới nhất
      refreshData();
      handleCloseModal();
    } catch (error) {
      if (!controller.signal.aborted) {
        showToast(parseApiError(error), "error");
      }
    } finally {
      clearTimeout(timeoutId);
    }
  };

  const handleDelete = async (id: string) => {
    // Tạo controller mới để có thể hủy request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // Timeout 8 giây
    
    try {
      await permissionService.delete(String(id), controller.signal);
      showToast("Permission deleted successfully", "success");
      
      // Hàm refreshData() sẽ kích hoạt useEffect trong hook để gọi lại API getAll
      // và cập nhật state với dữ liệu mới nhất
      refreshData();
    } catch (error) {
      if (!controller.signal.aborted) {
        showToast(parseApiError(error), "error");
      }
    } finally {
      clearTimeout(timeoutId);
    }
  };

  const handleOpenModal = (permission: Permission | null = null) => {
    setSelectedPermission(permission);
    setIsModalOpen(true);
  };

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
    refreshData,
  };
}
