"use client";

import { CategoryColumns, CategoryTableData } from "./category-Columns";
import SearchInput from "@/components/ui/data-table-component/search-input";
import { CategoryModalUpsert } from "./category-ModalUpsert";
import { Plus } from "lucide-react";
import { ConfirmDeleteModal } from "@/components/ui/confirm-delete-modal";
import { DataTable } from "@/components/ui/data-table-component/data-table";
import { Button } from "@/components/ui/button";
import { useCategory } from "./useCategory";
import { useTranslations } from "next-intl";
import { useDataTable } from "@/hooks/useDataTable";
import DataTableViewOption from "@/components/ui/data-table-component/data-table-view-option";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CategoryCreateRequest, CategoryUpdateRequest } from "@/types/admin/category.interface";

export function CategoryTable() {
  const t = useTranslations("admin.ModuleCategory.Table");
  const {
    data: categories,
    loading,
    pagination,
    handlePageChange,
    handleLimitChange,
    handleSearch,
    handleSortChange,
    refreshData,
    
    // Modal states
    upsertOpen,
    modalMode,
    categoryToEdit,
    handleOpenUpsertModal,
    handleCloseUpsertModal,
    
    // CRUD functions
    addCategory,
    editCategory,
    
    // Delete state & handlers
    deleteOpen,
    categoryToDelete,
    deleteLoading,
    handleOpenDelete,
    handleConfirmDelete,
    handleCloseDeleteModal,
    
    // Navigation
    currentParentId,
    breadcrumb,
    currentCategoryTitle,
    handleViewSubcategories,
    handleBackToRoot,
    handleBreadcrumbClick,
  } = useCategory();

  const handleCreateCategory = () => {
    handleOpenUpsertModal('add');
  };
  
  const columns = CategoryColumns({
    onEdit: (category) => handleOpenUpsertModal('edit', category),
    onDelete: handleOpenDelete,
  });
  
  const table = useDataTable({
    data: categories || [],
    columns,
  });

  return (
    <div className="w-full space-y-4">
      {/* Add button */}
      <div className="flex justify-end">
        <Button onClick={handleCreateCategory}>
          <Plus className="w-4 h-4 mr-2" />
          {t("addCategory")}
        </Button>
      </div>

      {/* Search and View Options */}
      <div className="flex justify-between flex-wrap gap-4 items-center">
        <div className="flex-1">
          <SearchInput
            value={pagination?.search || ""}
            onValueChange={handleSearch}
            placeholder={t("searchPlaceholder")}
            className="w-full md:max-w-sm"
          />
        </div>
        <DataTableViewOption table={table} />
      </div>

      {/* Breadcrumb navigation */}
      {(currentParentId !== null || breadcrumb.length > 0) && (
        <div className="flex items-center gap-2 mb-2 bg-muted/30 p-2 rounded-md">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleBackToRoot}
            className="flex items-center gap-1 hover:bg-muted"
          >
            <ChevronLeft className="h-4 w-4" />
            {t("backToRoot")}
          </Button>
          
          {breadcrumb.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="px-1">/</span>
              {breadcrumb.map((crumb, index) => (
                <div key={crumb.id} className="flex items-center">
                  {index > 0 && <ChevronRight className="h-3 w-3 mx-1" />}
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="px-1 py-0 h-auto text-sm hover:bg-muted"
                    onClick={() => handleBreadcrumbClick(index)}
                  >
                    {crumb.name}
                  </Button>
                </div>
              ))}
            </div>
          )}
          
          {currentCategoryTitle && (
            <div className="ml-auto text-sm font-medium">
              {t("currentCategory")}: {currentCategoryTitle}
            </div>
          )}
        </div>
      )}

      {/* Data Table */}
      <div className="relative">
        <DataTable
          table={table}
          columns={columns}
          loading={loading}
          notFoundMessage={t("notFound")}
          onRowClick={handleViewSubcategories}
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

      {/* Upsert Modal */}
      <CategoryModalUpsert
        isOpen={upsertOpen}
        onClose={handleCloseUpsertModal}
        mode={modalMode}
        category={categoryToEdit}
        onSubmit={(data) => {
          if (modalMode === 'add') {
            return addCategory(data as CategoryCreateRequest);
          } else if (categoryToEdit) {
            return editCategory(String(categoryToEdit.id), data as CategoryUpdateRequest);
          }
          return Promise.resolve(null);
        }}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        open={deleteOpen}
        onClose={() => {
          if (!deleteLoading) handleCloseDeleteModal();
        }}
        onConfirm={handleConfirmDelete}
        title={t('deleteConfirmTitle')}
        description={
          categoryToDelete ? (
            <>
              {t('deleteConfirmMessage')}{' '}
              <b>{categoryToDelete.name}</b>?
            </>
          ) : (
            ''
          )
        }
        confirmText={t('delete')}
        cancelText={t('cancel')}
        loading={deleteLoading}
      />
    </div>
  );
}
