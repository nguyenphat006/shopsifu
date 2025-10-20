'use client'

import { useTranslations } from 'next-intl'
import { PlusIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table-component/data-table'
import { ConfirmDeleteModal } from '@/components/ui/confirm-delete-modal'

import { RolesColumns, Role } from './roles-Columns'
import RolesModalUpsert from './roles-ModalUpsert'
import { showToast } from '@/components/ui/toastify'
import { useRoles } from './useRoles'
import {
  RoleCreateRequest,
  RoleUpdateRequest,
} from "@/types/auth/role.interface"
import { useDataTable } from '@/hooks/useDataTable'
import SearchInput from '@/components/ui/data-table-component/search-input'
import DataTableViewOption from '@/components/ui/data-table-component/data-table-view-option'

export default function RolesTable() {
  const t = useTranslations("admin.roles")
  
  const {
    data,
    loading,
    pagination,
    handleSearch,
    handlePageChange,
    handleLimitChange,
    deleteOpen,
    roleToDelete,
    deleteLoading,
    handleOpenDelete,
    handleConfirmDelete,
    handleCloseDeleteModal,
    upsertOpen,
    modalMode,
    roleToEdit,
    handleOpenUpsertModal,
    handleCloseUpsertModal,
    addRole,
    editRole,
    permissionsData,
    isPermissionsLoading,
  } = useRoles()

  const handleSubmit = async (values: {
    name: string
    description: string
    isActive: boolean
    permissionIds: string[]
  }) => {
    try {
      if (modalMode === 'edit' && roleToEdit) {
        const payload: RoleUpdateRequest = {
          name: values.name,
          description: values.description,
          isActive: values.isActive,
          permissionIds: values.permissionIds,
        };
        await editRole(roleToEdit.id, payload);
      } else {
        const payload: RoleCreateRequest = {
          name: values.name,
          description: values.description,
          isActive: values.isActive,
        };
        await addRole(payload);
      }
    } catch (err) {
      showToast(
        modalMode === 'edit'
          ? t('updateError')
          : t('createError'),
        'error'
      )
    }
  }



    const columns = RolesColumns({ 
      onDelete: handleOpenDelete, 
      onEdit: (role) => handleOpenUpsertModal('edit', role) 
    });

    const table = useDataTable({ data: data, columns })
  return (
    <div className="w-full space-y-4">
      {/* Hàng 1: Nút Thêm mới */}
      <div className="flex justify-end">
        <Button onClick={() => handleOpenUpsertModal('add')}>
          <PlusIcon className="w-4 h-4 mr-2" />
          {t("addAction")}
        </Button>
      </div>

      {/* Hàng 2: Search + View Option */}
      <div className="flex justify-between flex-wrap gap-4 items-center">
        <div className="flex-1">
          <SearchInput
            value={pagination.search || ""}
            onValueChange={(value) => handleSearch(value)}
            placeholder={t("searchPlaceholder")}
            className="w-full md:max-w-sm"
          />
        </div>
        <DataTableViewOption table={table} />
      </div>

      {/* Data Table */}
      <div className="relative">
        <DataTable
          table={table}
          columns={columns}
          loading={loading}
          notFoundMessage={t('noData')}
          pagination={{
            metadata: pagination,
            onPageChange: handlePageChange,
            onLimitChange: handleLimitChange,
          }}
        />
      </div>

      {/* Modal Add/Edit */}
      {upsertOpen && (
        <RolesModalUpsert
          open={upsertOpen}
          onClose={handleCloseUpsertModal}
          mode={modalMode}
          role={roleToEdit}
          onSubmit={handleSubmit}
          permissionsData={permissionsData}
          isPermissionsLoading={isPermissionsLoading}
        />
      )}

      {/* Modal xác nhận xóa */}
      <ConfirmDeleteModal
        open={deleteOpen}
        onClose={() => {
          if (!deleteLoading) handleCloseDeleteModal();
        }}
        onConfirm={handleConfirmDelete}
        title={t("confirmDeleteTitle")}
        description={
          roleToDelete
            ? t("confirmDeleteDesc", { name: roleToDelete.name })
            : ""
        }
        confirmText={t("modal.delete")}
        cancelText={t("modal.cancel")}
        loading={deleteLoading}
      />
    </div>
  );
}
