'use client'

import { useState, useCallback } from "react"
import { LanguagesColumns, Language } from "./languages-Columns"
import SearchInput from "@/components/ui/data-table-component/search-input"
import LanguagesModalUpsert from "./languages-ModalUpsert"
import { PlusIcon } from "lucide-react"
import { ConfirmDeleteModal } from "@/components/ui/confirm-delete-modal"
import { DataTable } from "@/components/ui/data-table-component/data-table"
import { Button } from "@/components/ui/button"
import { useLanguages } from "./useLanguages"
import { useTranslations } from "next-intl"
import { useDataTable } from "@/hooks/useDataTable"
import DataTableViewOption from "@/components/ui/data-table-component/data-table-view-option"

export function LanguagesTable() {
  const t = useTranslations()
  const {
    languages,
    pagination,
    loading,
    isModalOpen,
    selectedLanguage,
    deleteLanguage,
    createLanguage,
    updateLanguage,
    handleOpenModal,
    handleCloseModal,
    handlePageChange,
    handleLimitChange,
    handleSearch,
    refreshData
  } = useLanguages()

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [languageToDelete, setLanguageToDelete] = useState<Language | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const handleEdit = useCallback((language: Language) => {
    handleOpenModal(language);
  }, [handleOpenModal]);

  const handleOpenDelete = useCallback((language: Language) => {
    setLanguageToDelete(language);
    setDeleteOpen(true);
  }, []);

  const handleCloseDeleteModal = useCallback(() => {
    setDeleteOpen(false);
    setLanguageToDelete(null);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (!languageToDelete) return;
    setDeleteLoading(true);
    try {
      await deleteLanguage(languageToDelete.code);
      // Đóng modal xác nhận xóa sau khi xóa thành công
      handleCloseDeleteModal();
      // Lưu ý: refreshData đã được gọi trong deleteLanguage
    } catch (error) {
      // Lỗi đã được xử lý trong deleteLanguage
      console.error('Error deleting language:', error);
    } finally {
      setDeleteLoading(false);
    }
  }, [languageToDelete, deleteLanguage, handleCloseDeleteModal]);

  const handleSubmit = useCallback(async (values: { code: string; name: string }) => {
    try {
      if (selectedLanguage) {
        // Update
        await updateLanguage(selectedLanguage.code, { name: values.name });
      } else {
        // Create
        await createLanguage({ id: values.code, name: values.name });
      }
      // Đóng modal sau khi thực hiện thành công
      handleCloseModal();
      // Lưu ý: refreshData đã được gọi trong createLanguage/updateLanguage
    } catch (error) {
      // Lỗi đã được xử lý trong createLanguage/updateLanguage
      console.error('Error handling language operation:', error);
    }
  }, [selectedLanguage, createLanguage, updateLanguage, handleCloseModal]);

  // Sử dụng useDataTable để tạo bảng từ dữ liệu
  const table = useDataTable({
    data: languages,
    columns: LanguagesColumns({ onDelete: handleOpenDelete, onEdit: handleEdit }),
  });

  return (
   <div className="w-full space-y-4">
  {/* Hàng 1: Nút Thêm mới */}
  <div className="flex justify-end">
    <Button onClick={() => handleOpenModal()}>
      <PlusIcon className="w-4 h-4 mr-2" />
      {t("admin.languages.addAction")}
    </Button>
  </div>

  {/* Hàng 2: Search + View Option */}
  <div className="flex justify-between flex-wrap gap-4 items-center">
    <div className="flex-1">
      <SearchInput
        value={pagination.search || ""}
        onValueChange={(value) => handleSearch(value)}
        placeholder={t("admin.languages.searchPlaceholder")}
        className="w-full md:max-w-sm"
      />
    </div>
    <DataTableViewOption table={table} />
  </div>

  {/* Data Table */}
  <div className="relative">
    <DataTable
      table={table}
      columns={LanguagesColumns({ onDelete: handleOpenDelete, onEdit: handleEdit })}
      loading={loading}
      notFoundMessage={t("admin.languages.notFound")}
      pagination={{
        metadata: pagination || {
          page: 1,
          limit: 10,
          totalPages: 1,
          totalItems: 0,
          hasNext: false,
          hasPrevious: false,
        },
        onPageChange: handlePageChange,
        onLimitChange: handleLimitChange,
      }}
    />
  </div>

  {/* Modal thêm/sửa */}
  <LanguagesModalUpsert
    open={isModalOpen}
    onClose={handleCloseModal}
    mode={selectedLanguage ? 'edit' : 'add'}
    language={selectedLanguage}
    onSubmit={handleSubmit}
  />

  {/* Modal xác nhận xóa */}
  <ConfirmDeleteModal
    open={deleteOpen}
    onClose={() => {
      if (!deleteLoading) handleCloseDeleteModal()
    }}
    onConfirm={handleConfirmDelete}
    title={t('admin.languages.modalDelete.deleteConfirmTitle')}
    description={
      languageToDelete ? (
        <>
          {t('admin.languages.modalDelete.deleteConfirmMessage')}{' '}
          <b>{languageToDelete.name}</b>?
        </>
      ) : (
        ''
      )
    }
    confirmText={t('admin.languages.deleteAction')}
    cancelText={t('admin.languages.modalDelete.cancelAction')}
    loading={deleteLoading}
  />
</div>

  )
}
