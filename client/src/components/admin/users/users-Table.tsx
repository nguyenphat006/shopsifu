'use client'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/ui/data-table-component/data-table'
import { userColumns } from './users-Columns'
import { ConfirmDeleteModal } from '@/components/ui/confirm-delete-modal'
import UsersModalUpsert from './users-ModalUpsert'
import { useUsers } from './useUsers'
import SearchInput from '@/components/ui/data-table-component/search-input'
import { PlusIcon } from 'lucide-react'
import { User, UserCreateRequest } from '@/types/admin/user.interface'
import { useDataTable } from '@/hooks/useDataTable'
import DataTableViewOption from '@/components/ui/data-table-component/data-table-view-option'

export default function UserTable() {
  const t = useTranslations("admin.ModuleUsers.Table");
  
  const {
    data,
    loading,
    pagination,
    handleSearch,
    handlePageChange,
    handleLimitChange,
    deleteOpen,
    userToDelete,
    deleteLoading,
    handleOpenDelete,
    handleConfirmDelete,
    handleCloseDeleteModal,
    upsertOpen,
    modalMode,
    userToEdit,
    handleOpenUpsertModal,
    handleCloseUpsertModal,
    addUser,
    editUser,
    roles,
  } = useUsers();

  const handleSubmit = async (formData: User | UserCreateRequest) => {
    if (modalMode === 'edit') {
      await editUser(formData as User);
    } else {
      await addUser(formData as UserCreateRequest);
    }
  };

  const table = useDataTable({
      data: data,
      columns: userColumns({ onEdit: (user) => handleOpenUpsertModal('edit', user), onDelete: handleOpenDelete }),
    });
  return (
    <div className="w-full space-y-4">
      {/* Hàng 1: Nút Thêm mới */}
      <div className="flex justify-end">
        <Button onClick={() => handleOpenUpsertModal('add')}>
          <PlusIcon className="w-4 h-4 mr-2" />{t("addAction")}
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
          columns={userColumns({ onEdit: (user) => handleOpenUpsertModal('edit', user), onDelete: handleOpenDelete })}
          loading={loading}
          notFoundMessage={t('notFound')}
          pagination={{
            metadata: pagination,
            onPageChange: handlePageChange,
            onLimitChange: handleLimitChange,
          }}
        />
      </div>

      {/* Modal xác nhận xóa */}
      <ConfirmDeleteModal
        open={deleteOpen}
        onClose={() => {
          if (!deleteLoading) handleCloseDeleteModal();
        }}
        onConfirm={handleConfirmDelete}
        title={t('deleteConfirm.title')}
        description={
          userToDelete
            ? t('deleteConfirm.description', {
                name: userToDelete?.name || '',
              })
            : ''
        }
        confirmText={t('deleteConfirm.deleteAction')}
        cancelText={t('deleteConfirm.cancel')}
        loading={deleteLoading}
      />

      {/* Add/Edit Modal */}
      {upsertOpen && (
        <UsersModalUpsert
          open={upsertOpen}
          onClose={handleCloseUpsertModal}
          roles={roles}
          mode={modalMode}
          user={userToEdit}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  )
}
