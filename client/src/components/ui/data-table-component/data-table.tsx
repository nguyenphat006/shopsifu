 'use client'

import * as React from 'react'
import { flexRender, Table as TanstackTable } from '@tanstack/react-table'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Loader2 } from 'lucide-react'
import { DataTablePaginationProps, Pagination } from './pagination'

interface DataTableProps<TData> {
  table: TanstackTable<TData>
  columns: any[] // or more specific type
  loading?: boolean
  notFoundMessage?: string
  onRowClick?: (row: any) => void
  Toolbar?: React.ComponentType<{ table: TanstackTable<TData> }>
  pagination?: DataTablePaginationProps
  expandedRows?: Set<string>
  renderExpandedRow?: (row: TData) => React.ReactNode
}

export function DataTable<TData>({
  table,
  columns,
  loading = false,
  notFoundMessage = 'Không có dữ liệu.',
  onRowClick,
  Toolbar,
  pagination,
  expandedRows,
  renderExpandedRow,
}: DataTableProps<TData>) {
  return (
    <div className="w-full space-y-4">
      {Toolbar && <Toolbar table={table} />}
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10 rounded-md">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <React.Fragment key={row.id}>
                    <TableRow
                      data-state={row.getIsSelected() && 'selected'}
                      onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                      className={onRowClick ? 'cursor-pointer hover:bg-muted/60' : ''}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                    {expandedRows && renderExpandedRow && expandedRows.has(String((row.original as any).id)) && (
                      <TableRow>
                        <TableCell colSpan={columns.length} className="p-0 border-b-0">
                          {renderExpandedRow(row.original)}
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    {notFoundMessage}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {pagination && (
          <Pagination
            metadata={pagination.metadata}
            onPageChange={pagination.onPageChange}
            onLimitChange={pagination.onLimitChange}
          />
        )}
      </div>
    </div>
  )
}
