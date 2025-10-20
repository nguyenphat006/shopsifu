"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Package } from "lucide-react";
import { OrdersColumns } from "./orders-Columns";
import { OrdersStats } from "./orders-Stats";
import { DataTable } from "@/components/ui/data-table-component/data-table";
import { SearchInput } from "@/components/ui/data-table-component/search-input";
import DataTableViewOption from "@/components/ui/data-table-component/data-table-view-option";
import type { Table as TanstackTable } from "@tanstack/react-table";
import { useDataTable } from "@/hooks/useDataTable";
import { useServerDataTable } from "@/hooks/useServerDataTable";
import { manageOrderService } from "@/services/orderService";
import type { ManageOrder, ManageOrderGetAllResponse } from "@/types/order.interface";
import { useOrder } from "./useOrders";

export function OrdersTable() {
  const t = useTranslations("admin.orders");
  const router = useRouter();
  
  // State để quản lý expanded rows
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  // Sử dụng useServerDataTable để xử lý phân trang
  const {
    data: orders,
    loading,
    pagination,
    handleSearch,
    handlePageChange,
    handleLimitChange,
  } = useServerDataTable<ManageOrder, ManageOrder>({
    fetchData: (params) => manageOrderService.getAll({
      ...params,
      sortOrder: params.sortOrder as "asc" | "desc" | undefined,
    }),
    getResponseData: (response: ManageOrderGetAllResponse) => {
      console.log('Orders data received:', response.data);
      return response.data || [];
    },
    getResponseMetadata: (response: ManageOrderGetAllResponse) => response.metadata,
    defaultLimit: 10,
    requestConfig: {
      includeSearch: true,
      includeSort: true,
      includeCreatedById: false,
    },
  });

  // Handlers cho actions
  const handleViewDetail = (orderId: string) => {
    router.push(`/admin/order/${orderId}`);
  };

  // Sử dụng handlePrintInvoice từ useOrder hook
  const { handlePrintInvoice } = useOrder();

  const handlePrintOrder = (order: ManageOrder) => {
    console.log('handlePrintOrder called with order:', order);
    console.log('Order ID:', order.id);
    console.log('Order Code:', order.orderCode);
    
    if (!order.orderCode) {
      alert('Đơn hàng chưa có mã vận đơn. Không thể in hóa đơn.');
      return;
    }
    
    // Truyền cả orderId và orderCode để đảm bảo function có đủ thông tin
    handlePrintInvoice(order.id, order.orderCode);
  };

  const handleUpdateStatus = (orderId: string) => {
    // TODO: Implement update status modal/dialog
    console.log('Update status for order:', orderId);
  };

  const columns = OrdersColumns({ 
    t,
    onViewDetail: handleViewDetail,
    onPrintInvoice: handlePrintOrder,
    onUpdateStatus: handleUpdateStatus,
    expandedRows,
    setExpandedRows,
  });

  const table = useDataTable<ManageOrder>({
    data: orders,
    columns,
  });

  const OrdersTableToolbar = ({ table }: { table: TanstackTable<ManageOrder> }) => (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <SearchInput
          value={pagination.search || ""}
          onValueChange={handleSearch}
          placeholder={t("searchPlaceholder")}
          className="w-full md:max-w-sm"
        />
      </div>
      <div className="flex items-center gap-2">
        <DataTableViewOption table={table} />
      </div>
    </div>
  );

  const renderExpandedRow = (order: ManageOrder) => (
    <div className="bg-gray-50 border-t p-4">
      <h4 className="font-semibold mb-3 text-sm">Chi tiết sản phẩm đơn hàng #{order.id}:</h4>
      <div className="space-y-3 max-h-60 overflow-y-auto">
        {order.items.map((item, index) => (
          <div key={index} className="flex items-center gap-3 p-3 bg-white rounded border">
            {item.image ? (
              <img 
                src={item.image} 
                alt={item.productName}
                className="w-12 h-12 object-cover rounded border flex-shrink-0"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-100 rounded border flex items-center justify-center flex-shrink-0">
                <Package className="w-5 h-5 text-gray-400" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm">{item.productName}</div>
              <div className="text-gray-500 text-xs">
                SKU: {item.skuValue || 'N/A'} | Số lượng: {item.quantity}
              </div>
              <div className="font-semibold text-green-600 text-sm">
                {new Intl.NumberFormat('vi-VN').format(item.skuPrice * item.quantity)}₫
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-full space-y-4">
      {/* Statistics Cards */}
      <OrdersStats orders={orders} />
      
      <DataTable
        table={table}
        columns={columns}
        loading={loading}
        notFoundMessage={t("notFound")}
        Toolbar={OrdersTableToolbar}
        pagination={{
          metadata: pagination,
          onPageChange: handlePageChange,
          onLimitChange: handleLimitChange,
        }}
        onRowClick={(row: ManageOrder) => {
          router.push(`/admin/order/${row.id}`);
        }}
        expandedRows={expandedRows}
        renderExpandedRow={renderExpandedRow}
      />
    </div>
  );
}
