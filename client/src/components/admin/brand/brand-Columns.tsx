'use client'

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "@/components/ui/data-table-component/data-table-column-header"
import { DataTableRowActions, ActionItem } from "@/components/ui/data-table-component/data-table-row-actions"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Edit, Trash2 } from "lucide-react"
import { format } from "date-fns"
import { Brand } from "@/types/admin/brands.interface"
import { useTranslations } from "next-intl"

// Hàm tạo danh sách actions cho Brand
const getBrandActions = (
  brand: Brand,
  onDelete: (brand: Brand) => void,
  onEdit: (brand: Brand) => void,
  t: (key: string) => string
): ActionItem<Brand>[] => [
  {
    type: "command",
    label: t("actions.edit"),
    icon: <Edit className="w-4 h-4" />,
    onClick: (brand) => {
      onEdit(brand);
    },
  },
  { type: "separator" },
  {
    type: "command",
    label: t("actions.delete"),
    icon: <Trash2 className="w-4 h-4" />,
    onClick: (brand) => onDelete(brand),
    className: "text-red-500 hover:!text-red-500",
  },
]

type BrandColumnsProps = {
  onEdit: (brand: Brand) => void
  onDelete: (brand: Brand) => void
}

export const BrandColumns = ({ 
  onEdit, 
  onDelete
}: BrandColumnsProps): ColumnDef<Brand>[] => {
  const t = useTranslations("admin.ModuleBrands.Table");

  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("id") || "ID"} />
      ),
      cell: ({ row }) => (
        <div className="font-mono text-xs">{row.getValue("id")}</div>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "logo",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("logo")} />
      ),
      cell: ({ row }) => {
        const brand = row.original
        return (
          <div className="w-[80px] flex justify-center">
            <Avatar className="h-12 w-12 border">
              <AvatarImage src={brand.logo} alt={brand.name} className="object-contain p-1" />
              <AvatarFallback className="bg-primary/10 text-primary">
                {brand.name?.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        )
      },
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("name")} />
      ),
      cell: ({ row }) => (
        <div className="font-medium">{row.getValue("name")}</div>
      ),
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("createdAt")} />
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt"));
        return <span>{format(date, 'dd/MM/yyyy HH:mm')}</span>;
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("updatedAt")} />
      ),
      cell: ({ row }) => {
        const date = new Date(row.getValue("updatedAt"));
        return <span>{format(date, 'dd/MM/yyyy HH:mm')}</span>;
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DataTableRowActions
          row={row}
          actions={getBrandActions(row.original, onDelete, onEdit, t)}
        />
      ),
    },
  ];
}
