'use client'

import { ColumnDef } from '@tanstack/react-table'
import { User } from '@/types/admin/user.interface'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/ui/data-table-component/data-table-column-header'
import { DataTableRowActions, ActionItem } from '@/components/ui/data-table-component/data-table-row-actions'
import { Edit, Trash2, User as UserIcon } from 'lucide-react'
import { format } from 'date-fns'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

const getUserActions = (
  onDelete: (user: User) => void,
  onEdit: (user: User) => void,
  t: (key: string) => string
): ActionItem<User>[] => [
  {
    type: 'command',
    label: t('actions.edit'),
    icon: <Edit className="w-4 h-4" />,
    onClick: (user) => onEdit(user),
  },
  { type: 'separator' },
  {
    type: 'command',
    label: t('actions.delete'),
    icon: <Trash2 className="w-4 h-4" />,
    onClick: (user) => onDelete(user),
    className: 'text-red-500 hover:!text-red-500',
  },
]

export const userColumns = (
  { onDelete, onEdit }: { onDelete: (user: User) => void; onEdit: (user: User) => void }
): ColumnDef<User>[] => {
  const t = useTranslations("admin.ModuleUsers.Table");

  return [
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
      id: 'avatar',
      header: () => null,
      cell: ({ row }) => {
        const user = row.original;
        return (
          <Avatar className="h-12 w-12">
            {user.avatar ? (
              <AvatarImage 
                src={user.avatar}
                alt={user.name || "User avatar"} 
                className="object-cover" 
              />
            ) : (
              <AvatarFallback className="bg-primary/10 text-primary">
                {user.name?.charAt(0).toUpperCase() || <UserIcon className="h-4 w-4" />}
              </AvatarFallback>
            )}
          </Avatar>
        );
      },
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('name')} />,
      cell: ({ row }) => {
        const name = row.original.name || '';
        return <div className="font-medium">{name.trim() || 'N/A'}</div>;
      },
    },
    {
      accessorKey: 'email',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('Email')} />,
    },
    {
      accessorKey: 'role.name',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('role')} />,
      cell: ({ row }) => {
        const role = row.original.role?.name || '';
        return <div>{role}</div>;
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('status')} />,
      cell: ({ row }) => {
        const isActive = row.getValue('status') === 'ACTIVE';
        return (
          <Badge
            variant="outline"
            className={isActive
              ? 'border-green-600 text-green-600 bg-green-50'
              : 'border-gray-500 text-gray-500 bg-gray-50'}
          >
            {isActive ? 'Hoạt động' : 'Không hoạt động'}
          </Badge>
        );
      },
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
      accessorKey: 'createdAt',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('createdAt')} />,
      cell: ({ row }) => {
        const date = new Date(row.getValue('createdAt'));
        return <span>{format(date, 'dd/MM/yyyy HH:mm')}</span>;
      },
    },
    {
      accessorKey: 'updatedAt',
      header: ({ column }) => <DataTableColumnHeader column={column} title={t('updatedAt')} />,
      cell: ({ row }) => {
        const date = new Date(row.getValue('updatedAt'));
        return <span>{format(date, 'dd/MM/yyyy HH:mm')}</span>;
      },
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <DataTableRowActions
          row={row}
          actions={getUserActions(onDelete, onEdit, t)}
        />
      ),
    },
  ]
}
