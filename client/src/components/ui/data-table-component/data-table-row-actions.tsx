'use client'

// import { DotsHorizontalIcon } from '@radix-ui/react-icons' // Thay thế bằng MoreHorizontal từ lucide-react
import { MoreHorizontal } from 'lucide-react';
import { Row } from '@tanstack/react-table'
import React from 'react'; // Import React for JSX.Element

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  // DropdownMenuShortcut, // Bỏ qua nếu không dùng
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

// Giả sử bạn có một schema cho User hoặc một type chung cho row data
// import { taskSchema } from "../data/schema" // Ví dụ từ Shadcn

// Định nghĩa kiểu cho một hành động thực thi lệnh
interface CommandAction<TData> {
  type: 'command';
  label: string;
  icon?: React.ReactNode;
  onClick?: (rowData: TData) => void;
  className?: string;
}

// Định nghĩa kiểu cho một dòng kẻ ngang separator
interface SeparatorAction {
  type: 'separator';
}

// Union type cho các loại action có thể có
export type ActionItem<TData> = CommandAction<TData> | SeparatorAction;

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  t?: (key: string) => string;
  actions?: ActionItem<TData>[];
}

export function DataTableRowActions<TData>({
  row,
  actions = [],
}: DataTableRowActionsProps<TData>) {
  // const task = taskSchema.parse(row.original) // Ví dụ parse data nếu cần

  if (!actions || actions.length === 0) {
    return null; // Không render gì nếu không có actions
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          onClick={(e) => e.stopPropagation()} // Ngăn event bubble up
        >
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Mở menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-auto min-w-[160px]"
        onClick={(e) => e.stopPropagation()} // Ngăn event bubble up từ menu content
      >
        {actions.map((action, index) => {
          if (action.type === 'separator') {
            return <DropdownMenuSeparator key={index} />;
          }
          // Nếu là 'command'
          return (
            <DropdownMenuItem
              key={index}
              onClick={(e) => {
                e.stopPropagation(); // Ngăn event bubble up
                action.onClick?.(row.original);
              }}
              className={action.className}
            >
              {action.icon && <span className="mr-2 h-4 w-4">{action.icon}</span>}
              {action.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 