'use client'
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { DataTable } from '@/components/ui/data-table-component/data-table';
import { voucherColumns } from './voucher-Columns';
import { ConfirmDeleteModal } from '@/components/ui/confirm-delete-modal';
import { useVouchers } from './hook/useVouchers';
import SearchInput from '@/components/ui/data-table-component/search-input';
import DataTableViewOption from '@/components/ui/data-table-component/data-table-view-option';
import VoucherFormCreate from './voucher-FormCreate';
import { useDataTable } from '@/hooks/useDataTable';

export default function VoucherTable() {
  const t = useTranslations("admin.ModuleVouchers.Table");
  const router = useRouter();
  const {
    data,
    loading,
    pagination,
    handleSearch,
    handlePageChange,
    handleLimitChange,
    deleteOpen,
    voucherToDelete,
    deleteLoading,
    handleOpenDelete,
    handleConfirmDelete,
    handleCloseDeleteModal,
    handleOpenUpsertModal,
  } = useVouchers();

  // Handle edit voucher - redirect to edit page
  const handleEditVoucher = (voucher: any) => {
    router.push(`/admin/voucher/edit/${voucher.id}`);
  };

  const columns = voucherColumns({ 
    onEdit: handleEditVoucher, // Sử dụng handleEditVoucher thay vì handleOpenUpsertModal
    onDelete: handleOpenDelete 
  });

  const table = useDataTable({
      data: data,
      columns: columns,
    });
  return (
    <div className="w-full space-y-4">
        <div className="bg-background border rounded-lg p-4">
          <VoucherFormCreate />
        </div>

      {/* Hàng 2: Search + View Option */}
      <div className="flex justify-between flex-wrap gap-4 items-center">
        <div className="flex-1">
          <SearchInput
            value={pagination.search || ""}
            onValueChange={handleSearch}
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
          voucherToDelete
            ? t('deleteConfirm.description', {
                code: voucherToDelete?.code || '',
              })
            : ''
        }
        confirmText={t('deleteConfirm.deleteAction')}
        cancelText={t('deleteConfirm.cancel')}
        loading={deleteLoading}
      />
    </div>
  )
}
