"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { FileDown, Calendar as CalendarIcon } from "lucide-react";
import { CiExport } from "react-icons/ci";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import type { Table } from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

// Định nghĩa các định dạng file để dễ dàng tái sử dụng và mở rộng
const fileFormats = [
  { value: "xlsx", label: "Excel (.xlsx)" },
  { value: "csv", label: "CSV (.csv)" },
  { value: "pdf", label: "PDF (.pdf)" },
];

interface ProductsExportDataProps<TData> {
  table?: Table<TData>; // Prop `table` là optional
  data: TData[];       // Prop `data` là bắt buộc để có dữ liệu export
}

export function ProductsExportData<TData>({ table, data }: ProductsExportDataProps<TData>) {
  const t = useTranslations("admin.ModuleProduct.ExportData");

  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState<DateRange | undefined>();
  const [fileType, setFileType] = useState(fileFormats[0].value);

  const handleExport = () => {
    console.log("Đang export với các thiết lập:", {
      dateRange: date,
      format: fileType,
      selectedRows: table?.getFilteredSelectedRowModel().rows.map((row) => row.original),
      allData: data,
    });
    // TODO: Thêm logic tạo file thực tế ở đây (ví dụ: dùng 'xlsx', 'jspdf')
    alert(`Đang xuất file ${fileType.toUpperCase()}... (Kiểm tra console để xem dữ liệu)`);
    setIsOpen(false); // Đóng dialog sau khi export
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 lg:flex">
          <CiExport className="h-6 w-6" />
          {t("title")}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-6 py-4">
          {/* Date Range Picker */}
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="date-range">{t("dateRange")}</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  id="date-range"
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (
                    date.to ? (
                      <>
                        {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(date.from, "LLL dd, y")
                    )
                  ) : (
                    <span>{t("pickDate")}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
          {/* File Format Selector */}
          <div className="grid w-full items-center gap-2">
            <Label htmlFor="file-type">{t("fileFormat")}</Label>
            <Select value={fileType} onValueChange={setFileType}>
              <SelectTrigger id="file-type">
                <SelectValue placeholder={t("selectFormat")} />
              </SelectTrigger>
              <SelectContent>
                {fileFormats.map((format) => (
                  <SelectItem key={format.value} value={format.value}>
                    {format.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">{t("cancelText")}</Button>
          </DialogClose>
          <Button onClick={handleExport}>{t("confirmText")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}