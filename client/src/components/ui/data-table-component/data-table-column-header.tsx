'use client'

import { ArrowDownIcon, ArrowUpIcon, ChevronsUpDownIcon, EyeOffIcon } from 'lucide-react'
import { Column } from '@tanstack/react-table'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort() && !column.getCanHide()) {
    return <div className={cn(className)}>{title}</div>
  }

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            aria-label={
              column.getIsSorted() === 'desc'
                ? `Sắp xếp giảm dần theo ${title}`
                : column.getIsSorted() === 'asc'
                  ? `Sắp xếp tăng dần theo ${title}`
                  : `Sắp xếp theo ${title}`
            }
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 data-[state=open]:bg-accent"
          >
            <span>{title}</span>
            {column.getCanSort() && column.getIsSorted() === 'desc' ? (
              <ArrowDownIcon className="ml-2 h-4 w-4" aria-hidden="true" />
            ) : column.getIsSorted() === 'asc' ? (
              <ArrowUpIcon className="ml-2 h-4 w-4" aria-hidden="true" />
            ) : (
              <ChevronsUpDownIcon className="ml-2 h-4 w-4" aria-hidden="true" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {column.getCanSort() && (
            <>
              <DropdownMenuItem
                aria-label="Sắp xếp tăng dần"
                onClick={() => column.toggleSorting(false)}
              >
                <ArrowUpIcon
                  className="mr-2 h-3.5 w-3.5 text-muted-foreground/70"
                  aria-hidden="true"
                />
                Tăng dần
              </DropdownMenuItem>
              <DropdownMenuItem
                aria-label="Sắp xếp giảm dần"
                onClick={() => column.toggleSorting(true)}
              >
                <ArrowDownIcon
                  className="mr-2 h-3.5 w-3.5 text-muted-foreground/70"
                  aria-hidden="true"
                />
                Giảm dần
              </DropdownMenuItem>
            </>
          )}
          {column.getCanSort() && column.getCanHide() && (
            <DropdownMenuSeparator />
          )}
          {column.getCanHide() && (
            <DropdownMenuItem
              aria-label="Ẩn cột"
              onClick={() => column.toggleVisibility(false)}
            >
              <EyeOffIcon
                className="mr-2 h-3.5 w-3.5 text-muted-foreground/70"
                aria-hidden="true"
              />
              Ẩn cột
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
} 