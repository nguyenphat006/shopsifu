import { useState, useCallback, useEffect } from 'react';
import { showToast } from '@/components/ui/toastify';
import { parseApiError } from '@/utils/error';
import { userService } from '@/services/admin/userService';
import { roleService } from '@/services/roleService'; 
import { User, UserCreateRequest, UserRole } from '@/types/admin/user.interface';
import { useServerDataTable } from '@/hooks/useServerDataTable';
import { useTranslations } from 'next-intl'

export const useUsers = () => {
  const t = useTranslations();
  // Modal states
  const [upsertOpen, setUpsertOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [userToEdit, setUserToEdit] = useState<User | null>(null);
  
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Roles state
  const [roles, setRoles] = useState<UserRole[]>([]);

  // Tạo các callbacks cho useServerDataTable
  const getResponseData = useCallback((response: any) => {
    return response.data || [];
  }, []);

  const getResponseMetadata = useCallback((response: any) => {
    const metadata = response.metadata || {};
    return {
      totalItems: metadata.totalItems || 0,
      page: metadata.page || 1,
      totalPages: metadata.totalPages || 1,
      limit: metadata.limit || 10,
      hasNext: metadata.hasNext || false,
      hasPrevious: metadata.hasPrev || false
    };
  }, []);

  const mapResponseToData = useCallback((user: any): User => {
    return user;
  }, []);

  // Sử dụng hook useServerDataTable để quản lý data và pagination
  const {
    data: users,
    loading,
    pagination,
    handlePageChange,
    handleLimitChange,
    handleSearch,
    handleSortChange,
    refreshData,
  } = useServerDataTable({
    fetchData: userService.getAll,
    getResponseData,
    getResponseMetadata,
    mapResponseToData,
    initialSort: { sortBy: "createdAt", sortOrder: "asc" },
    defaultLimit: 10,
    // Cấu hình để không gửi các tham số search và sort
    // Điều này giúp tránh lỗi khi API không hỗ trợ các tham số này
    requestConfig: {
      includeSearch: false, // Không gửi tham số search trong request API
      includeSort: false,   // Không gửi các tham số sắp xếp (sortBy, sortOrder)
      includeCreatedById: true // Vẫn gửi tham số createdById nếu có
    },
  });

  // Fetch roles data
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        // Truyền tham số thông qua options với tham số all-records
        const response = await roleService.getAll({ limit: 100, page: 1 } as any);
        // Map response data to UserRole structure
        const userRoles: UserRole[] = response.data.map((role: any) => ({
          id: role.id,
          name: role.name
        }));
        setRoles(userRoles);
      } catch (error) {
        showToast(parseApiError(error), 'error');
      }
    };

    fetchRoles();
  }, []);

  // CRUD operations
  const addUser = async (user: UserCreateRequest) => {
    try {
      await userService.create(user);
      showToast(t('system.toasts.createSuccess'), 'success');
      refreshData();
      handleCloseUpsertModal();
    } catch (error) {
      showToast(parseApiError(error), 'error');
      console.error(error);
    }
  };

  const editUser = async (user: User) => {
    try {
      // Extract id for URL parameter and prepare update data without backend-managed fields
      const { id, createdById, updatedById, deletedById, deletedAt, createdAt, updatedAt, role, ...updateData } = user;
      
      await userService.update(id, updateData);
      showToast(t('system.toasts.updateSuccess'), 'success');
      refreshData();
      handleCloseUpsertModal();
    } catch (error) {
      showToast(parseApiError(error), 'error');
      console.error(error);
    }
  };

  const handleConfirmDelete = async () => {
    if (userToDelete) {
      setDeleteLoading(true);
      try {
        await userService.delete(userToDelete.id);
        showToast(t('system.toasts.deleteSuccess'), 'success');
        refreshData();
        setDeleteOpen(false);
        setUserToDelete(null);
      } catch (error) {
        showToast(parseApiError(error), 'error');
      } finally {
        setDeleteLoading(false);
      }
    }
  };

  const handleOpenDelete = (user: User) => {
    setUserToDelete(user);
    setDeleteOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteOpen(false);
    setUserToDelete(null);
  };

  const handleOpenUpsertModal = (mode: 'add' | 'edit', user?: User) => {
    setModalMode(mode);
    setUserToEdit(user || null);
    setUpsertOpen(true);
  };

  const handleCloseUpsertModal = () => {
    setUpsertOpen(false);
    setUserToEdit(null);
  };

  return {
    data: users,
    loading,
    pagination,
    
    // Server-side pagination handlers
    handlePageChange,
    handleLimitChange,
    handleSearch,
    handleSortChange,
    refreshData,
    
    // Delete
    deleteOpen,
    userToDelete,
    deleteLoading,
    handleOpenDelete,
    handleConfirmDelete,
    handleCloseDeleteModal,

    // Upsert
    upsertOpen,
    modalMode,
    userToEdit,
    handleOpenUpsertModal,
    handleCloseUpsertModal,
    addUser,
    editUser,

    // Data for dropdowns
    roles
  };
};
