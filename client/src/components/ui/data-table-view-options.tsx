"use client"

import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Settings2 } from "lucide-react"
import { Table } from "@tanstack/react-table"

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>
}

export function DataTableViewOptions<TData>({
  table,
}: DataTableViewOptionsProps<TData>) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto h-8 lg:flex"
        >
          <Settings2 className="mr-2 h-4 w-4" />
          Tùy chọn hiển thị
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" && 
              column.getCanHide() &&
              column.id !== "select" && // Không cho phép ẩn cột checkbox
              column.id !== "actions" // Không cho phép ẩn cột actions
          )
          .map((column) => {
            // Sử dụng header text nếu có, ngược lại sử dụng column id
            const headerText = column.columnDef.header?.toString() || 
              {
                "name": "Tên vai trò",
                "image": "Hình ảnh",
                "status": "Trạng thái",
                "createdAt": "Ngày tạo",
                "updatedAt": "Ngày cập nhật",
              }[column.id] || 
              column.id

            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {headerText}
              </DropdownMenuCheckboxItem>
            )
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
