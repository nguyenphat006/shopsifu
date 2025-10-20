"use client"

import * as React from "react"
import { Filter } from "lucide-react"
import { type Column } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DataTableFacetedFilterProps<TData> {
  column?: Column<TData, unknown>
  title?: string
  options: Array<{
    label: string
    value: string
    icon?: React.ComponentType<{ className?: string }>
  }>
}

export function DataTableFacetedFilter<TData>({
  column,
  title,
  options
}: DataTableFacetedFilterProps<TData>) {
  const facets = column?.getFacetedUniqueValues()
  const selectedValues = new Set(column?.getFilterValue() as string[])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <Filter className="mr-2 h-4 w-4" />
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Badge
                variant="secondary"
                className="ml-1 rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                <Badge
                  className="rounded-sm px-1 font-normal"
                >
                  {selectedValues.size}
                </Badge>
              </div>
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[200px]">
        <DropdownMenuLabel>{title}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {options.map((option) => {
          const isSelected = selectedValues.has(option.value)
          return (
            <DropdownMenuCheckboxItem
              key={option.value}
              checked={isSelected}
              onCheckedChange={(checked) => {
                if (checked) {
                  selectedValues.add(option.value)
                } else {
                  selectedValues.delete(option.value)
                }
                const filterValues = Array.from(selectedValues)
                column?.setFilterValue(
                  filterValues.length ? filterValues : undefined
                )
              }}
            >
              {option.label}
              {facets?.get(option.value) && (
                <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                  {facets.get(option.value)}
                </span>
              )}
            </DropdownMenuCheckboxItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}