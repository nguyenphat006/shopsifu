"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/ui/data-table-component/data-table-column-header";
import { DataTableRowActions, ActionItem } from "@/components/ui/data-table-component/data-table-row-actions";
import { Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useTranslations } from "next-intl";

// Interface mới theo PerGetByIdResponse
export type Permission = {
  id: string;
  name: string;
  description: string;
  module: string;
  path: string;
  method: string;
  createdById: string;
  updatedById: string;
  deletedById: string;
  deletedAt: string;
  createdAt: string;
  updatedAt: string;
};

const methodColorMap: { [key: string]: string } = {
  GET: "text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100",
  POST: "text-green-600 border-green-200 bg-green-50 hover:bg-green-100",
  PUT: "text-yellow-600 border-yellow-200 bg-yellow-50 hover:bg-yellow-100",
  UPDATE: "text-orange-600 border-orange-200 bg-orange-50 hover:bg-orange-100",
  DELETE: "text-red-600 border-red-200 bg-red-50 hover:bg-red-100",
  MANAGE: "text-red-600 border-red-200 bg-red-50 hover:bg-red-100",
};

const getPermissionActions = (
  permission: Permission,
  onDelete: (permission: Permission) => void,
  onEdit: (permission: Permission) => void,
  t: (key: string) => string
): ActionItem<Permission>[] => [
  {
    type: "command",
    label: t("editAction"),
    icon: <Edit />,
    onClick: (permission) => onEdit(permission),
  },
  { type: "separator" },
  {
    type: "command",
    label: t("deleteAction"),
    icon: <Trash2 />,
    onClick: (permission) => onDelete(permission),
    className: "text-red-600 hover:!text-red-700",
  },
];

export const PermissionsColumns = ({
  onDelete,
  onEdit,
}: {
  onDelete: (permission: Permission) => void;
  onEdit: (permission: Permission) => void;
}): ColumnDef<Permission>[] => {
  const t = useTranslations('admin.permissions.form');

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
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("ID")} />
      ),
      cell: ({ row }) => <div className="w-[100px] truncate">{row.getValue("id")}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("Name")} />
      ),
      cell: ({ row }) => <div className="w-[220px] truncate">{row.getValue("name")}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "module",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("module")} />
      ),
      cell: ({ row }) => <div className="w-[220px] truncate">{row.getValue("module")}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
    accessorKey: "path",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title={t("name")} />
    ),
    cell: ({ row }) => (
      <div className="w-[220px] line-clamp-3 break-words text-sm">
        {row.getValue("path")}
      </div>
    ),
    enableSorting: true,
    enableHiding: true,
  },
    {
      accessorKey: "method",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("method")} />
      ),
      cell: ({ row }) => {
        const method = (row.getValue("method") as string).toUpperCase();
        const colorClass = methodColorMap[method] || "text-gray-600 border-gray-200 bg-gray-50 hover:bg-gray-100";
        return (
          <Badge
            variant="outline"
            className={`uppercase w-20 justify-center py-1 ${colorClass}`}
          >
            {method}
          </Badge>
        );
      },
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "description",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("description")} />
      ),
      cell: ({ row }) => <div className="w-[220px] truncate">{row.getValue("description")}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("createdAt")} />
      ),
      cell: ({ row }) => <div className="w-[220px] truncate">{format(new Date(row.getValue("createdAt")), "yyyy-MM-dd HH:mm:ss")}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "updatedAt",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title={t("updatedAt")} />
      ),
      cell: ({ row }) => <div className="w-[220px] truncate">{format(new Date(row.getValue("updatedAt")), "yyyy-MM-dd HH:mm:ss")}</div>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DataTableRowActions
          row={row}
          actions={getPermissionActions(row.original, onDelete, onEdit, t)}
        />
      ),
    },
  ];
};
