"use client"

import * as React from "react"
import { type Table as TableInstance } from "@tanstack/react-table"
import { DataTableViewOptions } from "./dataTableViewOptions"
import { DataTableFacetedFilter } from "./dataTableFacetedFilter"
import { DataTableExport } from "./dataTableExport"
import { DataTableSearch } from "./dataTableSearch"
// import { DateRangePicker, type DateRange } from "@/components/ui/date-range-picker"
import { useTranslations } from "next-intl"

interface DataTableToolbarProps<TData> {
  table: TableInstance<TData>
  categories: Array<{ id: string; name: string }>
}

export function DataTableToolbar<TData>({ table, categories }: DataTableToolbarProps<TData>) {
  // const [date, setDate] = React.useState<DateRange>()
  const t  = useTranslations()

  return (
    <div className="flex items-center justify-between">      <div className="flex flex-1 items-center space-x-2">
        <DataTableSearch table={table} />
        {/* <DateRangePicker
          date={date}
          onDateChange={(newDate: DateRange | undefined) => {
            setDate(newDate)
            //Ở đây bạn có thể xử lý bộ lọc ngày
          }}
        /> */}
        <DataTableFacetedFilter
          column={table.getColumn("category")}
          title={t("admin.dataTableToolbar.categories")}
          options={categories.map(cat => ({
            label: cat.name,
            value: cat.id
          }))}
        />
        <DataTableViewOptions table={table} />
      </div>
      <div className="flex items-center space-x-2">
        <DataTableExport table={table} />
      </div>
    </div>
  )
}