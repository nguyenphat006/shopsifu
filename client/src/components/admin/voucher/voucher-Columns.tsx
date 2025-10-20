'use client'

import { ColumnDef } from '@tanstack/react-table'
import { DiscountStatus, DiscountType, VoucherType, DisplayType } from '@/types/discount.interface'
import { VoucherColumn } from './hook/useVouchers'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/ui/data-table-component/data-table-column-header'
import { DataTableRowActions, ActionItem } from '@/components/ui/data-table-component/data-table-row-actions'
import { Edit, Trash2, Ticket } from 'lucide-react'
import { format } from 'date-fns'
import { useTranslations } from 'next-intl'
import { useUserData } from '@/hooks/useGetData-UserLogin'

const getVoucherActions = (
  onDelete: (voucher: VoucherColumn) => void,
  onEdit: (voucher: VoucherColumn) => void,
  t: (key: string) => string
): ActionItem<VoucherColumn>[] => [
  {
    type: 'command',
    label: t('actions.edit'),
    icon: <Edit className="w-4 h-4" />,
    onClick: (voucher) => onEdit(voucher as VoucherColumn),
  },
  { type: 'separator' },
  {
    type: 'command',
    label: t('actions.delete'),
    icon: <Trash2 className="w-4 h-4" />,
    onClick: (voucher) => onDelete(voucher as VoucherColumn),
    className: 'text-red-500 hover:!text-red-500',
  },
]

export const voucherColumns = (
  { onDelete, onEdit }: { onDelete: (voucher: VoucherColumn) => void; onEdit: (voucher: VoucherColumn) => void }
): ColumnDef<VoucherColumn>[] => {
  const t = useTranslations("admin.ModuleVouchers.Table");
  const userData = useUserData();
  
  // Check if user is ADMIN
  const isAdmin = userData?.role?.name?.toLowerCase() === 'admin';

  const baseColumns: ColumnDef<VoucherColumn>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
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
      accessorKey: 'name',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('voucherInfo')} />,
      cell: ({ row }) => {
        const name = row.original.name || '';
        const code = row.original.code || '';
        const startDate = new Date(row.original.startDate);
        const endDate = new Date(row.original.endDate);
        const now = new Date();
        
        // Tự động tính trạng thái dựa vào thời gian
        let status = DiscountStatus.INACTIVE;
        let statusText = 'Chưa hoạt động';
        let statusClass = 'bg-gray-100 text-gray-600';
        
        if (now >= startDate && now <= endDate) {
          status = DiscountStatus.ACTIVE;
          statusText = 'Đang diễn ra';
          statusClass = 'bg-green-100 text-green-600';
        } else if (now > endDate) {
          status = DiscountStatus.EXPIRED;
          statusText = 'Hết hạn';
          statusClass = 'bg-red-100 text-red-600';
        }

        return (
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 flex-shrink-0">
              <Ticket className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className={`px-2 py-1 rounded text-xs font-medium ${statusClass}`}>
                  {statusText}
                </span>
              </div>
              <div className="font-medium text-sm truncate">{name}</div>
              <div className="text-xs text-gray-500 uppercase font-mono">
                Mã voucher: {code.trim() || 'N/A'}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: 'value',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('discountValue')} />,
      cell: ({ row }) => {
        const value = row.original.value || 0;
        const type = row.original.discountType;
        return <div>{type === DiscountType.PERCENTAGE ? `${value}%` : `${value.toLocaleString()}₫`}</div>;
      },
    },
  ];

  // Cột voucherType chỉ hiển thị khi user là ADMIN
  const voucherTypeColumn: ColumnDef<VoucherColumn> = {
    accessorKey: 'voucherType',
    header: ({ column }) => <DataTableColumnHeader column={column} title={t('voucherType')} />,
    cell: ({ row }) => {
      const type = row.getValue('voucherType') as VoucherType;
      let badgeClass = 'border-purple-500 text-purple-500 bg-purple-50';
      let typeText = 'Không xác định';

      switch (type) {
        case VoucherType.SHOP:
          badgeClass = 'border-purple-600 text-purple-600 bg-purple-50';
          typeText = 'Cửa hàng';
          break;
        case VoucherType.PRODUCT:
          badgeClass = 'border-indigo-600 text-indigo-600 bg-indigo-50';
          typeText = 'Sản phẩm';
          break;
        case VoucherType.PLATFORM:
          badgeClass = 'border-red-600 text-red-600 bg-red-50';
          typeText = 'Nền tảng';
          break;
        case VoucherType.CATEGORY:
          badgeClass = 'border-yellow-600 text-yellow-600 bg-yellow-50';
          typeText = 'Danh mục';
          break;
        case VoucherType.BRAND:
          badgeClass = 'border-pink-600 text-pink-600 bg-pink-50';
          typeText = 'Thương hiệu';
          break;
        case VoucherType.PRIVATE:
          badgeClass = 'border-gray-600 text-gray-600 bg-gray-50';
          typeText = 'Riêng tư';
          break;
      }

      return (
        <Badge variant="outline" className={badgeClass}>
          {typeText}
        </Badge>
      );
    },
    filterFn: (row, id, value) => value.includes(row.getValue(id)),
  };

  const remainingColumns: ColumnDef<VoucherColumn>[] = [
    {
      accessorKey: 'displayType',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('displayType')} />,
      cell: ({ row }) => {
        const type = row.getValue('displayType') as DisplayType;
        let badgeClass = 'border-teal-500 text-teal-500 bg-teal-50';
        let typeText = 'Không xác định';

        switch (type) {
          case DisplayType.PUBLIC:
            badgeClass = 'border-green-600 text-green-600 bg-green-50';
            typeText = 'Công khai';
            break;
          case DisplayType.PRIVATE:
            badgeClass = 'border-gray-600 text-gray-600 bg-gray-50';
            typeText = 'Riêng tư';
            break;
        }

        return (
          <Badge variant="outline" className={badgeClass}>
            {typeText}
          </Badge>
        );
      },
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
      accessorKey: 'startDate',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Thời gian lưu Mã giảm giá" />
      ),
      cell: ({ row }) => {
        const startDate = new Date(row.original.startDate);
        const endDate = new Date(row.original.endDate);

        return (
          <div className="text-sm w-[280px] whitespace-nowrap">
            {format(startDate, 'HH:mm dd/MM/yyyy')} - {format(endDate, 'HH:mm dd/MM/yyyy')}
          </div>
        );
      },
    },
    {
      accessorKey: 'maxUses',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Tổng lượt sử dụng tối đa" />,
      cell: ({ row }) => {
        const maxUses = row.original.maxUses || 0;
        return <div className="text-center">{maxUses === 0 ? '∞' : maxUses}</div>;
      },
    },
    {
      accessorKey: 'usersUsed',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Đã dùng" />,
      cell: ({ row }) => {
        const usersUsed = row.original.usersUsed || [];
        return <div className="text-center">{Array.isArray(usersUsed) ? usersUsed.length : 0}</div>;
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <DataTableRowActions
          row={row}
          actions={getVoucherActions(onDelete, onEdit, t)}
        />
      ),
    },
  ];

  // Kết hợp các columns dựa trên role của user
  const allColumns = [
    ...baseColumns,
    ...(isAdmin ? [voucherTypeColumn] : []),
    ...remainingColumns,
  ];

  return allColumns;
}
