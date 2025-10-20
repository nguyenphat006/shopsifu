"use client"

import * as React from "react"
import { Table } from "@tanstack/react-table"
import { saveAs } from "file-saver"
import * as XLSX from "xlsx"
import { Button } from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Download } from "lucide-react"

import { useTranslations } from "next-intl"

interface DataTableExportProps<TData> {
  table: Table<TData>
}

export function DataTableExport<TData>({ table }: DataTableExportProps<TData>) {
  const [isExporting, setIsExporting] = React.useState(false)
  const t  = useTranslations()

  const handleExport = async (type: "csv" | "excel") => {
    try {
      setIsExporting(true)
      const rows = table.getRowModel().rows
      const data = rows.map((row) => {
        const rowData: Record<string, unknown> = {}
        row.getVisibleCells().forEach((cell) => {
          if (cell.column.id !== "select") {
            rowData[cell.column.id] = cell.getValue()
          }
        })
        return rowData
      })

      const ws = XLSX.utils.json_to_sheet(data)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, "Data")
      const excelBuffer = XLSX.write(wb, { bookType: type === "csv" ? "csv" : "xlsx", type: "array" })

      const blob = new Blob([excelBuffer], {
        type: type === "csv"
          ? "text/csv;charset=utf-8"
          : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })

      saveAs(
        blob,
        `export_${new Date().toISOString().split("T")[0]}.${type === "csv" ? "csv" : "xlsx"}`
      )
    } catch (error) {
      console.error("Export failed:", error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto h-8">
          <Download className="mr-2 h-4 w-4" />
          {t("admin.dataTableExport.export")}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport("csv")} disabled={isExporting}>
          {t("admin.dataTableExport.export CSV")}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("excel")} disabled={isExporting}>
          {t("admin.dataTableExport.export Excel")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
