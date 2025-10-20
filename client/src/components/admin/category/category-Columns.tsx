'use client'


import { ColumnDef } from "@tanstack/react-table"
import { format } from "date-fns"
import { useTranslations } from "next-intl"
import { Edit, Trash2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/ui/data-table-component/data-table-column-header";
import { DataTableRowActions, ActionItem } from "@/components/ui/data-table-component/data-table-row-actions";
import { Category } from "@/types/admin/category.interface";

// Use Category type from interface instead of local type
export type CategoryTableData = Category;

// Hàm tạo danh sách actions cho Category
const getCategoryActions = (
  category: Category,
  onEdit: ((category: Category) => void) | undefined,
  onDelete: ((category: Category) => void) | undefined,
  t: (key: string) => string
): ActionItem<Category>[] => {
  const actions: ActionItem<Category>[] = [];

  if (onEdit) {
    actions.push({
      type: "command",
      label: t("edit"),
      icon: <Edit className="w-4 h-4" />,
      onClick: (category) => onEdit(category),
    });
  }

  if (onEdit && onDelete) {
    actions.push({ type: "separator" });
  }

  if (onDelete) {
    actions.push({
      type: "command",
      label: t("delete"),
      icon: <Trash2 className="w-4 h-4" />,
      onClick: (category) => onDelete(category),
      className: "text-destructive hover:!text-destructive",
    });
  }

  return actions;
};

interface CategoryColumnsProps {
  onEdit?: (category: CategoryTableData) => void;
  onDelete?: (category: CategoryTableData) => void;
}

export const CategoryColumns = (param: CategoryColumnsProps = {}): ColumnDef<CategoryTableData>[] => {
  const { onEdit, onDelete } = param || {};
  const t  = useTranslations("admin.ModuleCategory.Table");
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
          onClick={(e) => e.stopPropagation()} // Ngăn event bubble up
          // aria-label={t('admin.pages.category.selectAll')}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onCheckedChange={value => row.toggleSelected(!!value)}
          onClick={(e) => e.stopPropagation()} // Ngăn event bubble up
          // aria-label={t('admin.pages.category.selectRow')}
        />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 32,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("name")} />
      ),
      cell: ({ row }) => {
        const category = row.original;
        return (
          <div className="flex items-center gap-1">
            <span className="font-medium">{category.name}</span>
          </div>
        );
      },
      enableSorting: true,
      enableHiding: false,
      filterFn: "includesString",
    },
    {
      accessorKey: "parentCategoryId",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("parentCategory")} />
      ),
      cell: ({ row }) => {
        const parentId = row.getValue("parentCategoryId");
        return (
          <div>{parentId ? String(parentId) : t("noParent")}</div>
        );
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "logo",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("logo")} />
      ),
      cell: ({ row }) => {
        const logo = row.getValue("logo") as string | null;
        return logo ? (
          <div className="h-10 w-10 relative">
            <img
              src={logo}
              alt={row.getValue("name")}
              className="h-full w-full object-contain rounded"
            />
          </div>
        ) : (
          <div className="text-muted-foreground italic">{t("noLogo")}</div>
        );
      },
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("createdAt")} />
      ),
      cell: ({ row }) => (
        <div className="whitespace-nowrap">{format(new Date(row.getValue("createdAt")), "yyyy-MM-dd HH:mm")}</div>
      ),
      enableSorting: true,
      enableHiding: true,
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue) return true;
        const rowDate = format(new Date(row.getValue(columnId)), "yyyy-MM-dd");
        return rowDate === filterValue;
      },
    },
     {
      accessorKey: "updatedAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("updatedAt")} />
      ),
      cell: ({ row }) => (
        <div className="whitespace-nowrap">{format(new Date(row.getValue("updatedAt")), "yyyy-MM-dd HH:mm")}</div>
      ),
      enableSorting: true,
      enableHiding: true,
      filterFn: (row, columnId, filterValue) => {
        if (!filterValue) return true;
        const rowDate = format(new Date(row.getValue(columnId)), "yyyy-MM-dd");
        return rowDate === filterValue;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DataTableRowActions
          row={row}
          actions={getCategoryActions(row.original, onEdit, onDelete, t)}
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
  ];
};