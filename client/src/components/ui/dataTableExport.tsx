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

interface DataTableExportProps<TData> {
  table: Table<TData>
}

export function DataTableExport<TData>({ table }: DataTableExportProps<TData>) {
  const [isExporting, setIsExporting] = React.useState(false)

  const handleExport = async (type: "csv" | "excel") => {
    try {
      setIsExporting(true)      // Get visible rows
      const rows = table.getRowModel().rows
      const data = rows.map((row) => {
        const rowData: Record<string, unknown> = {}
        row.getVisibleCells().forEach((cell) => {
          // Skip selection column
          if (cell.column.id !== "select") {
            rowData[cell.column.id] = cell.getValue()
          }
        })
        return rowData
      })

      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(data)

      // Create workbook
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, "Data")

      // Generate buffer
      const excelBuffer = XLSX.write(wb, { bookType: type === "csv" ? "csv" : "xlsx", type: "array" })

      // Convert buffer to Blob
      const blob = new Blob([excelBuffer], {
        type: type === "csv"
          ? "text/csv;charset=utf-8"
          : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      })

      // Save file
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
          Xuất file
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => handleExport("csv")}
          disabled={isExporting}
        >
          Xuất CSV
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleExport("excel")}
          disabled={isExporting}
        >
          Xuất Excel
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
