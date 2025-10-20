"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/ui/data-table-component/data-table-column-header";
import { DataTableRowActions, ActionItem } from "@/components/ui/data-table-component/data-table-row-actions";
import { Edit, Eye, Trash2, QrCode } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { format } from "date-fns";
import { FilterFn } from "@tanstack/react-table";
import { Product } from "@/types/products.interface";
import { ProductColumn } from "./useProducts";
import { getProductUrl } from "@/utils/slugify";

const priceInRange: FilterFn<any> = (row, columnId, value, addMeta) => {
  const price = row.getValue(columnId) as number;
  const [min, max] = value as [number, number];
  return price >= min && price <= max;
};

const getProductActions = (
  product: ProductColumn,
  onDelete: (product: ProductColumn) => void,
  onEdit: (product: ProductColumn) => void,
  onView: (product: ProductColumn) => void,
  onViewBarcode: (product: ProductColumn) => void,
  t: (key: string) => string
): ActionItem<ProductColumn>[] => [
  {
    type: "command",
    label: t("DataTable.view") + " (Trang sản phẩm)",
    icon: <Eye />,
    onClick: () => onView(product),
  },
  {
    type: "command",
    label: t("DataTable.edit"),
    icon: <Edit />,
    onClick: () => onEdit(product),
  },
  {
    type: "command",
    label: "Xem mã vạch",
    icon: <QrCode />,
    onClick: () => onViewBarcode(product),
  },
  { type: "separator" },
  {
    type: "command",
    label: t("DataTable.delete"),
    icon: <Trash2 />,
    onClick: () => onDelete(product),
    className: "text-red-600 hover:!text-red-700",
  },
];

export const productsColumns = ({
  onDelete,
  onEdit,
  onView,
  onViewBarcode,
}: {
  onDelete: (product: ProductColumn) => void;
  onEdit: (product: ProductColumn) => void;
  onView: (product: ProductColumn) => void;
  onViewBarcode: (product: ProductColumn) => void;
}): ColumnDef<ProductColumn>[] => {
  const t = useTranslations('admin.ModuleProduct');

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
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
        accessorKey: "images",
        header: () => t("DataTable.image"),
        cell: ({ row }) => {
            const imageUrl = row.original.image || '/images/image-placeholder.jpg';
            return (
                <div 
                    className="cursor-pointer" 
                    onClick={() => onEdit(row.original)}
                    title={`Chỉnh sửa sản phẩm: ${row.original.name}`}
                >
                    <Image
                        src={imageUrl}
                        alt={row.original.name ?? 'Product image'}
                        width={65}
                        height={65}
                        className="rounded-sm object-cover hover:opacity-80 transition-opacity"
                    />
                </div>
            )
        },
        enableSorting: false,
        enableHiding: true,
    },
    {
        accessorKey: "name",
        header: () => t("DataTable.name"),
        cell: ({ row }) => {
            return (
                <span 
                    className="font-medium line-clamp-3 w-40 whitespace-normal cursor-pointer hover:underline"
                    title={`Chỉnh sửa sản phẩm: ${row.original.name}`}
                    onClick={() => onEdit(row.original)}
                >
                    {row.original.name}
                </span>
            );
        },
        enableSorting: true,
        enableHiding: true,
    },

    // {
    //     accessorKey: "category",
    //     header: () => t("DataTable.category"),
    //     cell: ({ row }) => <div className="w-[100px] line-clamp-3 whitespace-normal">{row.original.category}</div>,
    //     enableSorting: true,
    //     enableHiding: true,
    // },
    {
        accessorKey: "price",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("DataTable.price")} />
        ),
        cell: ({ row }) => {
            const formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(row.original.price || 0);
            return <div className="w-[100px]">{formattedPrice}</div>;
        },
        enableSorting: true,
        enableHiding: true,
        filterFn: priceInRange,
    },
        {
        accessorKey: "virtualPrice",
        header: ({ column }) => (
          <DataTableColumnHeader column={column} title={t("DataTable.virtualPrice")} />
        ),
        cell: ({ row }) => {
            const formattedPrice = new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(row.original.virtualPrice || 0);
            return <div className="w-[100px]">{formattedPrice}</div>;
        },
        enableSorting: true,
        enableHiding: true,
        filterFn: priceInRange,
    },

    {
        accessorKey: "status",
        header: () => t("DataTable.status"),
        cell: ({ row }) => {
            const status = row.original.status;
            const statusVariant = {
                active: 'bg-green-100 text-green-800',
                inactive: 'bg-yellow-100 text-yellow-800',
            }[status] || 'bg-gray-100 text-gray-800';
            return (
                <Badge variant="outline" className={`capitalize ${statusVariant}`}>
                    {t(`Status.${status}`)}
                </Badge>
            );
        },
        enableSorting: true,
        enableHiding: true,
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t("DataTable.createdAt")} />
        ),
        cell: ({ row }) => (
            <div>{format(new Date(row.original.createdAt), "dd/MM/yyyy HH:mm:ss")}</div>
        ),
        enableSorting: true,
        enableHiding: true,
    },
    {
        accessorKey: "updatedAt",
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title={t("DataTable.updatedAt")} />
        ),
        cell: ({ row }) => (
            <div>{format(new Date(row.original.updatedAt), "dd/MM/yyyy HH:mm:ss")}</div>
        ),
        enableSorting: true,
        enableHiding: true,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DataTableRowActions
          row={row}
          actions={getProductActions(row.original, onDelete, onEdit, onView, onViewBarcode, t)}
        />
      ),
    },
  ];
};
