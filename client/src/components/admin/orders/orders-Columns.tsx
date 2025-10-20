"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/ui/data-table-component/data-table-column-header";
import { DataTableRowActions } from "@/components/ui/data-table-component/data-table-row-actions";
import type { ActionItem } from "@/components/ui/data-table-component/data-table-row-actions";
import type { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { 
  ChevronDown, 
  ChevronRight, 
  Eye, 
  Package, 
  Printer, 
  RefreshCw 
} from "lucide-react";
import type { ManageOrder } from "@/types/order.interface";

// Hàm tạo danh sách actions cho Order
const getOrderActions = (
  order: ManageOrder,
  onViewDetail: ((orderId: string) => void) | undefined,
  onPrintInvoice: ((order: ManageOrder) => void) | undefined,
  onUpdateStatus: ((orderId: string) => void) | undefined,
  t: (key: string) => string
): ActionItem<ManageOrder>[] => {
  const actions: ActionItem<ManageOrder>[] = [];

  if (onViewDetail) {
    actions.push({
      type: "command",
      label: t("viewDetail"),
      icon: <Eye className="w-4 h-4" />,
      onClick: (order) => onViewDetail(order.id),
    });
  }

  if (onPrintInvoice) {
    actions.push({
      type: "command",
      label: t("printInvoice"),
      icon: <Printer className="w-4 h-4" />,
      onClick: (order) => onPrintInvoice(order),
    });
  }

  // if (onUpdateStatus) {
  //   if (actions.length > 0) {
  //     actions.push({ type: "separator" });
  //   }
  //   actions.push({
  //     type: "command",
  //     label: t("updateStatus"),
  //     icon: <Package className="w-4 h-4" />,
  //     onClick: (order) => onUpdateStatus(order.id),
  //   });
  // }

  return actions;
};

export const OrdersColumns = ({
  t,
  onViewDetail,
  onPrintInvoice,
  onUpdateStatus,
  expandedRows,
  setExpandedRows,
}: {
  t: (key: string) => string;
  onViewDetail?: (orderId: string) => void;
  onPrintInvoice?: (order: ManageOrder) => void;
  onUpdateStatus?: (orderId: string) => void;
  expandedRows?: Set<string>;
  setExpandedRows?: (rows: Set<string>) => void;
}): ColumnDef<ManageOrder, any>[] => [
  // Expand button column
  {
    id: "expand",
    header: "",
    cell: ({ row }) => {
      const orderId = row.original.id;
      const isExpanded = expandedRows?.has(orderId) || false;
      const items = row.original.items;
      const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
      
      const toggleExpanded = (e: React.MouseEvent) => {
        e.stopPropagation(); // Ngăn trigger onRowClick
        if (setExpandedRows && expandedRows) {
          const newExpanded = new Set(expandedRows);
          if (isExpanded) {
            newExpanded.delete(orderId);
          } else {
            newExpanded.add(orderId);
          }
          setExpandedRows(newExpanded);
        }
      };
      
      return (
        <div className="w-[50px] flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleExpanded}
            className="h-8 w-8 p-0"
          >
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  // Products summary column
  {
    accessorFn: (row) => row.items,
    id: "products",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t("products")}
        className="justify-center text-center px-2"
      />
    ),
    cell: ({ row }) => {
      const items = row.original.items;
      const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
      
      return (
        <div className="w-[120px] text-center py-3">
          <div className="flex items-center justify-center gap-2">
            <Package className="h-4 w-4 text-gray-500" />
            <span className="text-sm">
              {totalItems} sản phẩm
            </span>
          </div>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorFn: (row) => row.id,
    id: "orderId",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Mã đơn hàng"
        className="justify-center text-center px-2"
      />
    ),
    cell: ({ getValue }) => (
      <div
        className="w-[140px] truncate text-center font-medium text-slate-600 py-3"
        title={getValue<string>()}
      >
        #{getValue<string>().slice(-8).toUpperCase()}
      </div>
    ),
  },
  {
    accessorFn: (row) => row.orderCode,
    id: "orderCode",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Mã vận đơn"
        className="justify-center text-center px-2"
      />
    ),
    cell: ({ row }) => {
      const orderCode = row.original.orderCode;
      
      return (
        <div className="w-[120px] text-center py-3">
          {orderCode ? (
            <div
              className="font-medium text-blue-600 text-sm"
              title={`Mã vận đơn: ${orderCode}`}
            >
              {orderCode}
            </div>
          ) : (
            <div className="text-gray-400 text-xs italic">
              Chưa có
            </div>
          )}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.createdAt,
    id: "orderDate",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t("orderDate")}
        className="justify-center text-center px-2"
      />
    ),
    cell: ({ getValue }) => {
      const date = format(new Date(getValue<string>()), "dd/MM/yyyy HH:mm");
      return (
        <div className="w-[170px] truncate text-center text-sm py-3" title={date}>
          {date}
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.userId, // Sử dụng userId thay vì receiver.name
    id: "customerName",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t("customerName")}
        className="justify-center text-center px-2"
      />
    ),
    cell: ({ getValue, row }) => {
      const userId = getValue<string>();
      // Tạm thời hiển thị userId, sau này có thể join với user data
      return (
        <div className="w-[160px] text-center py-3">
          <div className="font-medium truncate text-xs" title={userId}>
            UUID: {userId.slice(-8).toUpperCase()}
          </div>
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.status,
    id: "status",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t("status")}
        className="justify-center text-center px-2"
      />
    ),
    cell: ({ getValue }) => {
      const status = getValue<string>();
      const statusConfig: Record<string, { color: string; label: string; dotColor: string }> = {
        PENDING_PAYMENT: {
          color: "bg-yellow-50 text-yellow-700 border-yellow-200",
          label: t("statuses.pendingPayment"),
          dotColor: "bg-yellow-500"
        },
        PENDING_PACKAGING:{
          color: "bg-blue-50 text-blue-700 border-blue-200",
          label: t("statuses.pendingPackaging"),
          dotColor: "bg-blue-500"
        },
        PENDING_PICKUP: {
          color: "bg-blue-50 text-blue-700 border-blue-200",
          label: t("statuses.pendingPickup"),
          dotColor: "bg-blue-500"
        },
        PENDING_DELIVERY: {
          color: "bg-purple-50 text-purple-700 border-purple-200",
          label: t("statuses.pendingDelivery"),
          dotColor: "bg-purple-500"
        },
        DELIVERED: {
          color: "bg-green-50 text-green-700 border-green-200",
          label: t("statuses.delivered"),
          dotColor: "bg-green-500"
        },
        RETURNED: {
          color: "bg-gray-50 text-gray-700 border-gray-200",
          label: t("statuses.returned"),
          dotColor: "bg-gray-500"
        },
        CANCELLED: {
          color: "bg-red-50 text-red-700 border-red-200",
          label: t("statuses.cancelled"),
          dotColor: "bg-red-500"
        },
      };

      const { color, label, dotColor } = statusConfig[status] || {
        color: "bg-slate-50 text-slate-700 border-slate-200",
        label: status,
        dotColor: "bg-slate-500"
      };

      return (
        <div className="w-[160px] text-center py-3" title={label}>
          <Badge 
            variant="outline"
            className={`${color} border px-3 py-1.5 w-full justify-center font-medium text-xs inline-flex items-center gap-2`}
          >
            <span className={`w-2 h-2 rounded-full ${dotColor}`}></span>
            {label}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorFn: (row) => row.totalPayment,
    id: "totalPayment",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={t("totalPayment")}
        className="justify-center text-center px-2"
      />
    ),
    cell: ({ getValue, row }) => {
      const totalPayment = getValue<number>();
      const items = row.original.items;
      const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
      
      const formatCurrency = (amount: number) => 
        new Intl.NumberFormat('vi-VN').format(amount);

      return (
        <div className="w-[140px] text-center py-3">
          <div className="font-bold text-lg text-green-600 mb-1">
            {formatCurrency(totalPayment)}₫
          </div>
          <div className="text-xs text-gray-500">
            {itemCount} sản phẩm
          </div>
        </div>
      );
    },
  },
  // Actions column
  {
    id: "actions",
    cell: ({ row }) => (
      <DataTableRowActions
        row={row}
        actions={getOrderActions(row.original, onViewDetail, onPrintInvoice, onUpdateStatus, t)}
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
];
