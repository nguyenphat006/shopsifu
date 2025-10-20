"use client"

import * as React from "react"
import type { Table } from "@tanstack/react-table"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"


interface DataTableSearchProps<TData> {
  table: Table<TData>
  searchColumn?: string
  placeholder?: string
  className?: string
}

export function DataTableSearch<TData>({
  table,
  searchColumn = "name",
  placeholder = "Tìm kiếm sản phẩm...",
  className
}: DataTableSearchProps<TData>) {
  const [value, setValue] = React.useState<string>("")

  const debouncedSearch = React.useMemo(() => {
    const handler = (value: string) => {
      table.getColumn(searchColumn)?.setFilterValue(value)
    }
    
    // Debounce search to avoid too many re-renders
    return (value: string) => {
      setTimeout(() => handler(value), 300)
    }
  }, [table, searchColumn])

  const handleSearch = React.useCallback(() => {
    table.getColumn(searchColumn)?.setFilterValue(value)
  }, [table, searchColumn, value])

  const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }, [handleSearch])
  return (
    <form 
      onSubmit={(e) => {
        e.preventDefault()
        handleSearch()
      }}
      className={cn("relative flex w-fit", className)}
    >
      <div className="relative flex h-9 w-full min-w-[200px] max-w-[220px] lg:max-w-[240px] rounded-md border border-input bg-background ring-offset-background">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            debouncedSearch(e.target.value)
          }}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent pl-8 pr-8 text-sm placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
        />
        <button
          type="submit"
          className="inline-flex h-full items-center justify-center whitespace-nowrap rounded-r-md border-l bg-background px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          <Search className="h-4 w-4" />
          <span className="sr-only">Tìm kiếm</span>
        </button>
      </div>
    </form>
  )
}
